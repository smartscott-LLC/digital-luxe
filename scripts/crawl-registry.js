#!/usr/bin/env node
/**
 * Digital Luxe — Registry Crawler (Phase 3)
 *
 * Fetches component data from shadcn/ui-compatible public registries and
 * saves HTML/CSS-only components to data/registry-cache.json.
 *
 * Usage:
 *   node scripts/crawl-registry.js
 *   node scripts/crawl-registry.js --registry https://example.com/registry.json
 *
 * The generated file is read by catalog.js to populate the Community drawer.
 */

import https  from 'https';
import http   from 'http';
import fs     from 'fs';
import path   from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT    = path.join(__dirname, '..', 'data', 'registry-cache.json');

// ── Known community registries ────────────────────────────────
// Add more registry.json URLs here as the community grows.
// These must expose JSON in the shadcn registry format.
const REGISTRY_URLS = [
  // The official shadcn/ui registry index
  'https://ui.shadcn.com/registry/index.json',
];

// Parse CLI overrides: --registry <url>
const args = process.argv.slice(2);
const cliIdx = args.indexOf('--registry');
if (cliIdx !== -1 && args[cliIdx + 1]) {
  REGISTRY_URLS.push(args[cliIdx + 1]);
}

// ── HTTP fetch helper (no external deps) ─────────────────────
function fetchUrl(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects === 0) return reject(new Error(`Too many redirects: ${url}`));
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'digital-luxe-crawler/1.0', 'Accept': 'application/json' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, redirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end',  () => resolve(data));
    });
    req.setTimeout(12000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
    req.on('error', reject);
  });
}

// ── Determine if a component is renderable without React/TS ──
function isHtmlCssRenderable(entry) {
  if (!entry) return false;
  const files = entry.files || [];
  // Must have at least one file with actual content
  if (!files.length) return false;

  for (const file of files) {
    const content = file.content || '';
    // Skip if it requires React imports or TypeScript
    if (/import\s+React|from\s+['"]react['"]|tsx?['"]/.test(content)) return false;
    if (/export\s+default\s+function/.test(content)) return false;
    if (/className=/.test(content)) return false;
  }

  return true;
}

// ── Convert a registry entry into a DLX component object ─────
function registryEntryToDlx(entry) {
  const files   = entry.files || [];
  let   html    = '';
  let   css     = '';

  for (const file of files) {
    const content = file.content || '';
    if (file.path?.endsWith('.css') || file.type === 'registry:style') {
      css += content + '\n';
    } else if (file.path?.endsWith('.html') || file.type === 'registry:component') {
      html = content;
    }
  }

  if (!html && !css) return null;

  return {
    id         : `reg-${entry.name}`,
    category   : 'community',
    name       : entry.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: entry.description || 'Community component',
    tags       : [...(entry.categories || []), 'community', entry.name],
    source     : entry.registryDependencies?.[0] || 'community',
    html,
    css        : css || ':host { display:block; padding:1rem; }',
  };
}

// ── Process one registry URL ──────────────────────────────────
async function processRegistry(url) {
  console.log(`\nFetching registry: ${url}`);
  let rawIndex;
  try {
    rawIndex = await fetchUrl(url);
  } catch (e) {
    console.warn(`  ⚠ Could not fetch ${url}: ${e.message}`);
    return [];
  }

  let index;
  try {
    index = JSON.parse(rawIndex);
  } catch {
    console.warn(`  ⚠ Invalid JSON from ${url}`);
    return [];
  }

  const items = Array.isArray(index) ? index : (index.items || index.components || []);
  console.log(`  Found ${items.length} entries`);

  const components = [];
  for (const item of items.slice(0, 60)) { // cap to avoid rate limits
    const itemUrl = item.files
      ? null                        // already has full data
      : (item.url || `${url.replace(/\/[^/]+$/, '')}/${item.name}.json`);

    let entry = item;
    if (itemUrl) {
      try {
        const raw = await fetchUrl(itemUrl);
        entry = JSON.parse(raw);
      } catch {
        continue;
      }
    }

    if (!isHtmlCssRenderable(entry)) continue;

    const dlx = registryEntryToDlx(entry);
    if (dlx) {
      components.push(dlx);
      process.stdout.write('.');
    }
  }

  console.log(`\n  Imported ${components.length} renderable components`);
  return components;
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('Digital Luxe Registry Crawler');
  console.log('================================\n');

  // Load existing cache so we can merge / update
  let existing = [];
  if (fs.existsSync(OUTPUT)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT, 'utf8')).components || [];
    } catch { /* start fresh */ }
  }

  const fetched = [];
  for (const url of REGISTRY_URLS) {
    const comps = await processRegistry(url);
    fetched.push(...comps);
  }

  // Merge: newly fetched overrides existing by id
  const byId = new Map(existing.map(c => [c.id, c]));
  fetched.forEach(c => byId.set(c.id, c));
  const merged = [...byId.values()];

  const output = {
    version     : 1,
    generatedAt : new Date().toISOString(),
    count       : merged.length,
    components  : merged,
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\nSaved ${merged.length} components to ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
