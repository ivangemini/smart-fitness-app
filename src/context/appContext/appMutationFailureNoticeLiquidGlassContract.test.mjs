import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/context/appContext/AppMutationFailureNotice.tsx'),
  'utf8',
);

describe('AppMutationFailureNotice Liquid Glass contract', () => {
  it('owns failure and sync notice materials through the active glass palette', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.destructiveFill');
    expect(source).toContain('borderColor: glass.destructiveBorder');
    expect(source).toContain('backgroundColor: glass.elevatedFill');
    expect(source).toContain('borderColor: glass.cardBorder');
    expect(source).toContain('shadowColor: glass.shadowColor');
    expect(source).not.toMatch(/colors\.(errorSoft|surfaceElevated|borderSubtle)\b/);
  });
});
