#!/usr/bin/env python3
"""Memory persistence hooks.

  memory.py save  -> PreCompact: fill .claude/memory/template.md from the transcript and
                     write .claude/memory/sessions/<timestamp>_<session>.md (keeps last 10).
  memory.py load  -> SessionStart (startup/resume/clear/compact): print the latest snapshot;
                     Claude Code adds SessionStart stdout to context.
  memory.py mark  -> PostCompact: timeline entry only. Its stdout is not documented as reaching
                     context, and SessionStart(compact) already loads, so printing here would duplicate.

Every save/load is appended to .claude/memory/timeline.md.
"""
import datetime
import json
import os
import subprocess
import sys

ROOT = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
MEM = os.path.join(ROOT, ".claude", "memory")
SESSIONS = os.path.join(MEM, "sessions")
TEMPLATE = os.path.join(MEM, "template.md")
TIMELINE = os.path.join(MEM, "timeline.md")
KEEP = 10
MAX_REQUESTS = 10


def git(*args):
    r = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)
    return r.stdout.strip()


def text_of(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "\n".join(c.get("text", "") for c in content if isinstance(c, dict) and c.get("type") == "text")
    return ""


def read_transcript(path):
    requests, files, last_reply = [], [], ""
    if not path or not os.path.exists(path):
        return requests, files, last_reply
    with open(path, encoding="utf-8") as f:
        for line in f:
            try:
                entry = json.loads(line)
            except ValueError:
                continue
            msg = entry.get("message") or {}
            content = msg.get("content")
            if entry.get("type") == "user" and not entry.get("isMeta"):
                text = text_of(content).strip()
                if text and not text.startswith("<"):
                    requests.append(text)
            elif entry.get("type") == "assistant" and isinstance(content, list):
                for c in content:
                    if c.get("type") == "tool_use" and c.get("name") in ("Edit", "Write", "NotebookEdit"):
                        p = (c.get("input") or {}).get("file_path")
                        if p:
                            p = os.path.relpath(p, ROOT) if p.startswith(ROOT) else p
                            if p not in files:
                                files.append(p)
                reply = text_of(content).strip()
                if reply:
                    last_reply = reply
    return requests[-MAX_REQUESTS:], files, last_reply


def clip(text, n=400):
    text = " ".join(text.split())
    return text if len(text) <= n else text[:n] + "…"


def log(event, detail):
    now = datetime.datetime.now().isoformat(timespec="seconds")
    new = not os.path.exists(TIMELINE)
    with open(TIMELINE, "a", encoding="utf-8") as f:
        if new:
            f.write("# Memory timeline\n\n")
        f.write(f"- {now} | {event} | {detail}\n")


def save(data):
    os.makedirs(SESSIONS, exist_ok=True)
    now = datetime.datetime.now()
    session = data.get("session_id", "unknown")
    requests, files, last_reply = read_transcript(data.get("transcript_path"))
    with open(TEMPLATE, encoding="utf-8") as f:
        template = f.read()
    body = template.format(
        timestamp=now.isoformat(timespec="seconds"),
        session_id=session,
        trigger=data.get("trigger", "unknown"),
        branch=git("branch", "--show-current") or "-",
        requests="\n".join(f"{i}. {clip(r)}" for i, r in enumerate(requests, 1)) or "- none",
        files="\n".join(f"- {p}" for p in files) or "- none",
        git_status="```\n" + (git("status", "--short") or "clean") + "\n```",
        last_reply=clip(last_reply, 1500) or "- none",
    )
    name = f"{now:%Y-%m-%d_%H-%M-%S}_{session[:8]}.md"
    with open(os.path.join(SESSIONS, name), "w", encoding="utf-8") as f:
        f.write(body)

    snapshots = sorted(os.listdir(SESSIONS))
    for old in snapshots[:-KEEP]:
        os.remove(os.path.join(SESSIONS, old))
    log("save", f"{name} ({len(requests)} requests, {len(files)} files)")


def load(data):
    snapshots = sorted(os.listdir(SESSIONS)) if os.path.isdir(SESSIONS) else []
    event = data.get("hook_event_name", "load")
    if not snapshots:
        log(event, "no snapshot to load")
        return
    latest = snapshots[-1]
    with open(os.path.join(SESSIONS, latest), encoding="utf-8") as f:
        print(f"<session-memory file=\".claude/memory/sessions/{latest}\">\n{f.read()}</session-memory>")
    log(event, f"loaded {latest}")


def mark(data):
    log(data.get("hook_event_name", "PostCompact"), f"compaction done ({data.get('trigger', 'unknown')})")


def main():
    data = json.load(sys.stdin) if not sys.stdin.isatty() else {}
    {"save": save, "load": load, "mark": mark}[sys.argv[1]](data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
