import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/features/onboarding/OnboardingClientScreen.tsx'),
  'utf8',
);

describe('onboarding Liquid Glass source contract', () => {
  it('keeps inputs and activity choices on palette-owned materials', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.accentPressedFill');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    expect(source).not.toContain('backgroundColor: colors.backgroundSelected');
    expect(source).not.toContain('pressed: { opacity:');
  });

  it('freezes onboarding controls after completion is requested', () => {
    expect(source).toContain('disabled={completionRequested}');
    expect(source).toContain('editable={!disabled}');
    expect(source).toContain('accessibilityState={{ disabled }}');
    expect(source).toContain('accessibilityState={{ checked: selected, disabled: completionRequested }}');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
  });
});
