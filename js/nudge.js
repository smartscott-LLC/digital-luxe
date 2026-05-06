/* ============================================================
   Digital Luxe — Nudge Toggle Engine
   ============================================================ */
import { canvas } from './canvas.js';

// ── Nudge definitions ─────────────────────────────────────────
const NUDGES = [
  { id: 'nudge-grow',   label: 'Grow on Hover', icon: '⤢', title: 'Scale up on mouse hover' },
  { id: 'nudge-shadow', label: 'Soft Shadow',   icon: '◉', title: 'Add a warm glow shadow' },
  { id: 'nudge-round',  label: 'Round Corners', icon: '◯', title: 'Maximise border radii' },
  { id: 'nudge-pulse',  label: 'Breathing Pulse', icon: '❂', title: 'Gentle breathing animation' },
];

// ── Active nudges set ─────────────────────────────────────────
const activeNudges = new Set();

// ── DOM ref ───────────────────────────────────────────────────
const togglesContainer = document.getElementById('nudge-toggles');

// ── Public API ────────────────────────────────────────────────
export const nudge = {
  init() {
    renderToggles();
  },

  getActiveNudges() { return [...activeNudges]; },

  isActive(id) { return activeNudges.has(id); },

  setNudge(id, on) {
    if (on) activeNudges.add(id); else activeNudges.delete(id);
    updateToggleUI(id, on);
    canvas.applyNudges(activeNudges);
  },

  toggle(id) {
    this.setNudge(id, !activeNudges.has(id));
  },

  clearAll() {
    activeNudges.clear();
    NUDGES.forEach(n => updateToggleUI(n.id, false));
    canvas.applyNudges(activeNudges);
  }
};

// ── Render toggle pills ───────────────────────────────────────
function renderToggles() {
  togglesContainer.innerHTML = NUDGES.map(n => `
    <button
      class="dlx-nudge-toggle"
      id="nudge-btn-${n.id}"
      data-nudge="${n.id}"
      title="${n.title}"
      aria-pressed="false"
    >
      <span class="dlx-nudge-toggle__dot"></span>
      <span>${n.icon} ${n.label}</span>
    </button>
  `).join('');

  togglesContainer.querySelectorAll('.dlx-nudge-toggle').forEach(btn => {
    btn.addEventListener('click', () => nudge.toggle(btn.dataset.nudge));
  });
}

// ── Update a single toggle's visual state ────────────────────
function updateToggleUI(id, on) {
  const btn = document.getElementById(`nudge-btn-${id}`);
  if (!btn) return;
  btn.classList.toggle('active', on);
  btn.setAttribute('aria-pressed', String(on));
}
