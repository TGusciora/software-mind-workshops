#!/usr/bin/env bash
# Claude Code statusLine: context usage, git branch, git diff summary.
# Reads the statusline JSON payload from stdin.

input=$(cat)

# --- Context window usage ---
used_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty' 2>/dev/null)
if [ -n "$used_pct" ]; then
  ctx=$(printf "Ctx %.0f%%" "$used_pct")
else
  ctx="Ctx --"
fi

# --- Git branch + diff summary (fast, skip optional locks, tolerate non-repo) ---
git_info=""
if git --no-optional-locks rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  branch=$(git --no-optional-locks rev-parse --abbrev-ref HEAD 2>/dev/null)
  [ -z "$branch" ] && branch="detached"

  # Combine unstaged + staged diffstat (working tree vs HEAD covers both).
  stat_line=$(git --no-optional-locks diff --shortstat HEAD 2>/dev/null)
  added=0
  removed=0
  if [ -n "$stat_line" ]; then
    added=$(echo "$stat_line" | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+')
    removed=$(echo "$stat_line" | grep -oE '[0-9]+ deletion' | grep -oE '[0-9]+')
    [ -z "$added" ] && added=0
    [ -z "$removed" ] && removed=0
  fi

  if [ "$added" -gt 0 ] || [ "$removed" -gt 0 ]; then
    diff_part=" +$added -$removed"
  else
    diff_part=""
  fi

  git_info=" | $branch$diff_part"
fi

printf "%s%s" "$ctx" "$git_info"
