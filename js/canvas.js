/* ============================================================
   Digital Luxe — Design Canvas (Right Pane)
   ============================================================ */
import { NUDGE_BASE_CSS } from './components.js';
import { nudge } from './nudge.js';
import { toast } from './utils.js';

// ── State ─────────────────────────────────────────────────────
let items = [];           // { component, nudges: Set<string> }
let selectedIndex = -1;

// ── DOM refs ──────────────────────────────────────────────────
const emptyState  = document.getElementById('canvas-empty');
const itemsWrap   = document.getElementById('canvas-items');
const indicator   = document.getElementById('canvas-indicator');
const saveBtn     = document.getElementById('save-canvas-btn');
const clearBtn    = document.getElementById('clear-canvas-btn');
const exportBtn   = document.getElementById('export-canvas-btn');

// ── Public API ────────────────────────────────────────────────
export const canvas = {
  init() {
    saveBtn  .addEventListener('click', () => this.save());
    clearBtn .addEventListener('click', () => this.clear());
    exportBtn.addEventListener('click', () => this.exportHtml());
  },

  addComponent(component) {
    items.push({ component, nudges: new Set(nudge.getActiveNudges()) });
    selectedIndex = items.length - 1;
    renderCanvas();
    toast(`${component.name} added ✦`);
  },

  removeComponent(index) {
    items.splice(index, 1);
    if (selectedIndex >= items.length) selectedIndex = items.length - 1;
    renderCanvas();
  },

  selectComponent(index) {
    selectedIndex = index;
    document.querySelectorAll('.dlx-canvas-item').forEach((el, i) => {
      el.classList.toggle('selected', i === index);
    });
  },

  applyNudges(nudgeSet) {
    // Apply to selected or all based on target setting
    const target = document.getElementById('nudge-target').value;
    if (target === 'selected' && selectedIndex >= 0) {
      items[selectedIndex].nudges = new Set(nudgeSet);
    } else {
      items.forEach(item => { item.nudges = new Set(nudgeSet); });
    }
    updateNudgeAttributes();
  },

  clear() {
    if (!items.length) return;
    if (!confirm('Clear all components from the canvas?')) return;
    items = [];
    selectedIndex = -1;
    renderCanvas();
  },

  save() {
    import('./vault.js').then(({ vault }) => {
      vault.promptSave(this.serializeState());
    });
  },

  loadState(state) {
    import('./components.js').then(({ COMPONENTS }) => {
      items = (state.items || []).map(s => {
        const component = COMPONENTS.find(c => c.id === s.id);
        return component ? { component, nudges: new Set(s.nudges || []) } : null;
      }).filter(Boolean);
      renderCanvas();
    });
  },

  serializeState() {
    return {
      items: items.map(it => ({
        id: it.component.id,
        name: it.component.name,
        nudges: [...it.nudges]
      }))
    };
  },

  getItemCount() { return items.length; },

  exportHtml() {
    if (!items.length) { toast('Add some components first!', 'warn'); return; }
    const html = buildExportHtml(items);
    const modal = document.getElementById('export-modal');
    const codeEl = modal.querySelector('#export-code');
    if (codeEl) codeEl.textContent = html;
    modal.removeAttribute('hidden');
  }
};

// ── Render full canvas ────────────────────────────────────────
function renderCanvas() {
  const hasItems = items.length > 0;

  emptyState.hidden = hasItems;
  itemsWrap.hidden  = !hasItems;
  indicator.classList.toggle('has-items', hasItems);

  if (!hasItems) { itemsWrap.innerHTML = ''; return; }

  itemsWrap.innerHTML = '';
  items.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'dlx-canvas-item';
    wrap.dataset.index = idx;
    if (idx === selectedIndex) wrap.classList.add('selected');

    // Apply nudge classes to wrapper (outer CSS) and data-attrs to shadow host
    applyNudgeClasses(wrap, item.nudges);

    wrap.innerHTML = `
      <div class="dlx-canvas-item__bar">
        <span class="dlx-canvas-item__bar-name">${escHtml(item.component.name)}</span>
        <span class="text-muted" style="font-size:.72rem">${escHtml(item.component.category)}</span>
        <div class="dlx-canvas-item__bar-actions">
          <button class="dlx-canvas-item__bar-btn" data-action="duplicate" title="Duplicate">⧉</button>
          <button class="dlx-canvas-item__bar-btn remove" data-action="remove" title="Remove">✕</button>
        </div>
      </div>
      <div class="dlx-canvas-item__body"></div>
    `;

    // Build shadow DOM preview in body
    const body = wrap.querySelector('.dlx-canvas-item__body');
    const host = buildCanvasHost(item.component, item.nudges);
    body.appendChild(host);

    // Events
    wrap.addEventListener('click', e => {
      if (!e.target.dataset.action) canvas.selectComponent(idx);
    });
    wrap.querySelector('[data-action="remove"]').addEventListener('click', e => {
      e.stopPropagation(); canvas.removeComponent(idx);
    });
    wrap.querySelector('[data-action="duplicate"]').addEventListener('click', e => {
      e.stopPropagation();
      const copy = { component: items[idx].component, nudges: new Set(items[idx].nudges) };
      items.splice(idx + 1, 0, copy);
      renderCanvas();
    });

    itemsWrap.appendChild(wrap);
  });
}

// ── Build shadow DOM host for canvas item ─────────────────────
function buildCanvasHost(component, nudges) {
  const host = document.createElement('div');
  host.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${NUDGE_BASE_CSS}\n${component.css}</style>${component.html}`;
  applyNudgeAttrs(host, nudges);
  return host;
}

// ── Apply nudge classes to canvas item wrapper (for main CSS) ────
function applyNudgeClasses(el, nudges) {
  ['nudge-grow', 'nudge-shadow', 'nudge-round', 'nudge-pulse'].forEach(n => {
    el.classList.toggle(n, nudges.has(n));
  });
}

// ── Apply nudge data-attributes to shadow DOM host element ────────
function applyNudgeAttrs(el, nudges) {
  ['nudge-grow', 'nudge-shadow', 'nudge-round', 'nudge-pulse'].forEach(n => {
    el.toggleAttribute(`data-${n}`, nudges.has(n));
  });
}

// ── Re-apply nudge attrs after nudge toggle ───────────────────
function updateNudgeAttributes() {
  const wrappers = itemsWrap.querySelectorAll('.dlx-canvas-item');
  wrappers.forEach((wrap, idx) => {
    if (!items[idx]) return;
    applyNudgeClasses(wrap, items[idx].nudges);
    const host = wrap.querySelector('.dlx-canvas-item__body > div');
    if (host) applyNudgeAttrs(host, items[idx].nudges);
  });
}

// ── Build export HTML string ──────────────────────────────────
function buildExportHtml(canvasItems) {
  const palette = `
    --golden-bronze:#bba54c; --graphite:#2c2b25;
    --silver:#a7a6a2; --pine-teal:#1F4F3C; --sand-dune:#dcd6b9;`;

  const componentsCode = canvasItems.map(({ component }) => {
    return `<!-- ${component.name} -->
<style>
  /* ${component.name} */
${component.css.replace(/:host/g, '.dlx-preview')}
</style>
<div class="dlx-preview">
  ${component.html}
</div>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digital Luxe Export</title>
  <style>
    :root { ${palette} }
    body { font-family: system-ui, sans-serif; padding: 2rem; background: var(--sand-dune); }
    .dlx-preview { margin-bottom: 2rem; }
  </style>
</head>
<body>
${componentsCode}
</body>
</html>`;
}

// ── Utility ───────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
