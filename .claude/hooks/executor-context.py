#!/usr/bin/env python3
"""Executor frontmatter hook (PreToolUse): hand the executor brain.md and the latest session handoff.

SubagentStart can only be declared in settings.json, so the executor's own frontmatter uses
PreToolUse instead and this script injects the context once, on the executor's first tool call.
A marker file per agent run (agent_id, else transcript path) keeps later tool calls silent.

Reads from $CLAUDE_PROJECT_DIR (the main checkout), not the executor's worktree, because
brain.md and .claude/memory/ are untracked and would be missing from a fresh worktree.
"""
import hashlib
import json
import os
import sys
import tempfile

ROOT = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
BRAIN = os.path.join(ROOT, "brain.md")
SESSIONS = os.path.join(ROOT, ".claude", "memory", "sessions")
MARKERS = os.path.join(tempfile.gettempdir(), "claude-executor-context")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def first_call(data):
    key = data.get("agent_id") or data.get("agent_transcript_path") or data.get("transcript_path") or ""
    marker = os.path.join(MARKERS, hashlib.sha1(key.encode()).hexdigest())
    if os.path.exists(marker):
        return False
    os.makedirs(MARKERS, exist_ok=True)
    open(marker, "w").close()
    return True


def main():
    data = json.load(sys.stdin) if not sys.stdin.isatty() else {}
    if not first_call(data):
        return 0
    parts = []
    if os.path.exists(BRAIN):
        parts.append(f"<brain file=\"brain.md\">\n{read(BRAIN)}</brain>")
    snapshots = sorted(os.listdir(SESSIONS)) if os.path.isdir(SESSIONS) else []
    if snapshots:
        latest = snapshots[-1]
        parts.append(
            f"<session-memory file=\".claude/memory/sessions/{latest}\">\n"
            f"{read(os.path.join(SESSIONS, latest))}</session-memory>"
        )
    if parts:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": data.get("hook_event_name", "PreToolUse"),
                "additionalContext": "\n\n".join(parts),
            }
        }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
