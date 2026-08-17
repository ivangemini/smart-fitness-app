import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/components/ui/ListRow.tsx'),
  'utf8',
);

describe('ListRow Liquid Glass source contract', () => {
  it('uses palette-owned row and pressed materials', () => {
    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
    expect(source).not.toContain('backgroundColor: colors.backgroundSelected');
  });

  it('keeps optional badge on semantic accent glass material', () => {
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).not.toContain('colors.accentSoft');
  });
});
