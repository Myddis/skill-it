---
name: delegate-it
description: Split a large plan into tasks and build them in parallel with subagents on one feature branch.
argument-hint: "Path to the plan, e.g. docs/plans/<slug>/plan.md"
disable-model-invocation: true
---

Build a plan too big for one session by splitting it into **tasks** and running **implementer subagents** across them in parallel. The end state is one feature branch holding one commit per task, reviewed, and not pushed.

You are the coordinator. Talk to subagents through **context pointers** (the absolute paths of the plan, the task file, research notes, commits) rather than restating what those files say.

## 1. Load the plan

Use the plan the user passed; with no argument, list the folders under `docs/plans/` and ask which one. Read it in full, plus `GLOSSARY.md` and ADRs in the area being touched, if they exist. Explore the code the plan touches.

`docs/plans/` is gitignored, so worktrees won't contain it: always hand subagents **absolute** paths into the main checkout.

## 2. Split into tasks

Break the plan into **tracer-bullet** tasks:

- Each task cuts a narrow but complete path through every layer it needs (schema, API, UI, tests), so it is demoable or testable on its own.
- Each task fits one fresh agent session.
- Any **prefactoring** ("make the change easy, then make the easy change") comes first, as its own tasks.
- Each task lists the tasks that **block** it: the ones that must be finished before it can start.

**Wide refactors** are the exception: one mechanical change (rename a column, retype a shared symbol) that breaks call sites everywhere at once. Sequence it as **expand–contract**: add the new form beside the old; migrate callers in batches, each its own task blocked by the expand; then remove the old form in a task blocked by every batch.

The split is done when every Behaviour item and Decision in the plan belongs to exactly one task.

## 3. Agree the split

Show the tasks as a numbered list: title, blocked by, and what it delivers. Then ask whether the size feels right, whether the blocking edges are right, and whether any task should be merged or split, through the harness's question tool when it has one (concrete options, your recommendation first and marked "(Recommended)"). Iterate until the user approves.

Then write one file per task, numbered in dependency order:

```markdown
# <NN>: <Title>

**Plan:** <absolute path to plan.md>

**What to build:** the end-to-end behaviour this task makes work, from the user's point of view.

**Blocked by:** <task numbers and titles, or "None">

**Status:** ready

- [ ] Acceptance criterion
- [ ] Acceptance criterion
```

Save them as `docs/plans/<slug>/tasks/<NN>-<task-slug>.md`.

## 4. Create the feature branch

If the current branch is the default branch, create `<slug>` from it and use that. If the user is already on a feature branch, use that one. Confirm the branch with the user before any subagent starts.

## 5. Run the frontier

The **frontier** is every task whose blockers are all done and that hasn't started. Start one implementer subagent per frontier task, in the background, each in its own git worktree on its own branch cut from the feature branch.

Each implementer's brief:

- the absolute paths of its task file and the plan
- build exactly what the task file says; if the task or plan looks wrong, stop and report the concern rather than deciding
- if the repo has a test setup, call the Skill tool with "tdd" and work test-first
- tag every temporary line `[TEMP-<4 hex>]` in a comment on the same line
- before committing, search the changes for `TEMP-[0-9a-f]{4}`, delete every tagged line and file, and re-run the task's tests
- commit the task as one commit, with the task title as the message
- merge the feature branch's latest tip into its own branch and resolve conflicts
- report: the commit, test results, and any concerns

When an implementer reports, merge its branch into the feature branch, set the task's **Status** to `done`, and recompute the frontier. Start subagents for any newly unblocked tasks. A task whose implementer raised a concern instead of finishing stays `blocked`; tasks behind it wait, and the concern goes to the user.

If the harness has no subagents or worktrees, work the tasks yourself one at a time in dependency order on the feature branch, following the same brief.

This step is done when every task is `done` or waiting on a concern.

## 6. Review

Run the repo's full test suite on the feature branch. Then call the Skill tool with "review-it" on the feature branch against its base, passing the plan's path. Change nothing in response: the findings go to the user.

## 7. Report

Remove every worktree you created. Then report:

- the feature branch and its commits, one per task
- tasks waiting on a concern, with the concern
- review-it's findings, both axes, as it reported them
- test results on the feature branch

Nothing is pushed. Tell the user the next step: check the branch, then run `pr-it`, written in the form this skill was started with, plugin prefix included (`/skill-it:pr-it` in Claude Code).
