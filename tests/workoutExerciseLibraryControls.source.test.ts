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

const screen = readSource(
  'src/features/workouts/screens/WorkoutExerciseLibraryScreen.tsx',
);
const styles = readSource(
  'src/features/workouts/styles/workoutExerciseLibraryScreenStyles.ts',
);

describe('workout exercise library controls', () => {
  it('uses shared navigation and primary action chrome', () => {
    expect(screen).toContain('<LiquidGlassIconButton');
    expect(screen).toContain('accessibilityLabel={copy.back}');
    expect(screen).toContain('Icon={ChevronLeft}');
    expect(screen).toContain('<PrimaryButton');
    expect(screen).toContain('disabled={selectedIds.length === 0}');
    expect(screen).toContain('label={addLabel}');
    expect(screen).toContain('onPress={handleAdd}');
    expect(styles).not.toContain('backButton:');
    expect(styles).not.toContain('addButton:');
  });

  it('keeps potentially long exercise results virtualized', () => {
    expect(screen).toContain('<FlatList');
    expect(screen).toContain('data={loading || error ? [] : listResults}');
    expect(screen).toContain('initialNumToRender={4}');
    expect(screen).toContain('maxToRenderPerBatch={4}');
    expect(screen).toContain('windowSize={3}');
    expect(screen).toContain('updateCellsBatchingPeriod={80}');
  });

  it('preserves measured footer clearance and session-draft mutation', () => {
    expect(screen).toContain('const [footerHeight, setFooterHeight] = useState(0)');
    expect(screen).toContain('paddingBottom: footerHeight + Spacing.three');
    expect(screen).toContain('setFooterHeight((currentHeight) =>');
    expect(screen).toContain('paddingBottom: insets.bottom + Spacing.two');
    expect(screen).toContain('getActiveWorkoutSessionDraft()');
    expect(screen).toContain('addWorkoutSessionExercises(activeDraft, selectedExercises)');
    expect(screen).toContain('setActiveWorkoutSessionDraft(');
    expect(screen).toContain("router.replace('/workout-session')");
  });

  it('keeps exercise library interactive controls at usable touch sizes', () => {
    expect(styles).toMatch(/retryButton:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(styles).toMatch(/infoButton:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(styles).toMatch(/chip:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(styles).toMatch(/chipScroll:\s*\{[\s\S]*?maxHeight:\s*48/);
    expect(styles).not.toContain('minHeight: 34');
    expect(styles).not.toContain('minHeight: 40');
  });
});
