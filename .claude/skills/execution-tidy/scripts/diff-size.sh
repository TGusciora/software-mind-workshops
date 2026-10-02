#!/bin/sh
# diff-size.sh - decide whether a change is small enough to send to a reviewer.
#
# Diffs the current branch against a base, keeps only files worth a code review
# (drops tests, generated/vendored files and anything that is not source code),
# and compares the size of what is left with the limits in limits.conf.
#
# Exit codes: 0 = within limits, 1 = over limits, 2 = usage/config/git error.
# Output is deterministic: same repo state + same config = same bytes.

set -u
set -f # globs from the config must stay literal until we match them ourselves
LC_ALL=C
export LC_ALL

die() {
  printf 'execution-tidy: %s\n' "$*" >&2
  exit 2
}

usage() {
  cat <<'EOF'
Usage: diff-size.sh [--base REF] [--config FILE] [--committed-only]

  --base REF         Branch, tag or commit to compare against.
                     Default: base_ref from the config file.
  --config FILE      Limits file. Default: ../limits.conf next to this script.
  --committed-only   Compare HEAD only. By default uncommitted changes and
                     untracked files are included, because that is the work
                     a reviewer is about to look at.

Exit codes: 0 within limits, 1 over limits, 2 error.
EOF
}

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 2
config=$script_dir/../limits.conf
base=
committed_only=0

while [ $# -gt 0 ]; do
  case $1 in
    --base)
      [ $# -ge 2 ] || die "--base needs a value"
      base=$2
      shift 2
      ;;
    --config)
      [ $# -ge 2 ] || die "--config needs a value"
      config=$2
      shift 2
      ;;
    --committed-only)
      committed_only=1
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *) die "unknown argument: $1 (try --help)" ;;
  esac
done

tab=$(printf '\t')
nl='
'

# ---- temp files (no recursive delete: we know exactly what we create) ------
tmp=$(mktemp -d "${TMPDIR:-/tmp}/execution-tidy.XXXXXX") || die "cannot create temp dir"
cleanup() {
  rm -f "$tmp/raw" "$tmp/sorted" "$tmp/kept" "$tmp/skipped" "$tmp/offenders"
  rmdir "$tmp" 2>/dev/null
}
trap cleanup EXIT
trap 'exit 2' INT TERM HUP

# ---- config ----------------------------------------------------------------
[ -r "$config" ] || die "config not readable: $config"

trim() {
  printf '%s' "$1" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

cfg_base=
max_files=
max_total=
max_file=
code_exts=
excludes=

while IFS= read -r line || [ -n "$line" ]; do
  line=$(trim "$line")
  case $line in
    '' | '#'*) continue ;;
    *=*) ;;
    *) die "$config: expected 'key = value', got: $line" ;;
  esac
  key=$(trim "${line%%=*}")
  val=$(trim "${line#*=}")
  [ -n "$val" ] || die "$config: empty value for '$key'"
  case $key in
    base_ref) cfg_base=$val ;;
    max_files) max_files=$val ;;
    max_total_lines) max_total=$val ;;
    max_file_lines) max_file=$val ;;
    code_ext) code_exts="$code_exts $val" ;;
    exclude) excludes="${excludes:+$excludes$nl}$val" ;;
    *) die "$config: unknown key '$key'" ;;
  esac
done <"$config"

check_int() { # name value
  case $2 in
    '' | *[!0-9]*) die "$config: $1 must be a positive integer, got '$2'" ;;
  esac
  [ "$2" -ge 1 ] || die "$config: $1 must be at least 1"
}
check_int max_files "$max_files"
check_int max_total_lines "$max_total"
check_int max_file_lines "$max_file"
[ -n "$code_exts" ] || die "$config: at least one code_ext is required"

# ---- git -------------------------------------------------------------------
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "not inside a git work tree"
top=$(git rev-parse --show-toplevel) || die "cannot find repo root"
cd "$top" || die "cannot enter $top"

[ -n "$base" ] || base=$cfg_base
[ -n "$base" ] || die "no base: pass --base or set base_ref in $config"
git rev-parse --verify --quiet "$base^{commit}" >/dev/null || die "base ref not found: $base"
merge_base=$(git merge-base "$base" HEAD) || die "no merge base between $base and HEAD"
short_mb=$(git rev-parse --short "$merge_base") || die "cannot abbreviate $merge_base"

: >"$tmp/raw"
if [ "$committed_only" -eq 1 ]; then
  git -c core.quotepath=off diff --numstat --no-renames --no-ext-diff "$merge_base" HEAD -- >"$tmp/raw" ||
    die "git diff failed"
  compared="HEAD (committed changes only)"
else
  git -c core.quotepath=off diff --numstat --no-renames --no-ext-diff "$merge_base" -- >"$tmp/raw" ||
    die "git diff failed"
  # New files that git does not track yet are part of the work to review.
  git -c core.quotepath=off ls-files --others --exclude-standard |
    while IFS= read -r p; do
      [ -f "$p" ] || continue
      n=$(awk 'END { print NR }' "$p")
      printf '%s\t0\t%s\n' "$n" "$p" >>"$tmp/raw"
    done
  compared="working tree (tracked changes + untracked files)"
fi

# Stable order whatever git or the filesystem decided.
sort -t "$tab" -k3 "$tmp/raw" >"$tmp/sorted"

# ---- curate ----------------------------------------------------------------
# Patterns match the repo-relative path with a leading "/", so "*/test/*"
# matches test/ at any depth and "/docs/*" is anchored at the repo root.
skip_reason=
classify() { # path -> sets skip_reason ("" means reviewable)
  skip_reason=
  oldifs=$IFS
  IFS=$nl
  for g in $excludes; do
    # shellcheck disable=SC2254 # unquoted on purpose: $g is a glob
    case "/$1" in
      $g)
        skip_reason="excluded by '$g'"
        break
        ;;
    esac
  done
  IFS=$oldifs
  [ -z "$skip_reason" ] || return 0

  case ${1##*/} in
    *.*) ext=${1##*.} ;;
    *) ext= ;;
  esac
  ext=$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')
  for e in $code_exts; do
    [ "$ext" = "$e" ] && return 0
  done
  skip_reason="non-code"
}

: >"$tmp/kept"
: >"$tmp/skipped"
: >"$tmp/offenders"
kept_files=0
kept_add=0
kept_del=0
skip_files=0
skip_lines=0
largest=0
largest_path=-

while IFS="$tab" read -r add del path; do
  [ -n "$path" ] || continue
  case $add in
    -) # binary file per git: never reviewable as code
      printf '%6s  %s  (binary)\n' "-" "$path" >>"$tmp/skipped"
      skip_files=$((skip_files + 1))
      continue
      ;;
  esac
  size=$((add + del))
  classify "$path"
  if [ -n "$skip_reason" ]; then
    printf '%6d  %s  (%s)\n' "$size" "$path" "$skip_reason" >>"$tmp/skipped"
    skip_files=$((skip_files + 1))
    skip_lines=$((skip_lines + size))
    continue
  fi
  printf '%6d  +%d -%d  %s\n' "$size" "$add" "$del" "$path" >>"$tmp/kept"
  kept_files=$((kept_files + 1))
  kept_add=$((kept_add + add))
  kept_del=$((kept_del + del))
  if [ "$size" -gt "$largest" ]; then
    largest=$size
    largest_path=$path
  fi
  if [ "$size" -gt "$max_file" ]; then
    printf '%s has %d changed lines (limit %d)\n' "$path" "$size" "$max_file" >>"$tmp/offenders"
  fi
done <"$tmp/sorted"
kept_total=$((kept_add + kept_del))

# ---- verdict ---------------------------------------------------------------
verdict=PASS
reasons=
if [ "$kept_files" -gt "$max_files" ]; then
  verdict=FAIL
  reasons="$reasons  - $kept_files reviewable files (limit $max_files)$nl"
fi
if [ "$kept_total" -gt "$max_total" ]; then
  verdict=FAIL
  reasons="$reasons  - $kept_total reviewable changed lines (limit $max_total)$nl"
fi
if [ -s "$tmp/offenders" ]; then
  verdict=FAIL
  while IFS= read -r o; do
    reasons="$reasons  - $o$nl"
  done <"$tmp/offenders"
fi

status() { # value limit
  if [ "$1" -gt "$2" ]; then printf 'OVER'; else printf 'ok'; fi
}

printf 'execution-tidy\n'
printf '  base:      %s @ %s (merge-base)\n' "$base" "$short_mb"
printf '  compared:  %s\n' "$compared"
printf '  config:    %s\n\n' "$config"

printf 'Reviewable files (%d):\n' "$kept_files"
if [ -s "$tmp/kept" ]; then
  sed 's/^/  /' "$tmp/kept"
else
  printf '  (none)\n'
fi

printf '\nExcluded from review (%d files, %d changed lines):\n' "$skip_files" "$skip_lines"
if [ -s "$tmp/skipped" ]; then
  sed 's/^/  /' "$tmp/skipped"
else
  printf '  (none)\n'
fi

printf '\nLimits:\n'
printf '  files         %6d / %-6d %s\n' "$kept_files" "$max_files" "$(status "$kept_files" "$max_files")"
printf '  total lines   %6d / %-6d %s  (+%d -%d)\n' "$kept_total" "$max_total" "$(status "$kept_total" "$max_total")" "$kept_add" "$kept_del"
printf '  largest file  %6d / %-6d %s  (%s)\n' "$largest" "$max_file" "$(status "$largest" "$max_file")" "$largest_path"

if [ "$verdict" = FAIL ]; then
  printf '\nOver the limits:\n%s' "$reasons"
fi
printf '\nVERDICT: %s\n' "$verdict"

[ "$verdict" = PASS ]
