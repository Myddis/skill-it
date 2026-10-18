---
name: research-it
description: Research a question against primary sources in a background agent and write up the cited findings. Use when the user wants a topic researched, needs facts about a library, API or tool before deciding, or wants reading legwork delegated.
---

Start a **background agent** to do the research, so the main session keeps working while it reads. If the harness has no background agents, do the research inline.

Its brief:

1. Investigate the question against **primary sources**: official docs, source code, specs, changelogs, first-party APIs. Follow every claim back to the source that owns it, not a blog post or summary about it.
2. Note the version or date each fact applies to.
3. Write the findings to one markdown file: the question, a short answer up top, then the detail, with a link to the source after each claim. Mark anything the sources leave unclear as open.
4. Save it to `docs/plans/<slug>/research/<topic>.md` when the research feeds a plan, otherwise to `docs/research/<topic>.md`.

When it finishes, give the user the file path and the short answer.
