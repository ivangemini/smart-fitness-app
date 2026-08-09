# Visual UX and information architecture roadmap

Updated: 2026-08-09

## Current checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`
- Responsive Phase 10 is source/CI complete through RUI-6.
- VUX-1A PR #468 → `c6092048e3b94e7fc372c783a26668fa897428b0`.
- VUX-1B PR #469 → `511cb08e2e1ec6e3575b2fff35a482a570bdae28`.
- VUX-2A PR #470 → `a5983354d6850ed00ac5d79a0db91981ddee1faa`.
- VUX-3A Home Summary PR #471 → `a83d65d559f4542fa01e7a4588fb134b474a7346`.
- VUX-2B Profile Goals PR #472 → `1d717b114faefbac3101ff0c340554d53a7651bd`.
- VUX-3B / VUX-4A Nutrition diary affordances PR #473 → `158d3adb2b2e0a8fcc585951b8633b50260fc53c`.
- VUX-4B Add Food action affordances PR #474 → `5eaa389328e3c649b63833fcf511484e7e2321b4`.
- VUX-3C Progress measurement hierarchy PR #475 → `afcb93924d1d7fc2c74cbe18122495eaf5300aea`.
- VUX-3D Progress weight action ownership PR #476 → `fd361bc5eaf10a2be8054488d9a0cbc6cbcfa41a`.
- VUX-3E Progress compact selector touch targets PR #477 → `b58356f5b814b076c964ef249f4a0cc12c30dffd`.
- VUX-4C Coach input touch targets PR #478 → `8e73fcb76b77c834b81c63d998d6dfa1f85b0524`.
- VUX-4D Coach review touch targets PR #479 → `4add9d5dd7342c662d1a095ce86a436b5024a758`.
- VUX-4E Coach history filter accessibility PR #480 → `35acf1a2cafb0e491b34fa7720b572f12d473c45`.
- VUX-4F remaining Coach back touch targets PR #481 → `43eef67c867e88cd832acc719c5b4f8529d32783`.
- VUX-4G Coach strategy back icon language PR #482 → `59cf4c2d80bb17c2a9f362c19fd35e032e17ac2c`.
- VUX-4H secondary Coach back icon language PR #483 → `acb9de8df023ebfce8a04ded1697c2c4c22798e0`.
- VUX-4I complete Coach back navigation language PR #484 → `c8318d625a7eb8a489e3e51c005898cc283f0a37`.
- VUX-5A Settings shell hardening PR #485 → `ff81c5fb737704e8d15605f8435729ef3e8be8d1`.
- VUX-5B Profile theme consistency PR #486 → `c7928b25dc2d01a3a3fc891e0ff8496cdeb1710a`.
- VUX-5C Settings child theme and affordances PR #487 → `78238c6ff457fa532eae27c2f211b36b2319325d`.
- VUX-5D Settings support/developer theme consistency PR #488 → `1adb5dd31e491e76eabcc60a8ce0d3d9d6f4dc0b`.
- VUX-6A Social Profile Lookup shell/input hardening PR #489 → `46829390a5215b453ac5a054e1fdc40edba4ca27`.
- VUX-6B Social information/list shell hardening PR #490 → `e152fc7bb693b1fe40980d3b8a60a035302a4e9c`.
- VUX-6C Social workout-post shell hardening PR #491 → `95797bfbcf94d54c9b01da0cf238077bbd990f41`.
- VUX-6D Social profile/share shell hardening PR #492 → `625371ca7cde8c45178fd8bf21b2bb012bc4ea4f`.
- Active visual branch: `ui/progress-theme-consistency` (VUX-7A).
- Backend is a separate workstream and remains outside this roadmap execution.

Source/CI completion is not physical-device proof. OTA/EAS publication, native build/install, provider/production activation and store/release actions remain separately authorization-gated.

## Product principles

- Keep the public tabs focused on Home, Workouts, Nutrition, Progress and Coach.
- Use one Lucide icon language for action controls; do not replace intentional content symbols merely because they are not icons.
- Preserve at least 44 pt touch ownership through control size or hit slop.
- Never communicate disabled state through opacity alone.
- When a disabled action is not self-explanatory, show the blocking reason near the relevant field/action and expose it to accessibility.
- Prefer one clear owning surface over decorative card-within-card nesting.
- Give each destination/action one clear owner inside a surface; do not duplicate the same route under different labels.
- Preserve EN/RU localization, Dynamic Type/reflow, routes, persistence, sync, calculations and backend contracts during visual work.
- Presentation colors must resolve from `AppThemeProvider`; avoid local `Colors.dark` assumptions on theme-aware product surfaces.

## Completed visual packages

### VUX-1A — shared primitives — PR #468

- Lucide Settings in Profile.
- Explicit disabled surface/border/text states for shared Primary, Secondary and Destructive buttons.
- Loading remains visually distinct from disabled/unavailable.

### VUX-1B — primary affordances — PR #469

- Home profile emoji → Lucide User.
- Workouts History/Search/Start → Lucide History/Search/Play.
- Program-row action glyphs → Plus/Heart/Dumbbell.
- History uses shared floating-tab clearance; Search owns a 44 pt touch target.
- Create Program retains its required-name helper with an explicit disabled state.

### VUX-2A — Active Workout Finish — PR #470

- Existing completed-set requirement preserved.
- Visible EN/RU blocking reason + accessibility hint.
- Explicit disabled state and 44 pt Finish target.
- Session header controls use Lucide ChevronDown/Timer/Ellipsis.

### VUX-2B — Profile Goals — PR #472

- Existing validity boundaries preserved: target weight > 0, weekly change >= 0, training days integer 1–7.
- EN/RU field-level errors explain why Save is unavailable.
- First blocking reason is exposed as the disabled Save accessibility hint.
- Confirmation, nutrition-target recalculation and persistence behavior are unchanged.

### VUX-3A — Home Summary — PR #471

- One owning accent/warning summary surface instead of nested cards.
- Calories is a flat status block.
- Current Weight and Streak are flat metrics below a divider.
- Values/calculations/warning conditions/order are unchanged.

### VUX-3B / VUX-4A — Nutrition diary affordances — PR #473

- Calendar emoji → Lucide CalendarDays.
- Meal Add / expand-collapse glyphs → Lucide Plus / ChevronDown / ChevronRight.
- Today has an explicit disabled background/border/text state instead of opacity-only treatment.
- Week-strip accessibility labels are localized in EN/RU.
- Diary data, date selection, meal expansion, Add Food routing, calculations and SectionList behavior are unchanged.

### VUX-4B — Add Food action icon consistency — PR #474

- Search clear and Portion Sheet close → Lucide X.
- Favorite controls → Lucide Star with selected fill.
- Quick-add controls → Lucide Plus.
- Saved Meal delete → Lucide Trash2.
- Existing 44 pt control geometry/hit slop and localized labels are preserved.
- Search/provider behavior, food data, favorites, meal templates, portion logic, routes, persistence and sync are unchanged.

### VUX-3C — Progress body-measurement hierarchy — PR #475

- Body Measurements keeps one owning `AppCard`; the editor is flat content inside it.
- A quiet hairline divider separates the editor instead of a nested raised/bordered card.
- Metric radio choices explicitly own a 44 pt minimum touch height; unit controls remain 48 pt.
- Measurement model, supported units/ranges, analytics, persistence and sync remain unchanged.

### VUX-3D — Progress weight action ownership — PR #476

- `Weight details` beside the weight hero is the sole `/weight-details` owner on the Progress screen.
- The duplicate `Training details` button was removed.
- `Add weight` remains the only bottom action under the weight chart.
- Weight analytics, chart/range behavior, routes, persistence and sync remain unchanged.

### VUX-3E — Progress compact selector touch targets — PR #477

- Weight range tabs explicitly own a 44 pt minimum height while preserving tablist/tab semantics.
- Safety & Recovery period chips in both historical Progress surfaces now own a 44 pt minimum height.
- Weekly Safety selected-history filter chips now own a 44 pt minimum height.
- Selection/history semantics, period definitions, chart data and routes are unchanged.

### VUX-4C — Coach input touch targets — PR #478

- Recovery score controls now own a 44 pt minimum height.
- Recovery `Clear` owns a 44 pt Pressable surface and exposes its disabled accessibility state.
- Recovery and Limitations back controls now use 44 × 44 geometry.
- Limitation movement chips explicitly own a 44 pt minimum height.
- Recovery scoring, required signals, limitation state transitions, routes, persistence and sync remain unchanged.

### VUX-4D — Coach review touch targets — PR #479

- Safety & Recovery review back navigation now owns 44 × 44 geometry.
- Safety & Recovery review period controls now own a 44 pt minimum height.
- Combined review back navigation now owns 44 × 44 geometry.
- Review calculations, period semantics, generation behavior, routes, persistence and sync remain unchanged.

### VUX-4E — Coach history filter accessibility — PR #480

- Coach History domain/status pills now own a 44 pt minimum interaction height.
- Active domain/status filters expose `accessibilityState.selected` instead of relying on visual state alone.
- Filter values, query construction, loading/error behavior, routes and backend contracts remain unchanged.

### VUX-4F — remaining Coach back touch targets — PR #481

- Safety Recovery Preflight and Combined Proposal back navigation now own 44 × 44 geometry.
- Localized accessibility labels and existing `router.back()` behavior are preserved.
- Preflight gating, combined proposal generation/confirmation, sync and persistence remain unchanged.

### VUX-4G / VUX-4H / VUX-4I — complete Coach back icon language — PRs #482–#484

- Coach strategy/review/history/preflight/proposal surfaces now use Lucide `ChevronLeft` instead of raw text `‹`.
- Existing Pressable geometry, localized accessibility labels, routing and Coach domain behavior are preserved.
- A directory-level source guard prevents raw `‹` action glyphs from returning under `src/features/coach/screens`.

### VUX-5A — Settings shell hardening — PR #485

- Settings owns top/bottom safe-area padding while its native stack header remains intentionally hidden.
- The parent scroll is keyboard-aware so Personal Details inputs and actions remain reachable.
- Back navigation uses Lucide `ChevronLeft` with 44 pt ownership.
- Settings copy resolves from the current app theme and header copy owns narrow/large-text reflow.
- Preferences, account/session behavior, unit semantics, validation, sync and OTA developer actions are unchanged.

### VUX-5B — Profile theme consistency — PR #486

- Profile shell, headings, Settings affordance and Profile Goals presentation resolve from `useAppTheme()` instead of static `Colors.dark`.
- Existing safe-area/floating-tab clearance, goal validation, nutrition-target recalculation, persistence, routes and Social entry behavior are unchanged.

### VUX-5C — Settings child theme and affordances — PR #487

- Personal Details copy, radio controls and selected states resolve from `useAppTheme()`.
- Existing DOB/formula validation and 46 pt option geometry are preserved.
- About Settings Coach History disclosure uses Lucide `ChevronRight`.

### VUX-5D — Settings support/developer theme consistency — PR #488

- `ProfileActionsCard`, `ProfileRuntimeInfoCard` and `LocalPerformanceDiagnosticsCard` resolve presentation colors from the current app theme.
- Developer preview/reset routes, OTA behavior and diagnostics behavior are unchanged.
- Exact head `8aa052b8ae8f73b83fc2f56d2d29d55d64eb9d83` passed full Mobile CI #1895 before merge.

### VUX-6A — Social Profile Lookup shell/input hardening — PR #489

- Runtime top/bottom safe-area spacing, keyboard-aware username form, Lucide back and bounded header reflow.
- Username validation/normalization, auth gating and route targets are unchanged.
- Exact head `6ae33cb32ac1b70ac0fb53bde6a5f4333632ceb2` passed full Mobile CI #1898 before merge.

### VUX-6B — Social information/list shell hardening — PR #490

- Community Guidelines, Notifications and Relationship Lists own runtime safe-area spacing and Lucide back navigation.
- Header/list reflow is bounded and Relationship List tabs own 44 pt targets.
- Notification/relationship API behavior, auth/session, routes, persistence, sync and backend contracts are unchanged.
- Exact head `ff5760526751ce90d3e51c249d5dca9b831f4378` passed full Mobile CI #1901 before merge.

### VUX-6C — Social workout-post shell hardening — PR #491

- Following Feed, Profile Workout Posts and Workout Post Detail own runtime safe-area spacing and Lucide back navigation.
- Shared fixed top/back-label styles were removed and comment Report/Delete actions own 44 pt targets.
- Feed cache/pagination, post loading/deletion, comments, reactions, reports and routes are unchanged.
- Exact head `e1d04baea8b60bd932f1e896afb97de79d37e82e` passed full Mobile CI #1903 before merge.

### VUX-6D — Social profile/share shell hardening — PR #492

- Social Public Profile, Social Profile Editor and Share Workout own runtime top/bottom safe-area spacing with Lucide `ChevronLeft` navigation.
- Share Workout back ownership is 44 × 44 instead of 40 × 40.
- Public Profile reflow now owns `flexGrow`/bounded shrink where missing.
- Public Profile relationship/report behavior, Profile Editor validation/avatar/save behavior, and Share Workout sync/idempotency/media/moderation/publish behavior are unchanged.
- A focused source-contract guard protects the package.
- Exact head `fae691fec350ae81d637c9edadeee2b868ca4cdd` passed full Mobile CI #1905 before merge.

## VUX-7A — Progress theme consistency

**Status: active on `ui/progress-theme-consistency`.**

Confirmed findings:

- `AppThemeProvider` resolves a real light/dark/system palette, while the Progress tab still hard-coded `Colors.dark` for its own shell, weight/measurement copy and controls;
- the shared Progress trend chart and Weekly Workout Volume card also hard-coded dark-only surfaces/text;
- both visible Safety & Recovery Progress cards hard-coded `Colors.dark` in their style modules and status/chart colors;
- the body-measurement editor used static dark input, border, text and placeholder colors;
- Workouts and Nutrition audits did not reveal a higher-priority interaction defect: compact Nutrition actions already expand ownership through `hitSlop`, and audited Workouts actions already own 44 pt targets.

Current bounded remediation:

- resolve the Progress tab, body-measurement editor, trend chart, weekly volume and both Safety/Recovery cards from `useAppTheme()`;
- convert the two Safety/Recovery style modules to theme factories and derive status/chart colors from the active palette;
- preserve existing 44/48 pt interaction geometry, selected accessibility state and floating-tab clearance;
- preserve weight/body-measurement analytics, Safety/Recovery analytics, trend/range semantics, workout history parameters, units, routes, persistence and sync contracts;
- protect the package with a focused source-contract guard that rejects `Colors.dark.` in the touched Progress presentation files.

**Merge gate:** full exact-head Mobile CI on the final documentation-synchronized head, with no unresolved review threads.

## Remaining hierarchy / validation review order

1. Finish VUX-7A Progress theme consistency and merge only its validated exact head.
2. Continue Workouts/Nutrition/Progress audit only from concrete source findings; do not create cosmetic churn without a demonstrated defect.
3. Revisit remaining secondary surfaces for theme consistency, 44 pt ownership, safe-area/reflow and disabled-state clarity only when a concrete mismatch is found.

For each surface verify one obvious primary action, restrained surface nesting, EN/RU/Dynamic Type resilience, current-theme consistency, consistent interaction states and coherent loading/empty/error/success presentation.

## Validation matrix

Runtime UI PRs require exact-head:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model runner smoke;
- Expo export;
- Expo Doctor.

Physical/release evidence remains separately authorization-gated: narrow/short phones, large text, EN/RU, keyboard-open states, iPhone safe areas, Android system insets, light/dark/system appearance, and populated/empty/disabled/loading/error/success states.

No source/CI result is physical-device evidence.

## Next execution order

1. Finish VUX-7A and run full exact-head Mobile CI on the final documentation-synchronized head.
2. Merge only the validated VUX-7A head.
3. Continue the audited Workouts/Nutrition/Progress sequence only where source evidence demonstrates a real UI defect.
4. Keep backend, OTA/EAS/native/release and production/provider actions out of this autonomous UI sequence unless directly requested.
