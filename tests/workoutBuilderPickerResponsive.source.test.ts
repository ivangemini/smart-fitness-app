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
const source = readFileSync(
  resolve(projectRoot, 'src/components/workouts/ProgramWorkoutPickerModal.tsx'),
  'utf8',
);

describe('Program workout picker responsive choice mode', () => {
  it('keeps choice actions reachable on short-height and large-text layouts', () => {
    expect(source).toContain('ScrollView');
    expect(source).toContain('contentContainerStyle={styles.choiceGroup}');
    expect(source).toContain('style={styles.choiceScroll}');
    expect(source).toContain('choiceScroll:');
    expect(source).toContain('minHeight: 0');
  });

  it('allows localized choice copy to shrink instead of overflowing narrow layouts', () => {
    expect(source).toContain('choiceSubtitle:');
    expect(source).toContain('choiceTitle:');
    expect(source).toMatch(/choiceSubtitle:\s*\{[\s\S]*?flexShrink: 1/);
    expect(source).toMatch(/choiceTitle:\s*\{[\s\S]*?flexShrink: 1/);
  });

  it('preserves the virtualized existing-workout path and safe-area ownership', () => {
    expect(source).toContain('<FlatList');
    expect(source).toContain('paddingBottom: insets.bottom + Spacing.three');
    expect(source).toContain('paddingTop: insets.top + Spacing.three');
    expect(source).toContain('onAddWorkouts(selectedIds)');
  });
});
