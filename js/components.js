/* ============================================================
   Digital Luxe — Component Library
   All 42 built-in components across 8 drawers
   CSS in each entry uses CSS custom-property tokens inherited
   from the main document (shadow DOM inherits custom props).
   ============================================================ */

// ── Shared nudge base CSS (injected into every shadow root) ──
export const NUDGE_BASE_CSS = `
  :host([data-nudge-grow])  { transition: transform .25s ease, box-shadow .25s ease; }
  :host([data-nudge-grow]):hover { transform: scale(1.04); }
  :host([data-nudge-shadow])     { box-shadow: 0 8px 32px rgba(187,165,76,.38); }
  :host([data-nudge-round])  *   { border-radius: 24px !important; }
  :host([data-nudge-pulse])      { animation: dlx-pulse 2.5s ease-in-out infinite; }
  @keyframes dlx-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.025)} }
`;

// ── Drawer metadata ───────────────────────────────────────────
export const DRAWERS = [
  { id: 'buttons',     label: 'Buttons',     icon: '⬡' },
  { id: 'cards',       label: 'Cards',       icon: '🃏' },
  { id: 'forms',       label: 'Forms',       icon: '✏️'  },
  { id: 'navigation',  label: 'Navigation',  icon: '🧭' },
  { id: 'dashboards',  label: 'Dashboards',  icon: '📊' },
  { id: 'typography',  label: 'Typography',  icon: '𝕋'  },
  { id: 'modals',      label: 'Modals',      icon: '🔔' },
  { id: 'tables',      label: 'Tables',      icon: '⊞'  },
];

// ── Component definitions ─────────────────────────────────────
export const COMPONENTS = [

  /* ════════════════════ BUTTONS ════════════════════ */

  {
    id: 'btn-primary-cta',
    category: 'buttons',
    name: 'Primary CTA',
    description: 'Bold call-to-action with hover lift',
    tags: ['button', 'cta', 'primary', 'action'],
    html: `<button class="btn">Get Started →</button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1.5rem; }
      .btn {
        background: var(--pine-teal, #1F4F3C);
        color: var(--sand-dune, #dcd6b9);
        border: none; border-radius: 8px;
        padding: .7rem 2rem;
        font-size: .95rem; font-weight: 700;
        letter-spacing: .05em; cursor: pointer;
        transition: background .2s, transform .2s, box-shadow .2s;
      }
      .btn:hover { background: #285e47; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(31,79,60,.35); }
      .btn:active { transform: translateY(0); }
    `
  },

  {
    id: 'btn-ghost',
    category: 'buttons',
    name: 'Ghost Outline',
    description: 'Transparent with bold border',
    tags: ['button', 'ghost', 'outline', 'secondary'],
    html: `<button class="btn">Learn More</button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1.5rem; }
      .btn {
        background: transparent;
        color: var(--pine-teal, #1F4F3C);
        border: 2px solid var(--pine-teal, #1F4F3C);
        border-radius: 8px; padding: .65rem 1.8rem;
        font-size: .95rem; font-weight: 700; cursor: pointer;
        transition: background .2s, color .2s;
      }
      .btn:hover { background: var(--pine-teal,#1F4F3C); color: var(--sand-dune,#dcd6b9); }
    `
  },

  {
    id: 'btn-gold-pill',
    category: 'buttons',
    name: 'Gold Pill',
    description: 'Rounded pill in golden bronze accent',
    tags: ['button', 'pill', 'accent', 'gold', 'rounded'],
    html: `<button class="btn">✦ Explore Now</button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1.5rem; }
      .btn {
        background: var(--golden-bronze, #bba54c);
        color: var(--graphite, #2c2b25);
        border: none; border-radius: 9999px;
        padding: .65rem 2rem; font-size: .92rem; font-weight: 700;
        letter-spacing: .04em; cursor: pointer;
        box-shadow: 0 2px 12px rgba(187,165,76,.4);
        transition: background .2s, box-shadow .2s, transform .2s;
      }
      .btn:hover { background: #cbb85c; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(187,165,76,.55); }
    `
  },

  {
    id: 'btn-icon',
    category: 'buttons',
    name: 'Icon + Label',
    description: 'Button with leading icon',
    tags: ['button', 'icon', 'label', 'mixed'],
    html: `
      <button class="btn">
        <span class="icon">⬡</span>
        <span>Open Vault</span>
      </button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1.5rem; }
      .btn {
        display:flex; align-items:center; gap:.5rem;
        background: var(--graphite,#2c2b25); color: var(--sand-dune,#dcd6b9);
        border: none; border-radius:8px; padding:.65rem 1.5rem;
        font-size:.9rem; font-weight:600; cursor:pointer;
        transition: background .2s, transform .2s;
      }
      .btn:hover { background: #3d3c34; transform:translateY(-1px); }
      .icon { font-size:1rem; }
    `
  },

  {
    id: 'btn-split',
    category: 'buttons',
    name: 'Split Action',
    description: 'Primary action + dropdown arrow',
    tags: ['button', 'split', 'dropdown', 'action'],
    html: `
      <div class="wrap">
        <button class="main">Save Design</button>
        <button class="arrow" aria-label="More options">▾</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1.5rem; }
      .wrap { display:flex; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(44,43,37,.14); }
      .main {
        background:var(--pine-teal,#1F4F3C); color:var(--sand-dune,#dcd6b9);
        border:none; padding:.65rem 1.4rem; font-size:.9rem; font-weight:600; cursor:pointer;
        transition:background .2s;
      }
      .main:hover { background:#285e47; }
      .arrow {
        background:#17402f; color:var(--sand-dune,#dcd6b9);
        border:none; border-left:1px solid rgba(220,214,185,.2);
        padding:.65rem .9rem; font-size:.9rem; cursor:pointer;
        transition:background .2s;
      }
      .arrow:hover { background:#0e2e21; }
    `
  },

  {
    id: 'btn-gradient',
    category: 'buttons',
    name: 'Gradient Glow',
    description: 'Multi-stop gradient with glow on hover',
    tags: ['button', 'gradient', 'glow', 'premium'],
    html: `<button class="btn">✦ Go Premium</button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1.5rem; }
      .btn {
        background: linear-gradient(135deg, #bba54c 0%, #1F4F3C 100%);
        color: #f7f3e8; border:none; border-radius:8px;
        padding:.7rem 2rem; font-size:.95rem; font-weight:700;
        letter-spacing:.04em; cursor:pointer;
        box-shadow: 0 4px 20px rgba(187,165,76,.3);
        transition: transform .2s, box-shadow .2s;
        background-size: 200% 200%; background-position: 0% 50%;
      }
      .btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(187,165,76,.5); background-position: 100% 50%; }
    `
  },

  /* ════════════════════ CARDS ════════════════════ */

  {
    id: 'card-product',
    category: 'cards',
    name: 'Product Showcase',
    description: 'Image header + price + CTA',
    tags: ['card', 'product', 'shop', 'ecommerce'],
    html: `
      <div class="card">
        <div class="img">🏺</div>
        <div class="body">
          <div class="tag">New Arrival</div>
          <h3>Artisan Vase No.7</h3>
          <p>Hand-thrown ceramic with matte glaze finish.</p>
          <div class="footer">
            <span class="price">$128</span>
            <button class="btn">Add to Cart</button>
          </div>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:200px; background:#f7f3e8; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(44,43,37,.14); }
      .img { height:100px; background:linear-gradient(135deg,#1F4F3C,#2c2b25); display:flex; align-items:center; justify-content:center; font-size:2.5rem; }
      .body { padding:.9rem; }
      .tag { display:inline-block; background:rgba(187,165,76,.18); color:#8a6e1e; font-size:.65rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; border-radius:99px; padding:2px 8px; margin-bottom:.5rem; }
      h3 { font-size:.88rem; font-weight:700; color:#2c2b25; margin-bottom:.3rem; }
      p  { font-size:.72rem; color:#a7a6a2; line-height:1.4; margin-bottom:.75rem; }
      .footer { display:flex; align-items:center; justify-content:space-between; }
      .price { font-size:1rem; font-weight:800; color:#bba54c; }
      .btn { background:#1F4F3C; color:#dcd6b9; border:none; border-radius:6px; padding:5px 12px; font-size:.72rem; font-weight:600; cursor:pointer; transition:background .2s; }
      .btn:hover { background:#285e47; }
    `
  },

  {
    id: 'card-profile',
    category: 'cards',
    name: 'Profile Avatar',
    description: 'User profile with stats row',
    tags: ['card', 'profile', 'user', 'avatar'],
    html: `
      <div class="card">
        <div class="banner"></div>
        <div class="body">
          <div class="avatar">S</div>
          <h3>Scott Allard</h3>
          <p>UI Architect · ToolSmart LLC</p>
          <div class="stats">
            <div class="stat"><span class="n">142</span><span class="l">Designs</span></div>
            <div class="stat"><span class="n">38</span><span class="l">Vaults</span></div>
            <div class="stat"><span class="n">9.4k</span><span class="l">Views</span></div>
          </div>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:200px; background:#f7f3e8; border-radius:14px; overflow:hidden; box-shadow:0 2px 12px rgba(44,43,37,.14); }
      .banner { height:52px; background:linear-gradient(135deg,#1F4F3C,#bba54c); }
      .body { padding:.75rem .9rem 1rem; text-align:center; }
      .avatar { width:44px; height:44px; border-radius:50%; background:#bba54c; color:#2c2b25; font-size:1.1rem; font-weight:800; display:flex; align-items:center; justify-content:center; margin:-22px auto .5rem; border:3px solid #f7f3e8; }
      h3 { font-size:.85rem; font-weight:700; color:#2c2b25; }
      p  { font-size:.7rem; color:#a7a6a2; margin:.2rem 0 .8rem; }
      .stats { display:flex; justify-content:space-around; border-top:1px solid #e0d9c0; padding-top:.7rem; }
      .stat { display:flex; flex-direction:column; align-items:center; gap:2px; }
      .n { font-size:.88rem; font-weight:800; color:#1F4F3C; }
      .l { font-size:.65rem; color:#a7a6a2; text-transform:uppercase; letter-spacing:.07em; }
    `
  },

  {
    id: 'card-feature',
    category: 'cards',
    name: 'Feature Highlight',
    description: 'Icon + title + description block',
    tags: ['card', 'feature', 'icon', 'marketing'],
    html: `
      <div class="card">
        <div class="icon">⬡</div>
        <h3>Local-First Vault</h3>
        <p>Every design lives securely on your device — no cloud required, no account needed.</p>
        <a href="#" class="link">Learn more →</a>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:200px; padding:1.2rem; background:#f7f3e8; border-radius:14px; box-shadow:0 2px 12px rgba(44,43,37,.12); border:1px solid rgba(187,165,76,.18); }
      .icon { font-size:1.8rem; margin-bottom:.75rem; }
      h3 { font-size:.9rem; font-weight:700; color:#2c2b25; margin-bottom:.4rem; }
      p  { font-size:.72rem; color:#a7a6a2; line-height:1.5; margin-bottom:.75rem; }
      .link { font-size:.75rem; font-weight:600; color:#bba54c; text-decoration:none; }
      .link:hover { text-decoration:underline; }
    `
  },

  {
    id: 'card-stats',
    category: 'cards',
    name: 'Stats Counter',
    description: 'Big number KPI with trend badge',
    tags: ['card', 'stats', 'kpi', 'metric', 'number'],
    html: `
      <div class="card">
        <div class="top">
          <span class="label">Monthly Revenue</span>
          <span class="badge up">↑ 12.4%</span>
        </div>
        <div class="number">$48,320</div>
        <div class="sub">vs $42,990 last month</div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:200px; padding:1.1rem; background:#f7f3e8; border-radius:14px; box-shadow:0 2px 12px rgba(44,43,37,.12); border:1px solid #e0d9c0; }
      .top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.6rem; }
      .label { font-size:.7rem; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:#a7a6a2; }
      .badge { font-size:.68rem; font-weight:700; background:rgba(76,175,80,.15); color:#388e3c; border-radius:99px; padding:2px 7px; }
      .number { font-size:1.5rem; font-weight:800; color:#2c2b25; letter-spacing:-.01em; margin-bottom:.3rem; }
      .sub { font-size:.7rem; color:#a7a6a2; }
    `
  },

  {
    id: 'card-testimonial',
    category: 'cards',
    name: 'Testimonial Quote',
    description: 'Customer review with rating stars',
    tags: ['card', 'testimonial', 'review', 'quote', 'social'],
    html: `
      <div class="card">
        <div class="stars">★★★★★</div>
        <p class="quote">"Absolutely transformed how I build UI. This is the tool I've been waiting for."</p>
        <div class="author">
          <div class="av">M</div>
          <div>
            <div class="name">Maria C.</div>
            <div class="role">Frontend Architect</div>
          </div>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:200px; padding:1.1rem; background:#f7f3e8; border-radius:14px; box-shadow:0 2px 14px rgba(44,43,37,.13); border-left:3px solid #bba54c; }
      .stars { color:#bba54c; font-size:.85rem; margin-bottom:.5rem; letter-spacing:.05em; }
      .quote { font-size:.76rem; color:#4a4940; line-height:1.5; font-style:italic; margin-bottom:.8rem; }
      .author { display:flex; align-items:center; gap:.6rem; }
      .av { width:30px; height:30px; border-radius:50%; background:#1F4F3C; color:#dcd6b9; font-weight:700; font-size:.78rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
      .name { font-size:.78rem; font-weight:700; color:#2c2b25; }
      .role { font-size:.66rem; color:#a7a6a2; }
    `
  },

  {
    id: 'card-pricing',
    category: 'cards',
    name: 'Pricing Tier',
    description: 'Plan card with feature list',
    tags: ['card', 'pricing', 'plan', 'subscription'],
    html: `
      <div class="card">
        <div class="badge">Pro</div>
        <div class="price"><span class="amt">$29</span><span class="per">/mo</span></div>
        <ul class="features">
          <li>✓ Unlimited Vaults</li>
          <li>✓ Export HTML + CSS</li>
          <li>✓ 200+ Components</li>
          <li class="dim">✗ Team Sharing</li>
        </ul>
        <button class="btn">Start Free Trial</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.8rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:180px; padding:1.1rem; background:#f7f3e8; border-radius:14px; box-shadow:0 2px 12px rgba(44,43,37,.14); border:1.5px solid #bba54c; }
      .badge { display:inline-block; background:#bba54c; color:#2c2b25; font-size:.65rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; padding:2px 9px; border-radius:99px; margin-bottom:.6rem; }
      .price { margin-bottom:.8rem; }
      .amt { font-size:1.7rem; font-weight:800; color:#2c2b25; }
      .per { font-size:.75rem; color:#a7a6a2; }
      .features { list-style:none; font-size:.72rem; color:#4a4940; line-height:1; margin-bottom:.9rem; }
      .features li { padding:.28rem 0; border-bottom:1px solid rgba(167,166,162,.2); }
      .features li.dim { color:#a7a6a2; }
      .btn { width:100%; background:#1F4F3C; color:#dcd6b9; border:none; border-radius:7px; padding:.55rem; font-size:.78rem; font-weight:700; cursor:pointer; transition:background .2s; }
      .btn:hover { background:#285e47; }
    `
  },

  /* ════════════════════ FORMS ════════════════════ */

  {
    id: 'form-floating-input',
    category: 'forms',
    name: 'Floating Label',
    description: 'Animated label that floats on focus',
    tags: ['form', 'input', 'label', 'animated', 'material'],
    html: `
      <div class="wrap">
        <div class="field">
          <input id="f1" type="email" class="input" placeholder=" " value="scott@toolsmart.com"/>
          <label for="f1" class="label">Email Address</label>
        </div>
        <div class="field">
          <input id="f2" type="text" class="input" placeholder=" "/>
          <label for="f2" class="label">Full Name</label>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { display:flex; flex-direction:column; gap:.9rem; width:200px; }
      .field { position:relative; }
      .input { width:100%; padding:.75rem .75rem .3rem; background:#f7f3e8; border:1.5px solid #c4bc9a; border-radius:8px; font-size:.85rem; color:#2c2b25; outline:none; transition:border-color .2s; }
      .input:focus { border-color:#1F4F3C; }
      .label { position:absolute; left:.75rem; top:50%; transform:translateY(-50%); font-size:.85rem; color:#a7a6a2; pointer-events:none; transition:all .2s; }
      .input:focus~.label, .input:not(:placeholder-shown)~.label { top:.4rem; transform:none; font-size:.65rem; color:#1F4F3C; font-weight:600; }
    `
  },

  {
    id: 'form-search',
    category: 'forms',
    name: 'Search Bar',
    description: 'Search input with filter button',
    tags: ['form', 'search', 'filter', 'input'],
    html: `
      <div class="bar">
        <span class="icon">🔍</span>
        <input type="search" class="input" placeholder="Search components..."/>
        <button class="btn">Filter</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .bar { display:flex; align-items:center; gap:.4rem; background:#f7f3e8; border:1.5px solid #c4bc9a; border-radius:99px; padding:.5rem .5rem .5rem .9rem; width:220px; }
      .icon { font-size:.88rem; color:#a7a6a2; flex-shrink:0; }
      .input { flex:1; border:none; background:none; outline:none; font-size:.84rem; color:#2c2b25; min-width:0; }
      .input::placeholder { color:#a7a6a2; }
      .btn { background:#1F4F3C; color:#dcd6b9; border:none; border-radius:99px; padding:.38rem .9rem; font-size:.75rem; font-weight:600; cursor:pointer; flex-shrink:0; transition:background .2s; }
      .btn:hover { background:#285e47; }
    `
  },

  {
    id: 'form-subscribe',
    category: 'forms',
    name: 'Subscribe Strip',
    description: 'Inline email subscription pill',
    tags: ['form', 'subscribe', 'newsletter', 'email', 'cta'],
    html: `
      <div class="wrap">
        <h4>Stay in the loop</h4>
        <p>New components every week.</p>
        <div class="row">
          <input type="email" class="input" placeholder="your@email.com"/>
          <button class="btn">Join</button>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:210px; }
      h4 { font-size:.88rem; font-weight:700; color:#2c2b25; margin-bottom:.2rem; }
      p  { font-size:.72rem; color:#a7a6a2; margin-bottom:.75rem; }
      .row { display:flex; gap:.4rem; }
      .input { flex:1; border:1.5px solid #c4bc9a; background:#f7f3e8; border-radius:7px; padding:.45rem .6rem; font-size:.78rem; color:#2c2b25; outline:none; transition:border-color .2s; min-width:0; }
      .input:focus { border-color:#bba54c; }
      .btn { background:#bba54c; color:#2c2b25; border:none; border-radius:7px; padding:.45rem .9rem; font-size:.78rem; font-weight:700; cursor:pointer; flex-shrink:0; transition:background .2s; }
      .btn:hover { background:#cbb85c; }
    `
  },

  {
    id: 'form-toggle-row',
    category: 'forms',
    name: 'Settings Toggles',
    description: 'Labelled toggle switches for settings',
    tags: ['form', 'toggle', 'switch', 'settings', 'boolean'],
    html: `
      <div class="list">
        <div class="row">
          <span class="lbl">Notifications</span>
          <div class="tog on"><div class="knob"></div></div>
        </div>
        <div class="row">
          <span class="lbl">Dark Mode</span>
          <div class="tog"><div class="knob"></div></div>
        </div>
        <div class="row">
          <span class="lbl">Auto-save</span>
          <div class="tog on"><div class="knob"></div></div>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .list { display:flex; flex-direction:column; gap:.7rem; width:190px; }
      .row { display:flex; align-items:center; justify-content:space-between; padding:.55rem .7rem; background:#f7f3e8; border-radius:9px; border:1px solid #e0d9c0; }
      .lbl { font-size:.8rem; font-weight:500; color:#2c2b25; }
      .tog { width:36px; height:20px; border-radius:99px; background:#c4bc9a; position:relative; cursor:pointer; transition:background .2s; flex-shrink:0; }
      .tog.on { background:#1F4F3C; }
      .knob { width:16px; height:16px; border-radius:50%; background:#fff; position:absolute; top:2px; left:2px; transition:left .2s; box-shadow:0 1px 4px rgba(44,43,37,.2); }
      .tog.on .knob { left:18px; }
    `
  },

  {
    id: 'form-star-rating',
    category: 'forms',
    name: 'Star Rating',
    description: 'Interactive 5-star rating input',
    tags: ['form', 'rating', 'stars', 'review'],
    html: `
      <div class="wrap">
        <div class="label">Rate your experience</div>
        <div class="stars" role="radiogroup">
          <span class="star active" title="1">★</span>
          <span class="star active" title="2">★</span>
          <span class="star active" title="3">★</span>
          <span class="star active" title="4">★</span>
          <span class="star" title="5">★</span>
        </div>
        <div class="hint">4 out of 5 — Very Good</div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { text-align:center; width:180px; }
      .label { font-size:.78rem; font-weight:600; color:#4a4940; margin-bottom:.55rem; }
      .stars { display:flex; justify-content:center; gap:.25rem; margin-bottom:.4rem; }
      .star { font-size:1.6rem; color:#e0d9c0; cursor:pointer; transition:color .15s, transform .15s; }
      .star.active { color:#bba54c; }
      .star:hover { transform:scale(1.15); }
      .hint { font-size:.68rem; color:#a7a6a2; }
    `
  },

  /* ════════════════════ NAVIGATION ════════════════════ */

  {
    id: 'nav-topbar',
    category: 'navigation',
    name: 'Top Bar Nav',
    description: 'Horizontal navigation bar with logo',
    tags: ['nav', 'topbar', 'header', 'menu', 'horizontal'],
    html: `
      <nav class="nav">
        <div class="brand">💎 Luxe</div>
        <div class="links">
          <a class="link active" href="#">Catalog</a>
          <a class="link" href="#">Vault</a>
          <a class="link" href="#">Themes</a>
        </div>
        <button class="cta">Open App</button>
      </nav>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; width:100%; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; text-decoration:none; }
      .nav { display:flex; align-items:center; gap:1rem; padding:.55rem 1rem; background:#1F4F3C; border-radius:10px; width:100%; max-width:260px; }
      .brand { font-size:.82rem; font-weight:800; color:#dcd6b9; letter-spacing:.04em; white-space:nowrap; }
      .links { display:flex; gap:.2rem; flex:1; }
      .link { font-size:.74rem; font-weight:500; color:rgba(220,214,185,.65); padding:.3rem .55rem; border-radius:5px; transition:background .15s, color .15s; }
      .link.active, .link:hover { background:rgba(220,214,185,.12); color:#dcd6b9; }
      .link.active { color:#bba54c; }
      .cta { background:#bba54c; color:#2c2b25; border:none; border-radius:6px; padding:.3rem .75rem; font-size:.74rem; font-weight:700; cursor:pointer; white-space:nowrap; flex-shrink:0; }
    `
  },

  {
    id: 'nav-sidebar',
    category: 'navigation',
    name: 'Sidebar Nav',
    description: 'Vertical sidebar with icon labels',
    tags: ['nav', 'sidebar', 'vertical', 'menu'],
    html: `
      <nav class="sidebar">
        <div class="logo">💎</div>
        <a class="item active" href="#"><span class="icon">⬡</span><span class="txt">Catalog</span></a>
        <a class="item" href="#"><span class="icon">🗄</span><span class="txt">Vault</span></a>
        <a class="item" href="#"><span class="icon">🎨</span><span class="txt">Themes</span></a>
        <a class="item" href="#"><span class="icon">⚙</span><span class="txt">Settings</span></a>
      </nav>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; text-decoration:none; }
      .sidebar { display:flex; flex-direction:column; gap:.2rem; background:#2c2b25; border-radius:12px; padding:.75rem .5rem; width:100px; }
      .logo { text-align:center; font-size:1.2rem; padding:.3rem 0 .6rem; border-bottom:1px solid rgba(220,214,185,.12); margin-bottom:.3rem; }
      .item { display:flex; flex-direction:column; align-items:center; gap:3px; padding:.5rem .4rem; border-radius:8px; color:rgba(220,214,185,.55); transition:background .15s, color .15s; }
      .item:hover { background:rgba(220,214,185,.08); color:#dcd6b9; }
      .item.active { background:rgba(187,165,76,.14); color:#bba54c; }
      .icon { font-size:.95rem; }
      .txt { font-size:.62rem; font-weight:600; text-transform:uppercase; letter-spacing:.07em; }
    `
  },

  {
    id: 'nav-tabs',
    category: 'navigation',
    name: 'Pill Tab Bar',
    description: 'Pill-style tab switcher',
    tags: ['nav', 'tabs', 'pill', 'switcher'],
    html: `
      <div class="tabs">
        <button class="tab active">Overview</button>
        <button class="tab">Components</button>
        <button class="tab">Exports</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .tabs { display:flex; gap:.3rem; background:#ede7cd; border-radius:99px; padding:.25rem; }
      .tab { background:none; border:none; border-radius:99px; padding:.4rem 1rem; font-size:.8rem; font-weight:600; color:#a7a6a2; cursor:pointer; transition:background .2s, color .2s, box-shadow .2s; }
      .tab:hover { color:#2c2b25; }
      .tab.active { background:#1F4F3C; color:#dcd6b9; box-shadow:0 2px 8px rgba(31,79,60,.25); }
    `
  },

  {
    id: 'nav-breadcrumb',
    category: 'navigation',
    name: 'Breadcrumb',
    description: 'Path breadcrumb with separators',
    tags: ['nav', 'breadcrumb', 'path', 'trail'],
    html: `
      <nav class="bc" aria-label="Breadcrumb">
        <a class="crumb" href="#">Home</a>
        <span class="sep">›</span>
        <a class="crumb" href="#">Catalog</a>
        <span class="sep">›</span>
        <a class="crumb" href="#">Buttons</a>
        <span class="sep">›</span>
        <span class="current">Primary CTA</span>
      </nav>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; text-decoration:none; }
      .bc { display:flex; align-items:center; gap:.35rem; flex-wrap:wrap; }
      .crumb { font-size:.78rem; color:#1F4F3C; font-weight:500; transition:color .15s; }
      .crumb:hover { color:#bba54c; }
      .sep { font-size:.78rem; color:#c4bc9a; }
      .current { font-size:.78rem; color:#a7a6a2; }
    `
  },

  {
    id: 'nav-pagination',
    category: 'navigation',
    name: 'Pagination',
    description: 'Page navigation with prev/next',
    tags: ['nav', 'pagination', 'paging', 'pages'],
    html: `
      <div class="pg">
        <button class="btn prev">← Prev</button>
        <button class="page">1</button>
        <button class="page active">2</button>
        <button class="page">3</button>
        <span class="dots">…</span>
        <button class="page">12</button>
        <button class="btn next">Next →</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .pg { display:flex; align-items:center; gap:.3rem; flex-wrap:wrap; justify-content:center; }
      .btn { background:none; border:1.5px solid #c4bc9a; border-radius:7px; padding:.35rem .7rem; font-size:.78rem; font-weight:600; color:#4a4940; cursor:pointer; transition:border-color .15s, color .15s; }
      .btn:hover { border-color:#1F4F3C; color:#1F4F3C; }
      .page { width:32px; height:32px; border:1.5px solid #e0d9c0; border-radius:7px; font-size:.8rem; font-weight:600; color:#4a4940; background:none; cursor:pointer; transition:all .15s; }
      .page:hover { border-color:#1F4F3C; color:#1F4F3C; }
      .page.active { background:#1F4F3C; color:#dcd6b9; border-color:#1F4F3C; }
      .dots { font-size:.85rem; color:#a7a6a2; padding:0 .2rem; }
    `
  },

  /* ════════════════════ DASHBOARDS ════════════════════ */

  {
    id: 'dash-kpi',
    category: 'dashboards',
    name: 'KPI Grid',
    description: 'Four metric tiles in a 2×2 grid',
    tags: ['dashboard', 'kpi', 'metric', 'grid', 'analytics'],
    html: `
      <div class="grid">
        <div class="tile"><div class="icon">💎</div><div class="val">2,840</div><div class="lbl">Components</div></div>
        <div class="tile accent"><div class="icon">📦</div><div class="val">38</div><div class="lbl">Vaults</div></div>
        <div class="tile"><div class="icon">⬡</div><div class="val">142</div><div class="lbl">Exports</div></div>
        <div class="tile dark"><div class="icon">✦</div><div class="val">9.4k</div><div class="lbl">Views</div></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.7rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:.5rem; width:210px; }
      .tile { padding:.7rem; border-radius:10px; background:#f7f3e8; border:1px solid #e0d9c0; }
      .tile.accent { background:rgba(187,165,76,.12); border-color:rgba(187,165,76,.25); }
      .tile.dark { background:#2c2b25; border-color:#2c2b25; }
      .icon { font-size:.95rem; margin-bottom:.3rem; }
      .val { font-size:1.1rem; font-weight:800; color:#2c2b25; line-height:1; margin-bottom:.15rem; }
      .tile.dark .val { color:#dcd6b9; }
      .lbl { font-size:.65rem; color:#a7a6a2; text-transform:uppercase; letter-spacing:.07em; }
      .tile.dark .lbl { color:rgba(220,214,185,.5); }
    `
  },

  {
    id: 'dash-progress',
    category: 'dashboards',
    name: 'Progress Tracker',
    description: 'Labelled progress bars with percentages',
    tags: ['dashboard', 'progress', 'bar', 'tracker'],
    html: `
      <div class="wrap">
        <h4>Project Completion</h4>
        <div class="row"><span class="name">Buttons</span><div class="bar"><div class="fill" style="width:92%"></div></div><span class="pct">92%</span></div>
        <div class="row"><span class="name">Cards</span><div class="bar"><div class="fill" style="width:76%"></div></div><span class="pct">76%</span></div>
        <div class="row"><span class="name">Forms</span><div class="bar"><div class="fill accent" style="width:45%"></div></div><span class="pct">45%</span></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:210px; }
      h4 { font-size:.82rem; font-weight:700; color:#2c2b25; margin-bottom:.75rem; }
      .row { display:flex; align-items:center; gap:.5rem; margin-bottom:.6rem; }
      .name { font-size:.72rem; color:#4a4940; width:52px; flex-shrink:0; }
      .bar { flex:1; height:8px; background:#e0d9c0; border-radius:99px; overflow:hidden; }
      .fill { height:100%; background:#1F4F3C; border-radius:99px; transition:width .4s; }
      .fill.accent { background:#bba54c; }
      .pct { font-size:.7rem; font-weight:700; color:#a7a6a2; width:28px; text-align:right; flex-shrink:0; }
    `
  },

  {
    id: 'dash-activity',
    category: 'dashboards',
    name: 'Activity Feed',
    description: 'Timeline of recent events',
    tags: ['dashboard', 'activity', 'feed', 'timeline', 'log'],
    html: `
      <div class="feed">
        <h4>Recent Activity</h4>
        <div class="item"><div class="dot green"></div><div><div class="title">Vault saved — "Cookbook UI"</div><div class="time">2 min ago</div></div></div>
        <div class="item"><div class="dot gold"></div><div><div class="title">12 components exported</div><div class="time">1 hr ago</div></div></div>
        <div class="item"><div class="dot blue"></div><div><div class="title">New drawer: Dashboards</div><div class="time">Yesterday</div></div></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .feed { width:200px; }
      h4 { font-size:.82rem; font-weight:700; color:#2c2b25; margin-bottom:.8rem; }
      .item { display:flex; align-items:flex-start; gap:.6rem; margin-bottom:.65rem; }
      .dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:.25rem; }
      .dot.green { background:#4caf50; }
      .dot.gold  { background:#bba54c; }
      .dot.blue  { background:#42a5f5; }
      .title { font-size:.75rem; font-weight:600; color:#2c2b25; line-height:1.3; }
      .time  { font-size:.67rem; color:#a7a6a2; margin-top:.1rem; }
    `
  },

  {
    id: 'dash-status',
    category: 'dashboards',
    name: 'Status Badges',
    description: 'System status with colour-coded badges',
    tags: ['dashboard', 'status', 'badge', 'indicator', 'health'],
    html: `
      <div class="wrap">
        <h4>System Status</h4>
        <div class="row"><span class="label">OPFS Vault</span><span class="badge ok">● Operational</span></div>
        <div class="row"><span class="label">Service Worker</span><span class="badge ok">● Operational</span></div>
        <div class="row"><span class="label">Web Fonts</span><span class="badge warn">● Degraded</span></div>
        <div class="row"><span class="label">Export Engine</span><span class="badge ok">● Operational</span></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:210px; }
      h4 { font-size:.82rem; font-weight:700; color:#2c2b25; margin-bottom:.75rem; }
      .row { display:flex; align-items:center; justify-content:space-between; padding:.45rem 0; border-bottom:1px solid #ede7cd; }
      .label { font-size:.76rem; color:#4a4940; }
      .badge { font-size:.68rem; font-weight:700; border-radius:99px; padding:2px 8px; }
      .badge.ok   { background:rgba(76,175,80,.12);  color:#2e7d32; }
      .badge.warn { background:rgba(255,165,0,.12); color:#e65100; }
      .badge.err  { background:rgba(229,57,53,.12);  color:#c62828; }
    `
  },

  {
    id: 'dash-sparkline',
    category: 'dashboards',
    name: 'Mini Sparkline',
    description: 'Inline SVG sparkline chart',
    tags: ['dashboard', 'chart', 'sparkline', 'graph', 'data'],
    html: `
      <div class="card">
        <div class="top"><span class="title">Weekly Traffic</span><span class="delta up">↑ 8.3%</span></div>
        <div class="number">12,480</div>
        <svg viewBox="0 0 160 50" class="spark" aria-hidden="true">
          <polyline points="0,40 20,32 40,38 60,20 80,25 100,18 120,10 140,15 160,8" fill="none" stroke="#1F4F3C" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
          <polyline points="0,40 20,32 40,38 60,20 80,25 100,18 120,10 140,15 160,8 160,50 0,50" fill="rgba(31,79,60,.12)"/>
        </svg>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:200px; padding:1rem; background:#f7f3e8; border-radius:12px; border:1px solid #e0d9c0; }
      .top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.35rem; }
      .title { font-size:.7rem; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:#a7a6a2; }
      .delta { font-size:.7rem; font-weight:700; }
      .delta.up { color:#388e3c; }
      .number { font-size:1.35rem; font-weight:800; color:#2c2b25; margin-bottom:.5rem; letter-spacing:-.01em; }
      .spark { width:100%; height:40px; }
    `
  },

  /* ════════════════════ TYPOGRAPHY ════════════════════ */

  {
    id: 'typo-hero',
    category: 'typography',
    name: 'Hero Section',
    description: 'Large headline with subtext and CTA',
    tags: ['typography', 'hero', 'headline', 'landing'],
    html: `
      <div class="hero">
        <div class="eyebrow">✦ The Catalog</div>
        <h1>Design Without<br><em>Compromise.</em></h1>
        <p>Curate premium UI components and make them your own — no code required.</p>
        <button class="btn">Explore Catalog →</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.75rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .hero { text-align:center; width:220px; }
      .eyebrow { font-size:.65rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#bba54c; margin-bottom:.5rem; }
      h1 { font-size:1.3rem; font-weight:800; color:#2c2b25; line-height:1.2; margin-bottom:.55rem; }
      em { color:#1F4F3C; font-style:normal; }
      p  { font-size:.76rem; color:#a7a6a2; line-height:1.55; margin-bottom:.8rem; }
      .btn { background:#1F4F3C; color:#dcd6b9; border:none; border-radius:8px; padding:.55rem 1.2rem; font-size:.8rem; font-weight:700; cursor:pointer; transition:background .2s; }
      .btn:hover { background:#285e47; }
    `
  },

  {
    id: 'typo-section-title',
    category: 'typography',
    name: 'Section Divider',
    description: 'Heading with decorative ruled lines',
    tags: ['typography', 'section', 'divider', 'heading', 'title'],
    html: `
      <div class="wrap">
        <div class="row"><div class="line"></div><span class="eyebrow">Our Approach</span><div class="line"></div></div>
        <h2>The Cabinet of Wonders</h2>
        <p>Curation over creation — we give you the options, you provide the taste.</p>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { text-align:center; width:210px; }
      .row { display:flex; align-items:center; gap:.6rem; margin-bottom:.5rem; }
      .line { flex:1; height:1px; background:linear-gradient(90deg,transparent,#bba54c); }
      .row .line:last-child { background:linear-gradient(270deg,transparent,#bba54c); }
      .eyebrow { font-size:.62rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:#bba54c; white-space:nowrap; }
      h2 { font-size:1.05rem; font-weight:800; color:#2c2b25; margin-bottom:.4rem; line-height:1.2; }
      p  { font-size:.74rem; color:#a7a6a2; line-height:1.5; }
    `
  },

  {
    id: 'typo-pull-quote',
    category: 'typography',
    name: 'Pull Quote',
    description: 'Styled blockquote with author attribution',
    tags: ['typography', 'quote', 'blockquote', 'editorial'],
    html: `
      <blockquote class="quote">
        <div class="mark">"</div>
        <p>The best tools feel like they were designed specifically for you.</p>
        <footer>— ToolSmart Design Principles</footer>
      </blockquote>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .quote { width:200px; padding:1rem 1rem 1rem 1.2rem; border-left:3px solid #bba54c; background:rgba(187,165,76,.06); border-radius:0 10px 10px 0; }
      .mark { font-size:3rem; line-height:.8; color:#bba54c; font-family:Georgia,serif; margin-bottom:.2rem; }
      p { font-size:.8rem; color:#2c2b25; font-style:italic; line-height:1.55; margin-bottom:.6rem; }
      footer { font-size:.68rem; color:#a7a6a2; font-style:normal; }
    `
  },

  {
    id: 'typo-badge-set',
    category: 'typography',
    name: 'Label Badges',
    description: 'Tag and badge component set',
    tags: ['typography', 'badge', 'tag', 'label', 'pill'],
    html: `
      <div class="wrap">
        <span class="badge green">New</span>
        <span class="badge gold">Pro</span>
        <span class="badge dark">v2.0</span>
        <span class="badge outline">Beta</span>
        <span class="badge red">Deprecated</span>
        <span class="badge teal">Open Source</span>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { display:flex; flex-wrap:wrap; gap:.4rem; justify-content:center; max-width:210px; }
      .badge { display:inline-block; border-radius:99px; padding:3px 10px; font-size:.68rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
      .badge.green { background:rgba(76,175,80,.14); color:#2e7d32; }
      .badge.gold  { background:rgba(187,165,76,.18); color:#7a6420; }
      .badge.dark  { background:#2c2b25; color:#dcd6b9; }
      .badge.outline { background:none; border:1.5px solid #c4bc9a; color:#4a4940; }
      .badge.red   { background:rgba(229,57,53,.12); color:#c62828; }
      .badge.teal  { background:rgba(31,79,60,.12); color:#1F4F3C; }
    `
  },

  /* ════════════════════ MODALS ════════════════════ */

  {
    id: 'modal-confirm',
    category: 'modals',
    name: 'Confirm Dialog',
    description: 'Yes/No confirmation with warning',
    tags: ['modal', 'dialog', 'confirm', 'alert', 'warning'],
    html: `
      <div class="modal">
        <div class="icon">⚠️</div>
        <h3>Delete this design?</h3>
        <p>This will permanently remove "Cookbook UI" from your Vault. This action cannot be undone.</p>
        <div class="actions">
          <button class="btn cancel">Cancel</button>
          <button class="btn danger">Yes, Delete</button>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.75rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .modal { width:210px; background:#f7f3e8; border-radius:14px; border:1px solid #e0d9c0; padding:1.2rem; text-align:center; box-shadow:0 4px 20px rgba(44,43,37,.15); }
      .icon { font-size:1.8rem; margin-bottom:.6rem; }
      h3 { font-size:.9rem; font-weight:700; color:#2c2b25; margin-bottom:.4rem; }
      p  { font-size:.72rem; color:#a7a6a2; line-height:1.45; margin-bottom:.9rem; }
      .actions { display:flex; gap:.5rem; }
      .btn { flex:1; border:none; border-radius:7px; padding:.5rem; font-size:.78rem; font-weight:700; cursor:pointer; transition:background .2s; }
      .btn.cancel { background:#e0d9c0; color:#4a4940; }
      .btn.cancel:hover { background:#d4cc9e; }
      .btn.danger { background:#e53935; color:#fff; }
      .btn.danger:hover { background:#c62828; }
    `
  },

  {
    id: 'modal-toast',
    category: 'modals',
    name: 'Toast Notification',
    description: 'Bottom-anchored status toast',
    tags: ['modal', 'toast', 'notification', 'alert', 'message'],
    html: `
      <div class="wrap">
        <div class="toast success"><span class="icon">✓</span><span class="msg">Design saved to Vault</span><button class="close">✕</button></div>
        <div class="toast info" style="margin-top:.4rem"><span class="icon">ℹ</span><span class="msg">12 components exported</span><button class="close">✕</button></div>
        <div class="toast warn" style="margin-top:.4rem"><span class="icon">⚠</span><span class="msg">Vault nearing capacity</span><button class="close">✕</button></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .toast { display:flex; align-items:center; gap:.55rem; padding:.55rem .8rem; border-radius:9px; width:200px; border-left:3px solid; }
      .toast.success { background:#f7f3e8; border-color:#4caf50; }
      .toast.info    { background:#f7f3e8; border-color:#42a5f5; }
      .toast.warn    { background:#f7f3e8; border-color:#bba54c; }
      .icon { font-size:.85rem; flex-shrink:0; }
      .toast.success .icon { color:#2e7d32; }
      .toast.info    .icon { color:#1565c0; }
      .toast.warn    .icon { color:#7a6420; }
      .msg { flex:1; font-size:.75rem; font-weight:500; color:#2c2b25; }
      .close { background:none; border:none; color:#a7a6a2; font-size:.75rem; cursor:pointer; padding:0 .1rem; }
    `
  },

  {
    id: 'modal-drawer-sheet',
    category: 'modals',
    name: 'Side Sheet',
    description: 'Slide-in side panel (mobile pattern)',
    tags: ['modal', 'drawer', 'sheet', 'panel', 'slide'],
    html: `
      <div class="wrap">
        <div class="backdrop"></div>
        <div class="sheet">
          <div class="handle"></div>
          <div class="head"><h3>Component Details</h3><button class="close">✕</button></div>
          <p class="sub">Primary CTA Button</p>
          <div class="tags"><span class="tag">Button</span><span class="tag">CTA</span><span class="tag">Primary</span></div>
          <button class="cta">Add to Canvas →</button>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { position:relative; width:220px; height:140px; overflow:hidden; border-radius:10px; }
      .backdrop { position:absolute; inset:0; background:rgba(44,43,37,.3); }
      .sheet { position:absolute; bottom:0; left:0; right:0; background:#f7f3e8; border-radius:12px 12px 0 0; padding:.75rem; }
      .handle { width:32px; height:3px; background:#c4bc9a; border-radius:99px; margin:0 auto .6rem; }
      .head { display:flex; align-items:center; justify-content:space-between; margin-bottom:.3rem; }
      h3 { font-size:.82rem; font-weight:700; color:#2c2b25; }
      .close { background:none; border:none; color:#a7a6a2; font-size:.8rem; cursor:pointer; }
      .sub { font-size:.72rem; color:#a7a6a2; margin-bottom:.5rem; }
      .tags { display:flex; gap:.3rem; margin-bottom:.6rem; }
      .tag { font-size:.63rem; font-weight:600; background:rgba(31,79,60,.1); color:#1F4F3C; border-radius:99px; padding:2px 7px; }
      .cta { width:100%; background:#1F4F3C; color:#dcd6b9; border:none; border-radius:7px; padding:.4rem; font-size:.76rem; font-weight:700; cursor:pointer; }
    `
  },

  {
    id: 'modal-prompt',
    category: 'modals',
    name: 'Input Prompt',
    description: 'Modal with an inline text field',
    tags: ['modal', 'prompt', 'input', 'dialog', 'rename'],
    html: `
      <div class="modal">
        <h3>Name Your Design</h3>
        <p>Give this collection a memorable name before saving to your Vault.</p>
        <input type="text" class="input" value="Cookbook UI v2" placeholder="Design name..."/>
        <div class="actions">
          <button class="btn cancel">Cancel</button>
          <button class="btn save">Save to Vault</button>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.75rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .modal { width:210px; background:#f7f3e8; border-radius:14px; border:1px solid #e0d9c0; padding:1.1rem; box-shadow:0 4px 20px rgba(44,43,37,.15); }
      h3 { font-size:.9rem; font-weight:700; color:#2c2b25; margin-bottom:.3rem; }
      p  { font-size:.72rem; color:#a7a6a2; line-height:1.45; margin-bottom:.7rem; }
      .input { width:100%; border:1.5px solid #c4bc9a; background:#fff; border-radius:7px; padding:.45rem .6rem; font-size:.82rem; color:#2c2b25; outline:none; margin-bottom:.75rem; transition:border-color .2s; }
      .input:focus { border-color:#1F4F3C; }
      .actions { display:flex; gap:.5rem; }
      .btn { flex:1; border:none; border-radius:7px; padding:.5rem; font-size:.78rem; font-weight:700; cursor:pointer; transition:background .2s; }
      .btn.cancel { background:#e0d9c0; color:#4a4940; }
      .btn.save { background:#bba54c; color:#2c2b25; }
      .btn.save:hover { background:#cbb85c; }
    `
  },

  /* ════════════════════ TABLES ════════════════════ */

  {
    id: 'table-data',
    category: 'tables',
    name: 'Data Table',
    description: 'Striped rows with sort headers',
    tags: ['table', 'data', 'grid', 'list', 'rows'],
    html: `
      <div class="wrap">
        <table class="tbl">
          <thead><tr><th>Name ↕</th><th>Category</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Primary CTA</td><td>Buttons</td><td><span class="ok">Active</span></td></tr>
            <tr><td>Profile Card</td><td>Cards</td><td><span class="ok">Active</span></td></tr>
            <tr><td>Star Rating</td><td>Forms</td><td><span class="warn">Beta</span></td></tr>
          </tbody>
        </table>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.8rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:220px; overflow:hidden; border-radius:10px; border:1px solid #e0d9c0; }
      .tbl { width:100%; border-collapse:collapse; }
      thead tr { background:#2c2b25; }
      thead th { padding:.45rem .6rem; font-size:.68rem; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:#dcd6b9; text-align:left; }
      tbody tr { background:#f7f3e8; }
      tbody tr:nth-child(even) { background:#ede7cd; }
      tbody td { padding:.42rem .6rem; font-size:.75rem; color:#2c2b25; }
      .ok   { font-size:.65rem; font-weight:700; background:rgba(76,175,80,.14); color:#2e7d32; border-radius:99px; padding:2px 7px; }
      .warn { font-size:.65rem; font-weight:700; background:rgba(187,165,76,.14); color:#7a6420; border-radius:99px; padding:2px 7px; }
    `
  },

  {
    id: 'table-feature-matrix',
    category: 'tables',
    name: 'Feature Matrix',
    description: 'Plan comparison with ✓/✗ marks',
    tags: ['table', 'comparison', 'matrix', 'pricing', 'features'],
    html: `
      <div class="wrap">
        <table class="tbl">
          <thead><tr><th>Feature</th><th>Free</th><th>Pro</th></tr></thead>
          <tbody>
            <tr><td>OPFS Vault</td><td class="y">✓</td><td class="y">✓</td></tr>
            <tr><td>Export HTML</td><td class="n">✗</td><td class="y">✓</td></tr>
            <tr><td>200+ Components</td><td class="n">✗</td><td class="y">✓</td></tr>
            <tr><td>Team Sharing</td><td class="n">✗</td><td class="y">✓</td></tr>
          </tbody>
        </table>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.8rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:210px; overflow:hidden; border-radius:10px; border:1px solid #e0d9c0; }
      .tbl { width:100%; border-collapse:collapse; }
      thead tr { background:#1F4F3C; }
      thead th { padding:.45rem .6rem; font-size:.68rem; font-weight:700; letter-spacing:.07em; color:#dcd6b9; text-align:left; }
      thead th:not(:first-child) { text-align:center; }
      tbody tr { background:#f7f3e8; border-bottom:1px solid #e8e1c6; }
      tbody td { padding:.4rem .6rem; font-size:.74rem; color:#2c2b25; }
      td.y { text-align:center; color:#2e7d32; font-weight:700; font-size:.85rem; }
      td.n { text-align:center; color:#a7a6a2; font-size:.85rem; }
    `
  },

  {
    id: 'table-timeline',
    category: 'tables',
    name: 'Timeline List',
    description: 'Chronological event timeline',
    tags: ['table', 'timeline', 'events', 'history', 'log'],
    html: `
      <div class="tl">
        <div class="item"><div class="dot"></div><div class="line"></div><div><div class="when">Today 14:32</div><div class="what">Vault saved — "Cookbook UI"</div></div></div>
        <div class="item"><div class="dot gold"></div><div class="line"></div><div><div class="when">Today 12:10</div><div class="what">Primary CTA added to canvas</div></div></div>
        <div class="item"><div class="dot"></div><div class="line last"></div><div><div class="when">Yesterday</div><div class="what">Opened Buttons drawer</div></div></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .tl { width:210px; }
      .item { display:grid; grid-template-columns:12px 14px 1fr; gap:0 .55rem; margin-bottom:.1rem; }
      .dot { width:10px; height:10px; border-radius:50%; background:#1F4F3C; border:2px solid #f7f3e8; box-shadow:0 0 0 1.5px #1F4F3C; margin-top:.25rem; flex-shrink:0; }
      .dot.gold { background:#bba54c; box-shadow:0 0 0 1.5px #bba54c; }
      .line { width:2px; background:#e0d9c0; margin:8px auto 0; height:calc(100% + .1rem); }
      .line.last { background:transparent; }
      .when { font-size:.66rem; color:#a7a6a2; margin-bottom:.15rem; }
      .what { font-size:.76rem; font-weight:500; color:#2c2b25; line-height:1.3; padding-bottom:.55rem; }
    `
  },

  {
    id: 'table-sortable',
    category: 'tables',
    name: 'Sortable Header',
    description: 'Table with active sort indicator',
    tags: ['table', 'sort', 'header', 'data', 'interactive'],
    html: `
      <div class="wrap">
        <table class="tbl">
          <thead><tr>
            <th class="sort asc">Component <span class="arr">▲</span></th>
            <th>Views</th>
            <th>Saved</th>
          </tr></thead>
          <tbody>
            <tr><td>Primary CTA</td><td>1,284</td><td>342</td></tr>
            <tr><td>Profile Card</td><td>980</td><td>210</td></tr>
            <tr><td>Gold Pill</td><td>876</td><td>189</td></tr>
          </tbody>
        </table>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.8rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:210px; overflow:hidden; border-radius:10px; border:1px solid #e0d9c0; }
      .tbl { width:100%; border-collapse:collapse; }
      thead tr { background:#ede7cd; }
      thead th { padding:.45rem .55rem; font-size:.7rem; font-weight:600; color:#4a4940; text-align:left; cursor:pointer; white-space:nowrap; transition:background .15s; }
      thead th:hover { background:#e0d9c0; }
      thead th.sort.asc .arr,
      thead th.sort.desc .arr { color:#1F4F3C; }
      thead th.sort { color:#1F4F3C; font-weight:700; }
      .arr { font-size:.6rem; margin-left:.2rem; }
      tbody tr { border-bottom:1px solid #ede7cd; background:#f7f3e8; }
      tbody tr:last-child { border-bottom:none; }
      tbody td { padding:.4rem .55rem; font-size:.75rem; color:#2c2b25; }
    `
  },

  {
    id: 'table-summary',
    category: 'tables',
    name: 'Summary Row',
    description: 'Table with totals / summary footer',
    tags: ['table', 'summary', 'total', 'footer', 'aggregate'],
    html: `
      <div class="wrap">
        <table class="tbl">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Pro Plan</td><td>1</td><td>$29</td></tr>
            <tr><td>Add-ons</td><td>3</td><td>$15</td></tr>
          </tbody>
          <tfoot><tr><td>Total</td><td>4</td><td class="total">$44</td></tr></tfoot>
        </table>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.8rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:200px; overflow:hidden; border-radius:10px; border:1px solid #e0d9c0; }
      .tbl { width:100%; border-collapse:collapse; }
      thead tr { background:#2c2b25; }
      thead th { padding:.42rem .6rem; font-size:.68rem; font-weight:700; color:#dcd6b9; text-align:left; }
      tbody tr { background:#f7f3e8; border-bottom:1px solid #e8e1c6; }
      tbody td { padding:.4rem .6rem; font-size:.75rem; color:#2c2b25; }
      tfoot tr { background:rgba(187,165,76,.1); border-top:2px solid #bba54c; }
      tfoot td { padding:.42rem .6rem; font-size:.78rem; font-weight:700; color:#2c2b25; }
      tfoot td.total { color:#7a6420; }
    `
  },
];
