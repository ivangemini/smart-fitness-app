# Liquid Glass UI architecture

Updated: 2026-08-09

## Goal

Smart Fitness uses the floating `LiquidGlassTabBar` as the visual reference for the application shell. The rest of the product should converge on the same material language without turning every content card into an expensive independent backdrop blur.

This is a presentation-system migration. Routes, persistence, synchronization, calculations, auth/session behavior, workout lifecycle, Coach contracts and backend APIs remain unchanged unless a separate task explicitly changes them.

## Reference implementation

The current reference is:

- `src/components/navigation/LiquidGlassTabBar.tsx`

Its defining characteristics are:

- translucent material rather than opaque flat fills;
- continuous rounded geometry;
- fine highlight/edge strokes;
- restrained depth shadows;
- true backdrop blur for floating chrome;
- a soft selected-state blob rather than a hard rectangular selection;
- spring/haptic feedback for direct manipulation;
- safe-area-aware floating placement.

## Shared implementation contract

Canonical shared pieces:

- `src/theme/liquidGlass.ts` — all adaptive Liquid Glass material tokens;
- `src/components/ui/LiquidGlassSurface.tsx` — reusable content/elevated glass surface;
- `src/components/ui/AppCard.tsx` — default content-card entry point;
- `src/components/ui/PrimaryButton.tsx` and `SecondaryButton.tsx` — shared glass interaction language;
- `src/components/navigation/LiquidGlassTabBar.tsx` — true-blur floating chrome reference.

Do not introduce new screen-local collections of arbitrary `rgba(...)` values to imitate glass. Extend the shared token contract when a genuinely new material role is needed.

## Material hierarchy

Use four depth levels:

1. **Background** — app background owned by the active theme.
2. **Content glass** — cards, metric groups, list containers and secondary controls. Use translucent material fills, highlight edges and restrained shadow. Do not stack true backdrop blur by default.
3. **Elevated glass** — temporary/priority surfaces such as overlays, floating contextual controls or sticky action containers. Backdrop blur may be used when the number of simultaneous surfaces is bounded.
4. **Floating chrome** — tab bar and equivalent navigation chrome. True backdrop blur, stronger edge lighting and controlled shadow are expected.

## Blur performance rule

Backdrop blur is not a default card effect.

- Floating chrome may use `BlurView`.
- `LiquidGlassSurface` supports blur for bounded elevated surfaces.
- `AppCard` intentionally uses the material surface without enabling per-card blur.
- Long lists must not create one native blur view per row/card.
- Android fallbacks must preserve contrast and interaction state even when blur quality differs from iOS.

This keeps the Liquid Glass look while avoiding avoidable GPU/native-view cost in Nutrition, Social, history and other list-heavy screens.

## Light / dark / system appearance

Liquid Glass is adaptive rather than dark-only.

- Resolve appearance through `AppThemeProvider`.
- Resolve material tokens through `resolveLiquidGlassPalette`.
- Keep text/status colors sourced from the active semantic theme.
- Do not hardcode `systemMaterialDark` or dark-only icon colors in shared Liquid Glass components.

The dark appearance remains the strongest visual reference, but light and system appearances must remain coherent and usable.

## Geometry

- Prefer `borderCurve: 'continuous'` on supported rounded glass surfaces.
- Shared content cards use the existing large radius unless a component has a documented geometry reason to differ.
- Floating navigation keeps its larger 32 pt shell radius.
- Preserve the existing minimum 44 pt interaction ownership and 48 pt primary-action height.
- Do not position glass surfaces with device-specific pixel offsets; safe-area and responsive rules remain authoritative.

## Interaction states

Glass is not a substitute for state clarity.

- Primary actions use an accent-tinted glass/material state.
- Secondary actions use neutral glass material.
- Pressed states must visibly change material fill.
- Disabled states must remain explicit and must not rely on opacity alone.
- Loading state remains distinct from disabled state.
- Selected navigation/filter state must remain accessible through `accessibilityState` where applicable.

## Semantic states

Warning, success and accent containers should remain translucent and use the shared semantic Liquid Glass tokens instead of reverting to large opaque color blocks.

Semantic color still communicates meaning; glass treatment changes material, not domain semantics.

## Migration order

### LG-1 — foundation

- central material tokens;
- reusable glass surface;
- AppCard;
- shared primary/secondary buttons;
- adaptive floating tab bar;
- Home summary/snapshot semantic materials.

### LG-2 — primary tabs

Audit and migrate remaining direct, non-shared surfaces on Home, Nutrition, Progress, Coach and Profile. Preserve Workouts custom dark training-session language until its own bounded package.

### LG-3 — secondary surfaces

Settings, account, Social, Coach detail, Progress detail, Nutrition detail and other secondary screens. Prefer shared primitives over screen-local glass styling.

### LG-4 — Workouts

Migrate Workouts hub/program/session surfaces deliberately. Preserve table readability, dense set-entry ergonomics, sticky actions and active-session state before adding translucency.

### LG-5 — QA and polish

Validate light/dark/system, narrow/short phones, large text, EN/RU, keyboard-open states, iPhone/Android insets, populated/empty/loading/error/disabled states and blur/fallback performance.

Physical-device evidence remains separately authorization-gated.
