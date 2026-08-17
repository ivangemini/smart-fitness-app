import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('DestructiveButton Liquid Glass contract', () => {
  it('uses palette-owned destructive, pressed and disabled materials', () => {
    const source = readSource('src/components/ui/DestructiveButton.tsx');

    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.destructiveFill');
    expect(source).toContain('borderColor: glass.destructiveBorder');
    expect(source).toContain('backgroundColor: glass.destructivePressedFill');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
    expect(source).toContain('accessibilityState={state.accessibilityState}');
    expect(source).toContain('minHeight: 44');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    expect(source).not.toContain('borderColor: colors.borderSubtle');
    expect(source).not.toContain('opacity: 0.86');
  });

  it('defines destructive materials in both Liquid Glass palettes', () => {
    const palette = readSource('src/theme/liquidGlass.ts');

    expect(palette).toContain('destructiveBorder: string;');
    expect(palette).toContain('destructiveFill: string;');
    expect(palette).toContain('destructivePressedFill: string;');
    expect(palette.match(/destructiveBorder: 'rgba\(/g)?.length).toBe(2);
    expect(palette.match(/destructiveFill: 'rgba\(/g)?.length).toBe(2);
    expect(palette.match(/destructivePressedFill: 'rgba\(/g)?.length).toBe(2);
  });
});
