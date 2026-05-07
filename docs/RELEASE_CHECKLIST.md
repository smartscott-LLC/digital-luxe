# Release Checklist (Digital Luxe / ToolSmart)

## Pre-release

- [ ] README reflects current product behavior
- [ ] Architecture/onboarding/copilot docs are up to date
- [ ] Registry cache is current or intentionally pinned
- [ ] Manual browser smoke test completed

## Smoke test matrix

- [ ] Chrome/Edge: launch app, add component, drag/resize/select, pan/zoom
- [ ] Vault: save, load, rename, delete
- [ ] Export: generated HTML opens and renders
- [ ] SmartBar: commands execute correctly
- [ ] Community drawer: import JSON + add to canvas
- [ ] Firefox/Safari fallback behavior (localStorage vault path)

## PWA checks

- [ ] Service worker registers
- [ ] Manifest loads
- [ ] App can launch offline after first load

## Documentation checks

- [ ] Links in README and docs resolve
- [ ] New shortcuts/actions reflected in docs
- [ ] Any data model changes documented in `ARCHITECTURE.md`

## Finalization

- [ ] Conventional commit history is clean
- [ ] PR description summarizes user-visible changes
- [ ] No accidental secrets or private data in commit
