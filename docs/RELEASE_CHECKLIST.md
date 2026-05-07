# Release Checklist (Digital Luxe / ToolSmart)

## Pre-release

- [ ] README reflects current product behavior
- [ ] Architecture/onboarding/copilot docs are up to date
- [ ] Registry cache is current or intentionally pinned
- [ ] Manual browser smoke test completed

## Smoke test matrix

- [ ] Chrome/Edge: launch app, add component, drag/resize/select, pan/zoom
- [ ] Multi-select toolbar: align/distribute/match-size works correctly
- [ ] Rulers/guides: add guides and verify guide snapping on drag
- [ ] Frames: create/select frames and confirm frame-aware export scope
- [ ] Vault: save, load, rename, delete
- [ ] Export: HTML, PNG, token JSON, and Preview all work
- [ ] SmartBar: commands execute correctly
- [ ] Community drawer: import JSON + add to canvas
- [ ] Blocks drawer: insert curated blocks and edit contained components
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
