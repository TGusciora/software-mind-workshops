#!/bin/bash
# Play the Peon "work complete" sound without blocking Claude Code.
cat >/dev/null  # drain hook input
sound="$CLAUDE_PROJECT_DIR/.claude/sounds/peon-work-complete.mp3"
[ -f "$sound" ] && command -v afplay >/dev/null && (afplay "$sound" >/dev/null 2>&1 &)
exit 0
