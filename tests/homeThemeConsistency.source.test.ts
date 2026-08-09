import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Home theme and shell consistency', () => {
  it('keeps live Home theme-aware and on the shared Liquid Glass shell', () => {
    const home = readSource('src/app/(tabs)/index.tsx');
    const metrics = readSource('src/components/home/HomeDailyMetricsPanel.tsx');

    expect(home).toContain('useAppTheme');
    expect(home).toContain('<HomeLiquidBackdrop />');
    expect(home).not.toContain('Colors.dark.');
    expect(metrics).toContain('<LiquidGlassSurface blur');
    expect(metrics).toContain('variant="elevated"');
    expect(metrics).not.toContain('Colors.dark.');
  });

  it('preserves Home routes, active-workout resume and nutrition/progress inputs', () => {
    const source = readSource('src/app/(tabs)/index.tsx');

    expect(source).toContain('hydrateActiveWorkoutSessionDraft');
    expect(source).toContain('getActiveWorkoutSessionDraft()');
    expect(source).toContain("router.push('/(tabs)/profile')");
    expect(source).toContain("onAddFood={() => router.push('/(tabs)/nutrition')}");
    expect(source).toContain("onLogWeight={() => router.push('/weight-entry')}");
    expect(source).toContain('sumNutritionTotals(todaysFoodEntries)');
    expect(source).toContain('getProgressAnalytics');
  });

  it('owns Home safe areas and floating-tab clearance around the feed', () => {
    const source = readSource('src/app/(tabs)/index.tsx');

    expect(source).toContain('paddingTop: safeAreaInsets.top + Spacing.three');
    expect(source).toContain('getFloatingTabBarBottomClearance(safeAreaInsets.bottom)');
    expect(source).toContain('content: { flexGrow: 1');
  });

  it('keeps the Home profile action at 44 pt ownership without opacity feedback', () => {
    const home = readSource('src/app/(tabs)/index.tsx');
    const iconButton = readSource('src/components/ui/LiquidGlassIconButton.tsx');

    expect(home).toContain('<LiquidGlassIconButton');
    expect(iconButton).toMatch(
      /pressable:\s*\{[\s\S]*?height:\s*44,[\s\S]*?width:\s*44,/,
    );
    expect(iconButton).toContain('transform: [{ scale: 0.96 }]');
    expect(iconButton).not.toContain('opacity:');
  });
});
