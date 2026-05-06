# Contributing to Digital Luxe

Thank you for your interest in contributing to **Digital Luxe — The Catalog**! This document explains how to report bugs, suggest improvements, and submit pull requests.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Development Setup](#development-setup)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)

---

## Code of Conduct

Be respectful. All contributions are welcome regardless of experience level. Constructive feedback only.

---

## Reporting Bugs

1. **Search existing issues** first to avoid duplicates.
2. Open a new issue and include:
   - Browser name and version (e.g. Chrome 124)
   - Operating system
   - Steps to reproduce
   - Expected vs actual behaviour
   - A screenshot or screen recording if applicable

---

## Suggesting Features

Open an issue with the label `enhancement`. Describe the problem you are solving and why it fits the project's local-first, no-code philosophy.

---

## Development Setup

Digital Luxe is a **zero-build project** — no bundler or transpiler is required.

```bash
git clone https://github.com/smartscott-LLC/digital-luxe.git
cd digital-luxe
npm start          # serves on http://localhost:3002
```

Requirements:
- Any modern browser (Chrome 86+, Edge 86+ recommended for full OPFS support)
- Node.js (for `npm start` only — the app itself has no Node.js dependency)

---

## Submitting a Pull Request

1. Fork the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes following the [Code Style](#code-style) guidelines below.
3. Test in Chrome and, where feasible, Firefox and Safari.
4. Commit with a clear message (see [Commit Messages](#commit-messages)).
5. Push your branch and open a pull request against `main`.
6. Fill in the pull request description explaining *what* and *why*.

Pull requests should be focused — one feature or bug fix per PR.

---

## Code Style

Digital Luxe is written in **vanilla ES modules** — no framework, no build step.

### JavaScript

- Use `const`/`let`; never `var`.
- Prefer arrow functions for callbacks; use named functions for module-level declarations.
- Keep modules single-responsibility. Each file in `js/` has one clear role.
- Export a single named object from each module (e.g. `export const catalog = { ... }`).
- Escape user-visible strings with the local `escHtml()` helper before inserting into `innerHTML`.
- Use `async/await` over raw promise chains.

### CSS

- All colours must reference the CSS custom-property palette defined in `:root` (see `css/app.css` §1).
- Class names use the `dlx-` BEM-style prefix.
- Avoid `!important` except where shadow DOM specificity requires it.
- Group related rules with the existing numbered section comments (`/* ── N. ... */`).

### HTML

- All interactive elements must have an accessible `aria-label` or visible label.
- Prefer semantic elements (`<button>`, `<nav>`, `<section>`, `<header>`).
- Modals use `role="dialog"` with `aria-modal="true"` and `aria-labelledby`.

### Components (`js/components.js`)

Each component object must have:
```js
{
  id:          'unique-kebab-id',   // unique, stable
  category:    'drawer-id',         // must match a DRAWERS entry
  name:        'Human Name',
  description: 'One-line summary.',
  tags:        ['tag1', 'tag2'],    // lowercase, for SmartBar search
  html:        `<element>...</element>`,
  css:         `/* scoped CSS */`
}
```

Shadow-DOM scoped CSS uses `:host` to refer to the component's root. Use the brand palette custom properties (e.g. `var(--pine-teal, #1F4F3C)`) with a hex fallback for shadow-DOM contexts.

---

## Commit Messages

Use the **Conventional Commits** format:

```
<type>(<scope>): <short description>

[optional body]
```

| Type     | When to use                              |
|----------|------------------------------------------|
| `feat`   | New component, feature, or capability    |
| `fix`    | Bug fix                                  |
| `style`  | CSS / visual changes, no logic change    |
| `docs`   | Documentation only                       |
| `chore`  | Build scripts, config, dependencies      |
| `refactor` | Code restructure, no behaviour change  |

Examples:
```
feat(components): add Accordion component to Forms drawer
fix(canvas): nudge data-attributes now use data- prefix for shadow DOM
docs(readme): update port from 8080 to 3002
```

---

## Questions?

Open a GitHub Discussion or reach out via the repository's issue tracker.
