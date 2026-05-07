/* ============================================================
   Digital Luxe — Explore Libraries
   Footer-left portal: curated + custom library URLs,
   last-visited staleness badges, and direct HTML-to-canvas import.
   ============================================================ */
import { canvas } from './canvas.js';
import { toast }  from './utils.js';

const STORAGE_KEY = 'dlx-explorer-v1';
const STALE_DAYS  = 7;

// ── Default library list ──────────────────────────────────────
const DEFAULT_LIBS = [
  { id: 'shadcn',     label: 'shadcn/ui',      url: 'https://ui.shadcn.com/docs/components',              desc: 'Beautifully designed Radix components' },
  { id: 'daisyui',    label: 'daisyUI',         url: 'https://daisyui.com/components/',                    desc: 'Tailwind CSS component library' },
  { id: 'flowbite',   label: 'Flowbite',        url: 'https://flowbite.com/docs/components/',              desc: 'Open-source Tailwind UI blocks' },
  { id: 'aceternity', label: 'Aceternity UI',   url: 'https://ui.aceternity.com/components',               desc: 'Animated modern components' },
  { id: 'magicui',    label: 'Magic UI',         url: 'https://magicui.design/docs/components',             desc: 'Animated component library' },
  { id: 'radix',      label: 'Radix UI',         url: 'https://www.radix-ui.com/primitives/docs',           desc: 'Accessible unstyled primitives' },
  { id: 'headlessui', label: 'Headless UI',      url: 'https://headlessui.com/',                            desc: 'Fully accessible unstyled components' },
  { id: 'chakra',     label: 'Chakra UI',        url: 'https://chakra-ui.com/docs/components',              desc: 'Accessible component system' },
  { id: 'tailwindui', label: 'Tailwind UI',      url: 'https://tailwindui.com/components',                  desc: 'Professional Tailwind components' },
  { id: 'uiverse',    label: 'UIverse',          url: 'https://uiverse.io/elements',                        desc: 'Community-built UI elements' },
];

const TAGLINES = [
  'Explore Different Possibilities',
  'Discover New Ideas',
  'Import Custom Libraries',
];

// ── State ─────────────────────────────────────────────────────
let state = { hidden: [], custom: [], visited: {} };
let popupEl   = null;
let popupOpen = false;

// Tagline typewriter state
let tagIdx   = 0;
let charIdx  = 0;
let typing   = true;
let typerTmr = null;

// ── Init ──────────────────────────────────────────────────────
export function initExplore() {
  state = load();
  renderTrigger();
  startTaglineCycle();

  document.addEventListener('click', e => {
    if (popupEl && !popupEl.contains(e.target) &&
        !e.target.closest('#explore-trigger')) {
      closePopup();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  });
}

// ── Persist ───────────────────────────────────────────────────
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (s) return { hidden: s.hidden || [], custom: s.custom || [], visited: s.visited || {} };
  } catch {}
  return { hidden: [], custom: [], visited: {} };
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

// ── Visible URL list ──────────────────────────────────────────
function visibleLibs() {
  const defaults = DEFAULT_LIBS.filter(d => !state.hidden.includes(d.id));
  return [...defaults, ...state.custom];
}

function isStale(lib) {
  const t = state.visited[lib.id];
  if (!t) return true;
  return (Date.now() - t) > STALE_DAYS * 86_400_000;
}

function markVisited(id) {
  state.visited[id] = Date.now();
  save();
}

// ── Trigger (footer left) ─────────────────────────────────────
function renderTrigger() {
  const wrap = document.getElementById('explore-trigger');
  if (!wrap) return;
  wrap.innerHTML = `
    <button class="dlx-explore-btn" aria-label="Explore Libraries" aria-expanded="false">
      <span class="dlx-explore-icon">✦</span>
      <span class="dlx-explore-word">Explore</span>
    </button>
    <span class="dlx-explore-tagline" id="explore-tagline" aria-live="polite"></span>`;

  wrap.querySelector('.dlx-explore-btn').addEventListener('click', togglePopup);
}

// ── Tagline typewriter ────────────────────────────────────────
function startTaglineCycle() {
  const el = document.getElementById('explore-tagline');
  if (!el) return;
  clearTimeout(typerTmr);
  tagIdx  = 0;
  charIdx = 0;
  typing  = true;
  tick(el);
}

function tick(el) {
  const text = TAGLINES[tagIdx];
  if (typing) {
    charIdx++;
    el.textContent = text.slice(0, charIdx);
    el.classList.remove('fading');
    if (charIdx >= text.length) {
      typing = false;
      typerTmr = setTimeout(() => tick(el), 2200);
    } else {
      typerTmr = setTimeout(() => tick(el), 48);
    }
  } else {
    el.classList.add('fading');
    typerTmr = setTimeout(() => {
      tagIdx  = (tagIdx + 1) % TAGLINES.length;
      charIdx = 0;
      typing  = true;
      tick(el);
    }, 320);
  }
}

// ── Popup ─────────────────────────────────────────────────────
function togglePopup() {
  if (popupOpen) { closePopup(); return; }
  openPopup();
}

function openPopup() {
  popupOpen = true;
  updateTriggerState(true);

  popupEl = document.createElement('div');
  popupEl.className = 'dlx-explorer-popup';
  popupEl.setAttribute('role', 'dialog');
  popupEl.setAttribute('aria-label', 'Explore Libraries');

  renderPopupContent();
  document.body.appendChild(popupEl);
  positionPopup();
}

function closePopup() {
  popupOpen = false;
  updateTriggerState(false);
  popupEl?.remove();
  popupEl = null;
}

function updateTriggerState(open) {
  const btn = document.querySelector('#explore-trigger .dlx-explore-btn');
  if (btn) {
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
}

function positionPopup() {
  if (!popupEl) return;
  const trigger = document.getElementById('explore-trigger');
  if (!trigger) return;
  const tr = trigger.getBoundingClientRect();
  const pr = popupEl.getBoundingClientRect();
  let left = tr.left;
  let top  = tr.top - pr.height - 8;
  left = Math.max(8, Math.min(left, window.innerWidth - pr.width - 8));
  top  = Math.max(8, top);
  popupEl.style.left = `${left}px`;
  popupEl.style.top  = `${top}px`;
}

function renderPopupContent() {
  if (!popupEl) return;
  const libs = visibleLibs();
  const staleCount = libs.filter(isStale).length;

  popupEl.innerHTML = `
    <div class="dlx-exp-head">
      <span class="dlx-exp-title">Explore Libraries</span>
      <div class="dlx-exp-head-actions">
        <button class="dlx-exp-refresh" title="Mark all as checked — revisit for fresh content">
          ↻${staleCount > 0 ? `<span class="dlx-exp-badge">${staleCount}</span>` : ''}
        </button>
        <button class="dlx-exp-close" aria-label="Close">✕</button>
      </div>
    </div>

    <div class="dlx-exp-list">
      ${libs.length === 0 ? `<p class="dlx-exp-empty">No libraries yet — add one below.</p>` : ''}
      ${libs.map(lib => {
        const stale  = isStale(lib);
        const custom = !!lib.custom;
        return `
        <div class="dlx-exp-item" data-lib-id="${lib.id}">
          <div class="dlx-exp-item-info">
            <span class="dlx-exp-item-label">
              ${lib.label}
              ${stale ? '<span class="dlx-exp-new" title="Worth checking — new content may be available">✦</span>' : ''}
            </span>
            <span class="dlx-exp-item-desc">${lib.desc}</span>
          </div>
          <div class="dlx-exp-item-actions">
            <button class="dlx-exp-open" data-lib-url="${lib.url}" data-lib-id="${lib.id}" title="Open in new tab">↗</button>
            <button class="dlx-exp-remove" data-lib-id="${lib.id}" data-lib-custom="${custom}" title="Remove">✕</button>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="dlx-exp-section">
      <div class="dlx-exp-section-label">Add Library URL</div>
      <div class="dlx-exp-add-row">
        <input class="dlx-exp-input" id="exp-add-label" type="text" placeholder="Label (e.g. My Components)" maxlength="40">
        <input class="dlx-exp-input" id="exp-add-url"   type="url"  placeholder="https://...">
        <button class="dlx-exp-add-btn">＋ Add</button>
      </div>
    </div>

    <div class="dlx-exp-section dlx-exp-section--import">
      <div class="dlx-exp-section-label">Import HTML → Canvas</div>
      <input class="dlx-exp-input" id="exp-import-name" type="text" placeholder="Component name" maxlength="60">
      <textarea class="dlx-exp-textarea" id="exp-import-html" rows="4"
                placeholder="Paste HTML from any library..."></textarea>
      <button class="dlx-exp-import-btn">Add to Canvas ↗</button>
    </div>`;

  // Close
  popupEl.querySelector('.dlx-exp-close')
    .addEventListener('click', closePopup);

  // Refresh — mark all visited
  popupEl.querySelector('.dlx-exp-refresh').addEventListener('click', () => {
    visibleLibs().forEach(l => markVisited(l.id));
    renderPopupContent();
    positionPopup();
    toast('All libraries marked as checked ✦', 'success');
  });

  // Open in tab
  popupEl.querySelectorAll('.dlx-exp-open').forEach(btn => {
    btn.addEventListener('click', () => {
      const { libUrl, libId } = btn.dataset;
      window.open(libUrl, '_blank', 'noopener,noreferrer');
      markVisited(libId);
      renderPopupContent();
      positionPopup();
    });
  });

  // Remove
  popupEl.querySelectorAll('.dlx-exp-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const { libId, libCustom } = btn.dataset;
      if (libCustom === 'true') {
        state.custom = state.custom.filter(c => c.id !== libId);
      } else {
        if (!state.hidden.includes(libId)) state.hidden.push(libId);
      }
      save();
      renderPopupContent();
      positionPopup();
    });
  });

  // Add custom URL
  popupEl.querySelector('.dlx-exp-add-btn').addEventListener('click', () => {
    const labelEl = popupEl.querySelector('#exp-add-label');
    const urlEl   = popupEl.querySelector('#exp-add-url');
    const label   = labelEl.value.trim();
    const url     = urlEl.value.trim();
    if (!label || !url) { toast('Enter both a label and a URL', 'error'); return; }
    try { new URL(url); } catch { toast('Enter a valid URL', 'error'); return; }
    state.custom.push({ id: `custom-${Date.now()}`, label, url, desc: 'Custom library', custom: true });
    save();
    labelEl.value = '';
    urlEl.value   = '';
    renderPopupContent();
    positionPopup();
    toast(`${label} added ✦`, 'success');
  });

  // Import HTML to canvas
  popupEl.querySelector('.dlx-exp-import-btn').addEventListener('click', () => {
    const name = popupEl.querySelector('#exp-import-name').value.trim();
    const html = popupEl.querySelector('#exp-import-html').value.trim();
    if (!name) { toast('Give the component a name', 'error'); return; }
    if (!html) { toast('Paste some HTML to import', 'error'); return; }
    canvas.addComponent({
      id           : `import-${Date.now()}`,
      name,
      category     : 'Imported',
      group        : 'Custom',
      html,
      defaultWidth : 320,
      defaultHeight: 180,
    });
    popupEl.querySelector('#exp-import-name').value = '';
    popupEl.querySelector('#exp-import-html').value = '';
    closePopup();
  });
}
