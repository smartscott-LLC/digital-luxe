/* ============================================================
   Digital Luxe — Cascading Dock
   Three slide-out panels on the right edge.
   Component (graphite) · Canvas (pine teal) · File (gold)
   Only one panel open at a time; all triggers always visible.
   ============================================================ */
import { canvas }  from './canvas.js';
import { catalog } from './catalog.js';
import { toast }   from './utils.js';

// ── State ─────────────────────────────────────────────────────
let activePanel  = null;
let currentIdx   = -1;
let currentItem  = null;

// ── DOM refs (populated after buildDOM) ───────────────────────
let dockEl, compBody, canvasBody, fileBody;

// ── Public init ───────────────────────────────────────────────
export function initDock() {
  buildDOM();
  dockEl     = document.getElementById('dlx-dock');
  compBody   = document.getElementById('dock-comp-body');
  canvasBody = document.getElementById('dock-canvas-body');
  fileBody   = document.getElementById('dock-file-body');

  // Strip click toggles
  dockEl.querySelectorAll('[data-dock-strip]').forEach(strip =>
    strip.addEventListener('click', () => togglePanel(strip.dataset.dockStrip))
  );

  // Close buttons inside panels
  dockEl.querySelectorAll('[data-dock-close]').forEach(btn =>
    btn.addEventListener('click', closePanel)
  );

  // Escape closes active panel
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activePanel) closePanel();
  });

  // Selection drives Component panel content
  document.addEventListener('dlx:selection-change', onSelectionChange);

  buildCanvasPanel();
  buildFilePanel();
  renderCompEmpty();
}

// ── Panel toggle ──────────────────────────────────────────────
function togglePanel(id) {
  if (activePanel === id) { closePanel(); return; }
  if (activePanel) closePanel(false);
  activePanel = id;
  document.getElementById(`dock-panel-${id}`)?.classList.add('open');
  dockEl.querySelector(`[data-dock-strip="${id}"]`)?.classList.add('active');
}

function closePanel(clearState = true) {
  if (!activePanel) return;
  document.getElementById(`dock-panel-${activePanel}`)?.classList.remove('open');
  dockEl.querySelector(`[data-dock-strip="${activePanel}"]`)?.classList.remove('active');
  if (clearState) activePanel = null;
}

// ── Build DOM ─────────────────────────────────────────────────
function buildDOM() {
  const el = document.createElement('div');
  el.id        = 'dlx-dock';
  el.className = 'dlx-dock';
  el.innerHTML = `
    <!-- ░░ Trigger strips ░░ -->
    <div class="dlx-dock__strips" aria-label="Dock panels">
      <button class="dlx-dock__strip dlx-dock__strip--comp"
              data-dock-strip="component"
              aria-label="Component panel"
              title="Component (position, colors, effects)">
        <span>Component</span>
      </button>
      <button class="dlx-dock__strip dlx-dock__strip--cv"
              data-dock-strip="canvas"
              aria-label="Canvas panel"
              title="Canvas (zoom, grid, alignment, theme)">
        <span>Canvas</span>
      </button>
      <button class="dlx-dock__strip dlx-dock__strip--file"
              data-dock-strip="file"
              aria-label="File panel"
              title="File (save, export, clear)">
        <span>File</span>
      </button>
    </div>

    <!-- ░░ Component panel ░░ -->
    <div class="dlx-dock__panel dlx-dock__panel--comp" id="dock-panel-component"
         role="region" aria-label="Component panel">
      <div class="dlx-dock__panel-head dlx-dock__panel-head--comp">
        <span class="dlx-dock__panel-title">◈ Component</span>
        <button class="dlx-dock__panel-close" data-dock-close aria-label="Close">✕</button>
      </div>
      <div class="dlx-dock__panel-body" id="dock-comp-body"></div>
    </div>

    <!-- ░░ Canvas panel ░░ -->
    <div class="dlx-dock__panel dlx-dock__panel--cv" id="dock-panel-canvas"
         role="region" aria-label="Canvas panel">
      <div class="dlx-dock__panel-head dlx-dock__panel-head--cv">
        <span class="dlx-dock__panel-title">⊞ Canvas</span>
        <button class="dlx-dock__panel-close" data-dock-close aria-label="Close">✕</button>
      </div>
      <div class="dlx-dock__panel-body" id="dock-canvas-body"></div>
    </div>

    <!-- ░░ File panel ░░ -->
    <div class="dlx-dock__panel dlx-dock__panel--file" id="dock-panel-file"
         role="region" aria-label="File panel">
      <div class="dlx-dock__panel-head dlx-dock__panel-head--file">
        <span class="dlx-dock__panel-title">✦ File</span>
        <button class="dlx-dock__panel-close" data-dock-close aria-label="Close">✕</button>
      </div>
      <div class="dlx-dock__panel-body" id="dock-file-body"></div>
    </div>`;

  document.getElementById('app').appendChild(el);
}

// ── Accordion section builder ─────────────────────────────────
function section(id, icon, label, bodyHtml, open = true) {
  return `
    <div class="dlx-ds" data-section="${id}">
      <button class="dlx-ds__head" aria-expanded="${open}">
        <span class="dlx-ds__icon">${icon}</span>
        <span class="dlx-ds__label">${label}</span>
        <span class="dlx-ds__chevron">›</span>
      </button>
      <div class="dlx-ds__body${open ? ' open' : ''}">${bodyHtml}</div>
    </div>`;
}

function wireAccordion(container) {
  container.querySelectorAll('.dlx-ds__head').forEach(head => {
    head.addEventListener('click', () => {
      const expanded = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!expanded));
      head.nextElementSibling.classList.toggle('open', !expanded);
    });
  });
}

// ── Selection change → Component panel ───────────────────────
function onSelectionChange(e) {
  const { indices, items } = e.detail;
  currentIdx  = indices.length === 1 ? indices[0] : -1;
  currentItem = items.length  === 1 ? items[0]   : null;

  if (indices.length === 0) {
    renderCompEmpty();
  } else if (indices.length === 1) {
    renderCompSingle(currentIdx, currentItem);
  } else {
    renderCompMulti(indices);
  }

  // Auto-open Component panel when something is selected
  if (indices.length >= 1 && activePanel !== 'component') {
    togglePanel('component');
  }
}

// ── Component panel — empty state ────────────────────────────
function renderCompEmpty() {
  if (!compBody) return;
  compBody.innerHTML = `
    <div class="dlx-dock-empty">
      <div class="dlx-dock-empty__icon">◈</div>
      <div class="dlx-dock-empty__msg">Select a component<br>to inspect it</div>
    </div>`;
}

// ── Component panel — single selection ───────────────────────
function renderCompSingle(idx, item) {
  if (!compBody || !item) return;
  const { x, y, width, height, rotation = 0, zIndex, component, nudges, props = {} } = item;
  const cssVars   = extractCssVars(component.css);
  const textNodes = extractTextNodes(component.html);
  const variants  = catalog.getVariantsFor(component);

  const posHtml = `
    <div class="dlx-dp-grid2">
      <label class="dlx-dp-label">X<input type="number" class="dlx-dp-input" data-prop="x" value="${Math.round(x)}"></label>
      <label class="dlx-dp-label">Y<input type="number" class="dlx-dp-input" data-prop="y" value="${Math.round(y)}"></label>
      <label class="dlx-dp-label">W<input type="number" class="dlx-dp-input" data-prop="width" value="${Math.round(width)}" min="40"></label>
      <label class="dlx-dp-label">H<input type="number" class="dlx-dp-input" data-prop="height" value="${Math.round(height)}" min="20"></label>
      <label class="dlx-dp-label" style="grid-column:span 2">
        ↻ Rotation
        <input type="number" class="dlx-dp-input" data-prop="rotation" value="${Math.round(rotation)}" min="-360" max="360">
      </label>
    </div>`;

  const layerHtml = `
    <div class="dlx-dp-row">
      <span class="dlx-dp-muted" style="flex:1">z: ${zIndex}</span>
      <button class="dlx-dp-btn" data-layer="up" title="Bring forward">↑ Fwd</button>
      <button class="dlx-dp-btn" data-layer="down" title="Send backward">↓ Back</button>
    </div>`;

  const variantHtml = variants.length > 1 ? `
    <label class="dlx-dp-label">
      Style
      <select class="dlx-dp-input" id="dock-variant-select">
        ${variants.map(v => `<option value="${escAttr(v.id)}" ${v.id === component.id ? 'selected' : ''}>${escHtml(v.variantLabel || v.name)}</option>`).join('')}
      </select>
    </label>` : '<span class="dlx-dp-muted">No variants</span>';

  const colorsHtml = cssVars.length ? cssVars.map(v => `
    <label class="dlx-dp-label dlx-dp-label--row" style="margin-bottom:5px">
      <span>${escHtml(v.name.replace('--', ''))}</span>
      <input type="color" class="dlx-dp-color" data-cssvar="${escAttr(v.name)}"
             value="${resolveHex(v.fallback, props[v.name])}">
    </label>`).join('') : '<span class="dlx-dp-muted">No color tokens</span>';

  const contentHtml = textNodes.length ? textNodes.map((t, i) => `
    <label class="dlx-dp-label" style="margin-bottom:5px">
      <span>${t.tag.toUpperCase()}</span>
      <input type="text" class="dlx-dp-input dlx-dp-text"
             data-textnode="${i}" data-selector="${escAttr(t.selector)}"
             value="${escHtml(props['__text_' + i] !== undefined ? props['__text_' + i] : t.text)}">
    </label>`).join('') : '<span class="dlx-dp-muted">No editable text</span>';

  const effectsHtml = [
    { id: 'nudge-grow',   icon: '⤢', label: 'Grow on Hover'   },
    { id: 'nudge-shadow', icon: '◉', label: 'Soft Shadow'     },
    { id: 'nudge-round',  icon: '◯', label: 'Round Corners'   },
    { id: 'nudge-pulse',  icon: '✾', label: 'Breathing Pulse' },
  ].map(n => `
    <label class="dlx-dp-label dlx-dp-label--row" style="margin-bottom:5px;cursor:pointer">
      <span>${n.icon} ${n.label}</span>
      <input type="checkbox" data-nudge="${n.id}" ${nudges.has(n.id) ? 'checked' : ''}>
    </label>`).join('');

  compBody.innerHTML =
    section('position', '⊕', 'Position &amp; Size', posHtml)   +
    section('layer',    '⊘', 'Layer &amp; Order',   layerHtml)  +
    section('variant',  '⬡', 'Variant',             variantHtml, variants.length > 1) +
    section('colors',   '◑', 'Colors',              colorsHtml, cssVars.length > 0)  +
    section('content',  '✎', 'Content',             contentHtml, textNodes.length > 0) +
    section('effects',  '✴', 'Effects',             effectsHtml);

  wireAccordion(compBody);

  // Position/size inputs
  compBody.querySelectorAll('[data-prop]').forEach(input => {
    input.addEventListener('change', () => {
      const prop = input.dataset.prop;
      const val  = parseFloat(input.value) || 0;
      const it   = canvas.getItems()[idx];
      if (!it) return;
      if (prop === 'x' || prop === 'y')
        canvas.updateItemPosition(idx, prop === 'x' ? val : it.x, prop === 'y' ? val : it.y);
      else if (prop === 'width' || prop === 'height')
        canvas.updateItemSize(idx, prop === 'width' ? val : it.width, prop === 'height' ? val : it.height);
      else if (prop === 'rotation')
        canvas.setItemRotation(idx, val);
    });
  });

  // Layer buttons
  compBody.querySelector('[data-layer="up"]')  ?.addEventListener('click', () => canvas.bringForward(idx));
  compBody.querySelector('[data-layer="down"]') ?.addEventListener('click', () => canvas.sendBackward(idx));

  // Variant select
  compBody.querySelector('#dock-variant-select')?.addEventListener('change', e =>
    canvas.setItemComponentVariant(idx, e.target.value)
  );

  // Color pickers
  compBody.querySelectorAll('[data-cssvar]').forEach(input =>
    input.addEventListener('input', () => canvas.updateItemProp(idx, input.dataset.cssvar, input.value))
  );

  // Text editors
  compBody.querySelectorAll('[data-textnode]').forEach(input => {
    input.addEventListener('input', () => {
      const nodeIdx  = parseInt(input.dataset.textnode);
      const selector = input.dataset.selector;
      canvas.updateItemProp(idx, `__text_${nodeIdx}`, input.value);
      const wrap = document.querySelector(`.dlx-canvas-item[data-index="${idx}"]`);
      const host = wrap?.querySelector('.dlx-shadow-host');
      if (host?.shadowRoot) {
        const el = host.shadowRoot.querySelector(selector);
        if (el && el.children.length === 0) el.textContent = input.value;
      }
    });
  });

  // Effect checkboxes
  compBody.querySelectorAll('[data-nudge]').forEach(cb => {
    cb.addEventListener('change', () => {
      const nudgeId = cb.dataset.nudge;
      if (cb.checked) item.nudges.add(nudgeId);
      else            item.nudges.delete(nudgeId);
      const wrap = document.querySelector(`.dlx-canvas-item[data-index="${idx}"]`);
      if (wrap) {
        wrap.classList.toggle(nudgeId, cb.checked);
        const host = wrap.querySelector('.dlx-shadow-host');
        if (host) host.toggleAttribute(`data-${nudgeId}`, cb.checked);
      }
    });
  });
}

// ── Component panel — multi-selection ────────────────────────
function renderCompMulti(indices) {
  if (!compBody) return;
  compBody.innerHTML = section('align', '⊞', `${indices.length} Selected — Align`, `
    <div class="dlx-dp-row-wrap">
      <button class="dlx-dp-btn" data-align="left">⇐ Left</button>
      <button class="dlx-dp-btn" data-align="center">⇔ Center</button>
      <button class="dlx-dp-btn" data-align="right">Right ⇒</button>
      <button class="dlx-dp-btn" data-align="top">⇑ Top</button>
      <button class="dlx-dp-btn" data-align="middle">⇕ Middle</button>
      <button class="dlx-dp-btn" data-align="bottom">Bottom ⇓</button>
    </div>
    <div class="dlx-dp-sep"></div>
    <div class="dlx-dp-row-wrap">
      <button class="dlx-dp-btn" data-align="dist-h">↔ Distribute H</button>
      <button class="dlx-dp-btn" data-align="dist-v">↕ Distribute V</button>
    </div>`);

  wireAccordion(compBody);
  compBody.querySelectorAll('[data-align]').forEach(btn =>
    btn.addEventListener('click', () => canvas.alignSelected(btn.dataset.align))
  );
}

// ── Canvas panel (static) ─────────────────────────────────────
function buildCanvasPanel() {
  if (!canvasBody) return;

  canvasBody.innerHTML =
    section('zoom', '⊕', 'Zoom', `
      <div class="dlx-dp-row" style="gap:6px">
        <button class="dlx-dp-btn dlx-dp-btn--wide" id="dock-zoom-out">− Out</button>
        <span class="dlx-dp-zoom-lbl" id="dock-zoom-lbl">100%</span>
        <button class="dlx-dp-btn dlx-dp-btn--wide" id="dock-zoom-in">+ In</button>
      </div>
      <button class="dlx-dp-btn dlx-dp-btn--full" id="dock-zoom-fit" style="margin-top:6px">⊡ Fit to Screen</button>`) +

    section('grid', '⊞', 'Grid &amp; Snap', `
      <label class="dlx-dp-label dlx-dp-label--row" style="cursor:pointer">
        <span>Snap to 8px grid</span>
        <input type="checkbox" id="dock-snap" checked>
      </label>`) +

    section('align', '⇔', 'Align Selected', `
      <div class="dlx-dp-row-wrap">
        <button class="dlx-dp-btn" data-align="left">⇐ L</button>
        <button class="dlx-dp-btn" data-align="center">⇔ C</button>
        <button class="dlx-dp-btn" data-align="right">R ⇒</button>
        <button class="dlx-dp-btn" data-align="top">⇑ T</button>
        <button class="dlx-dp-btn" data-align="middle">⇕ M</button>
        <button class="dlx-dp-btn" data-align="bottom">B ⇓</button>
      </div>
      <div class="dlx-dp-sep"></div>
      <div class="dlx-dp-row-wrap">
        <button class="dlx-dp-btn" data-align="dist-h">↔ Dist H</button>
        <button class="dlx-dp-btn" data-align="dist-v">↕ Dist V</button>
      </div>`, false) +

    section('theme', '◑', 'Brand Theme', `
      <label class="dlx-dp-label dlx-dp-label--row" style="margin-bottom:8px">
        <span>Brand color</span>
        <input type="color" id="dock-brand-color" value="#1F4F3C" class="dlx-dp-color">
      </label>
      <button class="dlx-dp-btn dlx-dp-btn--full dlx-dp-btn--primary" id="dock-apply-theme">
        Apply theme to all items
      </button>`) +

    section('effects-global', '✴', 'Global Effects', `
      <p class="dlx-dp-muted" style="margin-bottom:8px;line-height:1.4">
        Hover effects applied to components.<br>
        Target is set in the bottom bar.
      </p>
      <div id="nudge-toggles"></div>`);

  wireAccordion(canvasBody);

  // Zoom
  const zoomIn  = document.getElementById('zoom-in-btn');
  const zoomOut = document.getElementById('zoom-out-btn');
  const zoomFit = document.getElementById('zoom-fit-btn');

  canvasBody.querySelector('#dock-zoom-in') ?.addEventListener('click', () => zoomIn?.click());
  canvasBody.querySelector('#dock-zoom-out')?.addEventListener('click', () => zoomOut?.click());
  canvasBody.querySelector('#dock-zoom-fit')?.addEventListener('click', () => {
    zoomFit?.click();
    canvas.fitToScreen?.();
  });

  // Sync zoom label
  const dockZoomLbl = canvasBody.querySelector('#dock-zoom-lbl');
  const updateZoom = () => {
    if (dockZoomLbl) dockZoomLbl.textContent = `${Math.round((canvas.getZoom?.() ?? 1) * 100)}%`;
  };
  updateZoom();
  document.addEventListener('dlx:zoom-change', updateZoom);
  // Fallback polling via wheel listener
  document.addEventListener('wheel', updateZoom, { passive: true });

  // Snap sync (mirror the existing snap-toggle checkbox)
  const snapToggle = document.getElementById('snap-toggle');
  const dockSnap   = canvasBody.querySelector('#dock-snap');
  if (snapToggle && dockSnap) {
    dockSnap.checked = snapToggle.checked;
    dockSnap.addEventListener('change', () => {
      snapToggle.checked = dockSnap.checked;
      snapToggle.dispatchEvent(new Event('change'));
    });
    snapToggle.addEventListener('change', () => {
      dockSnap.checked = snapToggle.checked;
    });
  }

  // Align
  canvasBody.querySelectorAll('[data-align]').forEach(btn =>
    btn.addEventListener('click', () => canvas.alignSelected(btn.dataset.align))
  );

  // Theme
  canvasBody.querySelector('#dock-apply-theme')?.addEventListener('click', () => {
    const color = canvasBody.querySelector('#dock-brand-color')?.value || '#1F4F3C';
    canvas.applyThemeFromBrand(color);
    toast('Theme applied ✦', 'success');
  });
}

// ── File panel (static) ───────────────────────────────────────
function buildFilePanel() {
  if (!fileBody) return;

  fileBody.innerHTML =
    section('save', '🗄', 'Save', `
      <button class="dlx-dp-btn dlx-dp-btn--full dlx-dp-btn--primary" id="dock-save">
        🗄 Save to Vault
      </button>
      <button class="dlx-dp-btn dlx-dp-btn--full" id="dock-vault-open" style="margin-top:6px">
        Open Vault
      </button>`) +

    section('export', '↗', 'Export', `
      <button class="dlx-dp-btn dlx-dp-btn--full" id="dock-export-html">↗ Export HTML</button>
      <button class="dlx-dp-btn dlx-dp-btn--full" id="dock-download-html" style="margin-top:5px">⬇ Download .html</button>
      <button class="dlx-dp-btn dlx-dp-btn--full" id="dock-export-png" style="margin-top:5px">🖼 Export PNG</button>
      <button class="dlx-dp-btn dlx-dp-btn--full" id="dock-export-tokens" style="margin-top:5px">🎨 Design Tokens</button>
      <button class="dlx-dp-btn dlx-dp-btn--full" id="dock-preview" style="margin-top:5px">▶ Live Preview</button>`) +

    section('danger', '⚠', 'Danger Zone', `
      <button class="dlx-dp-btn dlx-dp-btn--full dlx-dp-btn--danger" id="dock-clear">
        ✕ Clear Canvas
      </button>`, false);

  wireAccordion(fileBody);

  // Save
  fileBody.querySelector('#dock-save')?.addEventListener('click', () => canvas.save());
  fileBody.querySelector('#dock-vault-open')?.addEventListener('click', () => {
    document.getElementById('vault-modal')?.removeAttribute('hidden');
    import('./vault.js').then(({ vault }) => vault.renderList());
  });

  // Export
  fileBody.querySelector('#dock-export-html')  ?.addEventListener('click', () => canvas.exportHtml());
  fileBody.querySelector('#dock-download-html') ?.addEventListener('click', () => canvas.downloadHtml());
  fileBody.querySelector('#dock-export-png')    ?.addEventListener('click', () => canvas.exportPng());
  fileBody.querySelector('#dock-export-tokens') ?.addEventListener('click', () => canvas.exportTokens());
  fileBody.querySelector('#dock-preview')       ?.addEventListener('click', () => canvas.previewLive());

  // Clear
  fileBody.querySelector('#dock-clear')?.addEventListener('click', () => canvas.clear());
}

// ── Helper functions (mirrored from inspector.js) ─────────────
function extractCssVars(css) {
  const seen = new Map();
  for (const m of css.matchAll(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g)) {
    const name = m[1], fallback = m[2]?.trim();
    if (!seen.has(name) && fallback && looksLikeColor(fallback))
      seen.set(name, { name, fallback });
  }
  return [...seen.values()].slice(0, 8);
}

function looksLikeColor(val) {
  return /^#[0-9a-fA-F]{3,8}$|^rgb|^hsl/.test(val?.trim() || '');
}

function resolveHex(fallback, override) {
  const val = override && looksLikeColor(override) ? override : fallback;
  if (!val) return '#000000';
  if (/^#[0-9a-fA-F]{6}$/.test(val)) return val;
  if (/^#[0-9a-fA-F]{3}$/.test(val)) {
    const [,r,g,b] = val.match(/^#(.)(.)(.)$/);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const rgb = val.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgb) return '#' + [rgb[1],rgb[2],rgb[3]].map(n => (+n).toString(16).padStart(2,'0')).join('');
  return '#000000';
}

function extractTextNodes(html) {
  const doc   = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const nodes = [];
  const seen  = new Map();
  ['button','h1','h2','h3','p','span','a','label','li','td','th'].forEach(tag => {
    doc.querySelectorAll(tag).forEach((el, i) => {
      const text = el.textContent.trim();
      if (text && el.children.length === 0 && !seen.has(text)) {
        seen.set(text, true);
        nodes.push({ tag, text, selector: `${tag}:nth-of-type(${i + 1})` });
      }
    });
  });
  return nodes.slice(0, 6);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(str) {
  return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
