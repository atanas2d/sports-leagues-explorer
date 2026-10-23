# AI notes

How AI tools were used, as the brief allows, and what was done by hand.

## Tool

Claude Code (Anthropic), in the editor, throughout.

## What the AI did

- Investigated the API before any code: found that key `3` is disabled, measured the free-tier limits,
  read the documentation and the OpenAPI spec, and captured the fixtures in `src/fixtures/`.
- Wrote the plan with the contracts (types, signatures, test cases, order of steps) and a clickable
  mockup of the UI.
- Wrote the code in every layer, the tests, the styles and the README, step by step from those contracts.
- Reviewed the list step with a second, fresh pass; its findings became a separate `fix:` commit.
- Drafted `DECISIONS.md` and this file.

## What I did

- Decided the stack, the data library (TanStack Query over an own cache), the demo mode and its links,
  the size of the test suite, and which review findings to apply.
- Read every file before it was committed and asked for an explanation of anything unclear; several
  comments and simplifications came out of those questions.
- Ran the app, the tests and the build locally.
- Edited these notes and approved every commit, each made in real time with no rewritten history.
