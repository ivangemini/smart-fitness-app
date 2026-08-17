import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/components/auth/AuthFormScreen.tsx'),
  'utf8',
);

describe('Auth form Liquid Glass contract', () => {
  it('uses the active Liquid Glass palette for registration experience choices', () => {
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

  it('preserves registration validation, keyboard and sensitive-state contracts', () => {
    expect(source).toContain('validateRegisterForm(registerPayload)');
    expect(source).toContain('clearSensitiveState();');
    expect(source).toContain('keyboardShouldPersistTaps="handled"');
    expect(source).toContain('safeAreaInsets.bottom + 32');
    expect(source).toContain('accessibilityRole="radio"');
    expect(source).toContain('accessibilityState={{ checked: selected }}');
  });

  it('does not regress the selector to direct legacy surfaces or opacity feedback', () => {
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.backgroundSelected');
    expect(source).not.toContain('pressed: { opacity:');
  });
});
