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
const RULER_SIZE = 20;
const GUIDE_SNAP = 6;

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
let guidesX = [];
let guidesY = [];
let draggingGuide = null; // { axis: 'x' | 'y', index: number }
let frames = [];
let activeFrameId = null;

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
const rulerH     = document.getElementById('canvas-ruler-h');
const rulerV     = document.getElementById('canvas-ruler-v');
const guidesEl   = document.getElementById('canvas-guides');
const multiTools = document.getElementById('canvas-multi-tools');
const frameSelect = document.getElementById('frame-select');
const frameAddBtn = document.getElementById('frame-add-btn');

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
    document.getElementById('export-download-html-btn')
      ?.addEventListener('click', () => this.downloadHtml());
    document.getElementById('export-png-btn')
      ?.addEventListener('click', () => this.exportPng());
    document.getElementById('export-tokens-btn')
      ?.addEventListener('click', () => this.exportTokens());
    document.getElementById('preview-btn')
      ?.addEventListener('click', () => this.previewLive());
    multiTools?.querySelectorAll('[data-align]').forEach(btn => {
      btn.addEventListener('click', () => this.alignSelected(btn.dataset.align));
    });
    frameAddBtn?.addEventListener('click', () => this.promptAddFrame());
    frameSelect?.addEventListener('change', () => this.setActiveFrame(frameSelect.value));
    rulerH?.addEventListener('mousedown', e => startGuideDrag('x', e));
    rulerV?.addEventListener('mousedown', e => startGuideDrag('y', e));
    document.addEventListener('dlx:selection-change', e => {
      const count = e.detail?.indices?.length || 0;
      if (multiTools) multiTools.hidden = count < 2;
    });
    ensureDefaultFrame();
    renderFrameOptions();
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

  async addBlock(block) {
    if (!block?.items?.length) return;
    const { COMPONENTS } = await import('./components.js');
    const custom = getCustomComponents();
    const source = new Map([...COMPONENTS, ...custom].map(c => [c.id, c]));
    const drop = calcDropPosition();
    const originX = Math.max(0, drop.x - (block.items[0]?.x || 0));
    const originY = Math.max(0, drop.y - (block.items[0]?.y || 0));
    const created = [];
    block.items.forEach(bi => {
      const component = source.get(bi.componentId);
      if (!component) return;
      items.push({
        component,
        nudges: new Set(nudge.getActiveNudges()),
        x: originX + (bi.x || 0),
        y: originY + (bi.y || 0),
        width: bi.width || DEFAULT_W,
        height: bi.height || DEFAULT_H,
        zIndex: nextZ++,
        props: {},
        rotation: 0,
      });
      created.push(items.length - 1);
    });
    selectedIndices.clear();
    created.forEach(i => selectedIndices.add(i));
    renderCanvas();
    fireSelectionChange();
    toast(`${block.name} block added ✦`, 'success');
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
      frames = Array.isArray(state.frames) && state.frames.length
        ? state.frames
        : [makeFrame('Desktop 1440×900', 60, 60, 1440, 900)];
      activeFrameId = state.activeFrameId || frames[0]?.id || null;
      guidesX = state.guidesX || [];
      guidesY = state.guidesY || [];
      nextZ = recalcNextZ();
      selectedIndices.clear();
      renderFrameOptions();
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
      })),
      frames,
      activeFrameId,
      guidesX,
      guidesY
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

  setItemComponentVariant(idx, componentId) {
    if (!items[idx]) return;
    import('./components.js').then(({ COMPONENTS }) => {
      const custom = getCustomComponents();
      const found = COMPONENTS.find(c => c.id === componentId) || custom.find(c => c.id === componentId);
      if (!found) return;
      items[idx].component = found;
      renderCanvas();
      fireSelectionChange();
    });
  },

  alignSelected(mode) {
    const indices = [...selectedIndices];
    if (indices.length < 2) return;
    const selected = indices.map(i => items[i]).filter(Boolean);
    const minX = Math.min(...selected.map(it => it.x));
    const maxX = Math.max(...selected.map(it => it.x + it.width));
    const minY = Math.min(...selected.map(it => it.y));
    const maxY = Math.max(...selected.map(it => it.y + it.height));
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const sortedX = [...indices].sort((a, b) => items[a].x - items[b].x);
    const sortedY = [...indices].sort((a, b) => items[a].y - items[b].y);

    switch (mode) {
      case 'left': indices.forEach(i => { items[i].x = minX; }); break;
      case 'center': indices.forEach(i => { items[i].x = midX - items[i].width / 2; }); break;
      case 'right': indices.forEach(i => { items[i].x = maxX - items[i].width; }); break;
      case 'top': indices.forEach(i => { items[i].y = minY; }); break;
      case 'middle': indices.forEach(i => { items[i].y = midY - items[i].height / 2; }); break;
      case 'bottom': indices.forEach(i => { items[i].y = maxY - items[i].height; }); break;
      case 'dist-h': {
        if (indices.length < 3) break;
        const span = (items[sortedX.at(-1)].x + items[sortedX.at(-1)].width) - items[sortedX[0]].x;
        const totalW = sortedX.reduce((s, i) => s + items[i].width, 0);
        const gap = (span - totalW) / (sortedX.length - 1);
        let cx = items[sortedX[0]].x + items[sortedX[0]].width + gap;
        for (let i = 1; i < sortedX.length - 1; i++) { items[sortedX[i]].x = cx; cx += items[sortedX[i]].width + gap; }
        break;
      }
      case 'dist-v': {
        if (indices.length < 3) break;
        const span = (items[sortedY.at(-1)].y + items[sortedY.at(-1)].height) - items[sortedY[0]].y;
        const totalH = sortedY.reduce((s, i) => s + items[i].height, 0);
        const gap = (span - totalH) / (sortedY.length - 1);
        let cy = items[sortedY[0]].y + items[sortedY[0]].height + gap;
        for (let i = 1; i < sortedY.length - 1; i++) { items[sortedY[i]].y = cy; cy += items[sortedY[i]].height + gap; }
        break;
      }
      case 'match-w': {
        const w = items[indices[0]].width;
        indices.slice(1).forEach(i => { items[i].width = w; });
        break;
      }
      case 'match-h': {
        const h = items[indices[0]].height;
        indices.slice(1).forEach(i => { items[i].height = h; });
        break;
      }
    }
    indices.forEach(i => positionItemEl(i));
    fireSelectionChange();
    toast('Aligned ✦', 'success');
  },

  getFrames() { return frames; },
  getActiveFrame() { return frames.find(f => f.id === activeFrameId) || null; },
  setActiveFrame(id) {
    activeFrameId = id;
    renderFrameOptions();
    renderCanvas();
  },
  promptAddFrame() {
    const preset = prompt('Frame preset: desktop | mobile | tablet', 'desktop')?.trim().toLowerCase();
    if (!preset) return;
    const map = {
      desktop: { name: 'Desktop 1440×900', w: 1440, h: 900 },
      mobile: { name: 'Mobile 390×844', w: 390, h: 844 },
      tablet: { name: 'Tablet 1024×768', w: 1024, h: 768 },
    };
    const p = map[preset] || map.desktop;
    const x = 80 + frames.length * 48;
    const y = 80 + frames.length * 32;
    const frame = makeFrame(p.name, x, y, p.w, p.h);
    frames.push(frame);
    activeFrameId = frame.id;
    renderFrameOptions();
    renderCanvas();
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
    const html  = buildExportHtml(items, this.getActiveFrame());
    const modal = document.getElementById('export-modal');
    const codeEl = modal?.querySelector('#export-code');
    if (codeEl) codeEl.textContent = html;
    modal?.removeAttribute('hidden');
  },

  downloadHtml() {
    if (!items.length) return;
    const html = buildExportHtml(items, this.getActiveFrame());
    downloadFile(`digital-luxe-${Date.now()}.html`, html, 'text/html');
    toast('HTML downloaded ✦', 'success');
  },

  previewLive() {
    if (!items.length) return;
    const html = buildExportHtml(items, this.getActiveFrame());
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(url), 20000);
  },

  async exportPng() {
    if (!items.length) return;
    const frame = this.getActiveFrame();
    if (!frame) { toast('Add/select a frame first', 'warn'); return; }
    const markup = buildExportHtml(items, frame, { fullDocument: false });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.width}" height="${frame.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${markup}</div></foreignObject></svg>`;
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = frame.width;
      c.height = frame.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      c.toBlob((png) => {
        if (!png) { toast('PNG export failed', 'error'); return; }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(png);
        link.download = `digital-luxe-${frame.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
        link.click();
      }, 'image/png');
      URL.revokeObjectURL(url);
      toast('PNG exported ✦', 'success');
    };
    img.onerror = () => toast('PNG export failed in this browser', 'error');
    img.src = url;
  },

  exportTokens() {
    if (!items.length) return;
    const tokens = collectDesignTokens(items);
    downloadFile(`digital-luxe-tokens-${Date.now()}.json`, JSON.stringify(tokens, null, 2), 'application/json');
    toast('Design tokens exported ✦', 'success');
  },

  applyThemeFromBrand(color) {
    const palette = makePaletteFromBrand(color);
    items.forEach(item => {
      item.props['--pine-teal'] = palette.primary;
      item.props['--golden-bronze'] = palette.accent;
      item.props['--graphite'] = palette.dark;
      item.props['--sand-dune'] = palette.light;
      item.props['--silver'] = palette.muted;
    });
    items.forEach((_, idx) => refreshShadowProps(idx));
    fireSelectionChange();
    toast('Theme applied across canvas ✦', 'success');
  },
};

// ── Full canvas render (called on add/remove/load) ────────────
function renderCanvas() {
  const hasItems = items.length > 0;
  emptyState.hidden = hasItems;
  itemsWrap.hidden  = !hasItems && !frames.length;
  indicator.classList.toggle('has-items', hasItems);

  if (!hasItems) {
    itemsWrap.innerHTML = '';
    renderFrames();
    applyTransform();
    return;
  }

  itemsWrap.innerHTML = '';
  renderFrames();
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
  renderGuides();
}

function setZoom(newZoom, ox, oy) {
  newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));
  const rect = canvasArea.getBoundingClientRect();
  const originX = ox ?? (rect.width  - RULER_SIZE) / 2;
  const originY = oy ?? (rect.height - RULER_SIZE) / 2;
  const cx = (originX - panX) / zoom;
  const cy = (originY - panY) / zoom;
  zoom = newZoom;
  panX = originX - cx * zoom;
  panY = originY - cy * zoom;
  applyTransform();
}

function fitToScreen() {
  const rect = canvasArea.getBoundingClientRect();
  const targetBounds = items.length ? getItemsBounds() : getFramesBounds();
  if (!targetBounds) { zoom = 1; panX = 40; panY = 40; applyTransform(); return; }
  const b = targetBounds;
  const pad = 80;
  zoom = Math.min((rect.width  - RULER_SIZE - pad * 2) / b.width,
                  (rect.height - RULER_SIZE - pad * 2) / b.height, 2);
  panX = (rect.width  - RULER_SIZE) / 2 - (b.x + b.width  / 2) * zoom;
  panY = (rect.height - RULER_SIZE) / 2 - (b.y + b.height / 2) * zoom;
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

function getFramesBounds() {
  if (!frames.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  frames.forEach(f => {
    minX = Math.min(minX, f.x);
    minY = Math.min(minY, f.y);
    maxX = Math.max(maxX, f.x + f.width);
    maxY = Math.max(maxY, f.y + f.height);
  });
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

// ── Coordinate util ───────────────────────────────────────────
function screenToCanvas(cx, cy) {
  const rect = canvasArea.getBoundingClientRect();
  return {
    x: (cx - rect.left - RULER_SIZE - panX) / zoom,
    y: (cy - rect.top - RULER_SIZE - panY) / zoom
  };
}

function calcDropPosition() {
  const activeFrame = frames.find(f => f.id === activeFrameId);
  if (activeFrame) {
    return {
      x: activeFrame.x + Math.max(10, activeFrame.width / 2 - DEFAULT_W / 2),
      y: activeFrame.y + Math.max(10, activeFrame.height / 2 - DEFAULT_H / 2),
    };
  }
  const rect   = canvasArea.getBoundingClientRect();
  const cx     = (rect.width  / 2 - RULER_SIZE - panX) / zoom - DEFAULT_W / 2;
  const cy     = (rect.height / 2 - RULER_SIZE - panY) / zoom - DEFAULT_H / 2;
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
      const src = items[i];
      items.push({
        component: src.component,
        nudges   : new Set(src.nudges),
        x        : src.x + 20,
        y        : src.y + 20,
        width    : src.width,
        height   : src.height,
        zIndex   : nextZ++,
        props    : { ...src.props },
        rotation : src.rotation,
      });
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
  if (draggingGuide) {
    const cm = screenToCanvas(e.clientX, e.clientY);
    if (draggingGuide.axis === 'x') guidesX[draggingGuide.index] = cm.x;
    else guidesY[draggingGuide.index] = cm.y;
    renderGuides();
    return;
  }
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
      const item = items[i];
      ({ x: nx, y: ny } = snapToGuides(nx, ny, item.width, item.height));
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
  if (draggingGuide) draggingGuide = null;
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
  setZoom(zoom * factor, e.clientX - rect.left - RULER_SIZE, e.clientY - rect.top - RULER_SIZE);
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
  ({ x: nx, y: ny } = snapToGuides(nx, ny, nw, nh));

  items[idx].x = nx; items[idx].y = ny;
  items[idx].width = nw; items[idx].height = nh;
  positionItemEl(idx);
  fireSelectionChange();
}

function updateBandEl(x, y, w, h) {
  if (!bandEl) return;
  bandEl.style.left   = `${x * zoom + panX + RULER_SIZE}px`;
  bandEl.style.top    = `${y * zoom + panY + RULER_SIZE}px`;
  bandEl.style.width  = `${w * zoom}px`;
  bandEl.style.height = `${h * zoom}px`;
}

function highlightBandItems(x, y, w, h) {
  items.forEach((item, i) => {
    const hit = isItemInBounds(item, x, y, w, h);
    const el  = itemsWrap.querySelector(`.dlx-canvas-item[data-index="${i}"]`);
    if (el) el.classList.toggle('band-hover', hit);
  });
}

function finalizeBand(x, y, w, h, additive) {
  if (!additive) selectedIndices.clear();
  items.forEach((item, i) => {
    if (isItemInBounds(item, x, y, w, h)) selectedIndices.add(i);
  });
  itemsWrap.querySelectorAll('.band-hover').forEach(el => el.classList.remove('band-hover'));
  syncDOMSelection();
  fireSelectionChange();
}

/** Returns true if the item's AABB overlaps the given canvas-space rect */
function isItemInBounds(item, x, y, w, h) {
  return item.x < x + w && item.x + item.width  > x &&
         item.y < y + h && item.y + item.height > y;
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

function buildExportHtml(canvasItems, frame, options = {}) {
  const { fullDocument = true } = options;
  const palette = '--golden-bronze:#bba54c;--graphite:#2c2b25;--silver:#a7a6a2;--pine-teal:#1F4F3C;--sand-dune:#dcd6b9;';
  const activeFrame = frame || getDefaultExportFrame();
  const frameX = activeFrame?.x || 0;
  const frameY = activeFrame?.y || 0;
  const frameW = activeFrame?.width || CANVAS_W;
  const frameH = activeFrame?.height || CANVAS_H;
  const sorted = [...canvasItems]
    .filter(it => intersectsFrame(it, activeFrame))
    .sort((a, b) => a.zIndex - b.zIndex);
  const blocks  = sorted.map(({ component, x, y, width, height, props }) => {
    const safe     = component.id.replace(/[^a-z0-9_-]/gi, '_');
    const propsCss = Object.entries(props||{}).filter(([k])=>k.startsWith('--')).map(([k,v])=>`${k}:${v};`).join(' ');
    return `<!-- ${component.name} -->\n<style>\n  .dlx-item-${safe}{position:absolute;left:${x - frameX}px;top:${y - frameY}px;width:${width}px;height:${height}px;${propsCss}}\n  ${component.css.replace(/:host/g,`.dlx-item-${safe}`)}\n</style>\n<div class="dlx-item-${safe}">${component.html}</div>`;
  }).join('\n\n');
  const fragment = `<style>:root{${palette}}.dlx-canvas{position:relative;width:${frameW}px;height:${frameH}px;background:var(--sand-dune);font-family:system-ui,sans-serif;overflow:hidden;}</style><div class="dlx-canvas">\n${blocks}\n</div>`;
  if (!fullDocument) return fragment;
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Digital Luxe Export</title>\n</head>\n<body style="margin:0">${fragment}</body>\n</html>`;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function ensureDefaultFrame() {
  if (frames.length) return;
  const f = makeFrame('Desktop 1440×900', 80, 80, 1440, 900);
  frames = [f];
  activeFrameId = f.id;
}

function makeFrame(name, x, y, width, height) {
  return { id: `frame-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, x, y, width, height };
}

function renderFrames() {
  frames.forEach(frame => {
    const el = document.createElement('div');
    el.className = `dlx-canvas-frame${frame.id === activeFrameId ? ' active' : ''}`;
    el.style.left = `${frame.x}px`;
    el.style.top = `${frame.y}px`;
    el.style.width = `${frame.width}px`;
    el.style.height = `${frame.height}px`;
    el.innerHTML = `<span class="dlx-canvas-frame__label">${escHtml(frame.name)}</span>`;
    itemsWrap.appendChild(el);
  });
}

function renderFrameOptions() {
  if (!frameSelect) return;
  frameSelect.innerHTML = frames.map(f =>
    `<option value="${f.id}" ${f.id === activeFrameId ? 'selected' : ''}>${escHtml(f.name)}</option>`
  ).join('');
}

function startGuideDrag(axis, e) {
  e.preventDefault();
  e.stopPropagation();
  const cm = screenToCanvas(e.clientX, e.clientY);
  if (axis === 'x') {
    guidesX.push(cm.x);
    draggingGuide = { axis: 'x', index: guidesX.length - 1 };
  } else {
    guidesY.push(cm.y);
    draggingGuide = { axis: 'y', index: guidesY.length - 1 };
  }
  renderGuides();
}

function renderGuides() {
  if (!guidesEl) return;
  guidesEl.innerHTML = '';
  guidesX.forEach(x => {
    const el = document.createElement('div');
    el.className = 'dlx-guide-line dlx-guide-line--v';
    el.style.left = `${x * zoom + panX + RULER_SIZE}px`;
    guidesEl.appendChild(el);
  });
  guidesY.forEach(y => {
    const el = document.createElement('div');
    el.className = 'dlx-guide-line dlx-guide-line--h';
    el.style.top = `${y * zoom + panY + RULER_SIZE}px`;
    guidesEl.appendChild(el);
  });
}

function snapToGuides(x, y, width, height) {
  const next = { x, y };
  const edgesX = [x, x + width / 2, x + width];
  const edgesY = [y, y + height / 2, y + height];
  guidesX.forEach(gx => {
    edgesX.forEach(edge => {
      if (Math.abs(edge - gx) <= GUIDE_SNAP) next.x += gx - edge;
    });
  });
  guidesY.forEach(gy => {
    edgesY.forEach(edge => {
      if (Math.abs(edge - gy) <= GUIDE_SNAP) next.y += gy - edge;
    });
  });
  return next;
}

function getDefaultExportFrame() {
  return frames.find(f => f.id === activeFrameId) || frames[0] || null;
}

function intersectsFrame(item, frame) {
  if (!frame) return true;
  return item.x < frame.x + frame.width
    && item.x + item.width > frame.x
    && item.y < frame.y + frame.height
    && item.y + item.height > frame.y;
}

function collectDesignTokens(canvasItems) {
  const colors = new Set();
  const fontSizes = new Set();
  canvasItems.forEach(it => {
    Object.entries(it.props || {}).forEach(([k, v]) => {
      if (k.startsWith('--') && /^#|rgb|hsl/i.test(v)) colors.add(v);
    });
    const css = it.component?.css || '';
    for (const m of css.matchAll(/font-size:\s*([^;]+);/g)) fontSizes.add(m[1].trim());
  });
  return {
    generatedAt: new Date().toISOString(),
    palette: {
      primary: '#1F4F3C',
      accent: '#bba54c',
      dark: '#2c2b25',
      muted: '#a7a6a2',
      light: '#dcd6b9',
    },
    colorsUsed: [...colors],
    fontSizesUsed: [...fontSizes],
  };
}

function makePaletteFromBrand(hex) {
  const base = normalizeHex(hex);
  const [r, g, b] = [base.slice(1, 3), base.slice(3, 5), base.slice(5, 7)].map(v => parseInt(v, 16));
  return {
    primary: base,
    accent: rgbToHex(mix(r, g, b, 255, 215, 120, 0.45)),
    dark: rgbToHex(mix(r, g, b, 20, 24, 26, 0.72)),
    muted: rgbToHex(mix(r, g, b, 168, 172, 176, 0.5)),
    light: rgbToHex(mix(r, g, b, 244, 240, 225, 0.78)),
  };
}

function normalizeHex(hex) {
  const h = String(hex || '').trim();
  if (/^#[0-9a-f]{6}$/i.test(h)) return h;
  if (/^#[0-9a-f]{3}$/i.test(h)) return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  return '#1F4F3C';
}

function mix(r1, g1, b1, r2, g2, b2, t) {
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
}

function downloadFile(filename, data, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 20000);
}
