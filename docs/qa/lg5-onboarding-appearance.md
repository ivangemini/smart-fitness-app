# LG-5 onboarding appearance consistency

Date: 2026-08-10

Scope: bounded source-level LG-5 fix for demonstrated onboarding surfaces that ignored the selected app appearance.

## Findings

The onboarding route and client screen still resolved their presentation directly from `Colors.dark`:

- the web/client-readiness placeholder in `src/app/onboarding.tsx` always rendered a dark background;
- `src/features/onboarding/OnboardingClientScreen.tsx` used the dark palette for the screen, header, fields, placeholders, activity choices, selection state, helper copy and validation text.

This could create a dark hydration/readiness flash and a fully dark onboarding flow while the rest of the application was using Light/System appearance.

## Fix

- the route placeholder now uses the active app `background` color;
- the onboarding client resolves semantic colors through `useAppTheme()`;
- screen/header/input/choice/helper/validation presentation now uses active palette keys;
- field placeholder text uses active `textMuted`.

## Preserved behavior

No changes were made to:

- onboarding validation rules;
- age, weight, activity, goal or training-days value domains;
- unit conversion/parsing;
- `completeOnboarding` payload or persistence lifecycle;
- success-alert/navigation behavior;
- keyboard avoidance, scroll reachability or safe-area ownership;
- localization copy;
- backend, sync or native configuration.

Physical light/dark/system validation remains part of the separately authorized LG-5 device matrix and is not claimed by this source-level package.
