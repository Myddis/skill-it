---
name: clean-it
description: Remove leftover temporary code before a commit, such as [TEMP-…] tagged lines, debug logs, commented-out code, stray TODOs and temp files. Use when the user is about to commit, asks to clean up or tidy the diff, or when another skill finishes building.
---

Make the uncommitted diff hold only what belongs in the commit.

## The tag

Skills mark every temporary line with `[TEMP-<4 hex>]` in a comment on the same line (`console.log(x) // [TEMP-a4f2]`), and every temporary file with `TEMP-<hex>` in its name. A tagged line or file is temporary by definition: removing it is certain, not a judgement.

## 1. Collect the diff

The scope is exactly what the user is about to commit:

- added lines in `git diff HEAD` (staged and unstaged)
- new files from `git ls-files --others --exclude-standard`

Only these lines and files are candidates. Lines that existed before, committed history and gitignored files stay as they are.

## 2. Find leftovers

**Tagged** (certain): every candidate line or file matching `TEMP-[0-9a-f]{4}`.

**Suspects** (judgement): candidates that look temporary without a tag. Check each against the repo's conventions first: a repo that logs through `console.log` on purpose has no debug-log suspects.

- debug output: `console.log`, `print`, `println!`, `dbg!`, `var_dump`, `debugger`, breakpoints
- commented-out code
- new `TODO`, `FIXME` or `XXX` comments
- test focus or skips: `.only`, `fit`, `fdescribe`, `.skip`, `xit`, `@Ignore`
- hard-coded values that look like manual-test overrides (fixed IDs, `if (true)`, short-circuited checks)
- new files that look like by-products: logs, screenshots, dumps, scratch scripts, `*.orig`, `*.bak`

This step is done when every added line and every new file has been checked against both lists.

## 3. Confirm

Show one numbered list, tagged items first, each with `file:line` (or the file path) and, for suspects, the reason it looks temporary. Ask which to remove: through the harness's question tool when it has one, as a multi-select with "All tagged items (Recommended)" first and the suspects grouped by kind; otherwise ask the user to reply with the numbers, or "all". Say plainly that removing a new file deletes it permanently, since git never tracked it.

If nothing was found, say so and stop.

**Unattended** (no user to answer, for example inside a `delegate-it` subagent): remove the tagged items only, and return the suspects list to the caller without removing them.

## 4. Remove

Remove exactly the approved items: delete tagged and approved lines (with any blank line or orphaned import they leave behind), and delete approved files.

Then verify:

- every approved item is gone from the diff
- the repo's typecheck and the tests touching the edited files still pass

Report what was removed and anything left in place.
