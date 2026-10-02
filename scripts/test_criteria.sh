#!/bin/sh
# Tests for criteria.sh. Run by scripts/check.sh.
cd "$(dirname "$0")" || exit 1
t=$(mktemp -d); trap 'rm -rf "$t"' EXIT
cat > "$t/T-001.md" <<'T'
## Scope
- [ ] not a criterion
## Acceptance criteria
- [ ] First open
- [x] Second done
- [X] Third done
- [ ] Fourth open
## Test plan
- [ ] also not a criterion
T
fail=0
ok() { [ "$1" = "$2" ] || { echo "FAIL $3: got [$1] want [$2]"; fail=1; }; }
ok "$(sh criteria.sh "$t/T-001.md" | cut -f1 | tr '\n' ' ')" "AC-1 AC-4 " "lists only unticked, stable ids"
sh criteria.sh "$t/T-001.md" --verify >/dev/null; ok $? 1 "verify fails without file"
sh criteria.sh "$t/T-001.md" --save >/dev/null
sh criteria.sh "$t/T-001.md" --verify >/dev/null; ok $? 1 "verify fails with empty evidence"
sed 's/^  EVIDENCE:$/  EVIDENCE: test_x/' "$t/evidence/T-001.md" > "$t/e" && mv "$t/e" "$t/evidence/T-001.md"
sh criteria.sh "$t/T-001.md" --verify >/dev/null; ok $? 0 "verify passes with evidence"
sh criteria.sh "$t/T-001.md" --save >/dev/null
sh criteria.sh "$t/T-001.md" --verify >/dev/null; ok $? 0 "save keeps existing evidence"
printf '## Acceptance criteria\nnone\n' > "$t/T-002.md"
sh criteria.sh "$t/T-002.md" >/dev/null 2>&1; ok $? 2 "no checkboxes is an input error"
[ "$fail" -eq 0 ] && echo "criteria.sh tests passed"; exit $fail
