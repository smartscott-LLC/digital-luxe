/* ============================================================
   Digital Luxe — SmartBar Command Palette (⌘K)
   ============================================================ */
import { COMPONENTS, DRAWERS } from './components.js';
import { catalog } from './catalog.js';
import { canvas } from './canvas.js';

// ── DOM refs ──────────────────────────────────────────────────
const overlay  = document.getElementById('smartbar-overlay');
const input    = document.getElementById('smartbar-input');
const results  = document.getElementById('smartbar-results');
const closeBtn = document.getElementById('smartbar-close');

// ── Built-in actions ──────────────────────────────────────────
const ACTIONS = [
  { type:'action', name:'New Canvas',        icon:'✦',  sub:'Clear and start fresh',                  action: () => canvas.clear() },
  { type:'action', name:'Save to Vault',     icon:'🗄', sub:'Save current design',                    action: () => canvas.save() },
  { type:'action', name:'Open Vault',        icon:'⬡',  sub:'Browse your saved designs',               action: openVault },
  { type:'action', name:'Export HTML',       icon:'↗',  sub:'Download as standalone HTML',             action: () => canvas.exportHtml() },
  { type:'action', name:'Fit to Screen',     icon:'⊡',  sub:'Zoom canvas to fit all items',            action: () => import('./canvas.js').then(m => m.canvas.fitToScreen?.()) },
  { type:'action', name:'Clear Nudges',      icon:'○',  sub:'Remove all active nudge effects',         action: () => import('./nudge.js').then(m => m.nudge.clearAll()) },
  { type:'action', name:'Browse Community',  icon:'🌐', sub:'Switch to Community registry drawer',     action: () => switchDrawer('community') },
  { type:'action', name:'Browse Buttons',    icon:'⬡',  sub:'Switch to Buttons drawer',                action: () => switchDrawer('buttons') },
  { type:'action', name:'Browse Cards',      icon:'🃏', sub:'Switch to Cards drawer',                  action: () => switchDrawer('cards') },
  { type:'action', name:'Browse Forms',      icon:'✏',  sub:'Switch to Forms drawer',                  action: () => switchDrawer('forms') },
  { type:'action', name:'Browse Navigation', icon:'🧭', sub:'Switch to Navigation drawer',             action: () => switchDrawer('navigation') },
  { type:'action', name:'Browse Dashboards', icon:'📊', sub:'Switch to Dashboards drawer',             action: () => switchDrawer('dashboards') },
  { type:'action', name:'Import from URL',   icon:'⇩',  sub:'Paste a registry JSON URL to import',    action: importFromUrl },
];

// ── State ─────────────────────────────────────────────────────
let focusedIndex = -1;
let visibleItems = [];

// ── Public API ────────────────────────────────────────────────
export const smartbar = {
  init() {
    document.getElementById('smartbar-trigger')
      ?.addEventListener('click', () => smartbar.open());
    closeBtn.addEventListener('click', smartbar.close);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) smartbar.close();
    });
    input.addEventListener('input', () => search(input.value.trim()));
    input.addEventListener('keydown', onKeyDown);
  },

  open() {
    overlay.removeAttribute('hidden');
    input.value = '';
    input.focus();
    search('');
  },

  close() {
    overlay.setAttribute('hidden', '');
    input.value = '';
    focusedIndex = -1;
  },
};

// ── Search / filter ───────────────────────────────────────────
function search(query) {
  focusedIndex = -1;
  const q = query.toLowerCase();
  results.innerHTML = '';
  visibleItems = [];

  if (!q) {
    // Default: recent sections
    renderSection('Quick Actions', ACTIONS.slice(0, 5));
    renderSection('Component Drawers', DRAWERS.map(d => ({
      type: 'drawer',
      name: d.label,
      icon: d.icon,
      sub: `Browse ${COMPONENTS.filter(c => c.category === d.id).length} components`,
      action: () => switchDrawer(d.id)
    })));
  } else {
    const matchedComponents = COMPONENTS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.includes(q))
    ).slice(0, 8);

    const matchedActions = ACTIONS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.sub.toLowerCase().includes(q)
    );

    if (matchedComponents.length) {
      renderSection('Components', matchedComponents.map(c => ({
        type: 'component',
        name: c.name,
        icon: DRAWERS.find(d => d.id === c.category)?.icon ?? '⬡',
        sub: c.description,
        tag: c.category,
        action: () => {
          canvas.addComponent(c);
          smartbar.close();
        }
      })));
    }

    if (matchedActions.length) {
      renderSection('Actions', matchedActions);
    }

    if (!matchedComponents.length && !matchedActions.length) {
      results.innerHTML = `
        <div style="padding:1.5rem;text-align:center;color:var(--silver);font-size:.85rem;">
          No results for "<strong>${escHtml(query)}</strong>"
        </div>`;
    }
  }
}

// ── Render a section heading + items ─────────────────────────
function renderSection(label, items) {
  if (!items.length) return;

  const section = document.createElement('div');
  section.innerHTML = `<div class="dlx-smartbar__section-label">${escHtml(label)}</div>`;
  results.appendChild(section);

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'dlx-smartbar__item';
    el.setAttribute('role', 'option');
    el.setAttribute('tabindex', '-1');
    el.innerHTML = `
      <div class="dlx-smartbar__item__icon">${item.icon}</div>
      <div class="dlx-smartbar__item__text">
        <div class="dlx-smartbar__item__name">${escHtml(item.name)}</div>
        ${item.sub ? `<div class="dlx-smartbar__item__sub">${escHtml(item.sub)}</div>` : ''}
      </div>
      ${item.tag ? `<span class="dlx-smartbar__item__tag">${escHtml(item.tag)}</span>` : ''}
      ${item.type === 'action' ? `<span class="dlx-smartbar__item__tag action">Action</span>` : ''}
    `;

    const execIdx = visibleItems.length;
    visibleItems.push({ el, item });

    el.addEventListener('click', () => execItem(execIdx));
    el.addEventListener('mouseenter', () => setFocus(execIdx));

    results.appendChild(el);
  });
}

// ── Execute a result item ─────────────────────────────────────
function execItem(idx) {
  const entry = visibleItems[idx];
  if (!entry) return;
  entry.item.action?.();
  smartbar.close();
}

// ── Keyboard navigation ───────────────────────────────────────
function onKeyDown(e) {
  if (e.key === 'Escape') { smartbar.close(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); setFocus(focusedIndex + 1); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); setFocus(focusedIndex - 1); }
  if (e.key === 'Enter')     { e.preventDefault(); execItem(focusedIndex); }
}

function setFocus(idx) {
  const clamped = Math.max(0, Math.min(idx, visibleItems.length - 1));
  if (visibleItems[focusedIndex]) visibleItems[focusedIndex].el.classList.remove('focused');
  focusedIndex = clamped;
  if (visibleItems[focusedIndex]) {
    visibleItems[focusedIndex].el.classList.add('focused');
    visibleItems[focusedIndex].el.scrollIntoView({ block: 'nearest' });
  }
}

// ── Helpers ───────────────────────────────────────────────────
function switchDrawer(id) {
  catalog.selectDrawer(id);
  smartbar.close();
}

function openVault() {
  document.getElementById('vault-modal').removeAttribute('hidden');
  import('./vault.js').then(m => m.vault.renderList());
  smartbar.close();
}

async function importFromUrl() {
  smartbar.close();
  const url = prompt('Paste a registry JSON URL:\n(e.g. https://example.com/registry.json)');
  if (!url?.startsWith('http')) return;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    import('./catalog.js').then(({ catalog }) => {
      // Delegate to catalog's import handler
      const comps = Array.isArray(data)
        ? data
        : (data.components || (data.id ? [data] : []));
      if (!comps.length) { import('./utils.js').then(m => m.toast('No components found at that URL', 'warn')); return; }
      comps.forEach(c => {
        if (c.id && c.html) catalog.importComponent({
          id: c.id || `import-${Date.now()}`,
          category: 'community',
          name: c.name || c.id,
          description: c.description || 'Imported',
          tags: c.tags || ['community'],
          source: url,
          html: c.html,
          css: c.css || ':host{display:block;padding:1rem;}',
        });
      });
      catalog.selectDrawer('community');
    });
  } catch (e) {
    import('./utils.js').then(m => m.toast(`Import failed: ${e.message}`, 'error'));
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
