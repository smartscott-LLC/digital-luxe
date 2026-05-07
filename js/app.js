/* ============================================================
   Digital Luxe — App.js  (boot, orchestration, keyboard shortcuts)
   Part of the ToolSmart suite by smartscott-LLC
   ============================================================ */
import { catalog }       from './catalog.js';
import { canvas }        from './canvas.js';
import { nudge }         from './nudge.js';
import { smartbar }      from './smartbar.js';
import { vault }         from './vault.js';
import { toast, dlxConfirm } from './utils.js';
import { initInspector } from './inspector.js';
import { initDock }      from './dock.js';
import { initHotBar }    from './hotbar.js';

// ── Boot ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* ignore */ });
  }

  // Init all modules
  await catalog.init();   // async — loads community registry
  canvas.init();
  smartbar.init();
  initInspector();
  initDock();             // builds dock DOM first (nudge-toggles container)
  nudge.init();           // then nudge renders into the dock's #nudge-toggles
  initHotBar();           // hot bar (reads localStorage, wires right-click)
  await vault.init();

  // PWA install prompt
  initInstallPrompt();

  // Keyboard shortcuts
  document.addEventListener('keydown', onGlobalKeyDown);

  // Pane divider drag
  initDividerDrag();

  // Export modal close
  document.getElementById('export-close')
    ?.addEventListener('click', () =>
      document.getElementById('export-modal').setAttribute('hidden', ''));
  document.getElementById('export-modal')
    ?.querySelector('.dlx-modal__backdrop')
    ?.addEventListener('click', () =>
      document.getElementById('export-modal').setAttribute('hidden', ''));

  // Copy export button
  document.getElementById('export-copy-btn')
    ?.addEventListener('click', copyExportCode);

  // Vault open button in header
  document.getElementById('vault-header-btn')
    ?.addEventListener('click', () => {
      document.getElementById('vault-modal').removeAttribute('hidden');
      vault.renderList();
    });

  // Undo / Redo buttons
  document.getElementById('undo-btn')?.addEventListener('click', () => canvas.undo());
  document.getElementById('redo-btn')?.addEventListener('click', () => canvas.redo());

  // What's New modal
  const whatsNewModal = document.getElementById('whats-new-modal');
  document.getElementById('whats-new-btn')?.addEventListener('click', () =>
    whatsNewModal?.removeAttribute('hidden'));
  document.getElementById('whats-new-close')?.addEventListener('click', () =>
    whatsNewModal?.setAttribute('hidden', ''));
  document.getElementById('whats-new-close-btn')?.addEventListener('click', () =>
    whatsNewModal?.setAttribute('hidden', ''));
  whatsNewModal?.querySelector('.dlx-modal__backdrop')?.addEventListener('click', () =>
    whatsNewModal?.setAttribute('hidden', ''));

  // Safety harness: brand logo navigation
  document.getElementById('brand-logo-link')?.addEventListener('click', async e => {
    e.preventDefault();
    const choice = await dlxConfirm({
      title: 'Leave Digital Luxe?',
      message: 'Any unsaved canvas work will be lost.',
      buttons: [
        { id: 'save-leave', label: '🗄 Save & Leave', accent: true },
        { id: 'leave',      label: 'Leave Anyway',    danger: true  },
        { id: 'cancel',     label: 'Stay Here' },
      ],
    });
    if (choice === 'cancel') return;
    if (choice === 'save-leave') canvas.save();
    window.location.href = '/';
  });

  console.log('\uD83D\uDC8E Digital Luxe loaded — ToolSmart by smartscott-LLC');
});

// ── Global keyboard shortcuts ─────────────────────────────────
function onGlobalKeyDown(e) {
  const meta = e.ctrlKey || e.metaKey;

  // ⌘K / Ctrl+K — SmartBar
  if (meta && e.key === 'k') { e.preventDefault(); smartbar.open(); return; }

  // ⌘S / Ctrl+S — Save
  if (meta && e.key === 's') { e.preventDefault(); canvas.save(); return; }

  // ⌘E / Ctrl+E — Export
  if (meta && e.key === 'e') { e.preventDefault(); canvas.exportHtml(); return; }

  // ⌘N / Ctrl+N — New canvas
  if (meta && e.key === 'n') { e.preventDefault(); canvas.clear(); return; }

  // Escape — close overlays
  if (e.key === 'Escape') {
    document.getElementById('vault-modal')     .setAttribute('hidden', '');
    document.getElementById('export-modal')    .setAttribute('hidden', '');
    document.getElementById('whats-new-modal') ?.setAttribute('hidden', '');
    // SmartBar handles its own Escape
  }
}

// ── PWA install prompt ────────────────────────────────────────
let deferredInstall = null;

function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstall = e;
    const btn = document.getElementById('install-btn');
    if (btn) btn.classList.add('visible');
  });

  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    const { outcome } = await deferredInstall.userChoice;
    if (outcome === 'accepted') {
      document.getElementById('install-btn').classList.remove('visible');
      deferredInstall = null;
    }
  });

  window.addEventListener('appinstalled', () => {
    document.getElementById('install-btn')?.classList.remove('visible');
    deferredInstall = null;
    toast('App installed! You can now use Digital Luxe offline ✦', 'success');
  });
}

// ── Pane divider drag (resizes catalog / canvas panes) ────────
function initDividerDrag() {
  const divider = document.getElementById('pane-divider');
  const catalogPane = document.querySelector('.dlx-catalog');
  if (!divider || !catalogPane) return;

  let dragging = false;
  let startX = 0;
  let startW = 0;

  divider.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = catalogPane.offsetWidth;
    divider.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const newW = Math.max(280, Math.min(startW + dx, window.innerWidth * 0.7));
    catalogPane.style.width = `${newW}px`;
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  // Keyboard nudge on divider when focused
  divider.setAttribute('tabindex', '0');
  divider.setAttribute('role', 'separator');
  divider.setAttribute('aria-label', 'Resize catalog pane');
  divider.addEventListener('keydown', e => {
    const step = e.shiftKey ? 80 : 20;
    const cur = catalogPane.offsetWidth;
    if (e.key === 'ArrowLeft')  catalogPane.style.width = `${Math.max(280, cur - step)}px`;
    if (e.key === 'ArrowRight') catalogPane.style.width = `${Math.min(cur + step, window.innerWidth * 0.7)}px`;
  });
}

// ── Copy export code ──────────────────────────────────────────
async function copyExportCode() {
  const code = document.getElementById('export-code')?.textContent;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    toast('HTML copied to clipboard ✦', 'success');
  } catch {
    toast('Could not copy — select manually', 'error');
  }
}
