#!/bin/sh
# Tests for scripts/diff-size.sh. Builds throwaway git repos under $TMPDIR.
# Run with any POSIX shell:  sh tests/test-diff-size.sh   (or dash, bash)

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 2
script=$here/../scripts/diff-size.sh
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/diff-size-test.XXXXXX") || exit 2
trap 'rm -r "$sandbox" </dev/null' EXIT

pass=0
fail=0
out=
code=0

ok() {
  pass=$((pass + 1))
  printf '  ok   %s\n' "$1"
}
bad() {
  fail=$((fail + 1))
  printf '  FAIL %s\n' "$1"
  printf '%s\n' "$out" | sed 's/^/       | /'
}

expect_code() { # name want
  if [ "$code" -eq "$2" ]; then ok "$1"; else bad "$1 (exit $code, want $2)"; fi
}
expect_has() { # name text
  case $out in
    *"$2"*) ok "$1" ;;
    *) bad "$1 (missing: $2)" ;;
  esac
}
expect_lacks() { # name text
  case $out in
    *"$2"*) bad "$1 (unexpected: $2)" ;;
    *) ok "$1" ;;
  esac
}

# new_repo <name>: repo on `main` with one commit, then a feature branch.
new_repo() {
  repo=$sandbox/$1
  mkdir -p "$repo"
  cd "$repo" || exit 2
  git init -q -b main
  git config user.name tester
  git config user.email tester@example.com
  git config commit.gpgsign false
  printf 'seed\n' >README.md
  git add -A
  git commit -q -m seed
  git checkout -q -b feature
}

commit_all() {
  git add -A
  git commit -q -m "$1"
}

lines() { # n -> n lines of text
  awk -v n="$1" 'BEGIN { for (i = 1; i <= n; i++) print "line " i }'
}

write_conf() { # extra lines appended after the defaults
  cat >"$repo/limits.conf" <<EOF
base_ref = main
max_files = 3
max_total_lines = 50
max_file_lines = 30
code_ext = js py sh
exclude = */test/*
exclude = *.test.*
exclude = */test_*
$1
EOF
}

run() { # args...
  out=$(cd "$repo" && sh "$script" --config "$repo/limits.conf" "$@" 2>&1)
  code=$?
}

echo "no changes"
new_repo empty
write_conf
run
expect_code "empty diff passes" 0
expect_has "reports zero reviewable files" "Reviewable files (0)"

echo "small change"
new_repo small
write_conf
lines 10 >a.js
commit_all small
run
expect_code "small change passes" 0
expect_has "lists the file" "a.js"
expect_has "verdict line" "VERDICT: PASS"

echo "curation"
new_repo curate
write_conf
lines 10 >a.js
mkdir -p test src
lines 200 >test/big.js
lines 200 >src/thing.test.js
lines 200 >test_helper.py
lines 200 >notes.md
lines 200 >data.json
commit_all mixed
run
expect_code "tests and non-code do not count" 0
expect_has "only code counted" "Reviewable files (1)"
expect_has "test dir excluded" "test/big.js  (excluded by '*/test/*')"
expect_has "spec-style name excluded" "src/thing.test.js  (excluded by '*.test.*')"
expect_has "test_ prefix excluded" "test_helper.py  (excluded by '*/test_*')"
expect_has "markdown is non-code" "notes.md  (non-code)"
expect_has "json is non-code" "data.json  (non-code)"

echo "limits"
new_repo files
write_conf
for n in 1 2 3 4; do lines 5 >"f$n.js"; done
commit_all many
run
expect_code "too many files fails" 1
expect_has "names the file limit" "4 reviewable files (limit 3)"

new_repo total
write_conf
lines 20 >a.js
lines 20 >b.js
lines 20 >c.py
commit_all total
run
expect_code "too many lines fails" 1
expect_has "names the total limit" "60 reviewable changed lines (limit 50)"

new_repo single
write_conf
lines 31 >big.sh
commit_all single
run
expect_code "one oversized file fails" 1
expect_has "names the file" "big.sh has 31 changed lines (limit 30)"

new_repo boundary
write_conf
lines 30 >a.js
lines 20 >b.js
commit_all boundary
run
expect_code "exactly at the limits passes" 0

new_repo deleted
write_conf
lines 20 >a.js
git checkout -q main
git checkout -q -b feature2
lines 20 >a.js
commit_all add
git checkout -q -b feature3
git rm -q a.js
commit_all remove
run --base feature2
expect_code "deletions count as changed lines" 0
expect_has "deleted lines are counted" "-20"

echo "working tree vs committed"
new_repo wt
write_conf
lines 5 >a.js
commit_all a
lines 7 >untracked.js
lines 9 >>a.js
run
expect_has "untracked file counted" "untracked.js"
expect_has "uncommitted edit counted" "Reviewable files (2)"
run --committed-only
expect_lacks "committed-only skips untracked" "untracked.js"
expect_has "committed-only counts HEAD" "Reviewable files (1)"

echo "paths and base"
new_repo odd
write_conf
mkdir -p "sub dir"
lines 5 >"sub dir/my file.js"
commit_all spaces
run
expect_has "path with spaces" "sub dir/my file.js"

new_repo base
write_conf
lines 5 >a.js
commit_all a
base_sha=$(git rev-parse HEAD)
lines 5 >b.js
commit_all b
run --base "$base_sha"
expect_has "accepts a commit as base" "Reviewable files (1)"
expect_has "diff starts after that commit" "b.js"
expect_lacks "earlier commit not counted" "a.js"

echo "errors"
new_repo errors
write_conf
run --base no-such-ref
expect_code "unknown base is an error" 2
expect_has "says so" "base ref not found"

run --bogus
expect_code "unknown flag is an error" 2

printf 'max_files = 3\nbase_ref = main\n' >"$repo/limits.conf"
run
expect_code "incomplete config is an error" 2

write_conf 'frobnicate = 1'
run
expect_code "unknown config key is an error" 2

write_conf
sed 's/max_files = 3/max_files = lots/' "$repo/limits.conf" >"$repo/l2" && mv "$repo/l2" "$repo/limits.conf"
run
expect_code "non-numeric limit is an error" 2

cd "$sandbox" || exit 2
out=$(sh "$script" --config "$sandbox/nope.conf" 2>&1)
code=$?
expect_code "missing config is an error" 2

echo "determinism"
new_repo det
write_conf
lines 4 >z.js
lines 4 >a.js
lines 4 >m.py
commit_all det
run
first=$out
run
if [ "$first" = "$out" ]; then ok "two runs give identical output"; else bad "output differs between runs"; fi

echo "default config"
cd "$sandbox" || exit 2
new_repo shipped
lines 5 >a.js
commit_all a
out=$(cd "$repo" && sh "$script" 2>&1)
code=$?
expect_code "shipped limits.conf loads and passes a tiny change" 0

printf '\n%d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
