# Digital Luxe Architecture

## 1) System overview

Digital Luxe is a **zero-build ES-module PWA**.

- Runtime: browser-only
- UI layer: vanilla JS + semantic HTML + CSS custom properties
- Isolation: Shadow DOM per component preview/item
- Persistence: OPFS primary, localStorage fallback
- Offline: service worker app-shell caching

## 2) Module map

### `js/app.js` (orchestrator)
- app bootstrap
- module initialization order
- global shortcuts
- modal wiring

### `js/canvas.js` (interaction engine)
- item state lifecycle
- free-form positioning
- drag/resize/select/pan/zoom
- serialization + export generation

### `js/inspector.js` (property panel)
- listens to `dlx:selection-change`
- auto-generates controls from component css/html
- writes per-item `props` overrides + text overrides

### `js/catalog.js` (library browser)
- drawers + component cards
- built-in + community merge
- json import pipeline

### `js/smartbar.js` (command palette)
- action routing
- drawer switching
- URL import trigger

### `js/vault.js` (storage adapter)
- save/list/load/delete/rename
- OPFS <-> localStorage fallback abstraction

### `js/nudge.js` (effects toggles)
- global effect state
- applies nudge classes/attributes to selected/all

### `js/components.js` (source catalog)
- built-in component definitions
- drawer taxonomy
- shared base nudge css

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

Serialized state preserves these geometry/layer fields.

## 4) Event contracts

### `dlx:selection-change`
Dispatched by canvas after selection/geometry changes.

```js
{
  detail: {
    indices: number[],
    items: CanvasItem[]
  }
}
```

Inspector relies on this event; avoid changing payload shape without coordinated updates.

## 5) Rendering model

- Catalog previews: shadow root per card
- Canvas items: shadow root per placed item
- Canvas transform: `translate(panX, panY) scale(zoom)` on `#canvas-items`
- Item transform: `rotate()` on each item wrapper

## 6) Persistence model

- Vault stores full design JSON including item geometry and props.
- Registry cache (`data/registry-cache.json`) is build-time/static data.
- User-imported community components persist in `localStorage` key:
  - `dlx-custom-components`

## 7) Security boundaries

- User-imported registry JSON is treated as trusted-by-user local input.
- No remote execution sandbox beyond browser security model.
- Keep imports constrained to expected schema before adding to library.

## 8) Operational architecture

- Registry crawler (`scripts/crawl-registry.js`) refreshes bundled cache.
- App reads cache at runtime; no required backend service.
- Optional GitHub Actions cron may run crawler and commit refreshed cache.
