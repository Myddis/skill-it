---
name: review-it
description: Review a diff on two axes, coding standards and the plan, in parallel fresh-context subagents. Use when the user wants a review of uncommitted changes, a branch or a PR, asks to "review since X", or when another skill needs its work reviewed.
---

Review a diff on two separate **axes**:

- **Standards:** does the code follow the coding rules?
- **Plan:** does the code do what the plan asked, no more and no less?

Each axis runs in its own **fresh subagent**, so neither sees the other's findings or the implementer's reasoning: only the diff and its brief.

## 1. Pin the diff

Use what the user or calling skill named. Otherwise:

- **Uncommitted changes exist:** review those. The diff is `git diff HEAD`, plus the new files listed by `git ls-files --others --exclude-standard`.
- **Working tree is clean:** review the branch against its base. Find the default branch (`git symbolic-ref refs/remotes/origin/HEAD`, else `main` or `master`). The diff is `git diff <base>...HEAD`; the commits are `git log <base>..HEAD --oneline`.

Run the diff command once before going further. An empty diff or a ref that doesn't resolve stops the review here, with a message to the user.

## 2. Find the plan

In order:

1. A plan path the user or calling skill passed.
2. `docs/plans/<slug>/plan.md` where the slug matches the branch name or the feature.
3. Issue references in the commit messages (`#123`, `Closes #45`), fetched from the tracker.
4. Ask the user. If there is none, the Plan axis is skipped and the report says so.

## 3. Find the standards

Collect every file in the repo that documents how code should be written. `CODING_STANDARDS.md` and `CONTRIBUTING.md` are always on the list when they exist; also check `AGENTS.md`, `CLAUDE.md` and `docs/` for coding rules.

Then read [BASELINE.md](BASELINE.md): the team baseline that applies in every repo. A documented repo rule overrides the baseline wherever they conflict.

## 4. Run both reviewers in parallel

Start both subagents together and wait for both reports. If the harness has no subagents, run the Standards review, write its report, then run the Plan review, and note in the final report that the axes were not independent.

**Standards reviewer** receives:

- the diff command, the commit list (if any), and the list of new files
- the list of standards files from step 3
- the full text of BASELINE.md, pasted in (the subagent has no other access to it)
- the brief: "Report every place the diff breaks a documented repo rule (cite the file and the rule) and every baseline issue you find (name it and quote the hunk). Mark each finding **hard** (a clear break of a documented rule) or **judgement call** (every baseline smell, and any rule that needs interpretation). A repo rule overrides the baseline. Skip anything a linter or formatter already enforces. Under 400 words."

**Plan reviewer** receives:

- the diff command, the commit list (if any), and the list of new files
- the plan's path or contents
- the brief: "Report (a) plan items missing or only partly built, (b) behaviour in the diff the plan didn't ask for, (c) plan items that look built but wrong. Quote the plan line for each finding. Under 400 words."

## 5. Report

Show the two reports under `## Standards` and `## Plan`, lightly cleaned, never merged or re-ranked: keeping the axes apart stops a pass on one from hiding a failure on the other.

End with one line: the number of findings on each axis and the worst finding within each.
