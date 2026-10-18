---
name: handoff-it
description: Pack the current session into a document a fresh agent can continue from.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document that lets a fresh agent, with none of this conversation, continue the work.

Save it to the OS temp directory (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows), named `handoff-<topic>-<date>.md`, not inside the repo.

Cover:

- **Goal:** what the user is trying to achieve.
- **State:** what is done, what is in progress, and what is left, as a short checklist.
- **Decisions:** choices made in this session and why, so the next agent doesn't reopen them.
- **Open questions:** what is still undecided or blocked.
- **Pointers:** paths and URLs for everything that already holds detail (the plan in `docs/plans/<slug>/`, task files, branches, commits, PRs, issues). Point to them rather than copying their content.
- **Suggested skills:** which skills the next agent should call the Skill tool for, and which typed skills the user should run.

If the user passed an argument, it describes what the next session is for: tailor the document to it.

Replace every secret (API keys, passwords, tokens, personal data) with `<REDACTED>`.

Finish by giving the user the file path and a one-line prompt to start the next session with, e.g. `Read <path> and continue the work.`
