# Release Checklist (Digital Luxe / ToolSmart)

## Pre-release

- [ ] README reflects current product behavior and module list
- [ ] `ARCHITECTURE.md` persistence table includes any new localStorage keys
- [ ] `AGENT_ONBOARDING.md` high-risk files and gotchas are current
- [ ] New JS modules added to `APP_SHELL` in `sw.js`
- [ ] SW cache version bumped if new files were added to the shell
- [ ] Manual browser smoke test completed

---

## Smoke test matrix

### Canvas
- [ ] Add component from catalog drawer
- [ ] Drag / resize / multi-select / rubber-band select
- [ ] Alignment and distribution tools (dock Canvas panel)
- [ ] Rulers / guides: add guides, verify guide snapping on drag
- [ ] Frames: create/select frames; confirm frame-aware export scope
- [ ] Undo / redo (multiple steps)
- [ ] Pan (Space + drag / middle drag) and zoom (wheel)

### Dock
- [ ] All three strip triggers open/close their panels
- [ ] Component panel reflects selected item and updates on re-select
- [ ] Canvas panel controls work (zoom, snap, align, brand theme)
- [ ] File panel: save, export, danger zone (clear guard fires)
- [ ] Nudge toggles in Canvas panel apply/remove effects correctly
- [ ] Dock closes on Escape and clicking outside

### Catalog
- [ ] Each drawer opens the grid slider
- [ ] Search filters components correctly
- [ ] Grid close button works
- [ ] Same-drawer click collapses grid
- [ ] Component cards drag onto canvas

### Hot Bar
- [ ] ＋ picker opens, shows all action groups
- [ ] Pin an action — it appears in the bar
- [ ] Pinned action runs correctly when clicked
- [ ] Unpin via picker and via right-click
- [ ] Bar persists across page refresh
- [ ] Bar respects 10-slot maximum

### Explore Libraries
- [ ] Trigger button visible in footer left; tagline cycles through all 3 phrases
- [ ] Popup opens above trigger, closes on Escape and outside click
- [ ] All default library URLs open in a new tab without interrupting canvas
- [ ] ✦ badge appears on unvisited URLs; clears after visiting
- [ ] Refresh button marks all as checked
- [ ] Add custom URL — validates label and URL format
- [ ] Remove URL (default and custom)
- [ ] Import HTML → Canvas: paste snippet, name it, verify it lands on canvas
- [ ] State persists across refresh

### Vault
- [ ] Save design (OPFS or localStorage fallback)
- [ ] Load design restores canvas state
- [ ] Rename and delete designs

### Exports
- [ ] Export HTML produces valid document
- [ ] PNG export captures active frame
- [ ] Token JSON export
- [ ] Preview tab opens live frame

### SmartBar
- [ ] ⌘K / Ctrl+K opens palette
- [ ] Commands execute correctly
- [ ] Escape closes

### Safety guards
- [ ] Brand logo click shows save-before-navigate dialog
- [ ] Clear canvas shows Save & Clear / Clear Anyway / Cancel dialog

---

## PWA checks

- [ ] Service worker registers successfully
- [ ] Manifest loads (name, icons, theme color)
- [ ] App can launch offline after first load
- [ ] Install prompt appears in supported browsers

---

## Documentation checks

- [ ] Links in README and docs resolve
- [ ] New shortcuts/actions reflected in keyboard shortcut table
- [ ] New localStorage keys in `ARCHITECTURE.md` persistence table
- [ ] New modules listed in README repo structure and ARCHITECTURE module map

---

## Finalization

- [ ] Conventional commit history is clean
- [ ] PR description summarizes user-visible changes
- [ ] No accidental secrets or private data in commit
