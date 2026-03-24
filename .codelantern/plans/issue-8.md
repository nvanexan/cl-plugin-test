# Technical Plan: Issue #8 - Add select/deselect all checkbox to item grid

**Status:** Planning
**Branch:** feat/select-deselect-all-checkbox-issue-8
**Created:** 2026-03-24T22:43:49Z
**Issue:** #8

## Context

The equipment item grid currently requires users to toggle each item's checkbox individually. With many items, this is tedious — particularly when wanting to include everything or start fresh. This plan adds a master checkbox in the desktop grid header and a text button on mobile, both of which toggle all currently visible (filtered) items at once. The header checkbox must reflect indeterminate state when only some items are selected. The feature must respect the active category filter and require no new dependencies (Radix UI already supports `checked="indeterminate"`).

## Implementation Approach

Extend `src/App.tsx` with:
1. A `toggleAll` callback that computes aggregate state from `filteredItems` and bulk-updates `items` state in a single `setItems` call.
2. Derived booleans (`allFilteredIncluded`, `someFilteredIncluded`) computed inline from `filteredItems` to drive the header checkbox state and mobile button label.
3. A Checkbox in the desktop grid header "Include" column replacing the current plain text label.
4. A conditional "Select all" / "Deselect all" text button above the item list in the mobile layout.

Extend `src/components/ui/checkbox.tsx` with:
- Indeterminate visual styling: `data-[state=indeterminate]` background/border on the root, and a `MinusIcon` in the indicator (rendered in place of `CheckIcon` when the ancestor root is indeterminate) using Tailwind's arbitrary ancestor variant `[[data-state=indeterminate]_&]`.

This approach is purely additive — no existing logic is removed or changed. The existing `toggleIncluded` per-item handler is untouched. The `sortedItems` array (used in the render map) is a sorted slice of `filteredItems`, so the toggle-all operates on the same filtered set that is displayed.

**Behavior spec:**
- Click when all filtered items are included → deselect all filtered items
- Click when none or some filtered items are included → select all filtered items
- Header checkbox: `checked={allFilteredIncluded ? true : someFilteredIncluded ? "indeterminate" : false}`
- Mobile button label: "Deselect all" when `allFilteredIncluded`, "Select all" otherwise

## Phases

### Phase 1: Checkbox component — indeterminate support

**Goal:** Add visual indeterminate state to the shared Checkbox UI component so it can render a minus/dash icon and the correct background/border when `checked="indeterminate"` is passed.

- [ ] Task 1.1: Import `MinusIcon` from `lucide-react` alongside the existing `CheckIcon`
  - File: `src/components/ui/checkbox.tsx`
  - Notes: lucide-react is already a dependency; no new imports needed from package.json

- [ ] Task 1.2: Add `data-[state=indeterminate]` Tailwind classes to `CheckboxPrimitive.Root`
  - File: `src/components/ui/checkbox.tsx`
  - Notes: Mirror the existing `data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary` classes — add the same three for `indeterminate`

- [ ] Task 1.3: Render `MinusIcon` conditionally inside `CheckboxPrimitive.Indicator`
  - File: `src/components/ui/checkbox.tsx`
  - Notes: Use Tailwind arbitrary ancestor variant to show/hide each icon based on parent root state:
    ```tsx
    <CheckIcon className="size-3.5 [[data-state=indeterminate]_&]:hidden" />
    <MinusIcon className="size-3.5 hidden [[data-state=indeterminate]_&]:block" />
    ```
  - The `Indicator` already only renders when state is `checked` or `indeterminate`, so `MinusIcon` is never visible in the unchecked state.

**Checkpoint criteria:**
- [ ] Passing `checked={true}` shows a check mark with blue background
- [ ] Passing `checked="indeterminate"` shows a minus/dash with blue background
- [ ] Passing `checked={false}` shows an empty box — no regression

### Phase 2: App.tsx — toggle-all logic and UI

**Goal:** Add `toggleAll` handler, derived state, the master checkbox in the desktop header, and the mobile select-all button.

- [ ] Task 2.1: Add `toggleAll` callback near the existing `toggleIncluded` (around line 103)
  - File: `src/App.tsx`
  - Notes:
    ```tsx
    const toggleAll = useCallback(() => {
      const allIncluded = filteredItems.every((item) => item.included)
      const filteredIds = new Set(filteredItems.map((item) => item.id))
      setItems((prev) =>
        prev.map((item) =>
          filteredIds.has(item.id) ? { ...item, included: !allIncluded } : item
        )
      )
    }, [filteredItems, setItems])
    ```
  - `filteredItems` is declared above `toggleAll` in the file (line 144), so this is fine
  - Items outside the current filter are left unchanged

- [ ] Task 2.2: Compute derived booleans from `filteredItems` (inline, after `filteredItems` declaration)
  - File: `src/App.tsx`
  - Notes:
    ```tsx
    const allFilteredIncluded = filteredItems.length > 0 && filteredItems.every((i) => i.included)
    const someFilteredIncluded = filteredItems.some((i) => i.included) && !allFilteredIncluded
    ```

- [ ] Task 2.3: Replace the desktop "Include" text header with a master Checkbox
  - File: `src/App.tsx` (line ~277)
  - Notes: Replace `<div className="col-span-1">Include</div>` with:
    ```tsx
    <div className="col-span-1 flex items-center">
      <Checkbox
        checked={allFilteredIncluded ? true : someFilteredIncluded ? "indeterminate" : false}
        onCheckedChange={toggleAll}
        aria-label="Select all items"
      />
    </div>
    ```
  - Ensure `Checkbox` is imported from `@/components/ui/checkbox` at the top of App.tsx

- [ ] Task 2.4: Add mobile "Select all" / "Deselect all" button above the item list
  - File: `src/App.tsx` (inside the `filteredItems.length > 0` branch, before the `sortedItems.map(...)`)
  - Notes: Add before the `<div className="space-y-2">` that wraps the item list:
    ```tsx
    {/* Mobile select-all button */}
    <div className="md:hidden px-1 pb-1">
      <button
        onClick={toggleAll}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {allFilteredIncluded ? "Deselect all" : "Select all"}
      </button>
    </div>
    ```
  - The button is inside the `filteredItems.length > 0` branch so it only appears when items are visible (satisfies the AC: "Mobile button only appears when there are items to display")

**Checkpoint criteria:**
- [ ] Desktop header "Include" column shows a checkbox instead of text
- [ ] Checking/unchecking the header checkbox toggles all filtered items
- [ ] Indeterminate state shows when some items are included
- [ ] Mobile button appears only when items exist
- [ ] Mobile button label switches between "Select all" and "Deselect all"
- [ ] Category filter respected — toggling all only affects filtered items
- [ ] Budget total updates immediately after toggle

### Phase 3: Storybook story update

**Goal:** Update the Checkbox stories to document the new indeterminate state so it is visible and testable in Storybook.

- [ ] Task 3.1: Add an `Indeterminate` story to `checkbox.stories.tsx`
  - File: `src/components/ui/checkbox.stories.tsx`
  - Notes: Add alongside the existing Default/Checked stories:
    ```tsx
    export const Indeterminate: Story = {
      args: {
        checked: "indeterminate",
      },
    }
    ```

**Checkpoint criteria:**
- [ ] Storybook shows three checkbox states: unchecked, checked, indeterminate
- [ ] Visual appearance is consistent with checked state (blue background, minus icon)

## Files to Modify

| File | Changes | Phase |
|------|---------|-------|
| `src/components/ui/checkbox.tsx` | Add indeterminate styling and MinusIcon indicator | 1 |
| `src/App.tsx` | Add `toggleAll`, derived booleans, header checkbox, mobile button | 2 |
| `src/components/ui/checkbox.stories.tsx` | Add Indeterminate story | 3 |

## New Files to Create

None.

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| `[[data-state=indeterminate]_&]` Tailwind v4 arbitrary variant not resolving | Low | Medium | Test in Storybook first; fallback: use `group`/`group-data-[state=indeterminate]` on root |
| `toggleAll` closure capturing stale `filteredItems` | Low | Low | `filteredItems` is in `useCallback` dependency array; no stale closure risk |
| `onCheckedChange` fires with `true`/`false` not `"indeterminate"` | Not a risk | — | Radix fires `true`/`false` on user click; we ignore the argument and compute desired state ourselves in `toggleAll` |
| Regression to individual item checkboxes | Low | Medium | Existing `toggleIncluded` handler is untouched; only the header and mobile button are new |

## Test Strategy

### Manual Testing
- [ ] Desktop: with no items included, header checkbox is unchecked → click → all items included
- [ ] Desktop: with all items included, header checkbox is checked → click → all items excluded
- [ ] Desktop: with some items included, header checkbox is indeterminate → click → all items included
- [ ] Desktop: with category filter active, toggle all only affects filtered items; unfiltered items unchanged
- [ ] Mobile: "Select all" button appears only when items are present
- [ ] Mobile: label switches to "Deselect all" when all items are included
- [ ] Budget total updates immediately after toggle-all in both layouts
- [ ] Individual item checkboxes continue to work without regression

### Storybook Verification
- [ ] `Checkbox` stories show: Default (unchecked), Checked, and Indeterminate states
- [ ] Indeterminate renders a minus icon with blue background

## Dependencies

None — Radix UI (`@radix-ui/react-checkbox` via `radix-ui` v1.4.3) already supports `checked="indeterminate"`.

## Out of Scope

- Keyboard shortcut for select/deselect all (separate issue)
- Persisting select-all state across sessions
- Batch delete of selected items
