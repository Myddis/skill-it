# skill-it

Agent skills for a team of developers and product managers, shipped as a Claude Code plugin and read by Codex, Copilot and other Agent Skills harnesses. `PLAN.md` holds the agreed skill list, flow and build order.

Call the Skill tool with "writing-for-agents" before creating or editing any `SKILL.md`, `AGENTS.md` or `CLAUDE.md`.

## Layout

Every skill is a folder `skills/<name>/` holding `SKILL.md`, `agents/openai.yaml`, and any reference files that skill owns. The folder is flat: every skill in it ships.

When a skill is added, renamed or removed, update all three in the same change:

- the `skills` array in `.claude-plugin/plugin.json`
- the skill's `<details>` block in `README.md`: a one-line summary, then What it does, When to use it, How to start it, What you get, Works with. Drop the _(planned)_ tag and link the name to its `SKILL.md` once it is built.
- the skill table in `PLAN.md`

Run `claude plugin validate . --strict` and `claude plugin validate .claude-plugin/plugin.json` after touching either file in `.claude-plugin/`; the root `CLAUDE.md` warning is expected, since that file guides work on this repo rather than plugin users. Bump `version` in `plugin.json` on every release, since installed copies update only when it changes.

## Naming

Workflow commands end in `-it` (`plan-it`, `review-it`). Reference skills that other skills load keep a plain name (`tdd`, `writing-for-agents`).

## Invocation

Each skill is either typed or auto, and both harness files must agree:

| Kind | `SKILL.md` frontmatter | `agents/openai.yaml` | `description` |
|---|---|---|---|
| Typed (only the human can start it) | `disable-model-invocation: true` | `policy.allow_implicit_invocation: false` | One human-facing line |
| Auto (agent or human can start it) | omit the key | omit `policy` | Model-facing, with trigger phrases |

`agents/openai.yaml` always carries `interface.display_name` and `interface.short_description`.

A skill reaches an auto skill by saying `Call the Skill tool with "<name>"`, one call per skill. A typed skill is unreachable from other skills; tell the user to run `/<name>` instead.

## Writing

Skills produce plain, concise prose for a reader who may be a developer or a product manager. Personal tone preferences belong in each user's own `CLAUDE.md`, not in a skill.

Skills adapted from [mattpocock/skills](https://github.com/mattpocock/skills) are covered by the dual copyright notice in `LICENSE`.
