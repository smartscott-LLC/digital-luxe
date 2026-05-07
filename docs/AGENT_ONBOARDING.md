# Agent Onboarding (Digital Luxe)

This guide is for future coding agents and maintainers.

---

## 1) First principles

- Keep **vanilla JS** and **PWA local-first** architecture — no frameworks, no build step.
- Keep **Shadow DOM isolation** for component rendering.
- Prefer small, surgical changes unless a larger refactor is explicitly requested.
- Design philosophy: **elegant not extravagant** — features should invite without demanding attention.
- Avoid introducing frameworks/build systems without explicit approval.

---

## 2) Local run

```bash
npx serve .
# http://localhost:3000
```

No build step, no test runner. Validation is manual UI verification.

> Note: service worker + OPFS require a localhost/secure context — open via the served URL, not `file://`.

---

## 3) Module overview (current)

| File | Role |
|---|---|
| `js/app.js` | Orchestrator — init order, keyboard shortcuts, modal wiring |
| `js/canvas.js` | Interaction engine — drag/resize/select/pan/zoom/undo/redo |
| `js/dock.js` | Cascading 3-panel right dock (Component / Canvas / File) |
| `js/catalog.js` | Left sidebar library browser + grid slider |
| `js/hotbar.js` | Footer center — up to 10 pinned action shortcuts |
| `js/explore.js` | Footer left — Explore Libraries portal |
| `js/smartbar.js` | ⌘K command palette |
| `js/nudge.js` | Canvas effect toggles (grow/shadow/round/pulse) |
| `js/vault.js` | OPFS/localStorage design save adapter |
| `js/components.js` | Built-in component definitions + drawer taxonomy |
| `js/blocks.js` | Curated multi-component sections |
| `js/utils.js` | `toast()` + `dlxConfirm()` |
| `js/inspector.js` | Legacy property panel (hidden when dock is present) |

---

## 4) Critical init order

In `app.js`, the initialization sequence is:

```
catalog.init → canvas.init → smartbar.init → initInspector
→ initDock → nudge.init → initHotBar → initExplore → vault.init
```

**`initDock` must run before `nudge.init`.** The dock Canvas panel creates `#nudge-toggles`. nudge.js looks it up lazily inside `renderToggles()` — if the dock hasn't built the DOM yet, `getElementById` returns null and the entire async init chain crashes, preventing everything after it (including `initHotBar` and `initExplore`) from running.

---

## 5) High-risk files

- `js/canvas.js` — interaction-critical; easiest place to regress drag/resize/select behavior
- `js/dock.js` — owns the Component panel which mirrors all inspector logic; event wiring is dense
- `js/catalog.js` — import pathways, variant-group deduplication, grid slider state
- `js/components.js` — variantGroup changes affect catalog card count; test all drawers after edits
- `css/app.css` — global styles; a stray `overflow: hidden` or `z-index` change can break layout silently

---

## 6) Service worker gotcha

The SW caches all app shell files under `digital-luxe-v2`. **Hard refresh does not bypass service worker cache.** When adding new JS/CSS files or making changes that aren't loading:

1. Bump the cache name in `sw.js` (e.g. `v2` → `v3`)
2. Add the new file to `APP_SHELL` in `sw.js`
3. Or instruct the user to: DevTools → Application → Service Workers → Unregister → hard refresh

---

## 7) Safe change workflow

1. Read impacted module + related modules
2. Confirm event/data contract dependencies (`dlx:selection-change`, canvas item model)
3. Implement minimal focused edit
4. Manually verify:
   - Add component from catalog
   - Drag / resize / multi-select / rubber-band
   - Alignment and distribution tools
   - Dock panels open/close; Component panel reflects selection
   - Hot bar: pin/unpin actions, run them
   - Explore: open popup, visit a URL, add/remove custom URL, import HTML to canvas
   - Rulers / guides / frame selection
   - Save to Vault / load design
   - Export HTML / PNG / tokens / preview tab
   - SmartBar actions
5. Update docs if behavior changed

---

## 8) Common gotchas

- Selection changes must fire `dlx:selection-change` — both dock.js and inspector.js depend on it.
- Geometry changes should avoid full re-render where possible (performance on large canvases).
- Imported community components must remain serializable plain objects (no Sets, no functions).
- Keep `aria-label` and `role` attributes on new interactive controls.
- Module-level `document.getElementById()` calls always return `null` at parse time — always look up DOM elements inside functions, never at top-level module scope.
- The `#nudge-toggles` element lives inside the dock Canvas panel, not in `index.html` directly.
- Footer layout uses `justify-content: space-between`: explore trigger (left), hotbar (absolute center), nudge-apply (right).

---

## 9) Adding new hot bar actions

1. Add an entry to `ACTIONS` in `hotbar.js`: `{ label, icon, group }`
2. Add a `case` in `runAction()` in `hotbar.js`
3. Add `data-action-id="your-action-id"` to the corresponding button in the DOM (dock or header) so right-click pinning works

---

## 10) Adding new catalog components

1. Add a definition to the `COMPONENTS` array in `components.js`
2. Assign a unique `id`, `name`, `category`, `group`, `html`
3. If it belongs to a family of variants, set `variantGroup` to the same shared string — only the first definition per variantGroup shows as a catalog card
4. Run the app and verify the drawer count is correct

---

## 11) Definition of done for feature work

- Behavior implemented and manually verified
- No obvious regressions in core canvas interactions
- New localStorage keys documented in `ARCHITECTURE.md` persistence table
- New modules added to `APP_SHELL` in `sw.js`
- README and docs updated
- Branch committed with clear conventional commit messages

---

## 12) ToolSmart alignment checklist

Before merging, verify the change supports collection goals:
- local-first (no required backend)
- no-code usability
- reliability over novelty
- documentation clarity for non-authors
- elegant not extravagant (features invite, they don't demand)
