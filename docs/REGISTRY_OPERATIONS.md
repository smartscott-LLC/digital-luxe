# Registry Operations Runbook

## Purpose

Maintain and refresh `data/registry-cache.json` used by the Community drawer.

## Refresh process

```bash
node scripts/crawl-registry.js
```

Optional custom source:

```bash
node scripts/crawl-registry.js --registry https://example.com/registry.json
```

## Expected output

- `data/registry-cache.json` updated with:
  - `version`
  - `generatedAt`
  - `count`
  - `components[]`

## Acceptance checks

1. JSON file is valid and committed.
2. App loads without console errors.
3. Community drawer displays imported entries.
4. Add-to-canvas works for at least 3 refreshed components.

## Suggested automation

Use a scheduled GitHub Actions workflow to:
1. run crawler
2. commit cache update
3. open pull request for review

## Failure handling

If crawler fails due to remote format drift:
- keep last-known-good cache
- log failing registry URL
- patch crawler parser conservatively
