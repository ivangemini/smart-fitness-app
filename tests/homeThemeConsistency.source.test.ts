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

const files = [
  'src/app/(tabs)/index.tsx',
  'src/components/home/HomeSummaryCard.tsx',
  'src/components/home/HomeSnapshotCard.tsx',
];

describe('Home theme consistency', () => {
  it.each(files)('%s resolves current theme instead of hard-coding dark colors', (path) => {
    const source = readSource(path);
    expect(source).toContain('useAppTheme');
    expect(source).not.toContain('Colors.dark.');
  });

  it('preserves Home routes, active-workout resume and nutrition/progress inputs', () => {
    const source = readSource('src/app/(tabs)/index.tsx');
    expect(source).toContain('hydrateActiveWorkoutSessionDraft');
    expect(source).toContain('getActiveWorkoutSessionDraft()');
    expect(source).toContain("router.push('/(tabs)/profile')");
    expect(source).toContain("onPress: () => router.push('/(tabs)/nutrition')");
    expect(source).toContain("onPress: () => router.push('/weight-entry')");
    expect(source).toContain('sumNutritionTotals(todaysFoodEntries)');
    expect(source).toContain('getProgressAnalytics');
  });

  it('preserves summary warning and snapshot tone ownership', () => {
    const summary = readSource('src/components/home/HomeSummaryCard.tsx');
    const snapshot = readSource('src/components/home/HomeSnapshotCard.tsx');
    expect(summary).toContain('isCaloriesOverTarget && styles.cardWarning');
    expect(summary).toContain('isCaloriesOverTarget && styles.caloriesValueWarning');
    expect(snapshot).toContain("tone === 'positive' && styles.tilePositive");
    expect(snapshot).toContain("tone === 'warning' && styles.tileWarning");
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

  it('owns Home safe areas and floating-tab clearance around the ambient backdrop', () => {
    const source = readSource('src/app/(tabs)/index.tsx');

    expect(source).toContain('<HomeLiquidBackdrop />');
    expect(source).toContain('contentInsetAdjustmentBehavior="never"');
    expect(source).toContain('paddingTop: safeAreaInsets.top + Spacing.three');
    expect(source).toContain('getFloatingTabBarBottomClearance(safeAreaInsets.bottom)');
    expect(source).toContain('flexGrow: 1');
  });

  it('uses one bounded hero blur and keeps weekly tiles as non-blurred glass surfaces', () => {
    const summary = readSource('src/components/home/HomeSummaryCard.tsx');
    const snapshot = readSource('src/components/home/HomeSnapshotCard.tsx');

    expect(summary).toContain('<LiquidGlassSurface');
    expect(summary).toContain('blur');
    expect(summary).toContain('variant="elevated"');
    expect(snapshot).toContain('<LiquidGlassSurface');
    expect(snapshot).toContain('variant="control"');
    expect(snapshot).not.toContain('<AppCard');
  });
});
