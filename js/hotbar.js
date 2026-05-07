/* ============================================================
   Digital Luxe — Hot Bar
   Up to 10 user-pinned actions, centered in the footer bar.
   Primary UX: click ＋ to open the action picker.
   Secondary: right-click any [data-action-id] button also works.
   Persisted to localStorage.
   ============================================================ */
import { canvas } from './canvas.js';

const STORAGE_KEY = 'dlx-hotbar-v1';
const MAX_SLOTS   = 10;

// ── Action registry ───────────────────────────────────────────
const ACTIONS = {
  // File
  'save':           { label: 'Save',      icon: '🗄', group: 'File'      },
  'export-html':    { label: 'Export',    icon: '↗',  group: 'File'      },
  'download-html':  { label: 'Download',  icon: '⬇',  group: 'File'      },
  'export-png':     { label: 'PNG',       icon: '🖼',  group: 'File'      },
  'export-tokens':  { label: 'Tokens',    icon: '🎨',  group: 'File'      },
  'preview':        { label: 'Preview',   icon: '▶',  group: 'File'      },
  'clear':          { label: 'Clear',     icon: '✕',  group: 'File'      },
  // Canvas
  'zoom-in':        { label: 'Zoom +',    icon: '+',  group: 'Canvas'    },
  'zoom-out':       { label: 'Zoom −',    icon: '−',  group: 'Canvas'    },
  'zoom-fit':       { label: 'Fit',       icon: '⊡',  group: 'Canvas'    },
  'align-left':     { label: 'Align ←',   icon: '⇐',  group: 'Canvas'    },
  'align-center':   { label: 'H Center',  icon: '⇔',  group: 'Canvas'    },
  'align-right':    { label: 'Align →',   icon: '⇒',  group: 'Canvas'    },
  'align-top':      { label: 'Align ↑',   icon: '⇑',  group: 'Canvas'    },
  'align-middle':   { label: 'V Middle',  icon: '⇕',  group: 'Canvas'    },
  'align-bottom':   { label: 'Align ↓',   icon: '⇓',  group: 'Canvas'    },
  'dist-h':         { label: 'Dist H',    icon: '↔',  group: 'Canvas'    },
  'dist-v':         { label: 'Dist V',    icon: '↕',  group: 'Canvas'    },
  'apply-theme':    { label: 'Theme',     icon: '◑',  group: 'Canvas'    },
  // Component
  'bring-forward':  { label: 'Forward',   icon: '↑',  group: 'Component' },
  'send-backward':  { label: 'Back',      icon: '↓',  group: 'Component' },
  'undo':           { label: 'Undo',      icon: '↩',  group: 'Component' },
  'redo':           { label: 'Redo',      icon: '↪',  group: 'Component' },
};

const GROUPS = ['File', 'Canvas', 'Component'];

// ── State ─────────────────────────────────────────────────────
let hotBarIds  = [];
let pickerOpen = false;
let pickerEl   = null;

// ── Init ──────────────────────────────────────────────────────
export function initHotBar() {
  hotBarIds = load();
  renderBar();

  // Right-click on any dock / header button also works
  document.addEventListener('contextmenu', e => {
    const btn = e.target.closest('[data-action-id]');
    if (!btn) return;
    e.preventDefault();
    const id    = btn.dataset.actionId;
    const inBar = hotBarIds.includes(id);
    if (inBar) { removeAction(id); }
    else if (hotBarIds.length < MAX_SLOTS) { addAction(id); }
  });

  document.addEventListener('click', e => {
    if (pickerEl && !pickerEl.contains(e.target) &&
        !e.target.closest('#hotbar-add-btn')) {
      closePicker();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePicker();
  });
}

// ── Persist ───────────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(hotBarIds)); }

function addAction(id) {
  if (hotBarIds.includes(id) || hotBarIds.length >= MAX_SLOTS) return;
  hotBarIds.push(id);
  save();
  renderBar();
  if (pickerEl) renderPickerContent();
}

function removeAction(id) {
  hotBarIds = hotBarIds.filter(x => x !== id);
  save();
  renderBar();
  if (pickerEl) renderPickerContent();
}

// ── Render hot bar ────────────────────────────────────────────
function renderBar() {
  const bar = document.getElementById('hotbar');
  if (!bar) return;

  const btnHtml = hotBarIds.map(id => {
    const a = ACTIONS[id];
    if (!a) return '';
    return `<button class="dlx-hotbar-btn" data-hotbar-action="${id}"
              title="${a.label}">${a.icon}</button>`;
  }).join('');

  const remaining = MAX_SLOTS - hotBarIds.length;
  const addTitle  = remaining === 0
    ? 'Hot Bar full'
    : `Add actions (${hotBarIds.length}/${MAX_SLOTS})`;

  bar.innerHTML = btnHtml +
    `<button class="dlx-hotbar-add${pickerOpen ? ' open' : ''}"
             id="hotbar-add-btn"
             title="${addTitle}"
             aria-label="Customize Hot Bar"
             aria-expanded="${pickerOpen}">＋</button>`;

  bar.querySelectorAll('[data-hotbar-action]').forEach(btn => {
    btn.addEventListener('click', () => runAction(btn.dataset.hotbarAction));
  });

  bar.querySelector('#hotbar-add-btn').addEventListener('click', togglePicker);
}

// ── Picker ────────────────────────────────────────────────────
function togglePicker() {
  if (pickerOpen) { closePicker(); return; }
  openPicker();
}

function openPicker() {
  pickerOpen = true;
  renderBar(); // re-render to update "+" active state

  pickerEl = document.createElement('div');
  pickerEl.className = 'dlx-hotbar-picker';
  pickerEl.setAttribute('role', 'dialog');
  pickerEl.setAttribute('aria-label', 'Customize Hot Bar');

  renderPickerContent();
  document.body.appendChild(pickerEl);
  positionPicker();
}

function closePicker() {
  pickerOpen = false;
  pickerEl?.remove();
  pickerEl = null;
  renderBar();
}

function positionPicker() {
  if (!pickerEl) return;
  const bar     = document.getElementById('hotbar-add-btn');
  if (!bar) return;
  const barRect = bar.getBoundingClientRect();
  const pRect   = pickerEl.getBoundingClientRect();
  let left = barRect.left + barRect.width / 2 - pRect.width / 2;
  let top  = barRect.top - pRect.height - 8;
  // Clamp
  left = Math.max(8, Math.min(left, window.innerWidth - pRect.width - 8));
  top  = Math.max(8, top);
  pickerEl.style.left = `${left}px`;
  pickerEl.style.top  = `${top}px`;
}

function renderPickerContent() {
  if (!pickerEl) return;
  const full = hotBarIds.length >= MAX_SLOTS;

  pickerEl.innerHTML = `
    <div class="dlx-hbp-head">
      <span>Hot Bar — ${hotBarIds.length} / ${MAX_SLOTS}</span>
      <button class="dlx-hbp-close" aria-label="Close">✕</button>
    </div>
    ${GROUPS.map(g => {
      const items = Object.entries(ACTIONS).filter(([,a]) => a.group === g);
      return `
        <div class="dlx-hbp-group">
          <div class="dlx-hbp-group-label">${g}</div>
          <div class="dlx-hbp-grid">
            ${items.map(([id, a]) => {
              const pinned = hotBarIds.includes(id);
              const disabled = !pinned && full;
              return `<button class="dlx-hbp-item${pinned ? ' pinned' : ''}${disabled ? ' disabled' : ''}"
                               data-pick="${id}"
                               title="${pinned ? 'Remove from Hot Bar' : disabled ? 'Hot Bar full' : 'Add to Hot Bar'}"
                               ${disabled ? 'disabled' : ''}>
                        <span class="dlx-hbp-icon">${a.icon}</span>
                        <span class="dlx-hbp-label">${a.label}</span>
                        ${pinned ? '<span class="dlx-hbp-pin">✓</span>' : ''}
                      </button>`;
            }).join('')}
          </div>
        </div>`;
    }).join('')}`;

  pickerEl.querySelector('.dlx-hbp-close').addEventListener('click', closePicker);

  pickerEl.querySelectorAll('[data-pick]:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.pick;
      if (hotBarIds.includes(id)) removeAction(id);
      else addAction(id);
    });
  });
}

// ── Run action ────────────────────────────────────────────────
function runAction(id) {
  switch (id) {
    case 'save':           canvas.save();                                            break;
    case 'export-html':    canvas.exportHtml();                                      break;
    case 'download-html':  canvas.downloadHtml();                                    break;
    case 'export-png':     canvas.exportPng();                                       break;
    case 'export-tokens':  canvas.exportTokens();                                    break;
    case 'preview':        canvas.previewLive();                                     break;
    case 'clear':          canvas.clear();                                           break;
    case 'zoom-in':        document.getElementById('zoom-in-btn')?.click();          break;
    case 'zoom-out':       document.getElementById('zoom-out-btn')?.click();         break;
    case 'zoom-fit':       canvas.fitToScreen();                                     break;
    case 'align-left':     canvas.alignSelected('left');                             break;
    case 'align-center':   canvas.alignSelected('center');                           break;
    case 'align-right':    canvas.alignSelected('right');                            break;
    case 'align-top':      canvas.alignSelected('top');                              break;
    case 'align-middle':   canvas.alignSelected('middle');                           break;
    case 'align-bottom':   canvas.alignSelected('bottom');                           break;
    case 'dist-h':         canvas.alignSelected('dist-h');                           break;
    case 'dist-v':         canvas.alignSelected('dist-v');                           break;
    case 'apply-theme':    document.getElementById('dock-apply-theme')?.click();     break;
    case 'bring-forward':  { const s = canvas.getSelectedIndices(); if (s.length) canvas.bringForward(s[0]);  break; }
    case 'send-backward':  { const s = canvas.getSelectedIndices(); if (s.length) canvas.sendBackward(s[0]); break; }
    case 'undo':           canvas.undo();                                            break;
    case 'redo':           canvas.redo();                                            break;
  }
}
