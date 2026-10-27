# Review baseline

The rules every review applies, in every repo, on top of the repo's own standards. A documented repo rule wins over any rule here.

## Scope and simplicity

- **Out of scope:** a change the task didn't call for (an unrelated refactor, reformatting, a renamed symbol, a version bump, a new dependency). → revert it, or raise it as its own task.
- **Speculative generality:** an abstraction, parameter, option or hook for a need the task doesn't have. → inline it back until a real need shows up.
- **Reinvention:** new code doing what an existing helper, the standard library, the platform or an installed dependency already does. → call the existing one.
- **Symptom patch:** a fix that hides the failure (a special case, a swallowed error, a retry) instead of fixing its cause. → fix the cause.
- **Weakened safety:** validation, error handling, security checks or accessibility removed or skipped to make the change smaller. → restore it.
- **Leftover:** temporary code the change added: debug output (`console.log`, `print`, `debugger`), commented-out code, new `TODO`/`FIXME`, test focus or skips (`.only`, `.skip`), hard-coded test overrides, by-product files (logs, dumps, `*.orig`). Skip what the repo does on purpose, such as logging through `console.log`. → delete it.

## Comments

- **Narrating comment:** explains what the code visibly does, or how it was written. → delete it.
- **Context-bound comment:** only makes sense with knowledge of the ticket, the conversation, or an alternative that isn't in the code ("as discussed", "instead of X"). → rewrite as the lasting reason, or delete it.
- **Long comment:** more than one line or one sentence. → shorten to the one constraint or invariant that the code can't express.

## Code smells

From Fowler's _Refactoring_, chapter 3. Each is a heuristic: report it as a "possible <smell>".

- **Mysterious Name:** a name that doesn't reveal what the thing does or holds. → rename it.
- **Duplicated Code:** the same logic shape in more than one place in the change. → extract it and call it from both.
- **Feature Envy:** a function that uses another object's data more than its own. → move it onto that data.
- **Data Clumps:** the same few fields or parameters travelling together. → bundle them into one type.
- **Primitive Obsession:** a string or number standing in for a domain concept. → give the concept its own small type.
- **Repeated Switches:** the same switch or if-chain on the same type in more than one place. → one shared map, or polymorphism.
- **Shotgun Surgery:** one logical change forcing edits scattered across many files. → gather what changes together into one module.
- **Divergent Change:** one module edited for several unrelated reasons. → split it so each part changes for one reason.
- **Message Chains:** long `a.b().c().d()` navigation the caller depends on. → hide the walk behind one method.
- **Middle Man:** a function or class that only passes calls on. → call the real target directly.
- **Refused Bequest:** a subclass or implementer that ignores or overrides most of what it inherits. → use composition instead of inheritance.
