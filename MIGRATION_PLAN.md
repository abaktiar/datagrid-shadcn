# Migration Plan: shadcn v4 + Tailwind v4 + Base UI

Branch: `claude/plan-shadcn-v4-migration-gQv3h`

## 1. Scope & Current State

The project already ships on Tailwind CSS **v4.1.8** (`@tailwindcss/vite`, `@import "tailwindcss"`, `@theme` blocks, `@custom-variant dark`, `@layer base`). shadcn components are on the **new-york** style using Radix primitives.

Radix is used in five UI primitives:

| File | Primitive | Radix package |
|---|---|---|
| `src/components/ui/button.tsx` | `Slot` (for `asChild`) | `@radix-ui/react-slot` |
| `src/components/ui/checkbox.tsx` | `Checkbox.Root/Indicator` | `@radix-ui/react-checkbox` |
| `src/components/ui/dropdown-menu.tsx` | full menu surface | `@radix-ui/react-dropdown-menu` |
| `src/components/ui/context-menu.tsx` | full context menu | `@radix-ui/react-context-menu` |
| `src/components/ui/select.tsx` | `Select.*` | `@radix-ui/react-select` |

Other primitives (`table.tsx`, `input.tsx`, `pagination.tsx`) are plain DOM so they need no library swap, only v4 token audit.

The DataGrid consumes these via `../ui/*` imports; for example `data-grid.tsx:19` imports `Checkbox`. Registry dependencies in `registry.json` list: `button`, `checkbox`, `input`, `select`, `context-menu`, `dropdown-menu`.

## 2. Goals

1. Upgrade the shadcn registry blueprint from Radix-backed primitives to **Base UI** (`@base-ui-components/react`).
2. Keep the **public component API identical** (`<Checkbox>`, `<Select>`, `<DropdownMenu*>`, etc.) so `data-grid/*` files need no changes beyond prop-name tweaks.
3. Modernize Tailwind v4 usage (the "shadcn v4" era conventions): consolidate `@theme` tokens, `@custom-variant dark`, kill unused `@theme inline` duplication, use v4-native animation tokens.
4. Update the shadcn registry JSON so downstream consumers install Base-UI-backed primitives.
5. No visual regression at the demo level (`src/App.tsx`).

## 3. Key API Deltas (Radix → Base UI)

Base UI (`base-ui.com`) uses dot-namespaced exports, a `render` prop (replacing `asChild`), and different data attributes / CSS variables. The most impactful deltas:

| Concern | Radix | Base UI |
|---|---|---|
| Slot / `asChild` | `<Slot>` / `asChild` | `render` prop: `render={<Link />}` |
| Portal | `<Select.Portal>` | `<Select.Portal>` (same name, but often paired with `Select.Positioner`) |
| Positioner node | implicit on `Content` | **explicit** `Select.Positioner`, `Menu.Positioner` |
| Popup node | `Content` | `Popup` (content now wraps inside `Positioner`) |
| State attr | `data-[state=open]` | `data-[open]` / `data-[popup-open]` |
| Item state | `data-[highlighted]` | `data-[highlighted]` (same) |
| Disabled | `data-[disabled]` | `data-disabled` (attribute-only) |
| Anchor vars | `--radix-*-content-transform-origin`, `--radix-*-available-height` | `--transform-origin`, `--available-height`, `--anchor-width` |
| Checkbox indicator | `Checkbox.Indicator` | `Checkbox.Indicator` with `keepMounted` option |
| Submenu | `DropdownMenu.Sub/SubTrigger/SubContent` | `Menu.SubmenuRoot/SubmenuTrigger` + nested `Menu.Positioner` + `Menu.Popup` |
| ContextMenu | `ContextMenu.*` | `ContextMenu.*` (similar shape, uses `Menu.Popup` internally) |

Consequence: every `Content` usage in our UI files becomes `Positioner` wrapping `Popup`, and every class selector keyed on `data-[state=*]` or `--radix-*` must be rewritten.

## 4. Step-by-Step Plan

### Phase 0 — Branch & baseline (Day 0)
1. Branch already created: `claude/plan-shadcn-v4-migration-gQv3h`.
2. Snapshot `npm run build` + `npm run registry:build` output on `main` for diff comparison.
3. Run the dev server once and capture screenshots of: header menu, column-visibility dropdown, per-row context menu, pagination select, checkbox selection — golden-path reference.

### Phase 1 — Dependencies
1. Remove: `@radix-ui/react-checkbox`, `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-slot`.
2. Add: `@base-ui-components/react` (single package, all primitives live under it).
3. Keep: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tw-animate-css` (still works in v4).
4. Confirm `tailwindcss@^4.1.8` and `@tailwindcss/vite@^4.1.8` are current; bump to latest patch.

### Phase 2 — Tailwind v4 / "shadcn v4" styling cleanup
Targets `src/index.css`:
1. Remove the duplicate `@theme` block at the top (`--color-primary: oklch(0.5 0.3 210)`) — it's overridden by the `@theme inline` definitions and the `:root` values. Consolidate into one `@theme inline` block.
2. Replace hand-rolled `@keyframes fade-in-up/slide-in-left/shimmer/...` with Tailwind v4 `@theme` `--animate-*` tokens where we already ship the keyframes, so they're tree-shakeable and typed through `animate-*` utilities.
3. Verify `tw-animate-css` still provides `animate-in/animate-out/fade-in-0/zoom-in-95/slide-in-from-top-2` utilities we use in the menu/select classes — Base UI surfaces these on `[data-open]/[data-closed]` instead of `[data-state=open]/[data-state=closed]`, so the selectors must change in tandem (Phase 3).
4. Audit `oklch()` palette against shadcn's v4 neutral baseline. `components.json` is set to `baseColor: "neutral"`, but the theme here is actually warm/orange. Document this as intentional and leave alone.
5. Delete any `@apply` uses that rely on legacy v3 semantics; `@apply border-border outline-ring/50` in `@layer base` is fine in v4.

### Phase 3 — Rewrite the five UI primitives

For each file in `src/components/ui/*`, rewrite in place so the **exported names stay the same**. This keeps `data-grid/*` untouched.

#### 3.1 `button.tsx`
- Replace `import { Slot } from "@radix-ui/react-slot"` with Base UI's render pattern.
- Change the `asChild` path to use `useRender` from `@base-ui-components/react/use-render` (Base UI's public composition API), or keep `asChild` as a prop and internally branch to `React.cloneElement` — simplest for a button.
- Keep all `cva` variants and `data-slot="button"` unchanged.

#### 3.2 `checkbox.tsx`
- `CheckboxPrimitive.Root` → `Checkbox.Root` from `@base-ui-components/react/checkbox`.
- `CheckboxPrimitive.Indicator` → `Checkbox.Indicator` (same API; pass `keepMounted={false}`).
- Swap `data-[state=checked]:*` classes for `data-[checked]:*` — **this is breaking** for our current class strings, so the full className in `checkbox.tsx:17` must be rewritten.
- Keep `size-4`, border, focus, invalid styling identical.

#### 3.3 `dropdown-menu.tsx`
- `DropdownMenu.Root` → `Menu.Root` (Base UI has no dedicated `DropdownMenu`; the menu primitive is `Menu` with default trigger behavior).
- Introduce `Menu.Positioner` between `Menu.Portal` and `Menu.Popup`. Move the `side/align/sideOffset` props onto `Positioner`.
- Replace `data-[state=open]/closed` with `data-[open]/closed` (Base UI exposes `data-open` on the popup).
- Replace `--radix-dropdown-menu-content-transform-origin` with `--transform-origin`, and `--radix-dropdown-menu-content-available-height` with `--available-height`.
- `DropdownMenu.CheckboxItem` → `Menu.CheckboxItem` + `Menu.CheckboxItemIndicator`.
- `DropdownMenu.RadioGroup/RadioItem` → `Menu.RadioGroup/RadioItem/RadioItemIndicator`.
- `DropdownMenu.Sub/SubTrigger/SubContent` → `Menu.SubmenuRoot/SubmenuTrigger` and a nested `Menu.Positioner` + `Menu.Popup` (keep exported names `DropdownMenuSub*` unchanged at the wrapper level).
- All `data-slot` attributes preserved.

#### 3.4 `context-menu.tsx`
- `ContextMenu.Root/Trigger` → `ContextMenu.Root/Trigger` (Base UI has `@base-ui-components/react/context-menu`).
- Same `Positioner`/`Popup` split as `dropdown-menu.tsx`.
- Translate `data-[state=*]` and `--radix-context-menu-*` vars the same way.
- Reuse the same class strings as `dropdown-menu.tsx` where possible to keep visual parity.

#### 3.5 `select.tsx`
- `SelectPrimitive.*` → `Select.*` from `@base-ui-components/react/select`.
- Base UI `Select` needs: `Select.Root` → `Select.Trigger` → `Select.Portal` → `Select.Positioner` → `Select.Popup` → `Select.List` → `Select.Item`.
- `SelectValue` → `Select.Value` (keep export name `SelectValue`).
- `SelectScrollUp/DownButton` → `Select.ScrollUpArrow/ScrollDownArrow`.
- `--radix-select-content-available-height` → `--available-height`; `--radix-select-trigger-width` → `--anchor-width`; `--radix-select-trigger-height` → `--anchor-height`.
- Base UI Select **does not** accept `position="popper"` — remove the conditional class block and rely on `Select.Positioner side/align/sideOffset` props.
- `Select.Icon asChild` pattern becomes a plain child `<ChevronDownIcon />` inside the trigger — the `asChild` prop doesn't exist.

### Phase 4 — DataGrid integration check
After the UI swap, verify consumers. Mostly mechanical:
1. `data-grid.tsx:19` — `Checkbox` API stays identical, no change needed.
2. `data-grid-context-menu.tsx` — uses `ContextMenu*` and `DropdownMenu*` wrappers; since we kept the wrapper exports, no source changes expected, but run type-check.
3. `data-grid-pagination.tsx` — uses `Select`; same.
4. `data-grid-action-dock.tsx` — uses `DropdownMenu`; same.
5. Run `npm run lint && tsc --noEmit` to catch any residual prop renames.

### Phase 5 — Registry updates
1. Update `registry.json` `items[0].dependencies`: replace Radix packages with `@base-ui-components/react`.
2. `components.json` — no changes needed; `style: new-york`, `baseColor: neutral`, `iconLibrary: lucide` still apply.
3. Re-run `npm run registry:build` and confirm `public/r/data-grid.json` lists Base UI as the dependency.
4. Smoke-test installability with `npx shadcn@latest add <local-registry-url>` in a scratch Next.js app.

### Phase 6 — QA
1. `npm run build` clean.
2. `npm run lint` clean.
3. Manual browser check of every golden-path interaction from Phase 0 screenshots.
4. Dark mode toggle — confirm `.dark` selector still flips tokens because `@custom-variant dark` targets `&:is(.dark *)`, unchanged.
5. Keyboard navigation — Base UI a11y behavior should match; specifically test: arrow keys in menus, typeahead in Select, Escape to close, Tab trap, right-arrow into submenu.
6. Virtualized body rendering (large dataset in `App.tsx`) — no Base UI involvement, but confirm no regression.

### Phase 7 — Commit & push
Split into reviewable commits:
- `chore(deps): swap @radix-ui/* for @base-ui-components/react`
- `refactor(ui): port button/checkbox/select/dropdown-menu/context-menu to Base UI`
- `style(tailwind): consolidate v4 theme tokens and migrate popup selectors`
- `chore(registry): point registry at Base UI dependency`
- `docs: migration plan`

Push to `claude/plan-shadcn-v4-migration-gQv3h` with `git push -u origin claude/plan-shadcn-v4-migration-gQv3h`.

## 5. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Base UI submenu positioning differs, breaks header column menu | Medium | Keep the `Menu.Positioner` props (`side`, `align`, `sideOffset`) explicit and mirror the existing 4px offset |
| `tw-animate-css` selectors keyed on `data-[state=*]` silently no-op | High | Rewrite selectors to `data-[open]`/`data-[closed]` in the same commit as each primitive |
| `Select` width behavior changes (`--radix-select-trigger-width`) breaks dropdown width in pagination | Medium | Replace with `--anchor-width` and visually compare |
| Consumers of the registry have Radix pinned elsewhere | Low | Document in README that the primitive swap is opt-in by re-running `shadcn add` |
| shadcn CLI `canary` version drift | Low | Pin `shadcn@^2.4.0-canary.12` in `devDependencies` until the stable "v4" CLI ships |

## 6. Out of Scope

- No changes to `src/components/data-grid/*` logic.
- No changes to `edit-components.tsx` input types (they're plain DOM).
- No new features.
- No visual redesign — this is a dependency swap, not a restyle.

## 7. Estimated Effort

~1 focused day: half a day porting primitives, a quarter-day on Tailwind v4 cleanup, a quarter-day on QA and registry.
