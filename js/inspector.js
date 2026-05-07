/* ============================================================
   Digital Luxe — Property Inspector Panel (Phase 2)
   Auto-generates controls from component CSS vars + text nodes.
   ============================================================ */
import { canvas } from './canvas.js';
import { toast } from './utils.js';

// ── DOM refs ──────────────────────────────────────────────────
const panel        = document.getElementById('inspector');
const inspBody     = document.getElementById('inspector-body');
const inspClose    = document.getElementById('inspector-close');

// ── Init ──────────────────────────────────────────────────────
export function initInspector() {
  inspClose?.addEventListener('click', () => panel?.setAttribute('hidden', ''));
  document.addEventListener('dlx:selection-change', onSelectionChange);
}

// ── Selection handler ─────────────────────────────────────────
function onSelectionChange(e) {
  if (!panel) return;
  const { indices, items } = e.detail;

  if (!indices.length) {
    panel.setAttribute('hidden', '');
    return;
  }

  panel.removeAttribute('hidden');

  if (indices.length === 1) {
    renderSingle(indices[0], items[0]);
  } else {
    renderMulti(indices);
  }
}

// ── Single-item inspector ─────────────────────────────────────
function renderSingle(idx, item) {
  if (!inspBody || !item) return;

  const { x, y, width, height, rotation, zIndex, component, nudges, props } = item;
  const cssVars   = extractCssVars(component.css);
  const textNodes = extractTextNodes(component.html);

  inspBody.innerHTML = `
    <!-- Position & Size -->
    <div class="dlx-insp-section">
      <div class="dlx-insp-section__title">Position &amp; Size</div>
      <div class="dlx-insp-grid2">
        <label class="dlx-insp-label">X
          <input type="number" class="dlx-insp-input" data-prop="x" value="${Math.round(x)}">
        </label>
        <label class="dlx-insp-label">Y
          <input type="number" class="dlx-insp-input" data-prop="y" value="${Math.round(y)}">
        </label>
        <label class="dlx-insp-label">W
          <input type="number" class="dlx-insp-input" data-prop="width" value="${Math.round(width)}" min="80">
        </label>
        <label class="dlx-insp-label">H
          <input type="number" class="dlx-insp-input" data-prop="height" value="${Math.round(height)}" min="40">
        </label>
        <label class="dlx-insp-label" style="grid-column:span 2">Rotation
          <input type="number" class="dlx-insp-input" data-prop="rotation" value="${rotation || 0}" min="-360" max="360" step="1">
        </label>
      </div>
    </div>

    <!-- Layer order -->
    <div class="dlx-insp-section">
      <div class="dlx-insp-section__title">Layer</div>
      <div class="dlx-insp-row" style="gap:6px">
        <span class="dlx-insp-muted" style="flex:1">z-index: ${zIndex}</span>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-layer="up" title="Bring forward">\u2191 Forward</button>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-layer="down" title="Send backward">\u2193 Back</button>
      </div>
    </div>

    ${cssVars.length ? `
    <!-- Colors -->
    <div class="dlx-insp-section">
      <div class="dlx-insp-section__title">Colors</div>
      ${cssVars.map(v => `
        <label class="dlx-insp-label dlx-insp-label--row" style="margin-bottom:6px">
          <span>${escHtml(v.name.replace('--',''))}</span>
          <input type="color" class="dlx-insp-color" data-cssvar="${escAttr(v.name)}"
                 value="${resolveHex(v.fallback, props[v.name])}">
        </label>`).join('')}
    </div>` : ''}

    ${textNodes.length ? `
    <!-- Content -->
    <div class="dlx-insp-section">
      <div class="dlx-insp-section__title">Content</div>
      ${textNodes.map((t, i) => `
        <label class="dlx-insp-label" style="margin-bottom:6px">
          <span>${t.tag.toUpperCase()}</span>
          <input type="text" class="dlx-insp-input dlx-insp-text"
                 data-textnode="${i}" data-selector="${escAttr(t.selector)}"
                 value="${escHtml(props['__text_' + i] !== undefined ? props['__text_' + i] : t.text)}">
        </label>`).join('')}
    </div>` : ''}

    <!-- Effects -->
    <div class="dlx-insp-section">
      <div class="dlx-insp-section__title">Effects</div>
      ${[
        { id:'nudge-grow',   icon:'\u2942', label:'Grow on Hover'    },
        { id:'nudge-shadow', icon:'\u25c9', label:'Soft Shadow'      },
        { id:'nudge-round',  icon:'\u25ef', label:'Round Corners'    },
        { id:'nudge-pulse',  icon:'\u2742', label:'Breathing Pulse'  },
      ].map(n => `
        <label class="dlx-insp-label dlx-insp-label--row" style="margin-bottom:6px;cursor:pointer">
          <span>${n.icon} ${n.label}</span>
          <input type="checkbox" data-nudge="${n.id}" ${nudges.has(n.id) ? 'checked' : ''}>
        </label>`).join('')}
    </div>
  `;

  // ── Wire position / size inputs ───────────────────────────
  inspBody.querySelectorAll('[data-prop]').forEach(input => {
    input.addEventListener('change', () => {
      const prop = input.dataset.prop;
      const val  = parseFloat(input.value) || 0;
      if (prop === 'x' || prop === 'y') {
        const it = canvas.getItems()[idx];
        canvas.updateItemPosition(idx, prop === 'x' ? val : it.x, prop === 'y' ? val : it.y);
      } else if (prop === 'width' || prop === 'height') {
        const it = canvas.getItems()[idx];
        canvas.updateItemSize(idx, prop === 'width' ? val : it.width, prop === 'height' ? val : it.height);
      } else if (prop === 'rotation') {
        canvas.setItemRotation(idx, val);
      }
    });
  });

  // ── Layer buttons ─────────────────────────────────────────
  inspBody.querySelector('[data-layer="up"]')  ?.addEventListener('click', () => { canvas.bringForward(idx); });
  inspBody.querySelector('[data-layer="down"]') ?.addEventListener('click', () => { canvas.sendBackward(idx); });

  // ── Color pickers ─────────────────────────────────────────
  inspBody.querySelectorAll('[data-cssvar]').forEach(input => {
    input.addEventListener('input', () => {
      canvas.updateItemProp(idx, input.dataset.cssvar, input.value);
    });
  });

  // ── Text content editors ──────────────────────────────────
  inspBody.querySelectorAll('[data-textnode]').forEach(input => {
    input.addEventListener('input', () => {
      const nodeIdx  = parseInt(input.dataset.textnode);
      const selector = input.dataset.selector;
      canvas.updateItemProp(idx, `__text_${nodeIdx}`, input.value);
      // Apply to shadow DOM immediately
      const wrap = document.querySelector(`.dlx-canvas-item[data-index="${idx}"]`);
      const host = wrap?.querySelector('.dlx-shadow-host');
      if (host?.shadowRoot) {
        const el = host.shadowRoot.querySelector(selector);
        if (el && el.children.length === 0) el.textContent = input.value;
      }
    });
  });

  // ── Effect checkboxes ─────────────────────────────────────
  inspBody.querySelectorAll('[data-nudge]').forEach(cb => {
    cb.addEventListener('change', () => {
      const nudgeId = cb.dataset.nudge;
      if (cb.checked) item.nudges.add(nudgeId);
      else            item.nudges.delete(nudgeId);
      // Apply directly without full re-render
      const wrap = document.querySelector(`.dlx-canvas-item[data-index="${idx}"]`);
      if (wrap) {
        wrap.classList.toggle(nudgeId, cb.checked);
        const host = wrap.querySelector('.dlx-shadow-host');
        if (host) host.toggleAttribute(`data-${nudgeId}`, cb.checked);
      }
    });
  });

  // Update inspector when selection changes position (drag)
  document.addEventListener('dlx:selection-change', onPositionUpdate, { once: true });
}

// ── Update position fields while dragging (lightweight) ──────
function onPositionUpdate(e) {
  const { indices, items } = e.detail;
  if (indices.length !== 1 || !inspBody) return;
  const item = items[0];
  if (!item) return;
  const xIn = inspBody.querySelector('[data-prop="x"]');
  const yIn = inspBody.querySelector('[data-prop="y"]');
  if (xIn) xIn.value = Math.round(item.x);
  if (yIn) yIn.value = Math.round(item.y);
}

// ── Multi-select inspector (alignment tools) ──────────────────
function renderMulti(indices) {
  if (!inspBody) return;

  inspBody.innerHTML = `
    <div class="dlx-insp-section">
      <div class="dlx-insp-section__title">${indices.length} items selected</div>

      <div class="dlx-insp-subtitle">Align</div>
      <div class="dlx-insp-row-wrap">
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="left">\u21d0 Left</button>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="center">\u21d4 Center</button>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="right">Right \u21d2</button>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="top">\u21d1 Top</button>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="middle">\u21d5 Middle</button>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="bottom">Bottom \u21d3</button>
      </div>

      <div class="dlx-insp-subtitle" style="margin-top:10px">Distribute</div>
      <div class="dlx-insp-row-wrap">
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="dist-h">\u2194 Horizontal</button>
        <button class="dlx-btn-sm dlx-btn-sm--ghost" data-align="dist-v">\u2195 Vertical</button>
      </div>
    </div>
  `;

  inspBody.querySelectorAll('[data-align]').forEach(btn => {
    btn.addEventListener('click', () => alignItems(indices, canvas.getItems(), btn.dataset.align));
  });
}

// ── Alignment ─────────────────────────────────────────────────
function alignItems(indices, allItems, mode) {
  const sel  = indices.map(i => allItems[i]).filter(Boolean);
  if (!sel.length) return;

  const minX = Math.min(...sel.map(it => it.x));
  const maxX = Math.max(...sel.map(it => it.x + it.width));
  const minY = Math.min(...sel.map(it => it.y));
  const maxY = Math.max(...sel.map(it => it.y + it.height));
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  sel.forEach((it, pos) => {
    const i = indices[pos];
    switch (mode) {
      case 'left':    it.x = minX;              break;
      case 'center':  it.x = midX - it.width / 2; break;
      case 'right':   it.x = maxX - it.width;  break;
      case 'top':     it.y = minY;              break;
      case 'middle':  it.y = midY - it.height / 2; break;
      case 'bottom':  it.y = maxY - it.height;  break;
      case 'dist-h': {
        if (sel.length < 3) return;
        const sorted = [...sel].sort((a, b) => a.x - b.x);
        const totalW = sorted.reduce((s, it2) => s + it2.width, 0);
        const span   = sorted[sorted.length-1].x + sorted[sorted.length-1].width - sorted[0].x;
        const gap    = (span - totalW) / (sorted.length - 1);
        let cx = sorted[0].x + sorted[0].width + gap;
        for (let j = 1; j < sorted.length - 1; j++) { sorted[j].x = cx; cx += sorted[j].width + gap; }
        break;
      }
      case 'dist-v': {
        if (sel.length < 3) return;
        const sorted = [...sel].sort((a, b) => a.y - b.y);
        const totalH = sorted.reduce((s, it2) => s + it2.height, 0);
        const span   = sorted[sorted.length-1].y + sorted[sorted.length-1].height - sorted[0].y;
        const gap    = (span - totalH) / (sorted.length - 1);
        let cy = sorted[0].y + sorted[0].height + gap;
        for (let j = 1; j < sorted.length - 1; j++) { sorted[j].y = cy; cy += sorted[j].height + gap; }
        break;
      }
    }
    canvas.updateItemPosition(i, allItems[i].x, allItems[i].y);
  });

  toast('Aligned \u2746');
}

// ── CSS variable extraction ───────────────────────────────────
function extractCssVars(css) {
  const seen = new Map();
  // Match var(--name, fallback) references in component CSS
  for (const m of css.matchAll(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g)) {
    const name     = m[1];
    const fallback = m[2]?.trim();
    if (!seen.has(name) && fallback && looksLikeColor(fallback)) {
      seen.set(name, { name, fallback });
    }
  }
  return [...seen.values()].slice(0, 8);
}

function looksLikeColor(val) {
  return /^#[0-9a-fA-F]{3,8}$|^rgb|^hsl/.test(val?.trim() || '');
}

function resolveHex(fallback, override) {
  const val = (override && looksLikeColor(override)) ? override : fallback;
  if (!val) return '#000000';
  if (/^#[0-9a-fA-F]{6}$/.test(val)) return val;
  if (/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.test(val)) {
    const [,r,g,b] = val.match(/^#(.)(.)(.)$/);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const rgb = val.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgb) return '#' + [rgb[1],rgb[2],rgb[3]].map(n => (+n).toString(16).padStart(2,'0')).join('');
  return '#000000';
}

// ── Text node extraction ──────────────────────────────────────
function extractTextNodes(html) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const nodes  = [];
  const tags   = ['button','h1','h2','h3','h4','p','span','a','label','li','td','th'];
  const seen   = new Map();

  tags.forEach(tag => {
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

// ── Utilities ─────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(str) {
  return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
