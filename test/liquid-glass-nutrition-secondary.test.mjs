import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('LG-3B Nutrition secondary Liquid Glass surfaces', () => {
  it('keeps the Nutrition calendar on adaptive control/accent material with explicit pressed states', () => {
    const source = readSource('src/app/nutrition/date-picker.tsx');

    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('backgroundColor: glass.accentPressedFill');
    expect(source).toContain('borderColor: glass.accentBorder');
    expect(source).toContain('color: glass.accentText');
    expect(source).toContain('Array.from({ length: 42 }');
    expect(source).toContain('accessibilityState={{ selected: day.isSelected }}');
    expect(source).toContain("router.replace({ pathname: '/nutrition', params: { date: selectedDate } })");
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.accentSoft');
    expect(source).not.toContain('BlurView');
  });

  it('resolves Add Food glass material from the active theme palette centrally', () => {
    const source = readSource('src/features/nutrition/styles/addFoodStyles.ts');

    expect(source).toContain("resolveLiquidGlassPalette(colors === Colors.light ? 'light' : 'dark')");
    expect(source).toContain('createAddFoodBaseStyles(colors, glass)');
    expect(source).toContain('createAddFoodScannerStyles(colors, glass)');
    expect(source).toContain('createAddFoodSheetStyles(colors, glass)');
  });

  it('keeps Add Food base controls on adaptive control/accent tokens', () => {
    const source = readSource('src/features/nutrition/styles/addFoodBaseStyles.ts');

    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('color: glass.accentText');
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.borderSubtle');
    expect(source).not.toContain('BlurView');
  });

  it('keeps Add Food sheet and scanner owners adaptive and blur-free', () => {
    const sheet = readSource('src/features/nutrition/styles/addFoodSheetStyles.ts');
    const scanner = readSource('src/features/nutrition/styles/addFoodScannerStyles.ts');
    const source = `${sheet}\n${scanner}`;

    expect(sheet).toContain('backgroundColor: glass.cardFill');
    expect(sheet).toContain('borderColor: glass.cardBorder');
    expect(sheet).toContain('backgroundColor: glass.controlFill');
    expect(scanner).toContain('backgroundColor: glass.cardFill');
    expect(scanner).toContain('borderColor: glass.cardBorder');
    expect(scanner).toContain('backgroundColor: glass.controlFill');
    expect(scanner).toContain('borderColor: glass.accentBorder');
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.borderSubtle');
    expect(source).not.toContain('BlurView');
  });
});
