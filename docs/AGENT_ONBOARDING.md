# Agent Onboarding (Digital Luxe)

This guide is for future coding agents and maintainers.

## 1) First principles

- Keep **vanilla JS** and **PWA local-first** architecture.
- Keep **Shadow DOM isolation** for component rendering.
- Prefer small, surgical changes unless a larger refactor is explicitly requested.
- Avoid introducing frameworks/build systems without explicit approval.

## 2) Local run

```bash
npm start
# http://localhost:3002
```

No build step, no test runner currently.
Validation is manual UI verification plus static review.

## 3) High-risk files

- `js/canvas.js`: interaction-critical, easiest place to regress behavior
- `js/inspector.js`: depends on event contract and selector assumptions
- `js/catalog.js`: import pathways and persistence merge logic
- `js/blocks.js`: curated block composition mapping to component IDs
- `css/app.css`: global styles; beware unintended side effects

## 4) Safe change workflow

1. Read impacted module + related module(s)
2. Confirm event/data contract dependencies
3. Implement minimal focused edit
4. Manually verify:
   - add component
   - drag/resize/select
   - alignment/distribution/match-size tools
   - rulers/guides/frame selection
   - add block and edit nested items
   - save/load vault
   - export html/png/tokens + preview tab
   - smartbar actions
5. Update docs if behavior changed

## 5) Common gotchas

- Selection changes must fire `dlx:selection-change`.
- Geometry changes should avoid full re-render where possible.
- Imported community components must remain serializable plain objects.
- Keep accessibility labels on new interactive controls.

## 6) Definition of done for feature work

- behavior implemented
- no obvious regressions in core interactions
- docs updated
- README/docs links remain valid
- branch committed with clear conventional messages

## 7) ToolSmart alignment checklist

Before merging, verify the change supports collection goals:
- local-first
- no-code usability
- reliability over novelty
- documentation clarity for non-authors
