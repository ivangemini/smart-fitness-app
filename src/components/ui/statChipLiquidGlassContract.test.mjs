import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(process.cwd(), 'src/components/ui/StatChip.tsx'), 'utf8');

describe('StatChip Liquid Glass contract', () => {
  it('derives neutral stat materials from the active Liquid Glass palette', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('createStyles(colors, glass)');
    expect(source).toContain('backgroundColor: glass.cardFill');
    expect(source).toContain('borderColor: glass.cardBorder');
  });

  it('uses semantic Liquid Glass materials for positive and warning tones', () => {
    expect(source).toContain('backgroundColor: glass.semanticPositiveFill');
    expect(source).toContain('borderColor: glass.semanticPositiveBorder');
    expect(source).toContain('backgroundColor: glass.semanticWarningFill');
    expect(source).toContain('borderColor: glass.semanticWarningBorder');
  });

  it('does not fall back to legacy direct surface or soft semantic fills', () => {
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.borderSubtle');
    expect(source).not.toContain('colors.successSoft');
    expect(source).not.toContain('colors.warningSoft');
  });
});
