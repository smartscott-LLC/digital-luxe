/* ============================================================
   Digital Luxe — Shared Utilities
   ============================================================ */

// ── Confirm dialog (returns Promise<'ok'|'save'|'cancel'|...>) ─
export function dlxConfirm({ title, message, buttons }) {
  buttons = buttons || [
    { id: 'ok',     label: 'OK',     accent: true },
    { id: 'cancel', label: 'Cancel' },
  ];
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'dlx-confirm-overlay';

    const btnsHtml = buttons.map(b =>
      `<button class="dlx-confirm-btn${b.accent ? ' dlx-confirm-btn--accent' : ''}${b.danger ? ' dlx-confirm-btn--danger' : ''}" data-cid="${b.id}">${b.label}</button>`
    ).join('');

    overlay.innerHTML = `
      <div class="dlx-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlx-ct">
        <div class="dlx-confirm-title" id="dlx-ct">${title}</div>
        ${message ? `<div class="dlx-confirm-msg">${message}</div>` : ''}
        <div class="dlx-confirm-actions">${btnsHtml}</div>
      </div>`;

    document.body.appendChild(overlay);
    overlay.querySelector('[data-cid]')?.focus();

    const finish = id => {
      overlay.remove();
      document.removeEventListener('keydown', keyHandler);
      resolve(id);
    };

    overlay.addEventListener('click', e => {
      const btn = e.target.closest('[data-cid]');
      if (btn) { finish(btn.dataset.cid); return; }
      if (e.target === overlay) finish('cancel');
    });

    const keyHandler = e => {
      if (e.key === 'Escape') finish('cancel');
      if (e.key === 'Enter') {
        const f = overlay.querySelector('[data-cid]:focus');
        if (f) finish(f.dataset.cid);
      }
    };
    document.addEventListener('keydown', keyHandler);
  });
}

// ── Toast notification ────────────────────────────────────────
export function toast(msg, type = '') {
  const container = document.getElementById('toasts');
  if (!container) return;

  const el = document.createElement('div');
  el.className = `dlx-toast${type ? ' ' + type : ''}`;
  el.textContent = msg;
  container.appendChild(el);

  setTimeout(() => {
    el.classList.add('leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 2800);
}
