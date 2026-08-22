import type { TrainingProgram, TrainingProgramDay, Workout } from '@/types';
import type { DraftWorkoutExercise } from '@/components/workouts/workout-builder-types';
import { WEEKDAY_KEYS } from '@/domain/models/program';
import {
  formatWorkoutPlanDescription,
  parseWorkoutPlanDescription,
} from './historyModel';

const cloneProgramDays = (days: TrainingProgramDay[]) => days.map((day) => ({ ...day }));

const getRestDayTemplate = (day: TrainingProgramDay): TrainingProgramDay => ({
  ...day,
  restDay: true,
  workoutTemplateId: undefined,
  workoutTemplateName: undefined,
  notes: undefined,
});

const buildBlankProgramDays = (): TrainingProgramDay[] =>
  WEEKDAY_KEYS.map((weekday, index) => ({
    id: `${weekday}-${index}`,
    weekday,
    restDay: true,
    workoutTemplateId: undefined,
    workoutTemplateName: undefined,
    notes: undefined,
  }));

export const createProgramDraftFromProgram = (program: TrainingProgram): TrainingProgram => ({
  ...program,
  days: cloneProgramDays(program.days),
  progression: program.progression ? { ...program.progression } : undefined,
  metadata: program.metadata ? { ...program.metadata } : undefined,
});

export const createBlankProgramDraft = (): TrainingProgram => ({
  id: `program-${Date.now()}`,
  name: '',
  description: '',
  goal: 'Strength',
  difficulty: 'intermediate',
  durationWeeks: 8,
  days: buildBlankProgramDays(),
  progression: {
    targetReps: 8,
    targetWeight: undefined,
    rir: 2,
    strategy: 'linear progression',
  },
  createdAt: new Date().toISOString(),
  isCustom: true,
});

export const serializeProgramDraft = (program: TrainingProgram) =>
  JSON.stringify({
    id: program.id,
    name: program.name.trim(),
    description: program.description?.trim() ?? '',
    goal: program.goal,
    difficulty: program.difficulty,
    durationWeeks: program.durationWeeks,
    days: program.days.map((day) => ({
      id: day.id,
      weekday: day.weekday,
      restDay: Boolean(day.restDay),
      workoutTemplateId: day.workoutTemplateId ?? null,
      workoutTemplateName: day.workoutTemplateName ?? null,
      notes: day.notes?.trim() ?? null,
    })),
    progression: program.progression
      ? {
          targetReps: program.progression.targetReps ?? null,
          targetWeight: program.progression.targetWeight ?? null,
          rir: program.progression.rir ?? null,
          strategy: program.progression.strategy ?? null,
        }
      : null,
  });

export const attachWorkoutsToProgramDraft = (
  program: TrainingProgram,
  workouts: Workout[],
  workoutIds: string[],
): TrainingProgram => {
  const nextDays = cloneProgramDays(program.days);
  const usedIds = new Set(nextDays.map((day) => day.workoutTemplateId).filter(Boolean) as string[]);

  for (const workoutId of workoutIds) {
    if (usedIds.has(workoutId)) {
      continue;
    }

    const workout = workouts.find((item) => item.id === workoutId);
    if (!workout) {
      continue;
    }

    const emptyDayIndex = nextDays.findIndex((day) => day.restDay || !day.workoutTemplateId);
    if (emptyDayIndex === -1) {
      break;
    }

    const targetDay = nextDays[emptyDayIndex] ?? nextDays[0];
    if (!targetDay) {
      break;
    }

    nextDays[emptyDayIndex] = {
      ...targetDay,
      restDay: false,
      workoutTemplateId: workout.id,
      workoutTemplateName: workout.title,
      notes: targetDay.notes,
    };
    usedIds.add(workoutId);
  }

  return {
    ...program,
    days: nextDays,
  };
};

export const removeWorkoutFromProgramDraft = (program: TrainingProgram, dayId: string): TrainingProgram => ({
  ...program,
  days: program.days.map((day) => (day.id === dayId ? getRestDayTemplate(day) : { ...day })),
});

const parseDraftNumber = (value: string, fallback: number) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const createWorkoutDraftFromWorkout = (workout?: Workout | null): {
  editingWorkoutId?: string;
  title: string;
  description: string;
  exercises: DraftWorkoutExercise[];
} => {
  const plan = parseWorkoutPlanDescription(workout?.description);

  return {
    editingWorkoutId: workout?.id,
    title: workout?.title ?? '',
    description: plan.baseDescription,
    exercises:
      workout?.exercises.map((exercise, index) => {
        const planExercise = plan.exercises[index];
        return {
          id: exercise.id,
          sourceExerciseId: exercise.id,
          name: exercise.name,
          notes: planExercise?.notes ?? '',
          restSeconds: String(planExercise?.restSeconds ?? 90),
          targetReps: String(planExercise?.targetReps ?? 8),
          targetSets: String(planExercise?.targetSets ?? 3),
        };
      }) ?? [],
  };
};

export const buildProgramWorkoutEditorSavePayload = (
  title: string,
  description: string,
  exercises: DraftWorkoutExercise[],
) => {
  const normalizedExercises = exercises
    .map((exercise) => ({
      ...exercise,
      name: exercise.name.trim(),
    }))
    .filter((exercise) => exercise.name.length > 0);

  return {
    title: title.trim(),
    description:
      formatWorkoutPlanDescription(
        description,
        normalizedExercises.map((exercise) => ({
          name: exercise.name,
          notes: exercise.notes.trim() || undefined,
          restSeconds: parseDraftNumber(exercise.restSeconds, 90),
          targetReps: parseDraftNumber(exercise.targetReps, 8),
          targetSets: parseDraftNumber(exercise.targetSets, 3),
        })),
      ) || undefined,
    exercises: normalizedExercises.map((exercise) => ({
      name: exercise.name,
      sourceExerciseId: exercise.sourceExerciseId,
    })),
  };
};
