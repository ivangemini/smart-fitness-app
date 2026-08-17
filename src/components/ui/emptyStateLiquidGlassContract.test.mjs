import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/components/ui/EmptyState.tsx'),
  'utf8',
);

describe('EmptyState Liquid Glass source contract', () => {
  it('uses palette-owned card material for non-compact empty states', () => {
    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain('backgroundColor: glass.cardFill');
    expect(source).toContain('borderColor: glass.cardBorder');
    expect(source).not.toContain('backgroundColor: colors.surfaceAccent');
  });
});
