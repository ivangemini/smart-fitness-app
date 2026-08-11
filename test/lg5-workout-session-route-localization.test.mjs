import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const route = readSource('src/app/workout-session.tsx');
const copy = readSource('src/localization/workoutSafetyGateCopy.ts');

describe('LG-5 workout-session route localization', () => {
  it('uses localized preparation copy on the live workout entry route', () => {
    expect(route).toContain("import { useLocalization } from '@/localization'");
    expect(route).toContain('getWorkoutSafetyGateCopy');
    expect(route).toContain('const { locale } = useLocalization()');
    expect(route).toContain('{copy.preparingWorkout}');
    expect(route).not.toContain('>Preparing workout safety check…<');

    expect(copy).toContain('preparingWorkout:');
    expect(copy).toContain('Подготовка проверки безопасности перед тренировкой…');
    expect(copy).toContain('Preparing workout safety check…');
  });

  it('preserves Safety Gate acknowledgement and active-draft persistence', () => {
    expect(route).toContain('hydrateActiveWorkoutSessionDraft()');
    expect(route).toContain('getActiveWorkoutSessionDraft()');
    expect(route).toContain('acknowledgementStore.get(activeDraft.id)');
    expect(route).toContain('createWorkoutSafetyMetadataFromAcknowledgement(acknowledgement)');
    expect(route).toContain('acknowledgementStore.set(acknowledgement)');
    expect(route).toContain('setActiveWorkoutSessionDraft(nextDraft)');
    expect(route).toContain('<WorkoutSafetyGateScreen draft={draft} onContinue={continueToWorkout} />');
    expect(route).toContain('<WorkoutSessionScreen />');
  });
});
