/* ============================================================
   Digital Luxe — Curated Blocks (Phase 5)
   Pre-assembled page sections composed from existing components.
   ============================================================ */

export const BLOCKS = [
  {
    id: 'block-hero-cta',
    name: 'Hero + CTA',
    description: 'Headline, CTA buttons, and testimonial card.',
    tags: ['hero', 'cta', 'landing'],
    items: [
      { componentId: 'typo-hero', x: 0, y: 0, width: 520, height: 220 },
      { componentId: 'btn-primary-cta', x: 120, y: 230, width: 220, height: 96 },
      { componentId: 'btn-ghost', x: 360, y: 230, width: 200, height: 96 },
      { componentId: 'card-testimonial', x: 80, y: 350, width: 520, height: 230 },
    ]
  },
  {
    id: 'block-pricing-grid',
    name: 'Pricing Grid',
    description: 'Three pricing cards with section heading.',
    tags: ['pricing', 'plans', 'marketing'],
    items: [
      { componentId: 'typo-divider', x: 0, y: 0, width: 1040, height: 120 },
      { componentId: 'card-pricing', x: 0, y: 140, width: 320, height: 360 },
      { componentId: 'card-pricing', x: 360, y: 140, width: 320, height: 360 },
      { componentId: 'card-pricing', x: 720, y: 140, width: 320, height: 360 },
    ]
  },
  {
    id: 'block-feature-footer',
    name: 'Feature + Footer Row',
    description: 'Feature cards with nav footer treatment.',
    tags: ['feature', 'footer', 'section'],
    items: [
      { componentId: 'card-feature', x: 0, y: 0, width: 320, height: 240 },
      { componentId: 'card-feature', x: 350, y: 0, width: 320, height: 240 },
      { componentId: 'card-feature', x: 700, y: 0, width: 320, height: 240 },
      { componentId: 'nav-breadcrumb', x: 0, y: 280, width: 1020, height: 92 },
    ]
  }
];
