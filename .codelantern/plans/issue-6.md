# Technical Plan: Issue #6 - Add select/deselect all checkbox to item grid

**Status:** Complete
**Branch:** feat/select-all-checkbox-issue-6
**Created:** 2026-03-24T19:23:00Z
**Issue:** #6

## Context

Users must toggle each item's "included" checkbox one at a time. This enhancement adds a select/deselect all checkbox to the grid header (desktop) and above the card list (mobile), using tri-state behavior (checked/unchecked/indeterminate). The toggle operates on filtered items only, respecting the active category filter.

## Implementation Approach

Add the select-all logic and UI directly to `App.tsx` since all item state already lives there. The approach:

1. Compute a derived `allIncludedState` value from `filteredItems` — returns `true`, `false`, or `"indeterminate"`
2. Add a `toggleAllIncluded` callback that maps over all items, flipping only those in the current filtered set
3. Replace the "Include" header text with a `Checkbox` component (desktop)
4. Add a `Checkbox` + label row above the card list (mobile)
5. Update Storybook stories — no new component needed since this is inline in App.tsx, but the existing App-level mock data patterns should be extended if applicable

**Why this approach:** No new components or abstractions needed. The Radix `Checkbox` already supports `checked: boolean | "indeterminate"`, and the filtered items set is already computed. This keeps changes minimal and follows the existing pattern of state management in App.tsx.

**Component reuse:** Uses existing `Checkbox` from `@/components/ui/checkbox`. No new components required.

## Phases

### Phase 1: Core Logic & Desktop UI

**Goal:** Add the select-all checkbox to the desktop table header with full tri-state behavior.

- [x] Task 1.1: Add `allIncludedState` derived value
  - Files: `src/App.tsx`
  - Notes: Compute from `filteredItems`. If all `included: true` → `true`. If all `included: false` → `false`. Otherwise → `"indeterminate"`. Use `useMemo` for consistency with existing patterns.

- [x] Task 1.2: Add `toggleAllIncluded` callback
  - Files: `src/App.tsx`
  - Notes: Wrap in `useCallback`. Build a `Set` of filtered item IDs. If current state is `true` (all included), set all filtered items to `included: false`. Otherwise, set all filtered items to `included: true`. Use `setItems(prev => prev.map(...))` pattern — only flip items whose ID is in the filtered set, leave others unchanged.

- [x] Task 1.3: Replace desktop header "Include" text with Checkbox
  - Files: `src/App.tsx` (line ~277)
  - Notes: Import `Checkbox` (already imported in EquipmentItem but not in App). Replace `<div className="col-span-1">Include</div>` with a `Checkbox` bound to `allIncludedState` and `toggleAllIncluded`. Add `aria-label="Select all items"` for accessibility.

**Checkpoint criteria:**
- [ ] Desktop header checkbox toggles all visible items
- [ ] Indeterminate state shows when items are mixed
- [ ] Category filter correctly scopes the toggle
- [ ] Budget totals recalculate correctly

### Phase 2: Mobile UI

**Goal:** Add the select-all checkbox to the mobile layout.

- [x] Task 2.1: Add mobile "Include all" checkbox row
  - Files: `src/App.tsx`
  - Notes: Add between the category filter badges and the card list (inside the `filteredItems.length > 0` branch). Use `md:hidden` to show only on mobile. Layout: flex row with `Checkbox` + `<span>Include all</span>` label. Same `allIncludedState` and `toggleAllIncluded` bindings as desktop.

**Checkpoint criteria:**
- [ ] Mobile checkbox visible below category badges
- [ ] Same tri-state behavior as desktop
- [ ] Hidden on desktop (`md:hidden`)

### Phase 3: Storybook Stories

**Goal:** Add story coverage for the new checkbox states.

- [x] Task 3.1: Update or add stories showing select-all behavior
  - Files: New story or update to existing stories
  - Notes: Since the select-all checkbox lives in `App.tsx` (not a standalone component), consider adding stories that demonstrate the tri-state checkbox pattern using the `Checkbox` primitive directly. Add stories to `src/components/ui/checkbox.stories.tsx` showing: Default checked, Unchecked, and Indeterminate states with `checked="indeterminate"`.

**Checkpoint criteria:**
- [ ] Storybook shows indeterminate checkbox state
- [ ] All existing stories still render correctly

## Files to Modify

| File | Changes | Phase |
|------|---------|-------|
| `src/App.tsx` | Add Checkbox import, `allIncludedState` memo, `toggleAllIncluded` callback, replace desktop header, add mobile row | 1, 2 |
| `src/components/ui/checkbox.stories.tsx` | Add Indeterminate story variant | 3 |

## New Files to Create

None.

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Category filter + toggle interaction bug (toggling affects wrong items) | Low | Medium | Build filtered ID set explicitly; only map items in that set |
| Indeterminate state not rendering correctly | Low | Low | Radix Checkbox natively supports `"indeterminate"` — verified in component source |
| Performance with large item lists | Very Low | Low | `useMemo` for state computation; `useCallback` for handler — same patterns as existing sort/filter code |

## Test Strategy

### Storybook
- [ ] Checkbox component: add Indeterminate state story
- [ ] Verify existing checkbox stories unchanged

### Manual Testing
- [ ] All items included → header checkbox shows checked
- [ ] No items included → header checkbox shows unchecked
- [ ] Mixed → header checkbox shows indeterminate (dash icon)
- [ ] Click header checkbox when checked → all items deselected, totals go to $0
- [ ] Click header checkbox when unchecked/indeterminate → all items selected, totals recalculate
- [ ] Apply category filter → toggle only affects filtered items
- [ ] Mobile: same behavior with "Include all" checkbox
- [ ] Per-item checkboxes still work independently

## Dependencies

None.

## Out of Scope

- Bulk delete of selected items
- Keyboard shortcut for select/deselect all
- Persisting "select all" state to localStorage
