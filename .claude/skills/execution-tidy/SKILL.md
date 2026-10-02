---
name: execution-tidy
allowed-tools: Bash, Read
description: Check whether a branch's change is small enough to send to the reviewer, using a deterministic script that diffs the branch against its base, drops tests and non-code files, and compares the rest with the limits in limits.conf. Use before handing a ticket or branch to the reviewer agent, after the executor finishes, when asked "is this too big to review", "how big is this diff", "check the PR size", "can we review this in one go", or when deciding whether work should be split into smaller tickets.
---

# Execution Tidy

A reviewer reads every changed file in full, so a change that is too big gets a shallow review. This skill gives a yes/no answer on size before the reviewer is spawned. The answer comes from a script, not from judgment, so the same diff gives the same verdict every time.

## Run it

```sh
sh .claude/skills/execution-tidy/scripts/diff-size.sh --base <base>
```

- `--base` is the branch or commit to compare against. When the coordinator has recorded a base commit for the ticket (`git rev-parse HEAD` before the executor started), pass that SHA. Without `--base`, the script uses `base_ref` from `limits.conf` (`main`).
- By default it measures the merge-base against the working tree, including uncommitted edits and untracked files. That is what the executor leaves behind (it never commits) and what the reviewer reads. Add `--committed-only` to measure `HEAD` only, for example on an already committed branch.
- `--config <file>` points at a different limits file.

Run it from anywhere inside the repo. It needs only `git`, `sh`, `awk`, `sed` and `sort`.

## Read the result

| Exit code | Meaning | Output ends with |
|---|---|---|
| `0` | Within every limit | `VERDICT: PASS` |
| `1` | Over at least one limit | `VERDICT: FAIL`, preceded by a list of which limits were exceeded |
| `2` | Could not decide (bad config, unknown base, not a git repo) | message on stderr |

The report lists the reviewable files with their added/deleted lines, then the excluded files with the reason for each, then each limit against its value. Show the user the report, not only the verdict, because the excluded list is how they notice a file that was dropped by mistake.

## What to do with the verdict

- **PASS:** send the change to the reviewer. Optionally pass the reviewable file list along so the reviewer starts with the files that matter.
- **FAIL:** do not send it to the reviewer yet. A change over the limits is a signal to split the work, so name the offenders from the report and propose a split (by file, by ticket acceptance criterion, or by layer). Ask the user before raising limits; changing a limit to make a verdict pass defeats the point of the check.
- **Exit 2:** fix the cause from the message. Do not treat it as pass or fail. Do not guess a base ref: ask for one.

An empty diff passes with zero files. If that is a surprise, the base is probably wrong, for example when you are on `main` and compared against `main`.

## What counts as reviewable

A file is reviewable when its extension is in `code_ext` and its path matches none of the `exclude` globs. Everything else, such as markdown, JSON, YAML, images, lockfiles and tests, is reported as excluded and does not count towards any limit. Binary files are always excluded. Renames are counted as a delete plus an add, which errs on the side of reviewing more.

Sizes are added plus deleted lines. Three limits apply: number of files, total lines, and lines in the single largest file.

## Tuning

All limits, the code extensions and the exclude globs live in `limits.conf` next to this file, with comments explaining the format. Edit that file, not the script. The config is parsed, never executed, and an unknown key or a non-numeric limit is an error rather than silently ignored.

## Tests

`sh .claude/skills/execution-tidy/tests/test-diff-size.sh` builds throwaway git repos and checks curation, limit boundaries, working-tree handling, error exits and output determinism. It passes under `dash` and `bash`; run it after changing the script.
