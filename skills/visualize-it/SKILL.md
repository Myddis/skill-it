---
name: visualize-it
description: Draw a multi-step process, flow or sequence as a flow chart in an HTML page. Use when the user asks to visualize, diagram or chart a flow, or when a process has enough steps, actors or branches that text is hard to follow.
---

Turn a process into a **flow chart** a reader understands in one look, saved as an HTML page.

## 1. Model the process

Before drawing, list:

- **Steps:** each action, as a short verb phrase.
- **Actors:** who or what performs each step (a user, a service, an agent, a job).
- **Decisions:** each point where the flow branches, with the condition on each branch.
- **Start and end:** where the flow begins, and every place it can finish (including failure).

Take these from the conversation, the code or the docs. If a step or branch is unclear and you can't find it, ask the user rather than drawing a guess.

This step is done when every step has an actor and every decision has all its branches.

## 2. Draw it

Copy [TEMPLATE.html](TEMPLATE.html) and fill in its placeholders:

- **Diagram:** Mermaid `flowchart TD`. One `subgraph` per actor when there are two or more. Decisions as `{diamonds}` with the condition on each edge. Labels of a few words; detail goes in the step list.
- **Step list:** one numbered line per step, matching the numbers in the diagram's labels, with the detail that didn't fit in the box.

Keep it readable: about 15 nodes at most. A bigger process becomes an overview chart plus one chart per section, as separate `<section>` blocks in the same page.

## 3. Save and show

- Tied to a plan: `docs/plans/<slug>/visuals/<name>.html`.
- Otherwise: the OS temp directory (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows).

If the harness can publish an artifact (Claude), publish the page and give the user the link. Otherwise give the file path; it opens in any browser (the diagram library loads from a CDN, so it needs internet).
