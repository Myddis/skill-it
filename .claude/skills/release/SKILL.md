---
name: release
description: Release the plugin as a new version: bump, validate, commit, push.
disable-model-invocation: true
metadata:
  internal: true
---

Release the working tree as a new version of the skill-it plugin. Installed copies update only when `version` in `.claude-plugin/plugin.json` changes, so every release bumps it.

## 1. Pick the version

Find the last release: the latest commit that changed `version` (`git log -1 -G'"version"' -- .claude-plugin/plugin.json`). Read every commit since it, plus uncommitted changes. If there are none, tell the user there is nothing to release and stop.

Pick the bump from what changed:

- **patch**: fixes and rewording inside existing skills
- **minor**: a skill added, or a skill's behaviour changed
- **major**: a skill renamed or removed, or users must start skills differently

Draft the commit message: `Release <version>: <summary>`, then one bullet per change. Show the user the version, the reason for the bump and the message, and ask whether to push after committing. Wait for their answer.

## 2. Bump and validate

Set `version` in `.claude-plugin/plugin.json`, then run both validate commands from `AGENTS.md`. Fix every failure except the expected root `CLAUDE.md` warning before committing.

## 3. Commit and push

Stage all changes and commit with the agreed message. Push only if the user agreed to it.

Tell the user how to update their installed copy: `claude plugin marketplace update skill-it`, then `claude plugin update skill-it@skill-it`.
