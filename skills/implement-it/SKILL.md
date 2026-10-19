---
name: implement-it
description: Build a plan, have it reviewed and cleaned, and leave the changes uncommitted.
argument-hint: "Path to the plan, e.g. docs/plans/<slug>/plan.md"
disable-model-invocation: true
---

Build what the plan describes, then hand the user a reviewed, clean, **uncommitted** diff.

## 1. Load the plan

Use the plan the user passed. With no argument, list the folders under `docs/plans/` and ask which one. State the plan's title before starting.

Read `GLOSSARY.md` and any ADRs in the area you're touching, if they exist.

The plan is the **scope**. Build every behaviour and decision in it and nothing beyond it. When the plan turns out wrong, incomplete or contradicted by the code, stop and ask the user; a gap in the plan is a decision, and decisions are theirs. Ask through the harness's question tool when it has one: 2-4 concrete options, your recommended option first and marked "(Recommended)".

## 2. Build

If the repo has a test setup, call the Skill tool with "tdd" and work test-first at the seams in the plan's Testing section. If it has none, follow whatever the plan's Testing section settled.

Run the repo's own typecheck, lint and the relevant test files as you go. Run the full test suite once at the end.

**Tag every temporary line** you add (a debug log, a hard-coded value for manual testing, a skipped check) with `[TEMP-<4 random hex>]` in a comment on the same line, and give temporary files a name containing `TEMP-<hex>`. `clean-it` removes them by that tag.

Building is done when every Behaviour item and every Decision in the plan is implemented, and the full test suite passes.

## 3. Review

Call the Skill tool with "review-it" on the uncommitted changes, passing the plan's path. Its reviewers run in fresh subagents, so they see the diff and the plan, never your reasoning.

Change nothing in response. The findings go to the user, who decides what to act on.

## 4. Clean

Call the Skill tool with "clean-it".

## 5. Stop

Leave everything uncommitted: the user commits. Report:

- what was built, in a few lines
- test results (the full-suite command and its outcome)
- review-it's findings, both axes, as it reported them
- your own concerns: anything in the plan that looked risky, unclear or wrong while building
- what clean-it removed

Then tell the user the next step: review the diff, commit, and run `/pr-it`.
