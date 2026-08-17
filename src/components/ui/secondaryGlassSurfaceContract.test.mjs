import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Secondary Liquid Glass surface source contract', () => {
  it('keeps Settings navigation feedback and icon material palette-owned', () => {
    const source = read('src/features/settings/SettingsNavigationGroup.tsx');

    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).not.toContain('colors.backgroundSelected');
    expect(source).not.toContain('colors.surfaceSecondary');
  });

  it('keeps Companion avatar and progress-track material palette-owned', () => {
    const source = read('src/features/companion/CompanionProgressCard.tsx');

    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
  });
});
