# Digital Luxe — The Catalog

> **A local-first, installable Progressive Web App for curating and customising premium UI components — no code required.**

Digital Luxe is part of the **ToolSmart** suite by [smartscott-LLC](https://github.com/smartscott-LLC) — a collection of uniquely designed tools that help anyone build like a pro. No account required. No data ever leaves your device.

---

## Table of Contents

- [Features](#features)
- [Live Demo / Install](#live-demo--install)
- [Getting Started](#getting-started)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Component Drawers](#component-drawers)
- [The Nudge System](#the-nudge-system)
- [Architecture Overview](#architecture-overview)
- [Colour Palette](#colour-palette)
- [Browser Compatibility](#browser-compatibility)
- [Privacy Model](#privacy-model)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### The Living Drawers (Curation)
- **8 component drawers** — Buttons, Cards, Forms, Navigation, Dashboards, Typography, Modals, Tables
- **42 built-in components** — each beautifully crafted using the brand palette
- Click any component card to instantly **add it to your canvas** — no code, no copy-paste
- Component previews are rendered in **shadow DOM** for true CSS isolation

### The Nudge Interface (Customisation)
- **4 one-click nudge toggles** in Golden Bronze accent:
  - ⤢ **Grow on Hover** — scales the component up on mouse-over
  - ◉ **Soft Shadow** — adds a warm golden glow shadow
  - ◯ **Round Corners** — maximises border-radii across all child elements
  - ❂ **Breathing Pulse** — gentle scale-pulse animation
- Apply nudges to **all components** or just the **selected one**
- Nudges use shadow DOM `:host([data-nudge-*])` selectors — zero performance cost

### The Structural Mirror (Dual Pane)
- **Left pane** — category sidebar + scrollable component grid
- **Right pane** — your live design canvas
- **Draggable divider** — resize the panes to your preference (keyboard-navigable too)
- Canvas items can be **duplicated**, **removed**, or reordered
- Canvas indicator dot turns **gold** when you have components collected

### SmartBar (Command Palette — `⌘K` / `Ctrl+K`)
- Fuzzy search across all **42 components**, 8 **drawers**, and 10 **actions**
- Keyboard-navigable (`↑↓ Enter`) with mouse fallback
- Actions: New Canvas, Save to Vault, Open Vault, Export HTML, Browse drawers

### Vault (OPFS Local-First Storage)
- Designs saved to the browser's **Origin Private File System** — private by design
- **localStorage fallback** for Firefox / Safari users
- One-click **Open**, **Rename** (click → type → Enter), and **Delete**
- Storage usage bar with quota display

### Export
- Exports your design as a **self-contained HTML file** with embedded CSS
- One-click **Copy HTML** to clipboard

### PWA & Offline
- Fully installable as a **desktop or mobile app**
- Service worker caches the entire app shell for **true offline use**
- All logic is vendored locally — **no CDN dependency** at runtime

---

## Live Demo / Install

Open Digital Luxe in a supported browser and click **"⬇ Install"** in the header, or use your browser's built-in install option from the address bar. Once installed, it works fully offline.

> **Browser requirement:** Chrome 86+, Edge 86+, or any Chromium-based browser for full OPFS Vault support.
> Firefox and Safari can use the app but store designs in localStorage instead of OPFS.

---

## Getting Started

Digital Luxe is a **zero-build, static web app** — no bundler, no transpiler, no Node.js required.

### Run locally

```bash
# Clone the repository
git clone https://github.com/smartscott-LLC/digital-luxe.git
cd digital-luxe

# Option 1 — npm start (uses port 3002 by default)
npm start

# Option 2 — any static file server
npx serve -l 3002 .
# or
python3 -m http.server 3002
# or
npx http-server . -p 3002
```

Then open `http://localhost:3002` in Chrome or Edge.

> **Why a server?** Service workers and OPFS require a secure context (`https://` or `localhost`). Opening `index.html` via `file://` will disable both features.

### File structure

```
digital-luxe/
├── index.html          — App shell, all modals and overlays
├── manifest.json       — PWA manifest
├── sw.js               — Service worker (cache-first app shell)
├── package.json        — npm scripts (npm start → serve on port 3002)
├── .gitignore
├── css/
│   └── app.css         — Complete design system and CSS custom properties
├── js/
│   ├── app.js          — Boot, orchestration, keyboard shortcuts, PWA install
│   ├── catalog.js      — Drawer navigation and component grid rendering
│   ├── canvas.js       — Design canvas (add, remove, duplicate, export)
│   ├── nudge.js        — Nudge toggle engine
│   ├── smartbar.js     — Command palette (⌘K)
│   ├── vault.js        — OPFS + localStorage storage adapter
│   └── components.js   — 42 built-in component templates (HTML + scoped CSS)
└── icons/
    └── icon.svg        — App icon (faceted gem in brand colours)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open SmartBar command palette |
| `⌘S` / `Ctrl+S` | Save current design to Vault |
| `⌘N` / `Ctrl+N` | New canvas (clear) |
| `⌘E` / `Ctrl+E` | Open Export dialog |
| `Escape` | Close SmartBar / Vault / Export modal |
| `↑` / `↓` *(in SmartBar)* | Navigate results |
| `Enter` *(in SmartBar)* | Execute focused result |
| `←` / `→` *(on divider, when focused)* | Adjust pane split by 20 px |
| `Shift+←` / `Shift+→` *(on divider)* | Adjust split by 80 px |
| `Enter` *(in Vault rename input)* | Commit rename |
| `Escape` *(in Vault rename input)* | Cancel rename |

---

## Component Drawers

| Drawer | Icon | Count | Highlights |
|---|---|---|---|
| Buttons | ⬡ | 6 | CTA, Ghost, Gold Pill, Split Action, Gradient Glow |
| Cards | 🃏 | 6 | Product, Profile, Feature, Stats, Testimonial, Pricing |
| Forms | ✏️ | 5 | Floating Label, Search Bar, Subscribe Strip, Toggles, Stars |
| Navigation | 🧭 | 5 | Top Bar, Sidebar, Pill Tabs, Breadcrumb, Pagination |
| Dashboards | 📊 | 5 | KPI Grid, Progress Tracker, Activity Feed, Status Badges, Sparkline |
| Typography | 𝕋 | 4 | Hero Section, Section Divider, Pull Quote, Label Badges |
| Modals | 🔔 | 4 | Confirm Dialog, Toast Stack, Side Sheet, Input Prompt |
| Tables | ⊞ | 5 | Data Table, Feature Matrix, Timeline List, Sortable Header, Summary Row |

---

## The Nudge System

Nudges are applied via **HTML data attributes** on shadow DOM host elements:

```
data-nudge-grow    → :host([data-nudge-grow]):hover  { transform: scale(1.04) }
data-nudge-shadow  → :host([data-nudge-shadow])      { box-shadow: 0 8px 32px rgba(187,165,76,.38) }
data-nudge-round   → :host([data-nudge-round]) *     { border-radius: 24px !important }
data-nudge-pulse   → :host([data-nudge-pulse])       { animation: dlx-pulse 2.5s ease-in-out infinite }
```

Because CSS custom properties inherit through shadow boundaries, the nudge rules live entirely inside each component's shadow root — no style leakage outside the shadow.

---

## Architecture Overview

Digital Luxe is a **zero-build, ES-module PWA**. There is no bundler, transpiler, or framework.

```
index.html
  └── <script type="module"> → js/app.js     (entry point)
        ├── js/catalog.js    (drawer nav + component grid)
        ├── js/canvas.js     (design canvas)
        ├── js/nudge.js      (nudge toggle engine)
        ├── js/smartbar.js   (⌘K command palette)
        ├── js/vault.js      (OPFS + localStorage adapter)
        └── js/components.js (component data + NUDGE_BASE_CSS)
```

**Persistence strategy:**

| Data | Storage |
|---|---|
| Saved designs | OPFS (`navigator.storage.getDirectory()`) or localStorage fallback |

---

## Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--golden-bronze` | `#bba54c` | Accent, nudge toggles, links, price tags |
| `--graphite` | `#2c2b25` | Sidebar, header text, dark surfaces |
| `--silver` | `#a7a6a2` | Secondary text, muted labels, borders |
| `--pine-teal` | `#1F4F3C` | Header, primary buttons, active states |
| `--sand-dune` | `#dcd6b9` | Main background, card surfaces, light text on dark |

---

## Browser Compatibility

| Feature | Chrome 86+ | Edge 86+ | Firefox | Safari |
|---|---|---|---|---|
| App renders & works | ✅ | ✅ | ✅ | ✅ |
| PWA install | ✅ | ✅ | ❌ | ⚠️ partial |
| OPFS Vault (full) | ✅ | ✅ | ❌ | ❌ |
| localStorage Vault (fallback) | ✅ | ✅ | ✅ | ✅ |
| Shadow DOM isolation | ✅ | ✅ | ✅ | ✅ |
| Offline use (SW) | ✅ | ✅ | ✅ | ✅ |

---

## Privacy Model

- **All design data lives exclusively in your browser.** Nothing is ever sent to any server.
- OPFS storage is sandboxed per origin — other websites cannot access it.
- The only external network request is loading the **Inter** font from Google Fonts (optional; the app falls back to `system-ui` when offline).
- No analytics, no telemetry, no cookies, no accounts.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting bugs, submitting pull requests, and the code style expected in this project.

---

## License

This project is part of the **ToolSmart** suite by [smartscott-LLC](https://github.com/smartscott-LLC).  
All rights reserved unless otherwise stated.
