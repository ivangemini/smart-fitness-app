import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/features/onboarding/OnboardingClientScreen.tsx'),
  'utf8',
);

describe('Onboarding Liquid Glass contract', () => {
  it('derives interactive materials from the active Liquid Glass palette', () => {
    expect(source).toContain('const { colors, resolvedAppearance } = useAppTheme()');
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('createStyles(colors, glass)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('borderColor: glass.accentBorder');
    expect(source).toContain('backgroundColor: glass.accentPressedFill');
    expect(source).toContain('color: glass.accentText');
  });

  it('keeps keyboard, safe-area and onboarding persistence interaction contracts intact', () => {
    expect(source).toContain('keyboardShouldPersistTaps="handled"');
    expect(source).toContain('paddingBottom: insets.bottom + Spacing.six');
    expect(source).toContain('completeOnboarding({');
    expect(source).toContain("mutationFailure?.label === 'Complete onboarding'");
    expect(source).toContain('selectionColor={colors.accent}');
  });

  it('does not regress to legacy direct surfaces or generic opacity feedback', () => {
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.backgroundSelected');
    expect(source).not.toContain('pressed: { opacity:');
  });
});
