/* ============================================================
   Digital Luxe — Shared Utilities
   ============================================================ */

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
