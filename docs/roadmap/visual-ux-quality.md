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
- Active visual branch: `ui/settings-child-theme-affordances`.
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
- Retired glyph/disabled styles were removed and the diary source contract was updated.
- Diary data, date selection, meal expansion, Add Food routing, calculations and SectionList behavior are unchanged.

### VUX-4B — Add Food action icon consistency — PR #474

- Search clear and Portion Sheet close → Lucide X.
- Favorite controls → Lucide Star with selected fill.
- Quick-add controls → Lucide Plus.
- Saved Meal delete → Lucide Trash2.
- Existing 44 pt control geometry/hit slop and localized labels are preserved.
- Clear localized text actions such as Scan/Cancel remain text.
- Retired glyph-only styles were removed and a focused source-contract guard was added.
- Search/provider behavior, food data, favorites, meal templates, portion logic, routes, persistence and sync are unchanged.

### VUX-3C — Progress body-measurement hierarchy — PR #475

- Body Measurements keeps one owning `AppCard`; the editor is flat content inside it.
- A quiet hairline divider separates the editor instead of a nested raised/bordered card.
- Metric radio choices explicitly own a 44 pt minimum touch height; unit controls remain 48 pt.
- A focused source-contract guard protects hierarchy/touch ownership.
- Measurement model, supported units/ranges, analytics, persistence and sync remain unchanged.

### VUX-3D — Progress weight action ownership — PR #476

- `Weight details` beside the weight hero is the sole `/weight-details` owner on the Progress screen.
- The duplicate `Training details` button was removed.
- `Add weight` remains the only bottom action under the weight chart.
- A focused source-contract guard requires exactly one `/weight-details` push.
- Weight analytics, chart/range behavior, routes, persistence and sync remain unchanged.

### VUX-3E — Progress compact selector touch targets — PR #477

- Weight range tabs explicitly own a 44 pt minimum height while preserving tablist/tab semantics.
- Safety & Recovery period chips in both historical Progress surfaces now own a 44 pt minimum height.
- Weekly Safety selected-history filter chips now own a 44 pt minimum height.
- Selection/history semantics, period definitions, chart data and routes are unchanged.
- A focused source-contract guard protects the compact control geometry.

### VUX-4C — Coach input touch targets — PR #478

- Recovery score controls now own a 44 pt minimum height.
- Recovery `Clear` owns a 44 pt Pressable surface and exposes its disabled accessibility state.
- Recovery and Limitations back controls now use 44 × 44 geometry.
- Limitation movement chips explicitly own a 44 pt minimum height.
- Recovery scoring, required signals, limitation state transitions, routes, persistence and sync remain unchanged.
- A focused source-contract guard protects the interaction geometry.

### VUX-4D — Coach review touch targets — PR #479

- Safety & Recovery review back navigation now owns 44 × 44 geometry.
- Safety & Recovery review period controls now own a 44 pt minimum height.
- Combined review back navigation now owns 44 × 44 geometry.
- Review calculations, period semantics, generation behavior, routes, persistence and sync remain unchanged.
- A focused source-contract guard protects the review interaction geometry.

### VUX-4E — Coach history filter accessibility — PR #480

- Coach History domain/status pills now own a 44 pt minimum interaction height.
- Active domain/status filters expose `accessibilityState.selected` instead of relying on visual state alone.
- Filter values, query construction, loading/error behavior, routes and backend contracts remain unchanged.
- A focused source-contract guard protects filter geometry and selected state.

### VUX-4F — remaining Coach back touch targets — PR #481

- Safety Recovery Preflight back navigation now owns 44 × 44 geometry.
- Combined Proposal back navigation now owns 44 × 44 geometry.
- Localized accessibility labels and existing `router.back()` behavior are preserved.
- Preflight gating, combined proposal generation/confirmation, sync and persistence remain unchanged.
- A focused source-contract guard protects the final audited Coach back geometry findings.

### VUX-4G — Coach strategy back icon language — PR #482

- Strength Coach, Nutrition Coach and Nutrition Target Proposal now use Lucide `ChevronLeft` instead of raw text `‹` for the back action.
- Existing Pressable geometry, 44 pt touch ownership, pressed states, localized accessibility labels and `router.back()` behavior are preserved.
- Coach generation/review/confirmation logic, period selection, sync, persistence and routes remain unchanged.
- A focused source-contract guard protects the strategy/review navigation icon language.

### VUX-4H — secondary Coach back icon language — PR #483

- Combined Review, Recovery Check-in, Safety Recovery Review and User Limitations now use Lucide `ChevronLeft` instead of raw text `‹` for the back action.
- Existing Pressable geometry, 44 pt ownership, pressed states, localized accessibility labels and `router.back()` behavior are preserved.
- Combined/recovery/limitation models, forms, review generation, sync, persistence and routes remain unchanged.
- A focused source-contract guard protects the secondary navigation icon language.

### VUX-4I — complete Coach back navigation language — PR #484

- Coach History, Coach History Detail, Safety Recovery Preflight and Combined Proposal now use Lucide `ChevronLeft` instead of raw text `‹` for the back action.
- Coach History and Coach History Detail now expose the localized `common.back` accessibility label.
- Existing 44 pt geometry, history/filter behavior, preflight gating, combined proposal behavior, sync and persistence are unchanged.
- A directory-level source guard prevents raw `‹` action glyphs from returning anywhere under `src/features/coach/screens`.

### VUX-5A — Settings shell hardening — PR #485

- Settings now owns top/bottom safe-area padding while its native stack header remains intentionally hidden.
- The parent scroll is keyboard-aware so Personal Details inputs and actions remain reachable.
- Settings back navigation now uses Lucide `ChevronLeft` with the existing 44 pt target and localized label.
- Settings section/block copy now resolves from the current app theme instead of static `Colors.dark` text colors.
- Header copy owns narrow/large-text reflow through `minWidth: 0` / `flexShrink`.
- Preferences, account/session behavior, unit semantics, Personal Details validation, sync, OTA developer actions and persistence remain unchanged.
- A focused source-contract guard protects the shell contracts.

### VUX-5B — Profile theme consistency — PR #486

- Profile shell background, headings and Settings affordance now resolve from `useAppTheme()` instead of static `Colors.dark`.
- Profile Goals disclosure surface/border/text now resolve from the current theme.
- Profile Goals card title/label now resolve from the current theme.
- Existing safe-area/floating-tab clearance, keyboard behavior, goal validation, confirmation, nutrition-target recalculation, persistence, routes and Social entry behavior are unchanged.
- A focused source-contract guard rejects `Colors.dark` in the three audited Profile presentation files.

## VUX-5C — Settings child theme and affordances

**Status: active on `ui/settings-child-theme-affordances`.**

Audit findings:

- `PersonalDetailsSettingsCard` still hard-coded `Colors.dark` for titles, helper copy, radio options, selected surfaces and error/success-adjacent presentation despite explicit light/dark appearance support.
- The Coach History disclosure in About Settings used a raw `›` text action glyph while the rest of the updated navigation/action language uses Lucide icons.
- `SyncSettingsCard` and the Privacy/About text palette are already current-theme aware and do not need broader restyling.
- Support-only diagnostics remain a separate audit surface and are intentionally excluded from this user-facing package.

Current bounded remediation:

- Bind Personal Details copy, radio controls and selected states to `useAppTheme()` while preserving the existing DOB/formula validation and 46 pt option geometry.
- Replace the About Coach History raw `›` glyph with Lucide `ChevronRight` while preserving its route and accessibility label.
- Add a focused source-contract guard.
- Do not change personal-details validation, calculation-sex semantics, profile persistence, Coach History routing, diagnostics data, sync, auth or backend contracts.

**Merge gate:** full exact-head Mobile CI.

## Remaining hierarchy / validation review order

1. Finish VUX-5C Settings child theme and affordances.
2. Audit support-only Settings diagnostics for static theme assumptions as a separate bounded package.
3. Secondary Social surfaces.
4. Return to Workouts/Nutrition/Progress only for concrete audited defects.

For each surface verify one obvious primary action, restrained surface nesting, EN/RU/Dynamic Type resilience, consistent interaction states and coherent loading/empty/error/success presentation.

## Validation matrix

Runtime UI PRs require exact-head:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded sync smoke;
- Expo export;
- Expo Doctor.

Physical/release evidence remains separately authorization-gated: narrow/short phones, large text, EN/RU, keyboard-open states, iPhone safe areas, Android system insets, and populated/empty/disabled/loading/error/success states.

No source/CI result is physical-device evidence.

## Next execution order

1. Finish VUX-5C and run full exact-head Mobile CI.
2. Merge only the validated VUX-5C head.
3. Audit support-only Settings diagnostics as a separate package.
4. Continue to Social only from concrete source findings.
5. Keep backend, OTA/EAS/native/release and production/provider actions out of this autonomous UI sequence unless directly requested.
