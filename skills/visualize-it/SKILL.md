---
name: visualize-it
description: Draw a process, system, sequence, schema, lifecycle or roadmap as a Mermaid diagram, in an HTML page or kept in the repo's Markdown docs. Use when the user asks to visualize or diagram something, wants a Mermaid diagram kept in the repo or docs, or when a process has enough steps, actors or branches that text is hard to follow.
---

Turn a process or system into a Mermaid **diagram** a reader understands in one look.

## 1. Pick the output

Decide from the request alone:

- **Repo doc:** the request asks to document the diagram, keep it in the repo or docs, or names a `.md` file. Write to the file the user named, else `docs/<topic>.md` in kebab-case, one file per subject, starting with a `# <Title>` heading. Existing docs such as `README.md` change only when the user names them. When the file already holds a diagram of this subject, update that block.
- **Page:** every other request, including calls from other skills. An HTML page built from [TEMPLATE.html](TEMPLATE.html).

## 2. Model it

Pick the type from what is shown:

- `flowchart TD`: a process with steps and decisions.
- `flowchart LR`: architecture or data flow.
- `sequenceDiagram`: calls between actors over time.
- `erDiagram`: a schema.
- `stateDiagram-v2`: a lifecycle.
- `timeline`: a roadmap, phases or releases over time.

Stick to these stable types; `-beta` types may not render.

**A process:** list each step as a short verb phrase, the actor that performs it, each decision with the condition on every branch, and where the flow starts and every place it can finish (including failure). Take these from the conversation, the code or the docs.

**A repo, service or named flow:** "this repo" means the git repo in the working directory. Build from evidence, not names: README and docs, entry points (handlers, routes, jobs), infra and deployment config, outbound calls (SDK clients, HTTP, queue producers), env vars naming queues, buckets and tables. Trace trigger → processing → storage and outputs → consumers, drawing what carries the flow and leaving plumbing (permissions, logging, secrets) out. When the flow lives in another repo, or hops into one, ask for that repo's local path and check it just enough to name what you draw; with no path, draw the hop from what this repo shows and mark it as an assumption.

When a step or branch is unclear and you can't find it, ask the user rather than drawing a guess.

This step is done when every node and edge is traced to a source or marked as an assumption, and, for a process, every step has an actor and every decision has all its branches.

## 3. Draw it

Flowcharts colour every node by its role with this palette, pasted at the end of the diagram and applied with `class <ids> <role>` lines. Pastel fills with dark text stay readable on both light and dark pages.

```
classDef trigger fill:#e0c2ff,stroke:#9b59d6,color:#1a1a1a
classDef work fill:#c2c2ff,stroke:#6666d6,color:#1a1a1a
classDef data fill:#ddffa3,stroke:#86b33a,color:#1a1a1a
classDef queue fill:#ffffa3,stroke:#b3b33a,color:#1a1a1a
classDef decision fill:#ffe0a3,stroke:#d69b33,color:#1a1a1a
```

Paste only the roles the diagram uses. Every other type takes its colours from the renderer's theme; a `timeline` colours each section by itself.

- 6-15 nodes per diagram. Past that, split into an overview plus one diagram per section.
- Short ids with quoted labels of a few words, named the way the team talks: `ordersApi["Orders API"]`. Edge labels 1-3 words: `-->|Raw data|`. Detail that doesn't fit goes in the step list or the text around the diagram.
- **Process flowchart (TD):** one `subgraph` per actor when there are two or more. Start and end points `(["..."])` as `trigger`, steps as `work`, decisions as `{diamonds}` with the condition on each edge, as `decision`.
- **Architecture flowchart (LR):** shape and colour show the role. Trigger (schedule, user action, upstream event) `(["..."])` as `trigger`; compute (function, job, service) `["..."]` as `work`; storage (database, bucket, table) `[("...")]` as `data`; queue, stream or topic `[["..."]]` as `queue`; external systems in a `subgraph` named "External".
- **Timeline:** `title` first, one `section` per period, a few short items per section.
- **Sequence:** `autonumber` first; `actor` for people, `participant` for systems; group participants with an uncoloured `box <Team or system>`; error, retry and timeout paths in `alt`/`else` or `opt` blocks; `+`/`-` activations on request/response pairs; `Note over` for retries, timeouts and schedules.
- **Parser gotchas:** quote every label containing `()[]{}:;#&` or the word `end`; `end` and `default` cannot be node ids; a line break inside a label is `<br/>`; a `subgraph` title longer than its widest node wraps and gets clipped, so keep it to a few words.

This step is done when each diagram has 6-15 nodes, every label passes the parser gotchas, and every flowchart node has a role class.

## 4. Save and show

**Page:** fill the template's placeholders. For a flowchart or sequence diagram, the step list gets one numbered line per step, matching the numbers in the diagram, with the detail that didn't fit in the box. For an ER, state or timeline diagram, remove the Steps heading and list. Split diagrams become separate `<section>` blocks in the same page. Save it to:

- `docs/plans/<slug>/visuals/<name>.html` when tied to a plan.
- Otherwise the OS temp directory (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows).

If the harness can publish an artifact (Claude), publish the page and give the user the link. Otherwise give the file path; it opens in any browser (the diagram library loads from a CDN, so it needs internet).

**Repo doc:** one sentence above each ```` ```mermaid ```` block saying what it shows; split diagrams each get their own heading. Give the file path and how to preview it: GitHub renders it, VS Code needs the "Markdown Preview Mermaid Support" extension, or paste it into mermaid.live.

End the reply with every assumption marked in step 2.
