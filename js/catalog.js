/* ============================================================
   Digital Luxe — Catalog (Drawers + Component Grid)
   ============================================================ */
import { DRAWERS, COMPONENTS, NUDGE_BASE_CSS } from './components.js';
import { canvas } from './canvas.js';

// ── State ─────────────────────────────────────────────────────
let activeDrawer = DRAWERS[0].id;

// ── DOM refs ──────────────────────────────────────────────────
const drawerNav   = document.getElementById('drawer-nav');
const gridTitle   = document.getElementById('grid-title');
const gridCount   = document.getElementById('grid-count');
const compGrid    = document.getElementById('component-grid-items');

// ── Public API ────────────────────────────────────────────────
export const catalog = {
  init() {
    renderDrawers();
    renderComponents(activeDrawer);
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
    return COMPONENTS.filter(c => c.category === drawerId);
  },

  getAllComponents() { return COMPONENTS; },

  createPreviewHost(component) {
    return buildShadowHost(component);
  }
};

// ── Render drawer list ────────────────────────────────────────
function renderDrawers() {
  drawerNav.innerHTML = `
    <div class="dlx-drawers__label">Drawers</div>
    ${DRAWERS.map(d => {
      const count = COMPONENTS.filter(c => c.category === d.id).length;
      return `
        <button class="dlx-drawer-item${d.id === activeDrawer ? ' active' : ''}"
                data-drawer="${d.id}"
                aria-pressed="${d.id === activeDrawer}"
                title="${d.label}">
          <span class="dlx-drawer-item__icon">${d.icon}</span>
          <span>${d.label}</span>
          <span class="dlx-drawer-item__count">${count}</span>
        </button>`;
    }).join('')}
    <div class="dlx-drawers__divider"></div>
    <div class="dlx-drawers__label">Vault</div>
    <button class="dlx-drawer-item" id="drawer-vault-link" title="Open your saved designs">
      <span class="dlx-drawer-item__icon">🗄</span>
      <span>My Designs</span>
    </button>
  `;

  // Wire drawer clicks
  drawerNav.querySelectorAll('.dlx-drawer-item[data-drawer]').forEach(btn => {
    btn.addEventListener('click', () => catalog.selectDrawer(btn.dataset.drawer));
  });

  // Wire vault shortcut
  document.getElementById('drawer-vault-link')?.addEventListener('click', () => {
    document.getElementById('vault-modal').removeAttribute('hidden');
    import('./vault.js').then(m => m.vault.renderList());
  });
}

// ── Render component grid ─────────────────────────────────────
function renderComponents(drawerId) {
  const items = COMPONENTS.filter(c => c.category === drawerId);
  const drawer = DRAWERS.find(d => d.id === drawerId);

  gridTitle.textContent = drawer?.label ?? drawerId;
  gridCount.textContent = `${items.length} components`;

  compGrid.innerHTML = '';

  items.forEach(component => {
    const card = document.createElement('div');
    card.className = 'dlx-comp-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Add ${component.name} to canvas`);

    // Preview area (shadow DOM for CSS isolation)
    const previewWrap = document.createElement('div');
    previewWrap.className = 'dlx-comp-card__preview';
    const host = buildShadowHost(component);
    // Scale down in preview
    host.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
    previewWrap.appendChild(host);

    // Metadata
    const meta = document.createElement('div');
    meta.className = 'dlx-comp-card__meta';
    meta.innerHTML = `
      <div class="dlx-comp-card__name">${escHtml(component.name)}</div>
      <div class="dlx-comp-card__desc">${escHtml(component.description)}</div>
      <div class="dlx-comp-card__actions">
        <button class="dlx-comp-card__add">+ Add to Canvas</button>
      </div>
    `;

    card.appendChild(previewWrap);
    card.appendChild(meta);
    compGrid.appendChild(card);

    // Click to add
    const addBtn = meta.querySelector('.dlx-comp-card__add');
    const addAction = () => canvas.addComponent(component);
    addBtn.addEventListener('click', e => { e.stopPropagation(); addAction(); });
    card.addEventListener('click', addAction);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') addAction(); });
  });
}

// ── Build shadow DOM host for a component ─────────────────────
function buildShadowHost(component) {
  const host = document.createElement('div');
  host.dataset.componentId = component.id;
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${NUDGE_BASE_CSS}\n${component.css}</style>${component.html}`;
  return host;
}

// ── Utility ───────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
