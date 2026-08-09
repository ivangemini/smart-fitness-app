import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

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

  it('keeps Safety Recovery period controls on adaptive glass control tokens', () => {
    const componentSource = readSource('src/components/progress/SafetyRecoveryProgressCard.tsx');
    const styleSource = readSource('src/components/progress/SafetyRecoveryProgressCard.styles.ts');

    expect(componentSource).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(styleSource).toContain('backgroundColor: glass.controlFill');
    expect(styleSource).toContain('borderColor: glass.controlBorder');
    expect(styleSource).toContain('backgroundColor: glass.semanticAccentFill');
    expect(styleSource).toContain('backgroundColor: glass.controlPressedFill');
    expect(styleSource).not.toContain('colors.surfaceSecondary');
    expect(styleSource).not.toContain('colors.accentSoft');
  });

  it('keeps weekly Safety Recovery selection and detail surfaces on Liquid Glass', () => {
    const componentSource = readSource('src/components/progress/SafetyRecoveryWeeklyTrendCard.tsx');
    const styleSource = readSource('src/components/progress/SafetyRecoveryWeeklyTrendCard.styles.ts');

    expect(componentSource).toContain("import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';");
    expect(componentSource).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(componentSource).toContain('<LiquidGlassSurface style={styles.detailCard} variant="control">');
    expect(styleSource).toContain('backgroundColor: glass.controlFill');
    expect(styleSource).toContain('backgroundColor: glass.semanticAccentFill');
    expect(styleSource).toContain('borderColor: glass.accentBorder');
    expect(styleSource).not.toContain('colors.surfaceSecondary');
    expect(styleSource).not.toContain('colors.accentSoft');
  });

  it('keeps Coach primary content on shared cards and buttons', () => {
    const source = readSource('src/app/(tabs)/coach.tsx');

    expect(source).toContain("import { AppButton } from '@/components/ui/AppButton';");
    expect(source).toContain("import { AppCard } from '@/components/ui/AppCard';");
    expect(source).toContain('<AppCard>');
    expect(source).toContain('<AppButton');
  });
});
