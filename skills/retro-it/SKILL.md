---
name: retro-it
description: Suggest how to improve the agent's setup after a session.
argument-hint: "Which session? Defaults to the current one."
disable-model-invocation: true
---

Run a **retrospective**: suggest changes to the coding agent's **environment** that would make future sessions go better. The environment is everything around the agent (instructions, checks, tooling, access), not the code it wrote.

## Steps

1. Call the Skill tool with "writing-for-agents" for how to write instructions agents follow.
2. Read the session the user named, from the conversation or the session logs on this machine. Default to the current session.
3. Look for candidates in each category below.
4. Present them most severe first. For each: what went wrong (with the moment in the session), the change you suggest, and where it goes (file and section). Make no changes until the user picks which to apply.

## Categories

- **Navigation:** how easily did the agent find the right files? Would a pointer in `AGENTS.md` or a doc have saved the search? _Look here when_ finding something took a long time.
- **Automated checks:** could a linter rule, type check, test, pre-commit hook or CI job have caught a mistake the agent made? Read the repo's own check commands and CI first: a check that exists but isn't wired up, or silently fails, is the finding. A repo with no guardrail at all (no hook and no CI running lint, typecheck and tests) is a finding in itself. _Look here when_ the agent made a mistake a machine could catch.
- **Coding standards:** should `review-it` enforce a new rule, or should an existing rule be removed or clarified? A **mechanical** rule (a banned API, an import shape, a file location) belongs in an automated check; build the check rather than writing the rule. Keep `CODING_STANDARDS.md` for **judgement calls** no check can make. _Look here when_ review missed a mistake.
- **Instruction files:** does `AGENTS.md` or `CLAUDE.md` (repo or global) carry rules that belong in coding standards or automated checks instead? _Look here when_ those files are long.
- **No-ops:** instructions that don't change the agent's behaviour. _Look here when_ instruction files are long and unwieldy.
- **Tool economy:** expensive or wasteful tool calls that could be cheaper, or custom tooling (CLIs, MCP servers) that burns tokens. _Look here when_ a tool call was slow or produced huge output.
- **Information access:** information the agent needed but couldn't reach (dev server logs, read-only access to a third-party service, docs). _Look here when_ the agent guessed at something it could have looked up.

## Where things belong

All work goes through implementation and review. The implementing agent carries the most context pressure (exploring, writing, debugging); the reviewing agent receives a diff and carries the least. So coding standards are enforced at review, not loaded into implementation.

- `AGENTS.md` / `CLAUDE.md`: loaded into every agent's context, so keep them to pointers to other files.
- `CODING_STANDARDS.md`: read by `review-it`, not during implementation.
- Docs: reference files reached by a pointer. Look for an existing doc before writing a new one.
- Skills: for user-invoked workflows, or reference the agent should find by its description.
