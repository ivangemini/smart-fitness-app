# Visual UX and information architecture roadmap

Updated: 2026-08-09

## Current checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
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
- VUX-4C through VUX-4I Coach interaction/navigation hardening → PRs #478–#484.
- VUX-5A through VUX-5D Settings/Profile theme and shell hardening → PRs #485–#488.
- VUX-6A Social Profile Lookup shell/input hardening PR #489 → `46829390a5215b453ac5a054e1fdc40edba4ca27`.
- VUX-6B Social information/list shell hardening PR #490 → `e152fc7bb693b1fe40980d3b8a60a035302a4e9c`.
- VUX-6C Social workout-post shell hardening PR #491 → `95797bfbcf94d54c9b01da0cf238077bbd990f41`.
- VUX-6D Social profile/share shell hardening PR #492 → `625371ca7cde8c45178fd8bf21b2bb012bc4ea4f`.
- VUX-7A Progress theme consistency PR #493 → `89b7fd36874a189f287388160f13863b726872d7`.
- VUX-7B Home theme consistency PR #494 → `4baa1f97b2fef5d68e53480e6570de227c5c9c92`.
- VUX-7C Coach tab theme consistency PR #495 → `e552b55af00fba111050564e89c5d29aeff5a626`.
- VUX-7D secondary Progress theme/inset consistency PR #496 → `03e54d7a2d3ba375a9f55bede1acb0db8f4c9be3`.
- No visual package is active; continue the secondary-surface audit only from concrete source findings.
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
- Presentation colors on theme-aware product surfaces must resolve from `AppThemeProvider`; avoid local `Colors.dark` assumptions.

## Completed visual packages

### VUX-1A / VUX-1B — shared and primary affordances — PRs #468–#469

- Shared button disabled states are explicit and distinct from loading.
- Home/Profile/Workouts primary affordances use the intended Lucide icon language.
- Existing navigation and action semantics were preserved.

### VUX-2A / VUX-2B — disabled-action clarity — PRs #470, #472

- Active Workout Finish and Profile Goals expose visible blocking reasons and accessible disabled-state context.
- Existing validation, persistence and recalculation behavior remain unchanged.

### VUX-3 / VUX-4 — hierarchy, Nutrition, Progress and Coach interaction quality — PRs #471–#484

- Home summary hierarchy was flattened and clarified.
- Nutrition diary/Add Food affordances were normalized to Lucide controls with existing data behavior preserved.
- Progress duplicate action ownership, measurement hierarchy and compact touch targets were hardened.
- Coach touch targets, filter selected state and back-navigation icon language were normalized without changing Coach domain behavior.

### VUX-5A through VUX-5D — Settings/Profile shell and theme consistency — PRs #485–#488

- Settings owns hidden-header safe areas and keyboard-aware reachability.
- Profile and Settings children/support surfaces resolve presentation from the current app theme.
- Navigation affordances use consistent Lucide disclosure/back icons.
- Preferences, account/session behavior, diagnostics and OTA developer actions remain unchanged.

### VUX-6A — Social Profile Lookup shell/input hardening — PR #489

- Runtime safe-area ownership, keyboard-aware username entry, Lucide back navigation and bounded header reflow.
- Exact head `6ae33cb32ac1b70ac0fb53bde6a5f4333632ceb2` passed full Mobile CI #1898 before merge.

### VUX-6B — Social information/list shell hardening — PR #490

- Community Guidelines, Notifications and Relationship Lists own runtime safe areas and Lucide back navigation.
- Relationship tabs own 44 pt targets; notification/relationship behavior remains unchanged.
- Exact head `ff5760526751ce90d3e51c249d5dca9b831f4378` passed full Mobile CI #1901 before merge.

### VUX-6C — Social workout-post shell hardening — PR #491

- Following Feed, Profile Workout Posts and Workout Post Detail own runtime safe areas and Lucide back navigation.
- Comment Report/Delete actions own 44 pt targets.
- Feed cache/pagination, comments, reactions, reports and post behavior remain unchanged.
- Exact head `e1d04baea8b60bd932f1e896afb97de79d37e82e` passed full Mobile CI #1903 before merge.

### VUX-6D — Social profile/share shell hardening — PR #492

- Public Profile, Profile Editor and Share Workout own runtime safe areas with Lucide back navigation.
- Share Workout back ownership is 44 × 44; Public Profile reflow is bounded.
- Relationship/report, profile-save and workout-publish behavior remain unchanged.
- Exact head `fae691fec350ae81d637c9edadeee2b868ca4cdd` passed full Mobile CI #1905 before merge.

### VUX-7A — Progress theme consistency — PR #493

- Progress tab, body-measurement editor, trend chart, weekly volume and both Safety/Recovery Progress cards now resolve presentation from `AppThemeProvider` instead of static `Colors.dark`.
- Safety/Recovery style modules are theme factories and status/chart colors derive from the active palette.
- Weight/body-measurement analytics, Safety/Recovery analytics, range semantics, workout-history params, units, routes, persistence and sync are unchanged.
- Existing 44/48 pt geometry and selected accessibility state remain intact.
- The pre-existing Progress touch-target source guard was made style-factory tolerant after CI exposed a false negative; production geometry itself never regressed.
- Exact head `6773c6bc268209484d34b1843ba29ea919adf7cf` passed full Mobile CI #1908 before merge.

### VUX-7B — Home theme consistency — PR #494

- The currently rendered Home tab, Home Summary and Home Snapshot now resolve presentation from `AppThemeProvider` instead of static `Colors.dark`.
- Home Summary preserves calorie-over-target warning semantics; Home Snapshot preserves neutral/positive/warning tone selection.
- `QuickActionsCard` was already theme-aware and remained unchanged; legacy Home cards not imported by the current Home entrypoint were intentionally left outside this bounded package.
- Onboarding redirect, active-workout resume, profile/nutrition/weight routes, nutrition totals, Progress analytics, units and snapshot calculations are unchanged.
- The Home profile affordance remains 44 × 44.
- Exact head `f8cec418134d1ca4531d8d6480da6e5c25375137` passed full Mobile CI #1910 before merge.

### VUX-7C — Coach tab theme consistency — PR #495

- The public Coach shell/body/title now resolve presentation from `AppThemeProvider` through a theme style factory.
- `AppCard`, `AppButton` and `SectionHeader` continue to own their existing theme behavior.
- Floating-tab clearance and all five `COACH_ACTIONS` destinations plus the Profile destination are unchanged.
- Coach domain logic, recovery/limitation/safety/combined flows, localization, persistence, sync and backend contracts are unchanged.
- Exact head `f3fed7aecca16df12df5e3955133632ab6368e42` passed full Mobile CI #1913 before merge.

### VUX-7D — secondary Progress theme and inset consistency — PR #496

- Add Weight and Weight Details now resolve their live presentation from `AppThemeProvider` rather than static `Colors.dark`.
- Weight Details no longer uses the legacy `safeAreaInsets.bottom + 120` clearance; it uses runtime safe-area spacing with `flexGrow: 1` content reachability.
- Weight history date/value rows have bounded shrink ownership while preserving the existing 44 pt row geometry.
- Weight parsing/conversion, `addWeightEntry`, analytics, units, recent-entry ordering, workout-history navigation, routes, persistence and sync remain unchanged.
- The existing Progress source-contract guard now covers both secondary weight surfaces.
- Exact head `7aa8be9148b75f76510caef1590ffc69b0446b50` passed full Mobile CI #1915 before merge.

## Remaining hierarchy / validation review order

1. Continue the visible-tab and secondary-surface audit from concrete source findings only; do not alter intentionally dark product areas without evidence that they are expected to follow app appearance.
2. Audit remaining secondary surfaces for theme consistency, 44 pt ownership, safe-area/reflow and disabled-state clarity only when a concrete mismatch is found.
3. Prefer one bounded package per demonstrated defect cluster rather than speculative visual churn.

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

1. Audit the next live secondary surface and open a package only when source evidence demonstrates a real UI defect.
2. Run full exact-head Mobile CI for runtime/code changes and merge only the validated head.
3. Keep documentation synchronized with actual Git history without triggering unnecessary runtime CI.
4. Keep backend, OTA/EAS/native/release and production/provider actions out of this autonomous UI sequence unless directly requested.
