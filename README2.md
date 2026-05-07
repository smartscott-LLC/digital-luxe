# Digital Luxe — Real Design Tool (ToolSmart Collection)

Digital Luxe is a **local-first, installable PWA** for composing production-ready UI layouts visually.
It is part of the **ToolSmart** suite by [smartscott-LLC](https://github.com/smartscott-LLC).

> Vanilla JavaScript, Shadow DOM isolation, offline-first, no framework lock-in.

---

## What it does now

Digital Luxe is a full-featured interactive design surface for building UI pages and dashboards visually — no code required, no framework, no paywall.

### Canvas
- **Free-form infinite canvas** (virtual 4000×3000 space)
- **Drag, multi-select, rubber-band selection, keyboard nudge**
- **8-handle resize** with Shift aspect-ratio lock
- **Pan + Zoom** (Space/middle-drag + wheel zoom)
- **Rulers + draggable guides** with guide snapping
- **Frame/pages model** (desktop/mobile/tablet presets, frame-aware save/export)
- **Undo/Redo** (60-step snapshot history)

### Component Library
- **Catalog panel** (left) — component cards organized by drawer category
- **Slider grid view** — click any drawer to expand a full visual component grid
- **Blocks drawer** — curated multi-component sections
- **Variant groups** — related components deduplicated into a single picker card

### Dock (right edge — cascading 3-panel system)
- **Component panel** (graphite strip) — full property inspector: position, size, colors, effects, content, variants, z-order, rotation
- **Canvas panel** (teal strip) — zoom controls, grid/snap toggles, alignment tools, brand theme, nudge effects
- **File panel** (gold strip) — save, export HTML/PNG/tokens, live preview, danger zone

### Hot Bar (footer center)
- Up to **10 user-pinned actions** centered in the footer
- Click **＋** to open the action picker — choose from File, Canvas, and Component actions
- **Right-click** any action button elsewhere in the app to pin/unpin
- Persisted to localStorage

### Explore Libraries (footer left)
- **Explore button** (Dancing Script, gold) with a ghost-typing tagline cycling through three phrases
- Opens a **library portal** with 10 curated public component libraries pre-seeded (shadcn/ui, daisyUI, Flowbite, Aceternity, Magic UI, Radix, Headless UI, Chakra, Tailwind UI, UIverse)
- **Last-visited ✦ badges** — pulsing indicator on unvisited or stale (7+ day) entries
- **Add custom URLs** — any public library the user wants to track
- **Remove** any entry (defaults can be restored by re-adding)
- **Import HTML → Canvas** — paste any HTML snippet from an external library and it drops straight onto the canvas as a named component
- All links open in a new tab; canvas is never interrupted

### SmartBar
- **⌘K / Ctrl+K** command palette for actions and drawer switching

### Vault
- **Local-first persistence** — OPFS primary, localStorage fallback
- Save / load / rename / delete named designs

### Exports
- **Live HTML** (frame-scoped static document)
- **PNG** (active frame via SVG foreignObject)
- **JSON design tokens** (color/font usage from canvas state)
- **Live preview tab**

### Safety & UX
- **Brand logo navigation guard** — confirms save before leaving
- **Clear canvas guard** — Save & Clear / Clear Anyway / Cancel
- **PWA installable** — works offline after first load

---

## Quick start

```bash
git clone https://github.com/smartscott-LLC/digital-luxe.git
cd digital-luxe
npx serve .
# open http://localhost:3000
```

Why a server: service worker + OPFS require a localhost/secure context.

---

## Documentation index

- [Architecture](docs/ARCHITECTURE.md)
- [Agent Onboarding](docs/AGENT_ONBOARDING.md)
- [Registry Operations](docs/REGISTRY_OPERATIONS.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Contributing](CONTRIBUTING.md)

---

## Repository structure

```txt
digital-luxe/
├── index.html
├── manifest.json
├── sw.js                     ← service worker (cache: digital-luxe-v2)
├── css/
│   └── app.css
├── js/
│   ├── app.js                ← orchestrator + keyboard shortcuts
│   ├── canvas.js             ← interaction engine
│   ├── catalog.js            ← library browser + grid slider
│   ├── dock.js               ← cascading 3-panel right dock
│   ├── inspector.js          ← legacy inspector (hidden when dock present)
│   ├── hotbar.js             ← footer hot bar (pinned actions)
│   ├── explore.js            ← Explore Libraries portal
│   ├── smartbar.js           ← command palette
│   ├── nudge.js              ← canvas effect toggles
│   ├── vault.js              ← OPFS/localStorage save adapter
│   ├── components.js         ← built-in component definitions
│   ├── blocks.js             ← curated multi-component sections
│   └── utils.js              ← toast, dlxConfirm dialog
├── scripts/
│   └── crawl-registry.js
├── data/
│   └── registry-cache.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AGENT_ONBOARDING.md
│   ├── REGISTRY_OPERATIONS.md
│   └── RELEASE_CHECKLIST.md
└── LICENSE
```

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open SmartBar |
| `⌘S` / `Ctrl+S` | Save to Vault |
| `⌘E` / `Ctrl+E` | Export HTML |
| `⌘N` / `Ctrl+N` | Clear canvas (with save guard) |
| `Delete` / `Backspace` | Remove selected |
| Arrow keys | Move selected (1 px) |
| `Shift + Arrow` | Move selected (10 px) |
| `⌘D` / `Ctrl+D` | Duplicate selected |
| `Space + Drag` | Pan canvas |
| Mouse wheel | Zoom canvas |
| `Escape` | Close overlays / deselect |

---

## Browser support

| Capability | Chrome / Edge | Firefox | Safari |
|---|---|---|---|
| App runtime | ✅ | ✅ | ✅ |
| Service worker offline shell | ✅ | ✅ | ✅ |
| OPFS Vault | ✅ | ❌ (fallback) | ❌ (fallback) |
| localStorage Vault fallback | ✅ | ✅ | ✅ |

---

## Security & privacy model

- Data is stored in-browser only — no server, no account required.
- No analytics, no telemetry.
- Explore Library links open externally in a new tab; no content is fetched automatically.
- Imported HTML is rendered in Shadow DOM isolation on the canvas.
- Exported HTML is static output from local state only.

---

## ToolSmart context

Digital Luxe is one tool in the broader ToolSmart collection.
To keep long-term quality high:
- preserve local-first architecture
- avoid unnecessary framework migrations
- keep docs and runbooks current with product behavior
- prefer additive, backwards-compatible changes

---

## License

Part of the ToolSmart suite by smartscott-LLC.
All rights reserved unless otherwise stated.
