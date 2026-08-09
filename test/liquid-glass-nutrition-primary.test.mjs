import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Nutrition primary Liquid Glass surfaces', () => {
  it('wires the Nutrition tab to the adaptive Liquid Glass palette', () => {
    const source = readSource('src/app/(tabs)/nutrition.tsx');

    expect(source).toContain("import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';");
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('createStyles(colors, glass)');
    expect(source).toContain('pressed && styles.controlPressed');
    expect(source).toContain('styles.todayButtonDisabled');
    expect(source).not.toContain('backgroundColor: colors.backgroundSecondary');
  });

  it('keeps Nutrition card and control material on adaptive glass tokens', () => {
    const source = readSource('src/features/nutrition/styles/nutritionScreenStyles.ts');

    expect(source).toContain('backgroundColor: glass.cardFill');
    expect(source).toContain('borderColor: glass.cardBorder');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('borderColor: glass.accentBorder');
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.accentSoft');
  });

  it('keeps meal interactions on the shared adaptive pressed state', () => {
    const source = readSource('src/features/nutrition/components/MealGroup.tsx');

    expect(source).toContain('style={({ pressed }) => [styles.mealHeader, pressed && styles.controlPressed]}');
    expect(source).toContain('style={({ pressed }) => [styles.mealActionButton, pressed && styles.controlPressed]}');
  });

  it('does not add native blur to dense diary or food rows', () => {
    const paths = [
      'src/features/nutrition/components/NutritionDiaryList.tsx',
      'src/features/nutrition/components/FoodEntryRow.tsx',
      'src/features/nutrition/components/MealGroup.tsx',
    ];

    for (const path of paths) {
      const source = readSource(path);
      expect(source).not.toContain('BlurView');
      expect(source).not.toContain('blur={true}');
    }
  });
});
