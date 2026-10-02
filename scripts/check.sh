#!/bin/sh
# Single point of testing. Run `sh scripts/check.sh` before every commit.
# Auto-discovers suites, so new tests are picked up without editing this file:
#   - any directory containing test_*.py runs pytest (via `uv run --with pytest` if not installed)
#   - any package.json (outside node_modules) with a "test" script runs `npm test`
# Add a new kind of check (lint, type check, ...) in the EXTRA section below.
cd "$(dirname "$0")/.." || exit 1
fail=0; ran=0

run() { # run <label> <dir> <cmd...>
  label=$1; dir=$2; shift 2
  ran=$((ran + 1))
  printf '\n== %s ==\n' "$label"
  if (cd "$dir" && "$@"); then echo "PASS $label"; else echo "FAIL $label"; fail=1; fi
}

# Python suites
for d in $(find . -name 'test_*.py' -not -path '*/node_modules/*' -not -path './.claude/worktrees/*' -not -path '*/.venv/*' -exec dirname {} \; | sort -u); do
  if python3 -c 'import pytest' 2>/dev/null; then
    run "pytest $d" "$d" python3 -m pytest -q
  else
    run "pytest $d" "$d" uv run --quiet --with pytest python -m pytest -q
  fi
done

# Node suites
for p in $(find . -name package.json -not -path '*/node_modules/*' -not -path './.claude/worktrees/*' | sort); do
  d=$(dirname "$p")
  grep -q '"test"' "$p" && run "npm test $d" "$d" npm test --silent
done

# EXTRA: add other repo-wide checks here (lint, type check, ...)
run "criteria.sh tests" . sh scripts/test_criteria.sh

printf '\n'
[ "$ran" -eq 0 ] && { echo "check: no test suites found"; exit 1; }
[ "$fail" -eq 0 ] && echo "check: ALL PASSED ($ran suites)" || echo "check: FAILED"
exit $fail
