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
  { id: 'blocks',      label: 'Blocks',      icon: '🧱' },
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
    variantGroup: 'button-core',
    variantLabel: 'Primary CTA',
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
    variantGroup: 'button-core',
    variantLabel: 'Ghost Outline',
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
    variantGroup: 'button-core',
    variantLabel: 'Gold Pill',
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
    variantGroup: 'button-action',
    variantLabel: 'Icon + Label',
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
    variantGroup: 'button-action',
    variantLabel: 'Split Action',
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
    variantGroup: 'button-core',
    variantLabel: 'Gradient Glow',
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

  /* ════════════════════ BUTTONS — new variants ════════════════════ */

  {
    id: 'btn-danger',
    category: 'buttons',
    name: 'Danger Button',
    description: 'Destructive action in bold red',
    tags: ['button', 'danger', 'destructive', 'delete', 'red'],
    defaultWidth: 200, defaultHeight: 60,
    html: `<button class="btn">Delete Record</button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      .btn { background:#c0392b; color:#fff; border:none; border-radius:8px; padding:.68rem 1.8rem; font-size:.93rem; font-weight:700; cursor:pointer; letter-spacing:.03em; transition:background .2s, transform .2s, box-shadow .2s; box-shadow:0 2px 8px rgba(192,57,43,.35); }
      .btn:hover { background:#a93226; transform:translateY(-2px); box-shadow:0 6px 18px rgba(192,57,43,.45); }
      .btn:active { transform:translateY(0); }
    `
  },

  {
    id: 'btn-success',
    category: 'buttons',
    name: 'Success Button',
    description: 'Confirmation action in forest green',
    tags: ['button', 'success', 'confirm', 'green', 'save'],
    defaultWidth: 200, defaultHeight: 60,
    html: `<button class="btn">✓ Confirm</button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      .btn { background:#2e7d32; color:#fff; border:none; border-radius:8px; padding:.68rem 1.8rem; font-size:.93rem; font-weight:700; cursor:pointer; letter-spacing:.03em; transition:background .2s, transform .2s, box-shadow .2s; box-shadow:0 2px 8px rgba(46,125,50,.3); }
      .btn:hover { background:#256427; transform:translateY(-2px); box-shadow:0 6px 18px rgba(46,125,50,.42); }
      .btn:active { transform:translateY(0); }
    `
  },

  {
    id: 'btn-loading',
    category: 'buttons',
    name: 'Loading Button',
    description: 'Spinner state for async actions',
    tags: ['button', 'loading', 'spinner', 'async', 'state'],
    defaultWidth: 200, defaultHeight: 60,
    html: `
      <button class="btn" disabled>
        <span class="spinner"></span>
        <span>Processing…</span>
      </button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      .btn { display:flex; align-items:center; gap:.6rem; background:var(--pine-teal,#1F4F3C); color:var(--sand-dune,#dcd6b9); border:none; border-radius:8px; padding:.68rem 1.8rem; font-size:.92rem; font-weight:700; cursor:not-allowed; opacity:.82; }
      .spinner { width:14px; height:14px; border:2px solid rgba(220,214,185,.3); border-top-color:var(--sand-dune,#dcd6b9); border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0; }
      @keyframes spin { to { transform:rotate(360deg); } }
    `
  },

  {
    id: 'btn-outline-gold',
    category: 'buttons',
    variantGroup: 'button-core',
    variantLabel: 'Gold Outline',
    name: 'Gold Outline',
    description: 'Transparent button with gold border',
    tags: ['button', 'outline', 'gold', 'accent', 'secondary'],
    defaultWidth: 200, defaultHeight: 60,
    html: `<button class="btn">✦ Premium</button>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      .btn { background:transparent; color:var(--golden-bronze,#bba54c); border:2px solid var(--golden-bronze,#bba54c); border-radius:8px; padding:.65rem 1.8rem; font-size:.93rem; font-weight:700; cursor:pointer; letter-spacing:.04em; transition:background .2s, color .2s, box-shadow .2s, transform .2s; }
      .btn:hover { background:var(--golden-bronze,#bba54c); color:var(--graphite,#2c2b25); box-shadow:0 4px 16px rgba(187,165,76,.4); transform:translateY(-1px); }
    `
  },

  /* ════════════════════ CARDS — new ════════════════════ */

  {
    id: 'card-dark-metric',
    category: 'cards',
    name: 'Dark Metric',
    description: 'Dark-themed headline stat with label and badge',
    tags: ['card', 'metric', 'dark', 'stat', 'kpi'],
    defaultWidth: 220, defaultHeight: 130,
    html: `
      <div class="card">
        <div class="top"><span class="label">Monthly Revenue</span><span class="badge">▲ 12%</span></div>
        <div class="value">$48,290</div>
        <div class="sub">vs $43,100 last month</div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:200px; background:var(--graphite,#2c2b25); border-radius:14px; padding:1.1rem; }
      .top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.7rem; }
      .label { font-size:.68rem; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:rgba(220,214,185,.55); }
      .badge { font-size:.68rem; font-weight:700; background:rgba(46,125,50,.3); color:#6fcf7a; border-radius:99px; padding:2px 8px; }
      .value { font-size:1.5rem; font-weight:800; color:var(--sand-dune,#dcd6b9); letter-spacing:-.02em; margin-bottom:.3rem; }
      .sub { font-size:.7rem; color:rgba(167,166,162,.6); }
    `
  },

  {
    id: 'card-blog-post',
    category: 'cards',
    name: 'Blog Post Card',
    description: 'Article preview with category tag, title and excerpt',
    tags: ['card', 'blog', 'article', 'post', 'content'],
    defaultWidth: 260, defaultHeight: 250,
    html: `
      <div class="card">
        <div class="img"></div>
        <div class="body">
          <span class="cat">Design</span>
          <h3>Building Better Dashboards Without Figma</h3>
          <p>Stop wrestling with tools built for other people. A local-first approach changes everything.</p>
          <div class="foot"><span class="date">May 7, 2026</span><a class="link" href="#">Read →</a></div>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; text-decoration:none; }
      .card { width:232px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; overflow:hidden; }
      .img { height:88px; background:linear-gradient(135deg,#1F4F3C 0%,#2c5f47 60%,#bba54c 100%); }
      .body { padding:.85rem; }
      .cat { display:inline-block; font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#1F4F3C; background:rgba(31,79,60,.1); border-radius:99px; padding:2px 8px; margin-bottom:.4rem; }
      h3 { font-size:.82rem; font-weight:700; color:#2c2b25; line-height:1.35; margin-bottom:.38rem; }
      p { font-size:.72rem; color:#a7a6a2; line-height:1.5; margin-bottom:.65rem; }
      .foot { display:flex; align-items:center; justify-content:space-between; }
      .date { font-size:.67rem; color:#c4bc9a; }
      .link { font-size:.74rem; font-weight:700; color:#bba54c; }
    `
  },

  {
    id: 'card-settings-panel',
    category: 'cards',
    name: 'Settings Panel',
    description: 'Card with settings rows and toggle switches',
    tags: ['card', 'settings', 'toggle', 'preferences', 'panel'],
    defaultWidth: 280, defaultHeight: 250,
    html: `
      <div class="card">
        <div class="head"><span class="title">Preferences</span><span class="badge">Pro</span></div>
        <div class="row"><div><div class="name">Email Notifications</div><div class="desc">Weekly digest</div></div><div class="tog on"><div class="knob"></div></div></div>
        <div class="row"><div><div class="name">Dark Mode</div><div class="desc">System default</div></div><div class="tog"><div class="knob"></div></div></div>
        <div class="row"><div><div class="name">Auto-save</div><div class="desc">Every 2 minutes</div></div><div class="tog on"><div class="knob"></div></div></div>
        <div class="row last"><div><div class="name">Analytics</div><div class="desc">Anonymous data</div></div><div class="tog"><div class="knob"></div></div></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:250px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; overflow:hidden; }
      .head { display:flex; align-items:center; justify-content:space-between; padding:.8rem .9rem .65rem; border-bottom:1px solid #e0d9c0; }
      .title { font-size:.86rem; font-weight:700; color:#2c2b25; }
      .badge { font-size:.62rem; font-weight:700; background:rgba(187,165,76,.18); color:#7a6420; border-radius:99px; padding:2px 8px; }
      .row { display:flex; align-items:center; justify-content:space-between; padding:.6rem .9rem; border-bottom:1px solid #ede7cd; }
      .row.last { border-bottom:none; }
      .name { font-size:.78rem; font-weight:600; color:#2c2b25; margin-bottom:.1rem; }
      .desc { font-size:.67rem; color:#a7a6a2; }
      .tog { width:34px; height:19px; border-radius:99px; background:#c4bc9a; position:relative; flex-shrink:0; }
      .tog.on { background:#1F4F3C; }
      .knob { width:15px; height:15px; border-radius:50%; background:#fff; position:absolute; top:2px; left:2px; box-shadow:0 1px 3px rgba(0,0,0,.2); }
      .tog.on .knob { left:17px; }
    `
  },

  {
    id: 'card-notification-item',
    category: 'cards',
    name: 'Notification Card',
    description: 'Single actionable notification row',
    tags: ['card', 'notification', 'alert', 'inbox', 'message'],
    defaultWidth: 300, defaultHeight: 84,
    html: `
      <div class="note">
        <div class="dot"></div>
        <div class="body">
          <div class="title">Design saved to Vault ✦</div>
          <div class="msg">Your design "Cookbook UI v3" was saved.</div>
        </div>
        <span class="time">2m</span>
        <button class="close">✕</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .note { display:flex; align-items:center; gap:.55rem; width:272px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:12px; padding:.7rem; border-left:3px solid #1F4F3C; }
      .dot { width:8px; height:8px; border-radius:50%; background:#1F4F3C; flex-shrink:0; }
      .body { flex:1; min-width:0; }
      .title { font-size:.78rem; font-weight:700; color:#2c2b25; margin-bottom:.12rem; }
      .msg { font-size:.7rem; color:#a7a6a2; line-height:1.35; }
      .time { font-size:.65rem; color:#c4bc9a; flex-shrink:0; }
      .close { background:none; border:none; color:#c4bc9a; font-size:.72rem; cursor:pointer; padding:0; flex-shrink:0; }
    `
  },

  /* ════════════════════ FORMS — new ════════════════════ */

  {
    id: 'form-input-group',
    category: 'forms',
    name: 'Input + Button',
    description: 'Attached input field and action button',
    tags: ['form', 'input', 'button', 'group', 'inline'],
    defaultWidth: 300, defaultHeight: 64,
    html: `
      <div class="group">
        <input class="input" type="text" placeholder="Enter email or URL…" value=""/>
        <button class="btn">Go →</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.75rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .group { display:flex; border-radius:9px; overflow:hidden; border:1.5px solid #c4bc9a; width:262px; transition:border-color .2s; }
      .group:focus-within { border-color:#1F4F3C; }
      .input { flex:1; border:none; background:#f7f3e8; padding:.6rem .8rem; font-size:.85rem; color:#2c2b25; outline:none; min-width:0; }
      .input::placeholder { color:#c4bc9a; }
      .btn { background:#1F4F3C; color:#dcd6b9; border:none; padding:.6rem 1.1rem; font-size:.85rem; font-weight:700; cursor:pointer; flex-shrink:0; transition:background .2s; }
      .btn:hover { background:#285e47; }
    `
  },

  {
    id: 'form-select-menu',
    category: 'forms',
    name: 'Select Menu',
    description: 'Styled dropdown select with label',
    tags: ['form', 'select', 'dropdown', 'menu', 'choose'],
    defaultWidth: 280, defaultHeight: 80,
    html: `
      <div class="wrap">
        <label class="lbl">Category</label>
        <div class="sel-wrap">
          <select class="sel">
            <option>Buttons</option>
            <option selected>Dashboards</option>
            <option>Cards</option>
            <option>Forms</option>
          </select>
          <span class="arrow">▾</span>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.75rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:242px; }
      .lbl { display:block; font-size:.72rem; font-weight:600; color:#4a4940; margin-bottom:.35rem; }
      .sel-wrap { position:relative; }
      .sel { width:100%; appearance:none; background:#f7f3e8; border:1.5px solid #c4bc9a; border-radius:8px; padding:.55rem .9rem; font-size:.85rem; color:#2c2b25; outline:none; cursor:pointer; transition:border-color .2s; }
      .sel:focus { border-color:#1F4F3C; }
      .arrow { position:absolute; right:.75rem; top:50%; transform:translateY(-50%); color:#a7a6a2; font-size:.75rem; pointer-events:none; }
    `
  },

  {
    id: 'form-textarea',
    category: 'forms',
    name: 'Textarea',
    description: 'Multi-line text input with character count',
    tags: ['form', 'textarea', 'text', 'multiline', 'message'],
    defaultWidth: 280, defaultHeight: 160,
    html: `
      <div class="wrap">
        <label class="lbl">Message</label>
        <textarea class="ta" placeholder="Write your message here…" rows="4"></textarea>
        <div class="foot"><span class="hint">Markdown supported</span><span class="count">0 / 500</span></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.75rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:244px; }
      .lbl { display:block; font-size:.72rem; font-weight:600; color:#4a4940; margin-bottom:.35rem; }
      .ta { width:100%; background:#f7f3e8; border:1.5px solid #c4bc9a; border-radius:8px; padding:.6rem .8rem; font-size:.83rem; color:#2c2b25; outline:none; resize:vertical; font-family:inherit; line-height:1.5; transition:border-color .2s; }
      .ta:focus { border-color:#1F4F3C; }
      .ta::placeholder { color:#c4bc9a; }
      .foot { display:flex; justify-content:space-between; margin-top:.3rem; }
      .hint,.count { font-size:.65rem; color:#c4bc9a; }
    `
  },

  {
    id: 'form-checkbox-group',
    category: 'forms',
    name: 'Checkbox Group',
    description: 'Labelled checkboxes for multi-select options',
    tags: ['form', 'checkbox', 'multi', 'select', 'options'],
    defaultWidth: 220, defaultHeight: 190,
    html: `
      <div class="wrap">
        <div class="title">Notification Channels</div>
        <label class="row"><span class="box checked"></span><span class="lbl">Email</span><span class="desc">Daily digest</span></label>
        <label class="row"><span class="box checked"></span><span class="lbl">Push</span><span class="desc">Instant alerts</span></label>
        <label class="row"><span class="box"></span><span class="lbl">SMS</span><span class="desc">Critical only</span></label>
        <label class="row"><span class="box"></span><span class="lbl">Slack</span><span class="desc">Team channel</span></label>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.75rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { width:192px; }
      .title { font-size:.74rem; font-weight:700; color:#2c2b25; margin-bottom:.6rem; }
      .row { display:flex; align-items:center; gap:.6rem; padding:.42rem 0; border-bottom:1px solid #ede7cd; cursor:pointer; }
      .row:last-child { border-bottom:none; }
      .box { width:16px; height:16px; border-radius:4px; border:1.5px solid #c4bc9a; background:#f7f3e8; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:.7rem; color:#dcd6b9; font-weight:700; }
      .box.checked { background:#1F4F3C; border-color:#1F4F3C; }
      .box.checked::after { content:'✓'; }
      .lbl { font-size:.78rem; font-weight:500; color:#2c2b25; flex:1; }
      .desc { font-size:.66rem; color:#a7a6a2; }
    `
  },

  /* ════════════════════ NAVIGATION — new ════════════════════ */

  {
    id: 'nav-sidebar-full',
    category: 'navigation',
    name: 'App Sidebar',
    description: 'Full left-panel sidebar with sections, icons, and user row',
    tags: ['nav', 'sidebar', 'menu', 'app', 'navigation'],
    defaultWidth: 210, defaultHeight: 460,
    html: `
      <nav class="sidebar">
        <div class="brand"><span class="gem">⬡</span><span class="name">Digital Luxe</span></div>
        <div class="section-label">Workspace</div>
        <a class="item active"><span class="icon">📊</span>Dashboard</a>
        <a class="item"><span class="icon">🃏</span>Components</a>
        <a class="item"><span class="icon">🗄</span>Vault</a>
        <a class="item"><span class="icon">📤</span>Export</a>
        <div class="section-label">Settings</div>
        <a class="item"><span class="icon">⚙</span>Preferences</a>
        <a class="item"><span class="icon">💳</span>Billing</a>
        <div class="spacer"></div>
        <div class="user"><div class="avatar">SS</div><div class="info"><div class="uname">Scott S.</div><div class="plan">Pro Plan</div></div></div>
      </nav>`,
    css: `
      :host { display:flex; align-items:stretch; padding:0; height:100%; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; text-decoration:none; }
      .sidebar { width:100%; height:100%; background:#2c2b25; display:flex; flex-direction:column; padding:.9rem .6rem; }
      .brand { display:flex; align-items:center; gap:.5rem; padding:.3rem .5rem .9rem; border-bottom:1px solid rgba(220,214,185,.1); margin-bottom:.6rem; }
      .gem { font-size:1.1rem; color:#bba54c; }
      .name { font-size:.88rem; font-weight:700; color:#dcd6b9; }
      .section-label { font-size:.58rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:rgba(167,166,162,.5); padding:.5rem .5rem .3rem; }
      .item { display:flex; align-items:center; gap:.55rem; padding:.52rem .65rem; border-radius:8px; font-size:.8rem; font-weight:500; color:rgba(220,214,185,.65); margin-bottom:.1rem; cursor:pointer; }
      .item:hover { background:rgba(220,214,185,.07); color:#dcd6b9; }
      .item.active { background:rgba(31,79,60,.5); color:#dcd6b9; }
      .icon { font-size:.85rem; }
      .spacer { flex:1; }
      .user { display:flex; align-items:center; gap:.6rem; padding:.6rem .5rem; border-top:1px solid rgba(220,214,185,.1); margin-top:.4rem; }
      .avatar { width:30px; height:30px; border-radius:50%; background:#1F4F3C; display:flex; align-items:center; justify-content:center; font-size:.65rem; font-weight:700; color:#dcd6b9; flex-shrink:0; }
      .uname { font-size:.76rem; font-weight:600; color:#dcd6b9; }
      .plan { font-size:.64rem; color:rgba(187,165,76,.7); }
    `
  },

  {
    id: 'nav-steps',
    category: 'navigation',
    name: 'Step Progress',
    description: 'Numbered step indicator for multi-step flows',
    tags: ['nav', 'steps', 'progress', 'wizard', 'flow'],
    defaultWidth: 440, defaultHeight: 80,
    html: `
      <div class="steps">
        <div class="step done"><div class="circle">✓</div><div class="label">Account</div></div>
        <div class="line done"></div>
        <div class="step done"><div class="circle">✓</div><div class="label">Profile</div></div>
        <div class="line active"></div>
        <div class="step active"><div class="circle">3</div><div class="label">Plan</div></div>
        <div class="line"></div>
        <div class="step"><div class="circle">4</div><div class="label">Confirm</div></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:1rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .steps { display:flex; align-items:center; }
      .step { display:flex; flex-direction:column; align-items:center; gap:.3rem; }
      .circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; background:#e0d9c0; color:#a7a6a2; border:2px solid #e0d9c0; flex-shrink:0; }
      .step.done .circle { background:#1F4F3C; color:#dcd6b9; border-color:#1F4F3C; }
      .step.active .circle { background:#fff; color:#1F4F3C; border-color:#1F4F3C; box-shadow:0 0 0 3px rgba(31,79,60,.15); }
      .label { font-size:.65rem; font-weight:600; color:#a7a6a2; white-space:nowrap; }
      .step.done .label { color:#1F4F3C; }
      .step.active .label { color:#2c2b25; font-weight:700; }
      .line { flex:1; height:2px; background:#e0d9c0; min-width:36px; margin:0 4px 18px; }
      .line.done { background:#1F4F3C; }
      .line.active { background:linear-gradient(90deg,#1F4F3C 50%,#e0d9c0 50%); }
    `
  },

  {
    id: 'nav-mobile-bottom',
    category: 'navigation',
    name: 'Mobile Bottom Bar',
    description: 'Bottom navigation bar for mobile layouts',
    tags: ['nav', 'mobile', 'bottom', 'tab', 'app'],
    defaultWidth: 340, defaultHeight: 70,
    html: `
      <nav class="bar">
        <a class="item active"><span class="icon">🏠</span><span class="lbl">Home</span></a>
        <a class="item"><span class="icon">🔍</span><span class="lbl">Search</span></a>
        <a class="item fab"><span class="plus">＋</span></a>
        <a class="item"><span class="icon">🗄</span><span class="lbl">Vault</span></a>
        <a class="item"><span class="icon">👤</span><span class="lbl">Profile</span></a>
      </nav>`,
    css: `
      :host { display:flex; align-items:stretch; padding:0; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; text-decoration:none; }
      .bar { width:100%; background:#2c2b25; display:flex; align-items:center; border-top:1px solid rgba(220,214,185,.1); padding:0 .4rem; }
      .item { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.18rem; padding:.55rem .2rem; color:rgba(167,166,162,.7); cursor:pointer; }
      .item.active { color:#dcd6b9; }
      .item.active .lbl { color:#bba54c; }
      .icon { font-size:1.05rem; }
      .lbl { font-size:.6rem; letter-spacing:.02em; }
      .item.fab { flex:0 0 52px; }
      .plus { display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#1F4F3C; color:#dcd6b9; font-size:1.3rem; font-weight:300; box-shadow:0 4px 14px rgba(31,79,60,.5); margin-bottom:4px; }
    `
  },

  /* ════════════════════ DASHBOARDS — new ════════════════════ */

  {
    id: 'dash-stat-card',
    category: 'dashboards',
    name: 'Stat Card',
    description: 'Single prominent KPI with icon, value and trend',
    tags: ['dashboard', 'stat', 'kpi', 'metric', 'card'],
    defaultWidth: 230, defaultHeight: 120,
    html: `
      <div class="card">
        <div class="top"><span class="label">Total Revenue</span><span class="icon">💰</span></div>
        <div class="value">$84,392</div>
        <div class="trend up">↑ 14.2% <span class="period">vs last month</span></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:206px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; padding:1rem 1.1rem; }
      .top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
      .label { font-size:.68rem; font-weight:600; text-transform:uppercase; letter-spacing:.09em; color:#a7a6a2; }
      .icon { font-size:1rem; }
      .value { font-size:1.55rem; font-weight:800; color:#2c2b25; letter-spacing:-.02em; margin-bottom:.35rem; }
      .trend { font-size:.72rem; font-weight:700; }
      .trend.up { color:#2e7d32; }
      .trend.down { color:#c62828; }
      .period { font-weight:400; color:#a7a6a2; margin-left:.2rem; }
    `
  },

  {
    id: 'dash-revenue-bars',
    category: 'dashboards',
    name: 'Revenue Chart',
    description: 'Revenue card with inline SVG bar chart',
    tags: ['dashboard', 'chart', 'bar', 'revenue', 'analytics'],
    defaultWidth: 340, defaultHeight: 200,
    html: `
      <div class="card">
        <div class="head">
          <div><div class="label">Monthly Revenue</div><div class="val">$284,390</div></div>
          <span class="badge">▲ 8.4%</span>
        </div>
        <svg viewBox="0 0 280 80" class="chart" aria-hidden="true">
          <g fill="#e0d9c0">
            <rect x="4"   y="55" width="22" height="25" rx="3"/>
            <rect x="32"  y="42" width="22" height="38" rx="3"/>
            <rect x="60"  y="48" width="22" height="32" rx="3"/>
            <rect x="88"  y="28" width="22" height="52" rx="3"/>
            <rect x="116" y="35" width="22" height="45" rx="3"/>
            <rect x="144" y="18" width="22" height="62" rx="3"/>
            <rect x="172" y="30" width="22" height="50" rx="3"/>
          </g>
          <g fill="#1F4F3C">
            <rect x="200" y="22" width="22" height="58" rx="3"/>
            <rect x="228" y="10" width="22" height="70" rx="3"/>
            <rect x="256" y="16" width="22" height="64" rx="3"/>
          </g>
        </svg>
        <div class="legend"><span class="dot prev"></span>Previous<span class="dot curr"></span>Current</div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.7rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:302px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; padding:1.1rem; }
      .head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:.8rem; }
      .label { font-size:.68rem; font-weight:600; text-transform:uppercase; letter-spacing:.09em; color:#a7a6a2; margin-bottom:.25rem; }
      .val { font-size:1.35rem; font-weight:800; color:#2c2b25; letter-spacing:-.02em; }
      .badge { font-size:.7rem; font-weight:700; background:rgba(46,125,50,.12); color:#2e7d32; border-radius:99px; padding:3px 9px; white-space:nowrap; }
      .chart { width:100%; height:auto; }
      .legend { display:flex; align-items:center; gap:.5rem; margin-top:.6rem; font-size:.67rem; color:#a7a6a2; }
      .dot { width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:.2rem; }
      .dot.prev { background:#e0d9c0; }
      .dot.curr { background:#1F4F3C; margin-left:.5rem; }
    `
  },

  {
    id: 'dash-donut-chart',
    category: 'dashboards',
    name: 'Donut Chart',
    description: 'SVG donut chart with category legend',
    tags: ['dashboard', 'donut', 'chart', 'pie', 'analytics'],
    defaultWidth: 280, defaultHeight: 220,
    html: `
      <div class="card">
        <div class="title">Traffic Sources</div>
        <div class="body">
          <svg viewBox="0 0 100 100" class="donut">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#e0d9c0" stroke-width="14"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#1F4F3C" stroke-width="14" stroke-dasharray="66 154" stroke-dashoffset="-25" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#bba54c" stroke-width="14" stroke-dasharray="44 176" stroke-dashoffset="-91" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#a7a6a2" stroke-width="14" stroke-dasharray="22 198" stroke-dashoffset="-135" stroke-linecap="round"/>
            <text x="50" y="47" text-anchor="middle" font-size="11" font-weight="800" fill="#2c2b25">30%</text>
            <text x="50" y="57" text-anchor="middle" font-size="6" fill="#a7a6a2">Organic</text>
          </svg>
          <div class="legend">
            <div class="item"><span class="dot teal"></span><span class="lbl">Organic</span><span class="pct">30%</span></div>
            <div class="item"><span class="dot gold"></span><span class="lbl">Referral</span><span class="pct">20%</span></div>
            <div class="item"><span class="dot grey"></span><span class="lbl">Direct</span><span class="pct">10%</span></div>
            <div class="item"><span class="dot light"></span><span class="lbl">Other</span><span class="pct">40%</span></div>
          </div>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:252px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; padding:1rem; }
      .title { font-size:.74rem; font-weight:700; color:#2c2b25; margin-bottom:.7rem; }
      .body { display:flex; align-items:center; gap:.8rem; }
      .donut { width:90px; height:90px; flex-shrink:0; }
      .legend { flex:1; display:flex; flex-direction:column; gap:.38rem; }
      .item { display:flex; align-items:center; gap:.4rem; }
      .dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
      .dot.teal { background:#1F4F3C; } .dot.gold { background:#bba54c; }
      .dot.grey { background:#a7a6a2; } .dot.light { background:#e0d9c0; }
      .lbl { font-size:.72rem; color:#4a4940; flex:1; }
      .pct { font-size:.72rem; font-weight:700; color:#2c2b25; }
    `
  },

  {
    id: 'dash-goal-tracker',
    category: 'dashboards',
    name: 'Goal Tracker',
    description: 'Goal with labelled progress bar and percentage',
    tags: ['dashboard', 'goal', 'progress', 'target', 'tracker'],
    defaultWidth: 280, defaultHeight: 130,
    html: `
      <div class="card">
        <div class="head"><span class="title">Q2 Revenue Goal</span><span class="pct">74%</span></div>
        <div class="bar"><div class="fill" style="width:74%"></div></div>
        <div class="foot"><span class="current">$74,000 raised</span><span class="target">Goal: $100,000</span></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:248px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; padding:1rem 1.1rem; }
      .head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:.7rem; }
      .title { font-size:.8rem; font-weight:700; color:#2c2b25; }
      .pct { font-size:1.2rem; font-weight:800; color:#1F4F3C; }
      .bar { height:10px; background:#e0d9c0; border-radius:99px; overflow:hidden; margin-bottom:.6rem; }
      .fill { height:100%; background:linear-gradient(90deg,#1F4F3C,#2e7d32); border-radius:99px; }
      .foot { display:flex; justify-content:space-between; }
      .current { font-size:.7rem; font-weight:600; color:#2c2b25; }
      .target { font-size:.7rem; color:#a7a6a2; }
    `
  },

  {
    id: 'dash-quick-stats',
    category: 'dashboards',
    name: 'Quick Stats Row',
    description: 'Three KPI tiles in a horizontal strip',
    tags: ['dashboard', 'stats', 'row', 'metrics', 'summary'],
    defaultWidth: 460, defaultHeight: 90,
    html: `
      <div class="row">
        <div class="tile"><div class="val">2,840</div><div class="lbl">Active Users</div><div class="delta up">↑ 12%</div></div>
        <div class="tile"><div class="val">$48.2k</div><div class="lbl">Revenue</div><div class="delta up">↑ 8%</div></div>
        <div class="tile"><div class="val">98.7%</div><div class="lbl">Uptime</div><div class="delta neutral">→ stable</div></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .row { display:flex; gap:.5rem; width:430px; }
      .tile { flex:1; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:12px; padding:.7rem .9rem; }
      .val { font-size:1.15rem; font-weight:800; color:#2c2b25; letter-spacing:-.01em; margin-bottom:.1rem; }
      .lbl { font-size:.65rem; text-transform:uppercase; letter-spacing:.08em; color:#a7a6a2; font-weight:600; margin-bottom:.22rem; }
      .delta { font-size:.68rem; font-weight:700; }
      .delta.up { color:#2e7d32; } .delta.down { color:#c62828; } .delta.neutral { color:#a7a6a2; }
    `
  },

  {
    id: 'dash-alert-success',
    category: 'dashboards',
    name: 'Alert — Success',
    description: 'Green success alert banner with dismiss',
    tags: ['dashboard', 'alert', 'success', 'banner', 'notification'],
    defaultWidth: 420, defaultHeight: 68,
    html: `
      <div class="alert success">
        <span class="icon">✓</span>
        <div class="body"><strong>Changes saved</strong><span> — Your design has been saved to the Vault.</span></div>
        <button class="close">✕</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .alert { display:flex; align-items:center; gap:.7rem; width:390px; padding:.75rem 1rem; border-radius:10px; border:1px solid rgba(46,125,50,.25); background:rgba(46,125,50,.08); }
      .icon { font-size:1rem; color:#2e7d32; flex-shrink:0; font-weight:700; }
      .body { flex:1; font-size:.78rem; color:#2c2b25; line-height:1.4; }
      .body strong { font-weight:700; }
      .close { background:none; border:none; color:#a7a6a2; cursor:pointer; font-size:.75rem; padding:0; flex-shrink:0; }
    `
  },

  {
    id: 'dash-alert-warn',
    category: 'dashboards',
    name: 'Alert — Warning',
    description: 'Amber warning alert banner',
    tags: ['dashboard', 'alert', 'warning', 'banner', 'caution'],
    defaultWidth: 420, defaultHeight: 68,
    html: `
      <div class="alert warn">
        <span class="icon">⚠</span>
        <div class="body"><strong>Storage nearing limit</strong><span> — You're using 82% of your Vault space.</span></div>
        <button class="close">✕</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .alert { display:flex; align-items:center; gap:.7rem; width:390px; padding:.75rem 1rem; border-radius:10px; border:1px solid rgba(187,165,76,.3); background:rgba(187,165,76,.1); }
      .icon { font-size:1rem; color:#7a6420; flex-shrink:0; }
      .body { flex:1; font-size:.78rem; color:#2c2b25; line-height:1.4; }
      .body strong { font-weight:700; }
      .close { background:none; border:none; color:#a7a6a2; cursor:pointer; font-size:.75rem; padding:0; flex-shrink:0; }
    `
  },

  {
    id: 'dash-alert-error',
    category: 'dashboards',
    name: 'Alert — Error',
    description: 'Red error alert banner',
    tags: ['dashboard', 'alert', 'error', 'banner', 'danger'],
    defaultWidth: 420, defaultHeight: 68,
    html: `
      <div class="alert error">
        <span class="icon">✕</span>
        <div class="body"><strong>Export failed</strong><span> — Could not generate PNG. Try HTML export instead.</span></div>
        <button class="close">✕</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .alert { display:flex; align-items:center; gap:.7rem; width:390px; padding:.75rem 1rem; border-radius:10px; border:1px solid rgba(192,57,43,.25); background:rgba(192,57,43,.08); }
      .icon { font-size:1rem; color:#c0392b; flex-shrink:0; font-weight:700; }
      .body { flex:1; font-size:.78rem; color:#2c2b25; line-height:1.4; }
      .body strong { font-weight:700; }
      .close { background:none; border:none; color:#a7a6a2; cursor:pointer; font-size:.75rem; padding:0; flex-shrink:0; }
    `
  },

  {
    id: 'dash-notification-list',
    category: 'dashboards',
    name: 'Notification Panel',
    description: 'Grouped notification feed with read/unread states',
    tags: ['dashboard', 'notifications', 'feed', 'inbox', 'panel'],
    defaultWidth: 300, defaultHeight: 300,
    html: `
      <div class="panel">
        <div class="head"><span class="title">Notifications</span><span class="badge">4 new</span></div>
        <div class="item unread"><div class="dot"></div><div class="body"><div class="msg">Vault saved — "Cookbook UI v3"</div><div class="time">Just now</div></div></div>
        <div class="item unread"><div class="dot"></div><div class="body"><div class="msg">Export complete — dashboard.html ready</div><div class="time">5 min ago</div></div></div>
        <div class="item"><div class="dot read"></div><div class="body"><div class="msg">12 community components imported</div><div class="time">1 hr ago</div></div></div>
        <div class="item"><div class="dot read"></div><div class="body"><div class="msg">New drawer added: Dashboards</div><div class="time">Yesterday</div></div></div>
        <div class="item"><div class="dot read"></div><div class="body"><div class="msg">Canvas updated to v2.4</div><div class="time">2 days ago</div></div></div>
        <button class="all">View all notifications →</button>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .panel { width:270px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; overflow:hidden; }
      .head { display:flex; align-items:center; justify-content:space-between; padding:.75rem .9rem; border-bottom:1px solid #e0d9c0; }
      .title { font-size:.82rem; font-weight:700; color:#2c2b25; }
      .badge { font-size:.65rem; font-weight:700; background:#1F4F3C; color:#dcd6b9; border-radius:99px; padding:2px 8px; }
      .item { display:flex; align-items:center; gap:.65rem; padding:.6rem .9rem; border-bottom:1px solid #ede7cd; }
      .item:last-of-type { border-bottom:none; }
      .item.unread { background:rgba(31,79,60,.04); }
      .dot { width:7px; height:7px; border-radius:50%; background:#1F4F3C; flex-shrink:0; }
      .dot.read { background:#e0d9c0; }
      .msg { font-size:.75rem; font-weight:500; color:#2c2b25; line-height:1.35; margin-bottom:.1rem; }
      .item.unread .msg { font-weight:600; }
      .time { font-size:.66rem; color:#a7a6a2; }
      .all { width:100%; background:none; border:none; border-top:1px solid #e0d9c0; padding:.6rem; font-size:.74rem; font-weight:600; color:#1F4F3C; cursor:pointer; }
      .all:hover { background:rgba(31,79,60,.05); }
    `
  },

  {
    id: 'dash-action-tiles',
    category: 'dashboards',
    name: 'Quick Actions',
    description: 'Grid of quick-action icon tiles',
    tags: ['dashboard', 'actions', 'quick', 'tiles', 'grid'],
    defaultWidth: 280, defaultHeight: 210,
    html: `
      <div class="card">
        <div class="title">Quick Actions</div>
        <div class="grid">
          <button class="tile"><span class="icon">📤</span><span class="lbl">Export</span></button>
          <button class="tile"><span class="icon">🗄</span><span class="lbl">Save</span></button>
          <button class="tile accent"><span class="icon">✦</span><span class="lbl">Publish</span></button>
          <button class="tile"><span class="icon">🔍</span><span class="lbl">Preview</span></button>
          <button class="tile"><span class="icon">📋</span><span class="lbl">Copy CSS</span></button>
          <button class="tile"><span class="icon">♻</span><span class="lbl">Reset</span></button>
        </div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:252px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; padding:1rem; }
      .title { font-size:.76rem; font-weight:700; color:#2c2b25; margin-bottom:.75rem; }
      .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.45rem; }
      .tile { display:flex; flex-direction:column; align-items:center; gap:.3rem; padding:.65rem .4rem; background:#fff; border:1px solid #e0d9c0; border-radius:10px; cursor:pointer; transition:background .15s, transform .15s; }
      .tile:hover { background:#ede7cd; transform:translateY(-1px); }
      .tile.accent { background:rgba(31,79,60,.07); border-color:rgba(31,79,60,.2); }
      .icon { font-size:1.1rem; }
      .lbl { font-size:.64rem; font-weight:600; color:#4a4940; }
    `
  },

  {
    id: 'dash-top-bar',
    category: 'dashboards',
    name: 'App Top Bar',
    description: 'Full application header with nav links and user actions',
    tags: ['dashboard', 'header', 'topbar', 'nav', 'appbar'],
    defaultWidth: 560, defaultHeight: 56,
    html: `
      <header class="bar">
        <div class="brand"><span class="gem">⬡</span><span class="name">Digital Luxe</span></div>
        <nav class="nav">
          <a class="link active">Dashboard</a>
          <a class="link">Components</a>
          <a class="link">Vault</a>
          <a class="link">Export</a>
        </nav>
        <div class="actions">
          <button class="search">🔍</button>
          <button class="btn">+ New</button>
          <div class="avatar">SS</div>
        </div>
      </header>`,
    css: `
      :host { display:flex; align-items:stretch; padding:0; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; text-decoration:none; }
      .bar { width:100%; background:#2c2b25; display:flex; align-items:center; gap:1rem; padding:0 1.1rem; }
      .brand { display:flex; align-items:center; gap:.45rem; flex-shrink:0; }
      .gem { font-size:1rem; color:#bba54c; }
      .name { font-size:.82rem; font-weight:700; color:#dcd6b9; white-space:nowrap; }
      .nav { display:flex; align-items:center; gap:.1rem; flex:1; justify-content:center; }
      .link { font-size:.78rem; font-weight:500; color:rgba(220,214,185,.55); padding:.4rem .7rem; border-radius:6px; cursor:pointer; }
      .link:hover { color:#dcd6b9; }
      .link.active { color:#dcd6b9; background:rgba(220,214,185,.08); }
      .actions { display:flex; align-items:center; gap:.55rem; flex-shrink:0; }
      .search { background:none; border:none; color:rgba(167,166,162,.7); font-size:.9rem; cursor:pointer; padding:.2rem .4rem; }
      .btn { background:#1F4F3C; color:#dcd6b9; border:none; border-radius:7px; padding:.38rem .85rem; font-size:.76rem; font-weight:700; cursor:pointer; white-space:nowrap; }
      .btn:hover { background:#285e47; }
      .avatar { width:28px; height:28px; border-radius:50%; background:#bba54c; display:flex; align-items:center; justify-content:center; font-size:.62rem; font-weight:800; color:#2c2b25; flex-shrink:0; }
    `
  },

  {
    id: 'dash-line-chart',
    category: 'dashboards',
    name: 'Line Chart',
    description: 'SVG area/line chart card with axis labels',
    tags: ['dashboard', 'chart', 'line', 'area', 'analytics'],
    defaultWidth: 380, defaultHeight: 210,
    html: `
      <div class="card">
        <div class="head">
          <div class="label">Active Users — 30 days</div>
          <div class="val">12,480 <span class="up">↑ 8.3%</span></div>
        </div>
        <svg viewBox="0 0 300 90" class="chart" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="dlx-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1F4F3C" stop-opacity=".22"/>
              <stop offset="100%" stop-color="#1F4F3C" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <polyline points="0,72 30,58 60,65 90,38 120,45 150,30 180,42 210,22 240,28 270,15 300,10"
            fill="none" stroke="#1F4F3C" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
          <polygon points="0,72 30,58 60,65 90,38 120,45 150,30 180,42 210,22 240,28 270,15 300,10 300,90 0,90"
            fill="url(#dlx-grad)"/>
        </svg>
        <div class="axis"><span>May 1</span><span>May 10</span><span>May 20</span><span>May 30</span></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:350px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; padding:1rem 1.1rem; }
      .head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:.65rem; }
      .label { font-size:.68rem; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:#a7a6a2; }
      .val { font-size:1.15rem; font-weight:800; color:#2c2b25; }
      .up { font-size:.72rem; font-weight:700; color:#2e7d32; }
      .chart { width:100%; height:90px; display:block; }
      .axis { display:flex; justify-content:space-between; margin-top:.35rem; }
      .axis span { font-size:.62rem; color:#c4bc9a; }
    `
  },

  {
    id: 'dash-metric-compare',
    category: 'dashboards',
    name: 'Metric Comparison',
    description: 'Two metrics side-by-side with trend indicators',
    tags: ['dashboard', 'metric', 'compare', 'vs', 'kpi'],
    defaultWidth: 280, defaultHeight: 120,
    html: `
      <div class="card">
        <div class="half"><div class="lbl">New Users</div><div class="val">1,284</div><div class="trend up">↑ 22%</div></div>
        <div class="divider"></div>
        <div class="half"><div class="lbl">Churn Rate</div><div class="val">2.4%</div><div class="trend good">↓ 0.8%</div></div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.6rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:250px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; padding:.9rem 1rem; display:flex; align-items:center; }
      .half { flex:1; text-align:center; }
      .lbl { font-size:.65rem; text-transform:uppercase; letter-spacing:.09em; color:#a7a6a2; font-weight:600; margin-bottom:.35rem; }
      .val { font-size:1.3rem; font-weight:800; color:#2c2b25; letter-spacing:-.01em; margin-bottom:.2rem; }
      .trend { font-size:.72rem; font-weight:700; }
      .trend.up,.trend.good { color:#2e7d32; }
      .trend.down { color:#c62828; }
      .divider { width:1px; background:#e0d9c0; align-self:stretch; margin:0 .5rem; }
    `
  },

  {
    id: 'dash-user-table',
    category: 'dashboards',
    name: 'User Table Card',
    description: 'Recent users in a dashboard table card',
    tags: ['dashboard', 'table', 'users', 'list', 'card'],
    defaultWidth: 480, defaultHeight: 300,
    html: `
      <div class="card">
        <div class="head"><span class="title">Recent Users</span><button class="btn">View All →</button></div>
        <table class="tbl">
          <thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>
            <tr><td class="nc"><div class="av">SS</div>Scott S.</td><td>scott@dlx.io</td><td><span class="tag pro">Pro</span></td><td><span class="st ok">Active</span></td><td>May 1</td></tr>
            <tr><td class="nc"><div class="av b">AJ</div>Alex J.</td><td>alex@co.io</td><td><span class="tag free">Free</span></td><td><span class="st ok">Active</span></td><td>Apr 28</td></tr>
            <tr><td class="nc"><div class="av c">MR</div>Morgan R.</td><td>m@riv.co</td><td><span class="tag pro">Pro</span></td><td><span class="st warn">Inactive</span></td><td>Apr 14</td></tr>
            <tr><td class="nc"><div class="av d">TK</div>Taylor K.</td><td>tk@mail.com</td><td><span class="tag free">Free</span></td><td><span class="st ok">Active</span></td><td>Apr 9</td></tr>
          </tbody>
        </table>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .card { width:452px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:14px; overflow:hidden; }
      .head { display:flex; align-items:center; justify-content:space-between; padding:.8rem 1rem; border-bottom:1px solid #e0d9c0; }
      .title { font-size:.84rem; font-weight:700; color:#2c2b25; }
      .btn { background:none; border:none; font-size:.74rem; font-weight:600; color:#1F4F3C; cursor:pointer; }
      .tbl { width:100%; border-collapse:collapse; }
      thead tr { background:#ede7cd; }
      thead th { padding:.42rem .7rem; font-size:.67rem; font-weight:700; color:#4a4940; text-align:left; white-space:nowrap; }
      tbody tr { border-bottom:1px solid #ede7cd; }
      tbody tr:last-child { border-bottom:none; }
      tbody td { padding:.52rem .7rem; font-size:.74rem; color:#2c2b25; }
      .nc { display:flex; align-items:center; gap:.5rem; }
      .av { width:22px; height:22px; border-radius:50%; background:#1F4F3C; color:#dcd6b9; font-size:.57rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
      .av.b { background:#bba54c; color:#2c2b25; } .av.c { background:#a7a6a2; } .av.d { background:#4a4940; color:#dcd6b9; }
      .tag { font-size:.62rem; font-weight:700; border-radius:99px; padding:2px 7px; }
      .tag.pro { background:rgba(187,165,76,.18); color:#7a6420; }
      .tag.free { background:#ede7cd; color:#4a4940; }
      .st { font-size:.68rem; font-weight:600; border-radius:99px; padding:2px 8px; }
      .st.ok { background:rgba(46,125,50,.12); color:#2e7d32; }
      .st.warn { background:rgba(255,165,0,.12); color:#e65100; }
    `
  },

  {
    id: 'dash-gauge',
    category: 'dashboards',
    name: 'Circular Gauge',
    description: 'SVG arc gauge showing a KPI percentage with label',
    tags: ['dashboard', 'gauge', 'kpi', 'percentage', 'arc', 'chart'],
    defaultWidth: 200, defaultHeight: 210,
    html: `
      <div class="wrap">
        <svg viewBox="0 0 120 80" class="arc" aria-hidden="true">
          <path class="track" d="M10,70 A60,60 0 0,1 110,70" fill="none" stroke-width="10" stroke-linecap="round"/>
          <path class="fill"  d="M10,70 A60,60 0 0,1 110,70" fill="none" stroke-width="10" stroke-linecap="round"
                stroke-dasharray="188.5" stroke-dashoffset="47" class="fill"/>
        </svg>
        <div class="val">78<span class="pct">%</span></div>
        <div class="lbl">Server Health</div>
        <div class="sub">+4% from last week</div>
      </div>`,
    css: `
      :host { display:flex; align-items:center; justify-content:center; padding:.5rem; }
      * { box-sizing:border-box; margin:0; padding:0; font-family:system-ui,sans-serif; }
      .wrap { display:flex; flex-direction:column; align-items:center; width:178px; background:#f7f3e8; border:1px solid #e0d9c0; border-radius:16px; padding:1.2rem 1rem .9rem; }
      .arc { width:130px; }
      .track { stroke:#e0d9c0; }
      .fill  { stroke:#1F4F3C; transition:stroke-dashoffset .5s ease; }
      .val { font-size:2rem; font-weight:800; color:#2c2b25; margin-top:-1.2rem; line-height:1; }
      .pct { font-size:1rem; font-weight:600; color:#a7a6a2; }
      .lbl { font-size:.75rem; font-weight:700; color:#2c2b25; margin-top:.3rem; }
      .sub { font-size:.67rem; color:#2e7d32; font-weight:600; margin-top:.18rem; }
    `
  },
];
