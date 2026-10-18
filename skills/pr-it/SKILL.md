---
name: pr-it
description: Write the pull request description for the current branch. Does not open the PR.
disable-model-invocation: true
metadata:
  credits:
    skill: show-me
    author: Dex Horthy
    organisation: Humanlayer
    url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---

Write a PR description a reviewer can understand at a glance, and hand it to the user to paste. The user opens the PR.

## 1. Gather

- The diff and commits against the base branch (`git symbolic-ref refs/remotes/origin/HEAD`, else `main` or `master`): `git diff <base>...HEAD` and `git log <base>..HEAD --oneline`.
- The plan in `docs/plans/<slug>/plan.md`, if one matches the branch: its Problem is the source for **Why**.
- Issue references in the commits.
- The repo's PR template (`.github/pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE/`), if any.
- `GLOSSARY.md`, if it exists: write in its terms.

## 2. Write

Write a short title, then the body below. Plain, concise prose, no preamble. If the repo's PR template asks for sections that aren't here, add them after Merge Danger and fill them in.

```markdown
## Summary

<the smallest visual that makes the change clear, plus a line or two of text>

## Why

<1-3 lines: the problem this solves; link the issue if there is one>

## Evidence

- **Before:** <screenshot, output, or failing test>
  **After:** <screenshot, output, or passing test>

## Merge Danger

**Door:** <one-way or two-way>

**Blast radius:** <one word>

<optional: what could break, and for whom>
```

### Summary

Pick the smallest view that makes the key point clear: pseudocode, a call tree, a component tree, a file tree, a Mermaid diagram, or a `diff` of one of those. [VISUALS.md](VISUALS.md) has an example of each and when to use it. One visual is usually enough.

### Evidence

Show the change working, before and after. Screenshots are best for visual changes; test runs and command output are next best. Use only evidence that exists: real output from this branch. Where evidence is missing, write `<!-- needs: ... -->` naming what to capture, and tell the user.

### Merge Danger

A **two-way door** is cheap to walk back (a revert undoes it). A **one-way door** is not: data migrations, deletions, public API changes, anything that has already escaped once deployed. The **blast radius** is who or what is affected if it goes wrong: layout shift, a consumer breaking, mobile users, a background job.

## 3. Hand over

Show the title and body in one markdown block, ready to paste.
