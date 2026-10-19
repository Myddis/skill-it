---
name: explore-it
description: Explore possible solutions to a problem, compare them, and pick the best one before planning.
argument-hint: "What problem are you trying to solve?"
disable-model-invocation: true
---

Find the best solution to a problem whose solution isn't known yet. Your first idea is unlikely to be the best, so lay out **radically different** options side by side, gather evidence, and let the user choose. The chosen solution then goes to `/plan-it`, which settles the details.

Ask every question through the harness's question tool when it has one: 2-4 concrete options, your recommendation first and marked "(Recommended)". Without one, ask in short numbered text.

## 1. Frame the problem

Read `GLOSSARY.md` and ADRs in the area, if they exist, and explore the code involved. Then write a short framing:

- **Problem:** what hurts today, and for whom.
- **Goals:** what a good solution achieves, in order of importance.
- **Constraints:** what any solution must respect (existing architecture, deadlines, budget, platforms).
- **Non-goals:** what this effort is not trying to solve.

Ask about anything you can't find in the code or the conversation. This step is done when the user confirms the framing.

## 2. Generate options

Produce 2-4 options that differ in **approach**, not in detail: different architectures, different places the change lives, build vs. reuse. When the harness has subagents, generate them in parallel, each given the framing and a different lens:

- **Smallest change** that solves the problem.
- **Long-term fit:** the solution you'd want if this area keeps growing.
- **Reuse:** an existing library, platform feature or pattern already in the repo.
- **Common case first:** make the most frequent use trivial, the rare cases possible.

Include "change nothing" or a manual workaround as an option when it is a serious contender. Drop options that are variations of another option.

## 3. Gather evidence

For each option, find what the decision really turns on. **Facts are your job**; decisions are the user's.

- **Codebase fit:** how each option fits existing code, patterns and conventions, and what it would touch.
- **Research:** when an option depends on how a library, API or platform behaves, call the Skill tool with "research-it".
- **Spikes:** when an option rests on a risky assumption ("can this library stream?"), test it with a tiny throwaway experiment in the OS temp directory. Report the result and delete the spike.
- **Visuals:** when options differ in how data or control flows, call the Skill tool with "visualize-it" to draw them.

This step is done when every claim in the comparison is backed by code you read, a source, or a spike you ran.

## 4. Compare and recommend

Present one comparison table:

| Option | How it works | Pros | Cons | Effort | Risk | Reversible? |
|---|---|---|---|---|---|---|

**Reversible?** is a **two-way door** (easy to undo) or a **one-way door** (hard to undo: data migrations, public APIs, vendor lock-in).

Then give your recommendation and why, in two or three sentences. Be opinionated: the user wants a strong read, not a menu. If parts of different options combine well, propose the hybrid as its own option.

## 5. Choose

Ask the user to pick, with each option as a choice and your recommendation first. If they want to dig deeper into one option or a new idea, return to step 3 for it, then compare again.

## 6. Write it down

Pick a short kebab-case slug and write `docs/plans/<slug>/options.md`. If `.gitignore` does not already cover `docs/plans/`, add that line and tell the user.

```markdown
# <Problem in a few words>

## Problem
## Goals
## Constraints
## Non-goals

## Options
One short section per option: how it works, and the evidence found.

## Comparison
The table from step 4.

## Decision
The chosen option, and why it beat the others.

## Rejected
One line per rejected option: why not.

## Open for plan-it
Details the choice leaves open, for the planning interview.
```

## 7. Hand over

Show the file path, then tell the user the next step: run `/plan-it docs/plans/<slug>/options.md`.
