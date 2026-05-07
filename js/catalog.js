/* ============================================================
   Digital Luxe — Catalog (Drawers + Component Grid)
   Supports built-in components, Community registry, and
   user-imported JSON components via drag-drop / localStorage.
   ============================================================ */
import { DRAWERS, COMPONENTS, NUDGE_BASE_CSS } from './components.js';
import { canvas } from './canvas.js';
import { toast } from './utils.js';

// ── Community drawer definition ───────────────────────────────
const COMMUNITY_DRAWER = { id: 'community', label: 'Community', icon: '\uD83C\uDF10' };

// ── State ─────────────────────────────────────────────────────
let activeDrawer       = DRAWERS[0].id;
let communityComponents = [];   // loaded from registry-cache.json + localStorage
let registryLoaded      = false;

// ── DOM refs ──────────────────────────────────────────────────
const drawerNav = document.getElementById('drawer-nav');
const gridTitle = document.getElementById('grid-title');
const gridCount = document.getElementById('grid-count');
const compGrid  = document.getElementById('component-grid-items');

// ── Public API ────────────────────────────────────────────────
export const catalog = {
  async init() {
    await loadCommunityComponents();
    renderDrawers();
    renderComponents(activeDrawer);
    initDropImport();
  },

  getActiveDrawer() { return activeDrawer; },

  selectDrawer(id) {
    activeDrawer = id;
    document.querySelectorAll('.dlx-drawer-item').forEach(el => {
      el.classList.toggle('active', el.dataset.drawer === id);
    });
    renderComponents(id);
  },

  getComponents(drawerId) {
    if (drawerId === 'community') return communityComponents;
    return COMPONENTS.filter(c => c.category === drawerId);
  },

  getAllComponents() { return [...COMPONENTS, ...communityComponents]; },

  /** Import a component object and persist to localStorage */
  importComponent(component) {
    const stored = getStoredCustom();
    const exists = stored.findIndex(c => c.id === component.id);
    if (exists !== -1) stored[exists] = component;
    else stored.push(component);
    setStoredCustom(stored);
    // Reload community list
    loadCommunityComponents().then(() => {
      if (activeDrawer === 'community') renderComponents('community');
      renderDrawers(); // update count
    });
    toast(`"${component.name}" added to Community \u2746`, 'success');
  },

  createPreviewHost(component) { return buildShadowHost(component); }
};

// ── Load community components (registry-cache + localStorage) ─
async function loadCommunityComponents() {
  const stored = getStoredCustom();
  let registry = [];

  if (!registryLoaded) {
    try {
      const res  = await fetch('./data/registry-cache.json');
      const data = await res.json();
      registry   = data.components || [];
      registryLoaded = true;
    } catch {
      /* offline — only use stored */ 
    }
  }

  // Merge: stored overrides registry by id
  const byId = new Map(registry.map(c => [c.id, c]));
  stored.forEach(c => byId.set(c.id, c));
  communityComponents = [...byId.values()];
}

// ── Render drawer sidebar ─────────────────────────────────────
function renderDrawers() {
  const allDrawers = [...DRAWERS, COMMUNITY_DRAWER];
  drawerNav.innerHTML = `
    <div class="dlx-drawers__label">Components</div>
    ${allDrawers.map(d => {
      const count = d.id === 'community'
        ? communityComponents.length
        : COMPONENTS.filter(c => c.category === d.id).length;
      const isActive = d.id === activeDrawer;
      return `
        <button class="dlx-drawer-item${isActive ? ' active' : ''}"
                data-drawer="${d.id}"
                aria-pressed="${isActive}"
                title="${d.label}">
          <span class="dlx-drawer-item__icon">${d.icon}</span>
          <span>${d.label}</span>
          <span class="dlx-drawer-item__count">${count}</span>
        </button>`;
    }).join('')}

    <div class="dlx-drawers__divider"></div>
    <div class="dlx-drawers__label">Workspace</div>

    <button class="dlx-drawer-item" id="drawer-vault-link" title="Open your saved designs">
      <span class="dlx-drawer-item__icon">\uD83D\uDDC4</span>
      <span>My Designs</span>
    </button>

    <button class="dlx-drawer-item" id="drawer-import-link" title="Import component from JSON file">
      <span class="dlx-drawer-item__icon">\u2B06</span>
      <span>Import JSON</span>
    </button>
  `;

  drawerNav.querySelectorAll('.dlx-drawer-item[data-drawer]').forEach(btn => {
    btn.addEventListener('click', () => catalog.selectDrawer(btn.dataset.drawer));
  });

  document.getElementById('drawer-vault-link')?.addEventListener('click', () => {
    document.getElementById('vault-modal').removeAttribute('hidden');
    import('./vault.js').then(m => m.vault.renderList());
  });

  document.getElementById('drawer-import-link')?.addEventListener('click', () => {
    triggerJsonFileImport();
  });
}

// ── Render component grid ─────────────────────────────────────
function renderComponents(drawerId) {
  const isCommunity = drawerId === 'community';
  const items  = isCommunity
    ? communityComponents
    : COMPONENTS.filter(c => c.category === drawerId);

  const drawer = [...DRAWERS, COMMUNITY_DRAWER].find(d => d.id === drawerId);
  gridTitle.textContent = drawer?.label ?? drawerId;

  if (isCommunity && !items.length) {
    gridCount.textContent = '0 components';
    compGrid.innerHTML = `
      <div class="dlx-community-empty">
        <div style="font-size:2rem;opacity:.3">\uD83C\uDF10</div>
        <p>No community components yet.</p>
        <p style="font-size:.78rem;color:var(--silver);margin-top:4px">
          Drag-and-drop a <strong>.json</strong> registry file here,<br>
          or run <code>node scripts/crawl-registry.js</code> to fetch from the web.
        </p>
      </div>`;
    return;
  }

  gridCount.textContent = `${items.length} component${items.length !== 1 ? 's' : ''}`;
  compGrid.innerHTML = '';
  items.forEach(component => renderCard(component));
}

function renderCard(component) {
  const card = document.createElement('div');
  card.className = 'dlx-comp-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Add ${component.name} to canvas`);

  const previewWrap = document.createElement('div');
  previewWrap.className = 'dlx-comp-card__preview';
  const host = buildShadowHost(component);
  host.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
  previewWrap.appendChild(host);

  const isCommunity = component.category === 'community';
  const meta = document.createElement('div');
  meta.className = 'dlx-comp-card__meta';
  meta.innerHTML = `
    <div class="dlx-comp-card__name">${escHtml(component.name)}</div>
    <div class="dlx-comp-card__desc">${escHtml(component.description)}</div>
    <div class="dlx-comp-card__actions">
      <button class="dlx-comp-card__add">+ Add to Canvas</button>
      ${isCommunity ? `<button class="dlx-comp-card__remove" title="Remove from library">\u2715</button>` : ''}
    </div>
  `;

  card.appendChild(previewWrap);
  card.appendChild(meta);
  compGrid.appendChild(card);

  const addAction = () => canvas.addComponent(component);
  meta.querySelector('.dlx-comp-card__add').addEventListener('click', e => { e.stopPropagation(); addAction(); });
  card.addEventListener('click', addAction);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') addAction(); });

  if (isCommunity) {
    meta.querySelector('.dlx-comp-card__remove')?.addEventListener('click', e => {
      e.stopPropagation();
      removeCustomComponent(component.id);
    });
  }
}

// ── Shadow DOM host (catalog preview) ─────────────────────────
function buildShadowHost(component) {
  const host = document.createElement('div');
  host.dataset.componentId = component.id;
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${NUDGE_BASE_CSS}\n${component.css}</style>${component.html}`;
  return host;
}

// ── Drag-and-drop JSON import ─────────────────────────────────
function initDropImport() {
  const dropTarget = document.querySelector('.dlx-component-grid');
  if (!dropTarget) return;

  dropTarget.addEventListener('dragover', e => {
    const hasFiles = [...(e.dataTransfer?.items || [])].some(it => it.kind === 'file');
    if (!hasFiles) return;
    e.preventDefault();
    dropTarget.classList.add('drag-over');
  });

  dropTarget.addEventListener('dragleave', () => dropTarget.classList.remove('drag-over'));

  dropTarget.addEventListener('drop', e => {
    e.preventDefault();
    dropTarget.classList.remove('drag-over');
    const files = [...(e.dataTransfer?.files || [])].filter(f => f.name.endsWith('.json'));
    if (!files.length) { toast('Drop a .json registry file', 'warn'); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          handleImportedJson(data, file.name);
        } catch {
          toast(`Invalid JSON: ${file.name}`, 'error');
        }
      };
      reader.readAsText(file);
    });
  });
}

function triggerJsonFileImport() {
  const input = document.createElement('input');
  input.type   = 'file';
  input.accept = '.json';
  input.multiple = true;
  input.addEventListener('change', () => {
    [...input.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        try { handleImportedJson(JSON.parse(ev.target.result), file.name); }
        catch { toast(`Invalid JSON: ${file.name}`, 'error'); }
      };
      reader.readAsText(file);
    });
  });
  input.click();
}

function handleImportedJson(data, filename) {
  // Support both single-component and registry list formats
  const components = [];

  if (Array.isArray(data)) {
    data.forEach(c => { if (c.id && c.html) components.push(normalizeImport(c)); });
  } else if (data.components && Array.isArray(data.components)) {
    data.components.forEach(c => { if (c.id && c.html) components.push(normalizeImport(c)); });
  } else if (data.id && data.html) {
    components.push(normalizeImport(data));
  }

  if (!components.length) {
    toast(`No importable components found in ${filename}`, 'warn');
    return;
  }

  components.forEach(c => catalog.importComponent(c));
  catalog.selectDrawer('community');
}

function normalizeImport(raw) {
  return {
    id         : raw.id || `import-${Date.now()}`,
    category   : 'community',
    name       : raw.name || raw.id,
    description: raw.description || 'Imported component',
    tags       : raw.tags || ['community'],
    source     : raw.source || 'imported',
    html       : raw.html || '',
    css        : raw.css  || ':host{display:block;padding:1rem;}',
  };
}

// ── Remove a custom component ─────────────────────────────────
function removeCustomComponent(id) {
  const stored = getStoredCustom().filter(c => c.id !== id);
  setStoredCustom(stored);
  communityComponents = communityComponents.filter(c => c.id !== id);
  renderComponents('community');
  renderDrawers();
  toast('Removed from Community');
}

// ── localStorage helpers ──────────────────────────────────────
function getStoredCustom() {
  try { return JSON.parse(localStorage.getItem('dlx-custom-components') || '[]'); }
  catch { return []; }
}

function setStoredCustom(arr) {
  localStorage.setItem('dlx-custom-components', JSON.stringify(arr));
}

// ── Utility ───────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
