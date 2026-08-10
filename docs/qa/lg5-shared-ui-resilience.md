# LG-5 shared UI resilience batch

Date: 2026-08-10

Scope: bounded source-level LG-5 review of shared UI primitives outside the previously reviewed Settings-specific controls.

## Reviewed primitives

- `src/components/ui/AppButton.tsx`
- `src/components/ui/PrimaryButton.tsx`
- `src/components/ui/SecondaryButton.tsx`
- `src/components/ui/DestructiveButton.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/FormField.tsx`
- `src/components/ui/ListRow.tsx`
- `src/components/ui/QuickActionsCard.tsx`

## Concrete fixes

### ListRow

The row already used a flexible copy column, but large text or long localized values could still compete without explicit shrink/min-width boundaries on nested text and trailing content.

The batch adds bounded flex shrink/min-width behavior to the title, detail, badge, trailing value, trailing container and row content while keeping leading controls and the chevron stable. No row height is fixed; the existing minimum touch/layout height remains intact.

### DestructiveButton

Primary and secondary shared buttons already allowed their labels to shrink and center inside a minimum-height control. `DestructiveButton` did not. The destructive label now uses the same `flexShrink`, `minWidth: 0`, and centered-text pattern so larger Dynamic Type or longer localized labels can wrap instead of forcing horizontal overflow.

## No-change findings

`PrimaryButton`, `SecondaryButton`, `EmptyState`, `FormField`, and `QuickActionsCard` already use minimum heights, wrapping, or flexible layouts compatible with this source-level pass. No speculative changes were made.

## Boundaries

- No navigation changes.
- No API, persistence, or business-logic changes.
- No native configuration or dependency changes.
- No EAS build, OTA publish, deployment, or device installation.

Physical-device screenshot validation remains part of the broader LG-5 QA matrix and is not claimed by this source-level batch.
