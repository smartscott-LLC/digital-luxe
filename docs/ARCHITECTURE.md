# Digital Luxe Architecture

## 1) System overview

Digital Luxe is a **zero-build ES-module PWA**.

- Runtime: browser-only
- UI layer: vanilla JS + semantic HTML + CSS custom properties
- Isolation: Shadow DOM per component preview/item
- Persistence: OPFS primary, localStorage fallback
- Offline: service worker app-shell caching (cache key: `digital-luxe-v2`)

---

## 2) Module map

### `js/app.js` (orchestrator)
- App bootstrap and module initialization order
- Global keyboard shortcuts
- Modal wiring (export, vault, what's new, brand-logo nav guard)
- Pane divider drag (catalog ↔ canvas resize)

**Init order is critical:**
```
catalog.init → canvas.init → smartbar.init → initInspector
→ initDock → nudge.init → initHotBar → initExplore → vault.init
```
`initDock` must run before `nudge.init` because the dock Canvas panel creates `#nudge-toggles` — nudge.js looks it up at call time, not module load time.

---

### `js/canvas.js` (interaction engine)
- Item state lifecycle
- Free-form positioning, drag/resize/select/pan/zoom
- Guides + ruler interactions
- Frame/page model
- Snapshot-based undo/redo (60-step `history[]` stack)
- Serialization + export generation
- `addComponent(component)` — adds a component object to the canvas at drop position

---

### `js/dock.js` (cascading right dock)
Three fixed-position strip triggers on the right edge (32px each = 96px total).
Each strip slides out a panel:

| Strip color | Panel | Width | Contents |
|---|---|---|---|
| Graphite | Component | 280px | Full property inspector (mirrors inspector.js) |
| Teal | Canvas | 240px | Zoom, grid/snap, alignment, brand theme, nudge toggles |
| Gold | File | 200px | Save, export, danger zone |

- Panels use `transform: translateX(100%)` → `translateX(0)` transition
- Component panel auto-opens on `dlx:selection-change` when items are selected
- Creates `<div id="nudge-toggles">` inside the Canvas panel — required by nudge.js
- Canvas header gets `padding-right: calc(96px + var(--sp-5))` to avoid strip overlap
- When dock is present: `.dlx-inspector` is hidden via `body:has(#dlx-dock) .dlx-inspector`

---

### `js/inspector.js` (legacy property panel)
- Listens to `dlx:selection-change`
- Auto-generates controls from component CSS/HTML
- Writes per-item `props` overrides + text overrides
- Hidden when dock is present (CSS `display: none`)
- Kept for reference / fallback

---

### `js/catalog.js` (library browser)
- Drawers + component cards in a collapsible left sidebar
- **Grid slider**: clicking a drawer expands the catalog to 430px with a full visual grid
- Same drawer click closes the grid; clicking another drawer switches it
- Built-in + community merge; variant-group deduplication
- Search filter in grid header
- JSON import pipeline

---

### `js/hotbar.js` (footer hot bar)
- Up to 10 user-pinned action shortcuts centered in the footer
- ACTIONS registry: 23 actions across File / Canvas / Component groups
- **＋ button** opens a picker popover grouped by action category
- Right-click any `[data-action-id]` button anywhere in the app pins/unpins
- State persisted to `localStorage` key `dlx-hotbar-v1`
- `runAction(id)` dispatches to the appropriate canvas/dock/UI method

---

### `js/explore.js` (library explorer portal)
- Left-side footer trigger: "Explore" button (Dancing Script font) + ghost-typing tagline
- Tagline cycles through 3 phrases via JS typewriter with fade transition
- Popup panel contains:
  - 10 pre-seeded public component library URLs
  - Last-visited ✦ badges (stale after 7 days or never visited)
  - Add custom URL form (label + URL, validated)
  - Remove any entry (defaults tracked via `hidden[]`, custom via `custom[]`)
  - **Import HTML → Canvas**: pastes HTML, calls `canvas.addComponent()` directly
- State persisted to `localStorage` key `dlx-explorer-v1`
- All external links open `window.open(..., '_blank', 'noopener,noreferrer')`

---

### `js/smartbar.js` (command palette)
- ⌘K / Ctrl+K trigger
- Action routing and drawer switching
- URL import trigger

---

### `js/vault.js` (storage adapter)
- save / list / load / delete / rename named designs
- OPFS primary (`navigator.storage.getDirectory()`), localStorage fallback
- `vault.saveDesign(name, state)` — main save entry point

---

### `js/nudge.js` (canvas effect toggles)
- Global effect state (grow, shadow, round, pulse)
- Applies nudge classes/attributes to canvas items
- `renderToggles()` looks up `#nudge-toggles` lazily at call time — the element lives inside the dock Canvas panel, which is built by `initDock()` before `nudge.init()` runs

---

### `js/components.js` (source catalog)
- Built-in component definitions (id, name, category, group, html, defaultWidth, defaultHeight)
- Drawer taxonomy
- Variant groups for catalog deduplication
- `getCustomComponents()` — merges user-imported components from localStorage

---

### `js/blocks.js` (curated sections)
- Pre-assembled multi-component blocks
- Block metadata and relative item layout

---

### `js/utils.js` (shared utilities)
- `toast(message, type)` — ephemeral status message
- `dlxConfirm({ title, message, buttons })` — returns `Promise<buttonId>`, used for destructive-action guards (clear canvas, brand logo navigation)

---

## 3) Canvas item model

Each canvas item carries:

```js
{
  component,      // component definition object
  nudges: Set,    // active effect ids
  x, y,
  width, height,
  zIndex,
  rotation,
  props: {}       // css var + content overrides
}
```

Serialized state also includes:
- `frames[]` (named fixed-size export/page frames)
- `activeFrameId`
- `guidesX[]` / `guidesY[]`
- `history[]` (not serialized — runtime only)

---

## 4) Event contracts

### `dlx:selection-change`
Dispatched by canvas after selection or geometry changes.

```js
{
  detail: {
    indices: number[],
    items: CanvasItem[]
  }
}
```

Consumed by: `dock.js` (Component panel), `inspector.js` (legacy).
Do not change payload shape without coordinating both consumers.

---

## 5) Rendering model

- Catalog previews: shadow root per card
- Canvas items: shadow root per placed item
- Canvas transform: `translate(panX, panY) scale(zoom)` on `#canvas-items`
- Item transform: `rotate()` on each item wrapper
- Dock panels: CSS `transform: translateX()` slide animation

---

## 6) Persistence model

| Key | Storage | Contents |
|---|---|---|
| OPFS `*.json` | OPFS | Full design state (canvas items, frames, guides) |
| `dlx-custom-components` | localStorage | User-imported community components |
| `dlx-hotbar-v1` | localStorage | Pinned hot bar action IDs |
| `dlx-explorer-v1` | localStorage | Hidden default URLs, custom URLs, visited timestamps |

---

## 7) Layout model

The app uses a CSS grid:
```
grid-template-rows: var(--header-h) 1fr var(--nudge-h);
grid-template-areas: "header" "main" "nudge";
```

- `--header-h: 58px` — top toolbar
- `--nudge-h: 54px` — bottom bar (hot bar, explore trigger, nudge apply)
- Dock strips: `position: fixed; right: 0; top: var(--header-h); bottom: var(--nudge-h)`
- Hot bar: `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%)` inside the footer
- Explore trigger: left flex item in footer (`justify-content: space-between`)

---

## 8) Service worker

Cache name: `digital-luxe-v2`
Bump the cache name any time new JS/CSS files are added to the app shell — this is the only way to force clients to fetch fresh files. Hard refresh alone does not bypass service worker cache.

App shell includes: `index.html`, `app.css`, all JS modules, `manifest.json`, `icon.svg`.

---

## 9) Security boundaries

- User-imported registry JSON is treated as trusted-by-user local input.
- Imported HTML is rendered in Shadow DOM (browser-level isolation).
- Explore library links use `noopener,noreferrer`.
- No remote execution sandbox beyond browser security model.

---

## 10) Export architecture

- **HTML export**: frame-scoped live document with component CSS/HTML
- **PNG export**: best-effort `SVG foreignObject` render of active frame
- **Token export**: JSON with color/font token usage from current canvas state
- **Preview mode**: generated frame HTML opened in a new tab
