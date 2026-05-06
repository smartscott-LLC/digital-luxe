/* ============================================================
   Digital Luxe — Vault  (OPFS local-first storage)
   ============================================================ */
import { canvas } from './canvas.js';
import { toast } from './utils.js';

// ── Constants ─────────────────────────────────────────────────
const LS_KEY = 'dlx-vault-fallback';   // localStorage fallback key

// ── State ─────────────────────────────────────────────────────
let opfsRoot = null;
let available = false;

// ── DOM refs ──────────────────────────────────────────────────
const modal      = document.getElementById('vault-modal');
const closeBtn   = document.getElementById('vault-close');
const body       = document.getElementById('vault-body');
const storageBar = document.getElementById('vault-storage-fill');
const storageLabel = document.getElementById('vault-storage-label');

// ── Public API ────────────────────────────────────────────────
export const vault = {
  async init() {
    closeBtn.addEventListener('click', () => modal.setAttribute('hidden', ''));
    modal.querySelector('.dlx-modal__backdrop')
      .addEventListener('click', () => modal.setAttribute('hidden', ''));

    try {
      opfsRoot  = await navigator.storage.getDirectory();
      available = true;
    } catch {
      available = false;
    }
  },

  isAvailable() { return available; },

  async promptSave(state) {
    const name = prompt('Name this design:', `My Design ${new Date().toLocaleDateString()}`);
    if (!name) return;
    await this.saveDesign(name, state);
  },

  async saveDesign(name, state) {
    const data = JSON.stringify({
      name,
      savedAt: new Date().toISOString(),
      version: 1,
      ...state
    });
    const key = sanitizeKey(name);

    if (available) {
      const fh = await opfsRoot.getFileHandle(`${key}.json`, { create: true });
      const w  = await fh.createWritable();
      await w.write(data);
      await w.close();
    } else {
      // localStorage fallback
      const store = getLocalStore();
      store[key] = data;
      setLocalStore(store);
    }

    toast(`"${name}" saved to Vault ✦`, 'success');
    await this.renderList();
    modal.removeAttribute('hidden');
  },

  async listDesigns() {
    if (available) {
      const entries = [];
      for await (const [name, handle] of opfsRoot.entries()) {
        if (name.endsWith('.json')) {
          try {
            const file = await handle.getFile();
            const text = await file.text();
            const data = JSON.parse(text);
            entries.push({ key: name.replace('.json',''), data, size: file.size, modified: file.lastModified });
          } catch { /* skip corrupt */ }
        }
      }
      return entries.sort((a,b) => b.modified - a.modified);
    } else {
      const store = getLocalStore();
      return Object.entries(store).map(([key, raw]) => {
        try {
          const data = JSON.parse(raw);
          return { key, data, size: raw.length, modified: new Date(data.savedAt).getTime() };
        } catch { return null; }
      }).filter(Boolean).sort((a,b) => b.modified - a.modified);
    }
  },

  async deleteDesign(key) {
    if (available) {
      try { await opfsRoot.removeEntry(`${key}.json`); } catch { /* ignore */ }
    } else {
      const store = getLocalStore();
      delete store[key];
      setLocalStore(store);
    }
    await this.renderList();
    toast('Design deleted');
  },

  async loadDesign(key) {
    let data;
    if (available) {
      const fh   = await opfsRoot.getFileHandle(`${key}.json`);
      const file = await fh.getFile();
      data = JSON.parse(await file.text());
    } else {
      const store = getLocalStore();
      data = JSON.parse(store[key]);
    }
    canvas.loadState(data);
    modal.setAttribute('hidden', '');
    toast(`"${data.name}" loaded`);
  },

  async renameDesign(oldKey, newName) {
    let data;
    if (available) {
      const fh   = await opfsRoot.getFileHandle(`${oldKey}.json`);
      const file = await fh.getFile();
      data = JSON.parse(await file.text());
      await opfsRoot.removeEntry(`${oldKey}.json`);
    } else {
      const store = getLocalStore();
      data = JSON.parse(store[oldKey]);
      delete store[oldKey];
      setLocalStore(store);
    }
    data.name = newName;
    await this.saveDesign(newName, data);
  },

  async renderList() {
    const designs = await this.listDesigns();

    // Storage bar
    if (available && navigator.storage && navigator.storage.estimate) {
      try {
        const { usage = 0, quota = 1 } = await navigator.storage.estimate();
        const pct = Math.min(100, (usage / quota) * 100).toFixed(1);
        const usedMb = (usage / 1024 / 1024).toFixed(2);
        const quotaGb = (quota / 1024 / 1024 / 1024).toFixed(1);
        if (storageBar)   storageBar.style.width = `${pct}%`;
        if (storageLabel) storageLabel.textContent = `${usedMb} MB used of ${quotaGb} GB`;
      } catch { /* skip */ }
    }

    if (!designs.length) {
      body.innerHTML = `
        <div class="dlx-vault-empty">
          <div class="dlx-vault-empty__icon">🗄</div>
          <div class="dlx-vault-empty__title">Your Vault is empty</div>
          <p style="font-size:.8rem;color:var(--silver);margin-top:.4rem">
            Build a design on the canvas and click <strong>Save to Vault</strong>.
          </p>
        </div>
        ${storageSection()}`;
      return;
    }

    const listHtml = designs.map(({ key, data, size, modified }) => {
      const date = new Date(modified).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
      const kb   = (size / 1024).toFixed(1);
      const count = (data.items || []).length;
      return `
        <div class="dlx-vault-item" data-key="${escAttr(key)}">
          <div class="dlx-vault-item__icon">🗄</div>
          <div class="dlx-vault-item__info">
            <div class="dlx-vault-item__name" data-name-display>${escHtml(data.name)}</div>
            <div class="dlx-vault-item__meta">${count} component${count !== 1 ? 's' : ''} · ${date} · ${kb} KB</div>
          </div>
          <div class="dlx-vault-item__actions">
            <button class="dlx-btn-sm dlx-btn-sm--primary"   data-action="load">Open</button>
            <button class="dlx-btn-sm dlx-btn-sm--ghost"     data-action="rename">Rename</button>
            <button class="dlx-btn-sm dlx-btn-sm--danger"    data-action="delete">✕</button>
          </div>
        </div>`;
    }).join('');

    body.innerHTML = `
      <div class="dlx-vault-list">${listHtml}</div>
      ${storageSection()}`;

    // Wire action buttons
    body.querySelectorAll('.dlx-vault-item').forEach(item => {
      const key = item.dataset.key;
      item.querySelector('[data-action="load"]')  .addEventListener('click', () => vault.loadDesign(key));
      item.querySelector('[data-action="rename"]').addEventListener('click', () => startRename(item, key));
      item.querySelector('[data-action="delete"]').addEventListener('click', async () => {
        if (confirm('Delete this design?')) await vault.deleteDesign(key);
      });
    });
  }
};

// ── Rename flow ───────────────────────────────────────────────
function startRename(itemEl, key) {
  const nameEl = itemEl.querySelector('[data-name-display]');
  const current = nameEl.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'dlx-vault-item__name-input';
  input.value = current;
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = async () => {
    const newName = input.value.trim();
    if (newName && newName !== current) {
      await vault.renameDesign(key, newName);
    } else {
      vault.renderList();
    }
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { vault.renderList(); }
  });
}

// ── Storage section HTML ──────────────────────────────────────
function storageSection() {
  if (!available) {
    return `<div class="dlx-vault-storage">
      <p style="font-size:.78rem;color:var(--silver)">
        ⚠ OPFS unavailable in this browser. Designs are saved to localStorage (limited to ~5 MB).
        Use Chrome 86+ or Edge 86+ for full Vault support.
      </p>
    </div>`;
  }
  return `<div class="dlx-vault-storage">
    <div class="dlx-vault-storage__label">
      <span>Storage used</span>
      <span id="vault-storage-label">—</span>
    </div>
    <div class="dlx-vault-storage__bar">
      <div class="dlx-vault-storage__fill" id="vault-storage-fill" style="width:0%"></div>
    </div>
  </div>`;
}

// ── localStorage fallback helpers ────────────────────────────
function getLocalStore() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}
function setLocalStore(store) {
  localStorage.setItem(LS_KEY, JSON.stringify(store));
}

// ── Utilities ─────────────────────────────────────────────────
function sanitizeKey(name) {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 64) || 'design';
}
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
