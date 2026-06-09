# HeroUI v2 → v3 Migration — Design

- **Date:** 2026-06-09
- **Branch:** `chore/upgrade-heroui-v3` (based on `chore/deps-major-upgrades`)
- **Status:** Approved design — ready for implementation plan
- **Target:** `@heroui/react` `^2.8.2` → `^3.1.0`

## Goal

Upgrade the app from HeroUI v2 to v3. v3 is a ground-up rewrite (React Aria
Components, compound-component architecture, CSS-first theming via
`@heroui/styles`, native CSS animations instead of Framer Motion, no provider).
This is an upgrade, not a redesign.

## Non-goals

- No visual redesign. No new features.
- No unrelated refactoring beyond what the migration forces.
- E2E (Playwright) authoring is out of scope; existing unit tests are kept green.

## Key decisions

1. **Strategy: big-bang on this branch.** Migrate everything in dependency
   order on the dedicated branch. The app will not build mid-migration; that is
   acceptable because the branch does not merge until the migration is complete
   and visually QA'd. Rejected: incremental coexistence via npm alias — v2's
   theme plugin and v3's `@heroui/styles` would run simultaneously and can
   conflict, plus temporary bundle bloat.
2. **Visual fidelity: hybrid.** Generally adopt v3's new component defaults.
   Preserve our color scheme and any place where we applied intentional custom
   styling. Edge cases are discussed during implementation, not pre-decided.
3. **Commit often.** Commit after every phase and every self-contained
   sub-step (e.g. each component group) so any step can be reverted in
   isolation. Prefer many small commits over few large ones.

## Scope (measured)

28 HeroUI components across ~52 files. No direct `framer-motion` usage in `src`
(it was only a v2 peer dep). Toasts use `react-toastify`, not HeroUI, so v3's
`useToast` removal does not affect us.

Packages today: `@heroui/react ^2.8.2`, `@heroui/system ^2.4.20`,
`@heroui/theme ^2.4.20`, `@heroui/use-disclosure` (transitive).

## v2 → v3 reference (condensed)

**Packages:** remove `@heroui/system`, `@heroui/theme`, `@heroui/use-disclosure`;
add `@heroui/styles`; bump `@heroui/react` → v3. No provider, no Tailwind plugin.

**Provider:** `HeroUIProvider` removed entirely (no replacement).

**Hooks:** `useDisclosure` → `useOverlayState` (from `@heroui/react`); the
prop-getter hooks (`useInput`/`useCheckbox`/`useRadio`/`useSwitch`/`useClipboard`/…)
are removed in favor of compound components.

**Renames:** `Progress`→`ProgressBar`, `CircularProgress`→`ProgressCircle`,
`Listbox`→`ListBox`, `Divider`→`Separator`, `Text`→`Typography`.

**Removals:** `Image` (→ `<img>`), `Snippet`/`Code` (→ styled container + copy
button), `Navbar`, `Spacer`, `User`, `Ripple`.

**Compound rewrites:**
- **Modal:** `ModalContent` eliminated →
  `Modal.Backdrop / Modal.Container / Modal.Dialog / Modal.Header / Modal.Heading / Modal.Body / Modal.Footer`.
  Open state via `useOverlayState` → `<Modal state={state}>` (or `isOpen`/`onOpenChange`
  on `Modal.Backdrop`). `isDismissable` relocates to `Modal.Backdrop`.
- **Button:** `color` + `variant` → single `variant`
  (`primary | secondary | tertiary | outline | ghost | danger | danger-soft`);
  `isLoading`→`isPending`; `startContent`/`endContent`→children; `radius` removed
  (Tailwind `rounded-*`); default width `w-fit`.
- **Input:** → `TextField` + `Input` (+ `InputGroup` for prefix/suffix);
  `label`→`<Label>`, `errorMessage`→`<FieldError>`, `description`→`<Description>`;
  `classNames` slots → `className` on sub-parts; `onValueChange`→`onChange`.
- **Checkbox:** compound `Checkbox.Control` / `Checkbox.Indicator` /
  `Checkbox.Content`; `onValueChange`→`onChange`; `color`/`size` removed.
- **RadioGroup/Radio:** compound; `name` now **required**; `onValueChange`→`onChange`;
  `label`→`<Label>` child.
- **Select:** `Select.Trigger`/`Value` + `ListBox.Item` requiring both `id` and
  `textValue`; `selectedKeys`→`value`, `onSelectionChange`→`onChange`.
- **Tabs/Tab:** `Tabs.List`/`Tabs.Tab`/`Tabs.Panel`; `key`→`id`, matched between
  a tab and its panel.
- **Accordion:** `Accordion.Item` requires `id`.
- **Card:** compound `Card.Header`/`Card.Body`.

**Collection items** (`Select`, `ListBox`, `Accordion`, `Tabs`, `RadioGroup`)
distinguish React `key` (reconciliation only), `id` (selection identity), and
`textValue` (a11y/type-ahead string, required when content is not plain text).

**Requirements:** React 19 (already met), Tailwind 4 (already met).

Sources: `heroui.com/docs/react/migration` and its sub-pages (styling, hooks,
modal, button, input, checkbox, radio-group, select, tabs), plus the v3.0.0
announcement and release notes.

## Migration phases (with commit points)

The app does not build until Phase 4 completes; `tsc` error count is the
burn-down metric. **Commit at the end of each phase, and after each component
group within a phase.**

### Phase 0 — Foundation (theming + packages + provider)
- Swap packages (remove system/theme/use-disclosure, add styles, bump react).
- Delete `src/hero.ts`.
- Rework `src/index.css` (imports + color tokens — see Theming below).
- Remove `<HeroUIProvider>` from `src/index.tsx`.
- Add `data-theme="dark"` to `<html>` in `index.html` (keep `class="dark"`).
- Commit: "heroui v3: foundation (packages, styles, theme tokens, remove provider)".

### Phase 1 — Mechanical components & utilities
- `cn` (verify v3 import path), `Spinner`, `Link`, `Tooltip`.
- Renames: `Progress`→`ProgressBar`, `CircularProgress`→`ProgressCircle`,
  `Listbox`→`ListBox`.
- `Image`→`<img>` (CustomRadio); `Accordion` `id` (ChannelList);
  `Card` compound + `Snippet` removal (Electrs).
- Commit per group (e.g. "heroui v3: spinners/links/tooltips", "heroui v3: renames",
  "heroui v3: Electrs card + snippet replacement").

### Phase 2 — Button
- Migrate the central `src/components/Button.tsx` wrapper: `color`+`variant` →
  `variant` mapping; `isLoading`→`isPending`; icon props → children.
- Update the ~19 call sites passing `color`.
- Commit: "heroui v3: Button wrapper + call sites".

### Phase 3 — Form components (compound rewrites)
- `Input` → `TextField`/`Input`/`InputGroup` (start with `AmountInput.tsx`
  wrapper, then the 10 sites). **Validate react-hook-form integration first.**
- `Checkbox`; `RadioGroup`/`Radio` (+ `CustomRadio` and the `.remove-radio`
  selector); `Select` (`I18nDropdown`, incl. `selectedKeys`→`value`);
  `Dropdown` (`Header`); `Tabs`/`Tab` (SendModal, ReceiveModal, Electrs).
- Commit per component group.

### Phase 4 — Modals
- Rework `src/hooks/use-modalmanager.ts` to `useOverlayState`.
- Rewrite `src/components/ConfirmModal.tsx` to the v3 compound tree.
- Migrate the 8 modal sites; `isDismissable`→`Modal.Backdrop` (SyncScreen).
- Commit: "heroui v3: modal manager + ConfirmModal", then "heroui v3: modal sites".

### Phase 5 — Green gates + visual QA
- Make `tsc` + `lint` + `build` + `test` green (update unit tests as needed).
- devtools-MCP visual QA against the pre-captured baseline (see Verification).
- Commit fixes individually.

## Theming migration (hybrid)

`src/index.css` is the largest single change.

- Replace `@plugin "./hero.ts"` and the `@source ".../@heroui/theme/dist/**"`
  glob with `@import "@heroui/styles";` — **after** `@import "tailwindcss";`
  (order is mandatory).
- Color tokens (sRGB→OKLCH):
  - `primary #4785FF` → v3 `--accent`: `oklch(0.6396 0.1928 262.16)`. Rename
    `bg-primary`/`text-primary`/`border-primary` utilities → `*-accent`.
  - `secondary #BBC6DC` is **removed** in v3 → recreate as a custom token
    `oklch(0.8250 0.0332 264.38)` mapped via `@theme inline { --color-secondary: var(--secondary); }`
    so the 10 `text-secondary` uses keep working (intentional styling → preserved).
  - `tertiary #253553` is already a plain Tailwind `@theme` token (47 uses) —
    keep as-is (optionally convert to `oklch(0.3301 0.0576 262.27)`).
  - Numbered scales `primary-900`/`primary-800` (Stepper, SetupContainer,
    CustomRadio) are **removed** in v3 → define custom `--accent-900`/`--accent-800`
    tokens (or substitute literal Tailwind blue), preserving the current look.
- Set both `:root,[data-theme="light"]` and `.dark,[data-theme="dark"]` blocks
  to the same brand values (dark is the forced, only theme).
- `.bd-*` / underline / `.input-*` custom classes use core Tailwind utilities and
  survive untouched. **Exception:** `.remove-radio > span` targets v2 Radio
  internals and must be retargeted to v3's rebuilt Radio DOM/BEM classes.

Files: `package.json`, `src/hero.ts` (delete), `src/index.css`, `index.html`,
`src/index.tsx`, plus the utility-rename sites listed above.

## Component approach notes

- The custom `Button.tsx` and `AmountInput.tsx` wrappers localize most churn;
  migrate the wrapper once and call sites largely follow.
- **react-hook-form is the key integration risk.** Inputs/Checkbox/Radio/Select
  are driven through RHF `Controller`s. Before mass-editing forms, build one
  reference migration (e.g. `UnlockModal` or `InputPassword`) and confirm v3's
  `onChange`/`value` contract round-trips through RHF. Lock the pattern, then
  apply it across the rest.
- `Snippet` removal in `Electrs`: replace with a styled container + a copy button
  using the app's own `src/hooks/use-clipboard.tsx` (not HeroUI's removed hook).

## Tests

Unit tests that render migrated components break on v3 (the v3 trial showed ~47
failures from changed/removed exports). Update test files within the same phase
as the components they exercise — do not defer to a separate pass. Keep
`npm test` green by end of Phase 5.

## Verification

- **Baseline first:** before Phase 0, capture devtools-MCP screenshots of every
  key screen on the current branch (`chore/deps-major-upgrades` state) to compare
  against.
- **Gates:** `npm run tsc`, `npm run lint`, `npm run build`, `npm test` all green.
- **Visual QA matrix** (devtools MCP, after build is green):
  - Login
  - Home: cards (Bitcoin/Lightning/Connection/Hardware), TransactionCard +
    Listbox + detail modal (ConfirmationsRing), Send/Receive/OpenChannel/
    ListChannel/Unlock modals (+ tabs)
  - Apps: AppCard/AppInfo (tooltips, links), Electrs (tabs, card, copy button)
  - Settings: ChangePw, reboot/shutdown modals
  - Setup wizard: every dialog, radios (CustomRadio), stepper, sync screen
    (progress + non-dismissable modal)
  - Header dropdown + language Select (I18nDropdown)
- Per hybrid fidelity: flag any drift from our color scheme / intentional custom
  styling for discussion; accept v3 default component chrome otherwise.

## Risks & open items (validate during implementation)

- **v3 API freshness** — v3.1.0 is recent. Validate exact compound APIs
  (`Modal.Backdrop`, `Checkbox.Control`, `ListBox.Item`, etc.) against the
  **installed** v3 type definitions before bulk edits, not just the docs.
- `.remove-radio > span` retargeting to v3 Radio DOM.
- `Select` `selectedKeys`→`value` change affects `I18nDropdown` language switching.
- react-hook-form ↔ v3 form-component contract (see Component approach).
- Confirm v3 still exposes `cn` and `Spinner` (or find replacements).

## Rollback

Many small commits (per phase and per component group) make `git revert` or
`git reset` to any checkpoint cheap. Each commit should leave a coherent,
described step even though the app may not build until Phase 4.

## Dependencies / sequencing

Branch is based on `chore/deps-major-upgrades` (React 19 + Tailwind 4 + modern
deps already in place). That branch should merge first; this branch rebases onto
the updated `master` afterward.
