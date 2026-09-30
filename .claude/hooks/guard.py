#!/usr/bin/env python3
"""PreToolUse hook: block `rm -rf` and reading .env files.

Exit code 2 blocks the tool call and shows stderr to Claude.
"""
import json
import os
import re
import shlex
import sys

ENV_RE = re.compile(r"(^|[\s/'\"=<])\.env(\.[\w.-]+)?($|[\s'\";|&>)])")


def is_env_path(path):
    name = os.path.basename(path or "")
    return name == ".env" or name.startswith(".env.")


def is_rm_rf(command):
    for segment in re.split(r"&&|\|\||[;|\n]", command):
        try:
            words = shlex.split(segment)
        except ValueError:
            words = segment.split()
        # Skip wrappers like sudo/xargs/env so `sudo rm -rf` is caught too.
        while words and words[0] in ("sudo", "xargs", "env", "command", "exec"):
            words = words[1:]
        if not words or os.path.basename(words[0]) != "rm":
            continue
        flags = "".join(w.lstrip("-") for w in words[1:] if w.startswith("-") and not w.startswith("--"))
        long = {w for w in words[1:] if w.startswith("--")}
        recursive = "r" in flags or "R" in flags or "--recursive" in long
        force = "f" in flags or "--force" in long
        if recursive and force:
            return True
    return False


def block(reason):
    print(f"Blocked by guard hook: {reason}", file=sys.stderr)
    sys.exit(2)


def main():
    data = json.load(sys.stdin)
    tool = data.get("tool_name", "")
    inp = data.get("tool_input", {}) or {}

    if tool == "Bash":
        command = inp.get("command", "")
        if is_rm_rf(command):
            block("`rm -rf` is not allowed in this repo. Delete specific files instead.")
        if ENV_RE.search(command):
            block("commands touching .env files are not allowed (secrets).")
    elif tool in ("Read", "Edit", "Write", "NotebookEdit"):
        if is_env_path(inp.get("file_path") or inp.get("notebook_path")):
            block(".env files may not be read or modified (secrets).")
    elif tool in ("Grep", "Glob"):
        if is_env_path(inp.get("path")) or ".env" in (inp.get("glob") or inp.get("pattern") or ""):
            block("searching .env files is not allowed (secrets).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
