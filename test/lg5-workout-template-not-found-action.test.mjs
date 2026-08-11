import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/features/workouts/screens/WorkoutTemplateDetailScreen.tsx'),
  'utf8',
);

describe('LG-5 Workout Template Detail not-found action', () => {
  it('delegates Back to Workouts to the shared SecondaryButton material', () => {
    expect(source).toContain("import { SecondaryButton } from '@/components/ui/SecondaryButton'");
    expect(source).toContain('<SecondaryButton');
    expect(source).toContain('accessibilityLabel={copy.backToWorkouts}');
    expect(source).toContain('label={copy.backToWorkouts}');
    expect(source).toContain("onPress={() => router.replace('/workouts')}");
    expect(source).not.toContain('backToWorkoutsLabel:');
    expect(source).not.toContain('pressed: {');
    expect(source).not.toContain('opacity: 0.72');
  });

  it('preserves template list identity, menu lifecycle and start route', () => {
    expect(source).toContain('data={workout.exercises}');
    expect(source).toContain('keyExtractor={(exercise) => exercise.id}');
    expect(source).toContain('deleteWorkoutTemplate(workout.id)');
    expect(source).toContain('toggleWorkoutTemplateFavorite(workout.id)');
    expect(source).toContain('startWorkoutSession(workout)');
    expect(source).toContain("pathname: '/workout-session'");
    expect(source).toContain('paddingBottom: footerHeight + Spacing.three');
    expect(source).toContain('paddingBottom: Math.max(insets.bottom, Spacing.two)');
  });
});
