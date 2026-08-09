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

describe('Liquid Glass primary-tab migration', () => {
  it('uses one shared 44 pt glass icon control on Home and Profile', () => {
    const control = readSource('src/components/ui/GlassIconButton.tsx');
    const home = readSource('src/app/(tabs)/index.tsx');
    const profile = readSource('src/app/(tabs)/profile.tsx');

    expect(control).toContain('resolveLiquidGlassPalette');
    expect(control).toContain('minHeight: 44');
    expect(control).toContain('minWidth: 44');
    expect(control).toContain('glass.controlPressedFill');
    expect(home).toContain('<GlassIconButton');
    expect(profile).toContain('<GlassIconButton');
    expect(home).not.toContain('profileButton:');
    expect(profile).not.toContain('settingsButton:');
  });

  it('moves Nutrition diary materials onto the shared glass palette', () => {
    const screen = readSource('src/app/(tabs)/nutrition.tsx');
    const styles = readSource('src/features/nutrition/styles/nutritionScreenStyles.ts');

    expect(screen).toContain('resolveLiquidGlassPalette');
    expect(screen).toContain('createStyles(colors, glass)');
    expect(screen).toContain('glass.disabledFill');
    expect(styles).toContain('LiquidGlassPalette');
    expect(styles).toContain('backgroundColor: glass.cardFill');
    expect(styles).toContain('backgroundColor: glass.controlFill');
    expect(styles).toContain('borderTopColor: glass.cardHighlight');
    expect(styles).not.toContain('colors.surfacePrimary');
    expect(styles).not.toContain('colors.surfaceSecondary');
  });

  it('keeps Nutrition interaction geometry and state semantics intact', () => {
    const styles = readSource('src/features/nutrition/styles/nutritionScreenStyles.ts');
    const screen = readSource('src/app/(tabs)/nutrition.tsx');

    expect(styles).toMatch(/calendarButton:\s*\{[\s\S]*?height:\s*44,/);
    expect(styles).toMatch(/weekDayButton:\s*\{[\s\S]*?minHeight:\s*44,/);
    expect(screen).toContain('accessibilityState={{ disabled: selectedDateIsToday }}');
    expect(screen).toContain('onOpenMealPicker={openMealPicker}');
    expect(screen).toContain('onEditFoodEntry={editFoodEntry}');
    expect(screen).toContain('onToggleMealExpansion={toggleMealExpansion}');
  });
});
