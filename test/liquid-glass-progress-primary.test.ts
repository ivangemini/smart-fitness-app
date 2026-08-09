import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Progress Liquid Glass primary surfaces', () => {
  it('keeps the weight range selector on the shared Liquid Glass control surface', () => {
    const source = readSource('src/app/(tabs)/progress.tsx');

    expect(source).toContain("import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';");
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('<LiquidGlassSurface radius={12} style={styles.rangeTabs} variant="control">');
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
  });

  it('keeps body-measurement inputs and choices on adaptive glass control tokens', () => {
    const source = readSource('src/components/progress/AddBodyMeasurementCard.tsx');

    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
  });

  it('keeps Progress trend charts on the shared control surface without local card material', () => {
    const source = readSource('src/components/progress/ProgressTrendChart.tsx');

    expect(source).toContain("import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';");
    expect(source).toContain('<LiquidGlassSurface radius={18} style={styles.chartShell} variant="control">');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
  });

  it('keeps Coach primary content on shared cards and buttons', () => {
    const source = readSource('src/app/(tabs)/coach.tsx');

    expect(source).toContain("import { AppButton } from '@/components/ui/AppButton';");
    expect(source).toContain("import { AppCard } from '@/components/ui/AppCard';");
    expect(source).toContain('<AppCard>');
    expect(source).toContain('<AppButton');
  });
});
