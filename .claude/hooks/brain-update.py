#!/usr/bin/env python3
"""SessionEnd hook: regenerate brain.md as a plain index of the repo's markdown files.

Each file is listed as a [[wikilink]] (repo-relative path without .md, so links stay
unique), one per line, grouped into sections by path. brain.md is fully generated;
edit SECTIONS below instead of editing brain.md by hand.
File discovery uses git, so .gitignore'd paths (node_modules, .claude/worktrees) are skipped.
"""
import os
import subprocess
import sys

ROOT = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
BRAIN = os.path.join(ROOT, "brain.md")
EXCLUDE = {"brain.md"}

# (section title, path prefixes). First match wins; unmatched files go to "Other".
SECTIONS = [
    ("Recipes", ("recipes/",)),
    ("Architecture", ("docs/", "pizza-creator/", "plans/pizza-creator-plan.md")),
    ("Business plans", ("plans/", ".claude/plans/")),
    ("Skill eval workspaces", (".claude/skills/spec-creator-workspace/",
                               ".claude/skills/user-story-creator-workspace/")),
    ("Structure", ("CLAUDE.md", ".claude/", "maps/")),
]
# Order sections appear in brain.md.
ORDER = ["Structure", "Architecture", "Business plans", "Recipes", "Skill eval workspaces", "Other"]


def repo_md_files():
    out = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "--", "*.md"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout
    return sorted(
        p for p in out.splitlines()
        if p not in EXCLUDE and "node_modules/" not in p
        and os.path.exists(os.path.join(ROOT, p))
    )


def section_of(path):
    for title, prefixes in SECTIONS:
        if path.startswith(prefixes):
            return title
    return "Other"


def main():
    groups = {}
    for p in repo_md_files():
        groups.setdefault(section_of(p), []).append(p)

    lines = ["# brain.md", ""]
    for title in ORDER:
        if title not in groups:
            continue
        lines += [f"## {title}", ""]
        lines += [f"[[{p[:-3]}]]" for p in groups[title]]
        lines.append("")
    content = "\n".join(lines)

    old = open(BRAIN, encoding="utf-8").read() if os.path.exists(BRAIN) else None
    if content != old:
        with open(BRAIN, "w", encoding="utf-8") as f:
            f.write(content)
        print("brain-update: brain.md regenerated", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
