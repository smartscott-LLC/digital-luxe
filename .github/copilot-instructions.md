# Copilot Instructions — Digital Luxe

## Project profile

- Vanilla JS ES modules, no framework.
- Static PWA served from repo root.
- Shadow DOM is foundational and should be preserved.

## Coding rules

1. Prefer minimal edits over broad rewrites.
2. Keep module responsibilities clear (canvas/inspector/catalog/etc.).
3. Preserve current event contracts (especially `dlx:selection-change`).
4. Use existing naming/style patterns (`dlx-` classes, `const`/`let`, helper escapes).
5. Maintain accessibility labels/roles for interactive UI additions.
6. Avoid adding dependencies unless absolutely necessary.

## Architecture constraints

- Do not introduce React/Vue/Svelte.
- Do not add bundlers/transpilers unless explicitly requested.
- Keep persistence local-first (OPFS + localStorage fallback).
- Keep component rendering in Shadow DOM.

## Documentation expectations

For any user-facing behavior changes:
- update `README.md`
- update relevant docs in `/docs`
- keep onboarding and runbook docs consistent

## Validation expectations

Manual verification should cover:
- add component
- select/move/resize
- pan/zoom
- save/load vault
- export html
- smartbar command flow
