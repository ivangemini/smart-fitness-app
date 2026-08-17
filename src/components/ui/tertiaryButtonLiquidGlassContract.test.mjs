import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/components/ui/TertiaryButton.tsx'),
  'utf8',
);

describe('TertiaryButton Liquid Glass source contract', () => {
  it('uses palette-owned pressed feedback and explicit disabled text state', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).toContain('visuallyDisabled && styles.disabledLabel');
    expect(source).toContain('color: colors.textMuted');
    expect(source).toContain('accessibilityState={state.accessibilityState}');
    expect(source).toContain('minHeight: 44');
    expect(source).not.toContain('backgroundColor: colors.accentSoft');
    expect(source).not.toContain('opacity: 0.5');
  });
});
