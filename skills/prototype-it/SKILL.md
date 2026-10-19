---
name: prototype-it
description: Turn a page of the running app into a clickable HTML prototype you can change and share.
argument-hint: "Which page, and what would you like to try?"
disable-model-invocation: true
---

Capture a page of the running app as a **prototype**: one self-contained HTML file that looks exactly like the real page and opens with a double-click. The user, often a product manager, then asks for changes to the prototype instead of the code, and shares it with a developer when it's ready. The developer passes it to `/plan-it`.

The prototype copies the page's look, not its logic: no data fetching, routing or app scripts come along. Interactions the user wants to try are rebuilt as small inline scripts.

## 1. Agree what to capture

Ask, if the user hasn't said, through the harness's question tool when it has one (likely pages and states as options):

- which page, and in which state (logged in as whom, which data, which tab open)
- what change they want to try, if they know yet
- a short name for the prototype

Save it to `docs/plans/<name>/prototype/<name>.html` (`docs/plans/` is gitignored; add it to `.gitignore` if missing).

## 2. Run the app

Find how the repo starts its dev server (`package.json` scripts, `README`, `Makefile`) and start it in the background. If it needs environment variables, seed data or other setup you can't do, walk the user through it and wait.

## 3. Open the page

Use the browser tool this harness has: Claude in Chrome or the Claude desktop browser pane in Claude, otherwise the Playwright MCP server. If none is available, tell the user to add the Playwright MCP server (`npx @playwright/mcp@latest`) to their agent and stop.

Open the page and bring it to the agreed state by navigating and clicking. If the page needs a login, ask the user to sign in in that browser themselves, and wait.

This step is done when a screenshot shows the page in the agreed state.

## 4. Capture

1. In a background shell, start the receiver from this skill's folder: `node scripts/receive.mjs <output path>`. It waits for one upload on `http://127.0.0.1:4799/`, writes the file and exits. If port 4799 is taken, pass another port as a second argument and change `RECEIVER` in the script to match.
2. Read `scripts/capture.js` from this skill's folder and run it in the page with the browser tool's JavaScript tool. It is an async function: pass it as the function to evaluate (Playwright's `browser_evaluate`), or run `await (<script>)()` (Claude's JavaScript tools).
3. The script returns `200 saved` and the size. The receiver prints the saved path.

The script collects every stylesheet into one `<style>`, inlines images and fonts as data URLs, keeps form values (never password fields), turns canvases into images, and strips scripts. Content in iframes and shadow DOM is not captured: say so if the page uses them.

## 5. Check it

Open the saved file in the browser and screenshot it next to the live page. Fix visible differences in the HTML file directly (usually a missing font or image that couldn't be fetched). Then stop the dev server.

This step is done when the prototype and the live page look the same.

## 6. Change it

Make each change the user asks for directly in the HTML file: markup and CSS for layout and look, small inline `<script>` blocks for interactions (opening a dialog, switching a tab, showing a validation message).

After each change, add one line to the `PROTOTYPE CHANGES` list in the comment at the top of the file, describing the change from the user's point of view. That list is what `plan-it` reads to know what the developer must build.

## 7. Share

If the harness can publish an artifact (Claude), publish the file and give the user the link. Always give the file path too. Tell the user the developer's next step: run `/plan-it` with the prototype's path.
