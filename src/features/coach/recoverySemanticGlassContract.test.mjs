import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/features/coach/components/RecoveryScorePicker.tsx'),
  'utf8',
);

describe('Recovery score Liquid Glass material contract', () => {
  it('derives score control materials from active Liquid Glass appearance', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('selected ? glass.semanticAccentFill : glass.controlFill');
    expect(source).toContain('selected ? glass.accentBorder : glass.controlBorder');
  });

  it('does not fall back to legacy score fills or borders', () => {
    expect(source).not.toContain('colors.accentSoft');
    expect(source).not.toContain('colors.surfaceElevated');
    expect(source).not.toContain('colors.borderSubtle');
  });
});
