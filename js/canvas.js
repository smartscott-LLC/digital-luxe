/* ============================================================
   Digital Luxe — Design Canvas  (Phase 1: Free-form infinite canvas)
   Supports: drag-move, 8-handle resize, pan, zoom, rubber-band
             select, keyboard shortcuts, snap-to-grid, multi-select
   ============================================================ */
import { NUDGE_BASE_CSS } from './components.js';
import { nudge } from './nudge.js';
import { toast } from './utils.js';

// ── Constants ──────────────────────────────────────────────────
const CANVAS_W  = 4000;
const CANVAS_H  = 3000;
const SNAP_GRID = 8;
const DEFAULT_W = 280;
const DEFAULT_H = 140;
const ZOOM_MIN  = 0.1;
const ZOOM_MAX  = 4;
const HANDLES   = ['tl','t','tr','r','br','b','bl','l'];

// ── State ─────────────────────────────────────────────────────
let items = [];          // { component, nudges, x, y, width, height, zIndex, props, rotation }
let selectedIndices = new Set();
let nextZ  = 1;
let zoom   = 1.0;
let panX   = 0;
let panY   = 0;

// ── Interaction state ─────────────────────────────────────────
let drag      = null;   // { startPositions:{idx:{x,y}}, mouseStartX, mouseStartY }
let resize    = null;   // { idx, handle, startX,startY,startW,startH, mouseStartX,mouseStartY }
let panning   = false;
let panStart  = null;
let spaceDown = false;
let band      = null;   // { startX, startY } canvas coords

let snapEnabled = true;

// ── DOM refs ──────────────────────────────────────────────────
const canvasArea = document.getElementById('canvas-area');
const emptyState = document.getElementById('canvas-empty');
const itemsWrap  = document.getElementById('canvas-items');
const indicator  = document.getElementById('canvas-indicator');
const saveBtn    = document.getElementById('save-canvas-btn');
const clearBtn   = document.getElementById('clear-canvas-btn');
const exportBtn  = document.getElementById('export-canvas-btn');
const zoomInBtn  = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const zoomFitBtn = document.getElementById('zoom-fit-btn');
const zoomLabel  = document.getElementById('zoom-label');
const snapToggle = document.getElementById('snap-toggle');
const bandEl     = document.getElementById('canvas-band');

// ── Public API ────────────────────────────────────────────────
export const canvas = {
  init() {
    saveBtn  .addEventListener('click', () => this.save());
    clearBtn .addEventListener('click', () => this.clear());
    exportBtn.addEventListener('click', () => this.exportHtml());
    zoomInBtn ?.addEventListener('click', () => setZoom(zoom * 1.25));
    zoomOutBtn?.addEventListener('click', () => setZoom(zoom / 1.25));
    zoomFitBtn?.addEventListener('click', fitToScreen);
    snapToggle?.addEventListener('change', e => { snapEnabled = e.target.checked; });
    initCanvasEvents();
  },

  addComponent(component) {
    const pos = calcDropPosition();
    items.push({
      component,
      nudges  : new Set(nudge.getActiveNudges()),
      x       : pos.x,
      y       : pos.y,
      width   : DEFAULT_W,
      height  : DEFAULT_H,
      zIndex  : nextZ++,
      props   : {},
      rotation: 0,
    });
    const idx = items.length - 1;
    selectOnly(idx);
    renderCanvas();
    fireSelectionChange();
    toast(`${component.name} added \u2746`);
  },

  removeComponent(index) {
    items.splice(index, 1);
    selectedIndices.clear();
    nextZ = recalcNextZ();
    renderCanvas();
    fireSelectionChange();
  },

  removeSelected() {
    [...selectedIndices].sort((a, b) => b - a).forEach(i => items.splice(i, 1));
    selectedIndices.clear();
    nextZ = recalcNextZ();
    renderCanvas();
    fireSelectionChange();
  },

  selectComponent(index) {
    selectOnly(index);
    syncDOMSelection();
    fireSelectionChange();
  },

  applyNudges(nudgeSet) {
    const target = document.getElementById('nudge-target')?.value || 'all';
    if (target === 'selected') {
      selectedIndices.forEach(i => { if (items[i]) items[i].nudges = new Set(nudgeSet); });
    } else {
      items.forEach(item => { item.nudges = new Set(nudgeSet); });
    }
    updateNudgeAttributes();
  },

  clear() {
    if (!items.length) return;
    if (!confirm('Clear all components from the canvas?')) return;
    items = [];
    selectedIndices.clear();
    nextZ = 1;
    renderCanvas();
    fireSelectionChange();
  },

  save() {
    import('./vault.js').then(({ vault }) => vault.promptSave(this.serializeState()));
  },

  loadState(state) {
    import('./components.js').then(({ COMPONENTS }) => {
      const custom = getCustomComponents();
      items = (state.items || []).map(s => {
        const component = COMPONENTS.find(c => c.id === s.id)
                       || custom.find(c => c.id === s.id);
        if (!component) return null;
        return {
          component,
          nudges  : new Set(s.nudges   || []),
          x       : s.x       ?? 60,
          y       : s.y       ?? 60,
          width   : s.width   ?? DEFAULT_W,
          height  : s.height  ?? DEFAULT_H,
          zIndex  : s.zIndex  ?? 1,
          props   : s.props   || {},
          rotation: s.rotation || 0,
        };
      }).filter(Boolean);
      nextZ = recalcNextZ();
      selectedIndices.clear();
      renderCanvas();
      fireSelectionChange();
    });
  },

  serializeState() {
    return {
      items: items.map(it => ({
        id      : it.component.id,
        name    : it.component.name,
        nudges  : [...it.nudges],
        x       : it.x,
        y       : it.y,
        width   : it.width,
        height  : it.height,
        zIndex  : it.zIndex,
        props   : it.props,
        rotation: it.rotation,
      }))
    };
  },

  getItemCount()       { return items.length; },
  fitToScreen()        { fitToScreen(); },
  getItems()           { return items; },
  getSelectedIndices() { return [...selectedIndices]; },
  getZoom()            { return zoom; },

  updateItemProp(idx, key, value) {
    if (!items[idx]) return;
    items[idx].props[key] = value;
    refreshShadowProps(idx);
  },

  updateItemPosition(idx, x, y) {
    if (!items[idx]) return;
    items[idx].x = x;
    items[idx].y = y;
    positionItemEl(idx);
  },

  updateItemSize(idx, w, h) {
    if (!items[idx]) return;
    items[idx].width  = Math.max(80, w);
    items[idx].height = Math.max(40, h);
    positionItemEl(idx);
  },

  setItemRotation(idx, deg) {
    if (!items[idx]) return;
    items[idx].rotation = deg;
    positionItemEl(idx);
  },

  bringForward(idx) {
    if (!items[idx]) return;
    items[idx].zIndex = ++nextZ;
    positionItemEl(idx);
  },

  sendBackward(idx) {
    if (!items[idx]) return;
    const min = Math.min(...items.map(it => it.zIndex));
    items[idx].zIndex = Math.max(1, min - 1);
    positionItemEl(idx);
  },

  getSelectedItem() {
    if (selectedIndices.size === 1) {
      const idx = [...selectedIndices][0];
      return { item: items[idx], idx };
    }
    return null;
  },

  exportHtml() {
    if (!items.length) { toast('Add some components first!', 'warn'); return; }
    const html  = buildExportHtml(items);
    const modal = document.getElementById('export-modal');
    const codeEl = modal?.querySelector('#export-code');
    if (codeEl) codeEl.textContent = html;
    modal?.removeAttribute('hidden');
  },
};

// ── Full canvas render (called on add/remove/load) ────────────
function renderCanvas() {
  const hasItems = items.length > 0;
  emptyState.hidden = hasItems;
  itemsWrap.hidden  = !hasItems;
  indicator.classList.toggle('has-items', hasItems);

  if (!hasItems) { itemsWrap.innerHTML = ''; applyTransform(); return; }

  itemsWrap.innerHTML = '';
  items.forEach((item, idx) => createItemEl(item, idx));
  applyTransform();
}

// ── Build one canvas item element ─────────────────────────────
function createItemEl(item, idx) {
  const wrap = document.createElement('div');
  wrap.className = 'dlx-canvas-item';
  wrap.dataset.index = String(idx);
  applyNudgeClasses(wrap, item.nudges);
  if (selectedIndices.has(idx)) wrap.classList.add('selected');
  setItemStyle(wrap, item);

  wrap.innerHTML = `
    <div class="dlx-canvas-item__bar">
      <span class="dlx-canvas-item__bar-drag" title="Drag to move">\u2807</span>
      <span class="dlx-canvas-item__bar-name">${escHtml(item.component.name)}</span>
      <span class="dlx-canvas-item__bar-cat">${escHtml(item.component.category)}</span>
      <div class="dlx-canvas-item__bar-actions">
        <button class="dlx-canvas-item__bar-btn" data-action="duplicate" title="Duplicate">\u29c9</button>
        <button class="dlx-canvas-item__bar-btn remove" data-action="remove" title="Remove">\u2715</button>
      </div>
    </div>
    <div class="dlx-canvas-item__body"></div>
    ${selectedIndices.has(idx) ? resizeHandlesHtml() : ''}
  `;

  wrap.querySelector('.dlx-canvas-item__body').appendChild(buildShadowHost(item));

  wrap.querySelector('[data-action="remove"]').addEventListener('click', e => {
    e.stopPropagation(); canvas.removeComponent(idx);
  });
  wrap.querySelector('[data-action="duplicate"]').addEventListener('click', e => {
    e.stopPropagation();
    const src = items[idx];
    items.splice(idx + 1, 0, {
      component: src.component,
      nudges   : new Set(src.nudges),
      x: src.x + 20, y: src.y + 20,
      width: src.width, height: src.height,
      zIndex: nextZ++, props: { ...src.props }, rotation: src.rotation,
    });
    selectOnly(idx + 1);
    renderCanvas();
    fireSelectionChange();
  });

  itemsWrap.appendChild(wrap);
}

function resizeHandlesHtml() {
  return HANDLES.map(h =>
    `<div class="dlx-resize-handle dlx-resize-handle--${h}" data-handle="${h}"></div>`
  ).join('');
}

// ── Shadow DOM ────────────────────────────────────────────────
function buildShadowHost(item) {
  const host   = document.createElement('div');
  host.className = 'dlx-shadow-host';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${NUDGE_BASE_CSS}\n${item.component.css}\n${buildPropsCss(item.props)}</style>${item.component.html}`;
  applyNudgeAttrs(host, item.nudges);
  return host;
}

function buildPropsCss(props) {
  const overrides = Object.entries(props || {})
    .filter(([k]) => k.startsWith('--'))
    .map(([k, v]) => `${k}:${v};`).join(' ');
  return overrides ? `:host{${overrides}}` : '';
}

function refreshShadowProps(idx) {
  const wrap = itemsWrap.querySelector(`.dlx-canvas-item[data-index="${idx}"]`);
  if (!wrap) return;
  const host = wrap.querySelector('.dlx-shadow-host');
  if (!host?.shadowRoot) return;
  let s = host.shadowRoot.querySelector('style[data-props]');
  if (!s) { s = document.createElement('style'); s.setAttribute('data-props',''); host.shadowRoot.appendChild(s); }
  s.textContent = buildPropsCss(items[idx].props);
}

// ── Style helpers ─────────────────────────────────────────────
function setItemStyle(el, item) {
  el.style.cssText = `left:${item.x}px;top:${item.y}px;width:${item.width}px;height:${item.height}px;z-index:${item.zIndex};transform:rotate(${item.rotation||0}deg);`;
}

function positionItemEl(idx) {
  const wrap = itemsWrap.querySelector(`.dlx-canvas-item[data-index="${idx}"]`);
  if (wrap && items[idx]) setItemStyle(wrap, items[idx]);
}

// ── Transform (pan + zoom) ────────────────────────────────────
function applyTransform() {
  itemsWrap.style.transform       = `translate(${panX}px,${panY}px) scale(${zoom})`;
  itemsWrap.style.transformOrigin = '0 0';
  if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

function setZoom(newZoom, ox, oy) {
  newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));
  const rect = canvasArea.getBoundingClientRect();
  const originX = ox ?? rect.width  / 2;
  const originY = oy ?? rect.height / 2;
  const cx = (originX - panX) / zoom;
  const cy = (originY - panY) / zoom;
  zoom = newZoom;
  panX = originX - cx * zoom;
  panY = originY - cy * zoom;
  applyTransform();
}

function fitToScreen() {
  const rect = canvasArea.getBoundingClientRect();
  if (!items.length) { zoom = 1; panX = 40; panY = 40; applyTransform(); return; }
  const b   = getItemsBounds();
  const pad = 80;
  zoom = Math.min((rect.width  - pad * 2) / b.width,
                  (rect.height - pad * 2) / b.height, 2);
  panX = rect.width  / 2 - (b.x + b.width  / 2) * zoom;
  panY = rect.height / 2 - (b.y + b.height / 2) * zoom;
  applyTransform();
}

function getItemsBounds() {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  items.forEach(it => {
    minX = Math.min(minX, it.x); minY = Math.min(minY, it.y);
    maxX = Math.max(maxX, it.x + it.width); maxY = Math.max(maxY, it.y + it.height);
  });
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

// ── Coordinate util ───────────────────────────────────────────
function screenToCanvas(cx, cy) {
  const rect = canvasArea.getBoundingClientRect();
  return { x: (cx - rect.left - panX) / zoom, y: (cy - rect.top - panY) / zoom };
}

function calcDropPosition() {
  const rect   = canvasArea.getBoundingClientRect();
  const cx     = (rect.width  / 2 - panX) / zoom - DEFAULT_W / 2;
  const cy     = (rect.height / 2 - panY) / zoom - DEFAULT_H / 2;
  const offset = (items.length % 8) * 24;
  return { x: Math.max(10, cx + offset), y: Math.max(10, cy + offset) };
}

// ── Selection ─────────────────────────────────────────────────
function selectOnly(idx) {
  selectedIndices.clear();
  if (idx >= 0 && idx < items.length) selectedIndices.add(idx);
}

function syncDOMSelection() {
  document.querySelectorAll('.dlx-canvas-item').forEach(el => {
    const i   = parseInt(el.dataset.index);
    const sel = selectedIndices.has(i);
    el.classList.toggle('selected', sel);
    el.querySelectorAll('.dlx-resize-handle').forEach(h => h.remove());
    if (sel) el.insertAdjacentHTML('beforeend', resizeHandlesHtml());
  });
}

function clearSelection() {
  selectedIndices.clear();
  syncDOMSelection();
  fireSelectionChange();
}

function fireSelectionChange() {
  document.dispatchEvent(new CustomEvent('dlx:selection-change', {
    detail: {
      indices: [...selectedIndices],
      items  : [...selectedIndices].map(i => items[i]).filter(Boolean),
    }
  }));
}

// ── Event wiring ──────────────────────────────────────────────
function initCanvasEvents() {
  document.addEventListener('keydown', onGlobalKeyDown);
  document.addEventListener('keyup',  e => {
    if (e.key === ' ') { spaceDown = false; if (!panning) canvasArea.style.cursor = ''; }
  });
  canvasArea.addEventListener('mousedown',  onCanvasMouseDown);
  window    .addEventListener('mousemove',  onWindowMouseMove);
  window    .addEventListener('mouseup',    onWindowMouseUp);
  canvasArea.addEventListener('wheel',      onWheel, { passive: false });
  canvasArea.addEventListener('selectstart', e => {
    if (drag || resize || panning || band) e.preventDefault();
  });
}

function onGlobalKeyDown(e) {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  if (e.key === ' ') { e.preventDefault(); spaceDown = true; if (!panning) canvasArea.style.cursor = 'grab'; return; }
  if (e.key === 'Escape') { clearSelection(); return; }

  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIndices.size) {
    e.preventDefault(); canvas.removeSelected(); return;
  }

  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key) && selectedIndices.size) {
    e.preventDefault();
    const step = e.shiftKey ? 10 : 1;
    const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
    const dy = e.key === 'ArrowUp'   ? -step : e.key === 'ArrowDown'  ? step : 0;
    selectedIndices.forEach(i => { items[i].x += dx; items[i].y += dy; positionItemEl(i); });
    fireSelectionChange();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedIndices.size) {
    e.preventDefault();
    const toClone = [...selectedIndices];
    const newSet  = new Set();
    toClone.forEach(i => {
      const s = items[i];
      items.push({ component:s.component, nudges:new Set(s.nudges), x:s.x+20, y:s.y+20,
                   width:s.width, height:s.height, zIndex:nextZ++, props:{...s.props}, rotation:s.rotation });
      newSet.add(items.length - 1);
    });
    selectedIndices.clear();
    newSet.forEach(i => selectedIndices.add(i));
    renderCanvas();
    fireSelectionChange();
  }
}

function onCanvasMouseDown(e) {
  if (e.button === 1 || spaceDown) {
    e.preventDefault();
    panning  = true;
    panStart = { panX, panY, mouseX: e.clientX, mouseY: e.clientY };
    canvasArea.style.cursor = 'grabbing';
    return;
  }
  if (e.button !== 0) return;

  const handleEl = e.target.closest('.dlx-resize-handle');
  if (handleEl) { startResize(handleEl, e); return; }

  const itemEl = e.target.closest('.dlx-canvas-item');
  if (itemEl) {
    if (e.target.closest('[data-action]')) return;
    const idx = parseInt(itemEl.dataset.index);

    if (e.shiftKey) {
      if (selectedIndices.has(idx)) selectedIndices.delete(idx);
      else selectedIndices.add(idx);
      syncDOMSelection();
      fireSelectionChange();
      return;
    }

    if (!selectedIndices.has(idx)) {
      selectOnly(idx);
      syncDOMSelection();
      fireSelectionChange();
    }

    const cm = screenToCanvas(e.clientX, e.clientY);
    const sp = {};
    selectedIndices.forEach(i => { sp[i] = { x: items[i].x, y: items[i].y }; });
    drag = { startPositions: sp, mouseStartX: cm.x, mouseStartY: cm.y };
    return;
  }

  if (!e.shiftKey) clearSelection();
  const cm = screenToCanvas(e.clientX, e.clientY);
  band = { startX: cm.x, startY: cm.y };
  if (bandEl) bandEl.removeAttribute('hidden');
  updateBandEl(cm.x, cm.y, 0, 0);
}

function startResize(handleEl, e) {
  e.stopPropagation();
  const itemEl = handleEl.closest('.dlx-canvas-item');
  if (!itemEl) return;
  const idx  = parseInt(itemEl.dataset.index);
  const item = items[idx];
  if (!item) return;
  const cm = screenToCanvas(e.clientX, e.clientY);
  resize = { idx, handle: handleEl.dataset.handle,
             startX:item.x, startY:item.y, startW:item.width, startH:item.height,
             mouseStartX:cm.x, mouseStartY:cm.y };
}

function onWindowMouseMove(e) {
  if (panning) {
    panX = panStart.panX + (e.clientX - panStart.mouseX);
    panY = panStart.panY + (e.clientY - panStart.mouseY);
    applyTransform(); return;
  }
  if (drag) {
    const cm = screenToCanvas(e.clientX, e.clientY);
    const dx = cm.x - drag.mouseStartX;
    const dy = cm.y - drag.mouseStartY;
    Object.entries(drag.startPositions).forEach(([i, pos]) => {
      let nx = pos.x + dx, ny = pos.y + dy;
      if (snapEnabled) { nx = snapV(nx); ny = snapV(ny); }
      items[i].x = nx; items[i].y = ny;
      positionItemEl(parseInt(i));
    });
    fireSelectionChange(); return;
  }
  if (resize) {
    const cm = screenToCanvas(e.clientX, e.clientY);
    applyResize(cm.x - resize.mouseStartX, cm.y - resize.mouseStartY, e.shiftKey); return;
  }
  if (band) {
    const cm = screenToCanvas(e.clientX, e.clientY);
    const x = Math.min(band.startX, cm.x), y = Math.min(band.startY, cm.y);
    const w = Math.abs(cm.x - band.startX), h = Math.abs(cm.y - band.startY);
    updateBandEl(x, y, w, h);
    highlightBandItems(x, y, w, h);
  }
}

function onWindowMouseUp(e) {
  if (panning) { panning = false; panStart = null; canvasArea.style.cursor = spaceDown ? 'grab' : ''; }
  if (drag)   drag   = null;
  if (resize) resize = null;
  if (band) {
    const cm = screenToCanvas(e.clientX, e.clientY);
    const x = Math.min(band.startX, cm.x), y = Math.min(band.startY, cm.y);
    const w = Math.abs(cm.x - band.startX), h = Math.abs(cm.y - band.startY);
    finalizeBand(x, y, w, h, e.shiftKey);
    band = null;
    if (bandEl) bandEl.setAttribute('hidden','');
    updateBandEl(0, 0, 0, 0);
  }
}

function onWheel(e) {
  e.preventDefault();
  const rect   = canvasArea.getBoundingClientRect();
  const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
  setZoom(zoom * factor, e.clientX - rect.left, e.clientY - rect.top);
}

function applyResize(dx, dy, keepRatio) {
  const { idx, handle, startX, startY, startW, startH } = resize;
  let nx = startX, ny = startY, nw = startW, nh = startH;

  if (handle.includes('r')) nw = Math.max(80, startW + dx);
  if (handle.includes('b')) nh = Math.max(40, startH + dy);
  if (handle.includes('l')) { nw = Math.max(80, startW - dx); nx = startX + startW - nw; }
  if (handle.includes('t')) { nh = Math.max(40, startH - dy); ny = startY + startH - nh; }

  if (keepRatio && ['tl','tr','br','bl'].includes(handle)) {
    const ratio = startW / startH;
    if (nw / nh > ratio) nh = nw / ratio; else nw = nh * ratio;
  }

  if (snapEnabled) { nx = snapV(nx); ny = snapV(ny); nw = snapV(nw); nh = snapV(nh); }

  items[idx].x = nx; items[idx].y = ny;
  items[idx].width = nw; items[idx].height = nh;
  positionItemEl(idx);
  fireSelectionChange();
}

function updateBandEl(x, y, w, h) {
  if (!bandEl) return;
  bandEl.style.left   = `${x * zoom + panX}px`;
  bandEl.style.top    = `${y * zoom + panY}px`;
  bandEl.style.width  = `${w * zoom}px`;
  bandEl.style.height = `${h * zoom}px`;
}

function highlightBandItems(x, y, w, h) {
  items.forEach((item, i) => {
    const hit = item.x < x+w && item.x+item.width  > x &&
                item.y < y+h && item.y+item.height > y;
    const el  = itemsWrap.querySelector(`.dlx-canvas-item[data-index="${i}"]`);
    if (el) el.classList.toggle('band-hover', hit);
  });
}

function finalizeBand(x, y, w, h, additive) {
  if (!additive) selectedIndices.clear();
  items.forEach((item, i) => {
    if (item.x < x+w && item.x+item.width  > x &&
        item.y < y+h && item.y+item.height > y) selectedIndices.add(i);
  });
  itemsWrap.querySelectorAll('.band-hover').forEach(el => el.classList.remove('band-hover'));
  syncDOMSelection();
  fireSelectionChange();
}

function applyNudgeClasses(el, nudges) {
  ['nudge-grow','nudge-shadow','nudge-round','nudge-pulse']
    .forEach(n => el.classList.toggle(n, nudges.has(n)));
}

function applyNudgeAttrs(el, nudges) {
  ['nudge-grow','nudge-shadow','nudge-round','nudge-pulse']
    .forEach(n => el.toggleAttribute(`data-${n}`, nudges.has(n)));
}

function updateNudgeAttributes() {
  itemsWrap.querySelectorAll('.dlx-canvas-item').forEach((wrap, idx) => {
    if (!items[idx]) return;
    applyNudgeClasses(wrap, items[idx].nudges);
    const host = wrap.querySelector('.dlx-shadow-host');
    if (host) applyNudgeAttrs(host, items[idx].nudges);
  });
}

function recalcNextZ()  { return items.reduce((m, it) => Math.max(m, it.zIndex), 0) + 1; }
function snapV(v)        { return Math.round(v / SNAP_GRID) * SNAP_GRID; }
function getCustomComponents() {
  try { return JSON.parse(localStorage.getItem('dlx-custom-components') || '[]'); } catch { return []; }
}

function buildExportHtml(canvasItems) {
  const palette = '--golden-bronze:#bba54c;--graphite:#2c2b25;--silver:#a7a6a2;--pine-teal:#1F4F3C;--sand-dune:#dcd6b9;';
  const sorted  = [...canvasItems].sort((a, b) => a.zIndex - b.zIndex);
  const blocks  = sorted.map(({ component, x, y, width, height, props }) => {
    const safe     = component.id.replace(/[^a-z0-9_-]/gi, '_');
    const propsCss = Object.entries(props||{}).filter(([k])=>k.startsWith('--')).map(([k,v])=>`${k}:${v};`).join(' ');
    return `<!-- ${component.name} -->\n<style>\n  .dlx-item-${safe}{position:absolute;left:${x}px;top:${y}px;width:${width}px;height:${height}px;${propsCss}}\n  ${component.css.replace(/:host/g,`.dlx-item-${safe}`)}\n</style>\n<div class="dlx-item-${safe}">${component.html}</div>`;
  }).join('\n\n');
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Digital Luxe Export</title>\n  <style>:root{${palette}}body{margin:0;font-family:system-ui,sans-serif;background:var(--sand-dune);}.dlx-canvas{position:relative;width:${CANVAS_W}px;height:${CANVAS_H}px;}</style>\n</head>\n<body>\n<div class="dlx-canvas">\n${blocks}\n</div>\n</body>\n</html>`;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
