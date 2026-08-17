import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/context/appContext/AppMutationFailureNotice.tsx'),
  'utf8',
);

describe('App mutation failure notice Liquid Glass contract', () => {
  it('keeps local failure and sync notice materials palette-owned', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.destructiveFill');
    expect(source).toContain('borderColor: glass.destructiveBorder');
    expect(source).toContain('backgroundColor: glass.elevatedFill');
    expect(source).toContain('borderColor: glass.cardBorder');
    expect(source).toContain('shadowColor: glass.shadowColor');
  });

  it('does not fall back to legacy notice surface fills', () => {
    expect(source).not.toContain('colors.errorSoft');
    expect(source).not.toContain('colors.surfaceElevated');
    expect(source).not.toContain('colors.borderSubtle');
  });
});
