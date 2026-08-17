import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const view = read('src/features/nutrition/components/NutritionAddFoodView.tsx');
const search = read('src/features/nutrition/components/FoodSearchModeSection.tsx');
const recent = read('src/features/nutrition/components/RecentFoodsModeSection.tsx');
const favorites = read('src/features/nutrition/components/FavoriteFoodsModeSection.tsx');
const savedMeals = read('src/features/nutrition/components/SavedMealsModeSection.tsx');
const styles = read('src/features/nutrition/styles/addFoodBaseStyles.ts');

describe('Nutrition Add Food pressed-state contract', () => {
  it('uses explicit Liquid Glass pressed materials for Add Food controls', () => {
    expect(styles).toContain('backButtonPressed');
    expect(styles).toContain('quietActionButtonPressed');
    expect(styles).toContain('clearButtonPressed');
    expect(styles).toContain('scanButtonPressed');
    expect(styles).toContain('suggestionChipPressed');
    expect(styles).toContain('iconButtonPressed');
    expect(styles).toContain('backgroundColor: glass.controlPressedFill');
  });

  it('binds pressed feedback across shell, search, recent, favorite and saved-meal modes', () => {
    expect(view).toContain('pressed && styles.backButtonPressed');
    expect(view).toContain('pressed && styles.quietActionButtonPressed');
    expect(search).toContain('pressed && styles.clearButtonPressed');
    expect(search).toContain('pressed && styles.scanButtonPressed');
    expect(search).toContain('pressed && styles.suggestionChipPressed');
    expect(search).toContain('pressed && styles.iconButtonPressed');
    expect(recent).toContain('pressed && styles.iconButtonPressed');
    expect(favorites).toContain('pressed && styles.iconButtonPressed');
    expect(savedMeals).toContain('pressed && styles.quietActionButtonPressed');
    expect(savedMeals).toContain('pressed && styles.iconButtonPressed');
  });
});
