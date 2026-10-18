---
name: plan-it
description: Interview me until nothing about the work is assumed, then write the plan.
argument-hint: "What do you want to build? Optionally a path to a prototype."
disable-model-invocation: true
---

Reach a **shared understanding** of the work with the user, with nothing silently assumed, then write it down as a plan that `implement-it`, `delegate-it` and `review-it` will read.

## 1. Gather context

- Read what the user asked for. If they passed a prototype (an HTML file), open it: it is the source of truth for layout and look, and the `PROTOTYPE CHANGES` list in its top comment says what differs from the live app. Your questions cover what it cannot show (behaviour, data, empty, loading and error states, permissions).
- Read `GLOSSARY.md` and any ADRs in the area being touched, if they exist, and use their terms.
- Explore the code the work touches, so your questions are grounded in how the code works today.

## 2. Interview

Map the work as a **design tree**: every decision branches into the decisions that hang off it. The **frontier** is every open decision whose prerequisites are already settled.

Work in **rounds**. Each round, ask the whole frontier at once, numbered, each with your recommended answer, worded so "yes" accepts the recommendation:

```
**Q1. <short title>**
<the question, with the options if there are several>
Recommended: <your answer, and one line on why>
```

Then wait for the answers, recompute the frontier, and ask the next round. A question that depends on another question still open belongs to a later round.

**Facts are your job; decisions are the user's.** When a question hinges on a fact you can find (in the code, the config, the docs, the git history), find it yourself, using a subagent if the lookup is large, and ask only about what remains a choice. Put every choice to the user, including the ones you feel sure about.

Cover these branches before you finish, alongside whatever the work itself raises:

- **Scope:** what is in, and what is explicitly out.
- **Behaviour:** what each user or caller sees, including edge cases and failure states.
- **Design:** which modules change, the shape of new interfaces, data and schema changes.
- **Testing:** if the repo has a test setup, which public boundaries (seams) get tests. Prefer existing seams and the highest one that reaches the behaviour. If the repo has no test setup, ask whether to add one.
- **Size:** does this fit one agent session (`implement-it`) or does it need splitting across subagents (`delegate-it`)?

The interview is done when the frontier is empty, every branch above is settled, and the user confirms you have a shared understanding.

## 3. Write the plan

Pick a short kebab-case slug for the feature and write `docs/plans/<slug>/plan.md`. If `.gitignore` does not already cover `docs/plans/`, add that line and tell the user: plans are working files, never committed.

Write it in plain, concise prose, using the glossary's terms:

```markdown
# <Feature name>

## Problem
What the user faces today, from their point of view.

## Solution
What changes, from the user's point of view.

## Behaviour
1. As a <actor>, I want <capability>, so that <benefit>.
(Numbered; one line each; cover every behaviour settled in the interview, edge cases included.)

## Decisions
Every decision from the interview, one bullet each: modules touched, interfaces, data and schema changes, API contracts. File paths are welcome.

## Testing
The agreed seams and what each one catches, plus existing tests to model new ones on. Or: "No test setup; agreed to <answer>."

## Prototype
Path to the prototype, if there is one. Otherwise omit this section.

## Out of scope
What was explicitly ruled out.
```

The plan is done when every decision from the interview appears in it exactly once.

## 4. Hand over

Show the plan's path, then tell the user the next step, using the size decision:

- Fits one session: run `/implement-it docs/plans/<slug>/plan.md`.
- Too big: run `/delegate-it docs/plans/<slug>/plan.md`.
