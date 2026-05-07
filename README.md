# Digital Luxe — Real Design Tool (ToolSmart Collection)

Digital Luxe is a **local-first, installable PWA** for composing production-ready UI layouts visually.
It is part of the **ToolSmart** suite by [smartscott-LLC](https://github.com/smartscott-LLC).

> Vanilla JavaScript, Shadow DOM isolation, offline-first, no framework lock-in.

---

## What it does now

Digital Luxe has evolved from a component viewer into a real interactive design surface.

### Core capabilities
- **Free-form infinite canvas** (virtual 4000×3000 space)
- **Drag, multi-select, rubber-band selection, keyboard nudge**
- **8-handle resize** with Shift aspect-ratio lock
- **Pan + Zoom** (Space/middle-drag + wheel zoom)
- **Property Inspector** (position, size, colors, effects, content, variants)
- **Multi-select toolbar** (align, distribute, match width/height)
- **Rulers + draggable guides** with guide snapping
- **Frame/pages model** (desktop/mobile/tablet presets, frame-aware save/export)
- **Blocks drawer** (curated multi-component sections)
- **Prompt assist + theme generator** in inspector
- **Community library support** via local registry cache + local imports
- **Local-first persistence** (OPFS with localStorage fallback)
- **Exports**: live HTML, PNG (active frame), JSON design tokens, live preview tab

---

## Quick start

```bash
git clone https://github.com/smartscott-LLC/digital-luxe.git
cd digital-luxe
npm start
# open http://localhost:3002
```

Why a server: service worker + OPFS require localhost/secure context.

---

## Documentation index

- [Architecture](docs/ARCHITECTURE.md)
- [Agent Onboarding](docs/AGENT_ONBOARDING.md)
- [Registry Operations](docs/REGISTRY_OPERATIONS.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Contributing](CONTRIBUTING.md)
- [Copilot Instructions](.github/copilot-instructions.md)

---

## Repository structure

```txt
digital-luxe/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── app.css
├── js/
│   ├── app.js
│   ├── canvas.js
│   ├── inspector.js
│   ├── catalog.js
│   ├── smartbar.js
│   ├── nudge.js
│   ├── vault.js
│   ├── components.js
│   ├── blocks.js
│   └── utils.js
├── scripts/
│   └── crawl-registry.js
├── data/
│   └── registry-cache.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AGENT_ONBOARDING.md
│   ├── REGISTRY_OPERATIONS.md
│   └── RELEASE_CHECKLIST.md
└── .github/
    └── copilot-instructions.md
```

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open SmartBar |
| `⌘S` / `Ctrl+S` | Save to Vault |
| `⌘E` / `Ctrl+E` | Export HTML |
| `⌘N` / `Ctrl+N` | Clear canvas |
| `Delete` / `Backspace` | Remove selected |
| Arrow keys | Move selected (1 px) |
| `Shift + Arrow` | Move selected (10 px) |
| `⌘D` / `Ctrl+D` | Duplicate selected |
| `Space + Drag` | Pan canvas |
| Mouse wheel | Zoom canvas |

Multi-select toolbar and frame controls are available in the canvas header when relevant.

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

- Data is stored in-browser only.
- No analytics, no telemetry, no account requirement.
- Registry imports are explicit user actions (file drop or URL import).
- Exported HTML is static output from local state.

---

## ToolSmart context

Digital Luxe is one tool in the broader ToolSmart collection.
To keep long-term quality high:
- preserve local-first architecture,
- avoid unnecessary framework migrations,
- keep docs and runbooks current with product behavior,
- prefer additive, backwards-compatible changes where possible.

---

## License

Part of the ToolSmart suite by smartscott-LLC.
All rights reserved unless otherwise stated.
