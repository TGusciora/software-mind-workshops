#!/bin/sh
# Deterministic acceptance-criteria extractor and evidence verifier for tickets.
#
#   sh scripts/criteria.sh <ticket.md>             list open criteria (unticked boxes)
#   sh scripts/criteria.sh <ticket.md> --save      write the evidence file (see below)
#   sh scripts/criteria.sh <ticket.md> --verify    check every open criterion has evidence
#
# Criteria are the `- [ ]` / `- [x]` lines under the "## Acceptance criteria" heading,
# up to the next "## " heading. Ticked boxes (`[x]`/`[X]`) are skipped. Ids (AC-1, AC-2, ...)
# count every checkbox in the section in order, so an id never changes when a box is ticked.
#
# Evidence file: <ticket dir>/evidence/<ticket file name>, one block per open criterion:
#   AC-2: <criterion text>
#     EVIDENCE: <test name, file:line, or command output proving it>
# The executor fills in each EVIDENCE line. The reviewer runs --verify, then judges the evidence.
# Exit codes: 0 ok, 1 verification failed (missing evidence), 2 usage or input error.
set -u
ticket=${1:-}; mode=${2:-list}
[ -f "$ticket" ] || { echo "usage: criteria.sh <ticket.md> [--save|--verify]" >&2; exit 2; }
case $mode in list|--save|--verify) ;; *) echo "unknown mode: $mode" >&2; exit 2;; esac

extract() { # prints "AC-n<TAB>text" for each unticked criterion
  awk '
    /^## / { insec = ($0 ~ /^## +Acceptance criteria[ \t]*$/); next }
    insec && /^[ \t]*[-*] \[[ xX]\] / {
      n++
      line = $0
      sub(/^[ \t]*[-*] \[/, "", line)
      box = substr(line, 1, 1)
      text = substr(line, 4)
      if (box == " ") printf "AC-%d\t%s\n", n, text
    }
    END { if (n == 0) exit 3 }
  ' "$ticket"
}

list=$(extract); rc=$?
[ "$rc" -eq 3 ] && { echo "no acceptance criteria checkboxes in $ticket" >&2; exit 2; }
dir=$(dirname "$ticket"); evid="$dir/evidence/$(basename "$ticket")"

case $mode in
  list)
    [ -n "$list" ] && printf '%s\n' "$list" || echo "all criteria already ticked"
    ;;
  --save)
    [ -n "$list" ] || { echo "all criteria already ticked; nothing to save"; exit 0; }
    mkdir -p "$dir/evidence"
    # Keep evidence already written for ids that are still open.
    tmp=$(mktemp)
    printf '%s\n' "$list" | while IFS='	' read -r id text; do
      old=""
      [ -f "$evid" ] && old=$(awk -v id="$id:" '$1 == id { f = 1; next } f && /^  EVIDENCE:/ { print; exit } f && /^AC-/ { exit }' "$evid")
      printf '%s %s\n%s\n' "$id:" "$text" "${old:-  EVIDENCE:}" >> "$tmp"
    done
    mv "$tmp" "$evid"; echo "wrote $evid"
    ;;
  --verify)
    [ -z "$list" ] && { echo "all criteria already ticked"; exit 0; }
    [ -f "$evid" ] || { echo "MISSING evidence file $evid (run --save, then fill it in)"; exit 1; }
    bad=0
    for id in $(printf '%s\n' "$list" | cut -f1); do
      ev=$(awk -v id="$id:" '$1 == id { f = 1; next } f && /^  EVIDENCE:/ { sub(/^  EVIDENCE:[ \t]*/, ""); print; exit } f && /^AC-/ { exit }' "$evid")
      if [ -n "$ev" ]; then echo "OK      $id"; else echo "MISSING $id"; bad=1; fi
    done
    [ "$bad" -eq 0 ] && echo "evidence present for all open criteria" || echo "evidence incomplete"
    exit $bad
    ;;
esac
