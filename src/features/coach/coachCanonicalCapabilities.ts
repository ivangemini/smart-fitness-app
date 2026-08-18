import type {
  BodyMeasurement,
  FoodEntry,
  NutritionTargets,
  ProfileState,
  TrainingProgram,
  UserLimitation,
  WeightEntry,
  Workout,
} from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_HISTORY_DAYS = 28;
const MAX_HISTORY_DAYS = 90;
const MAX_PROGRAM_DAYS = 7;
const MAX_WORKOUT_EXERCISES = 20;
const DEFAULT_BODY_ENTRY_LIMIT = 30;
const MAX_BODY_ENTRY_LIMIT = 90;
const DEFAULT_LAB_RESULT_LIMIT = 6;
const MAX_LAB_RESULT_LIMIT = 12;
const MAX_LAB_MARKERS = 40;

export type CoachCanonicalCapabilityError = {
  code: 'invalid_end_at';
  message: string;
};

export type CoachCanonicalCapabilityResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: CoachCanonicalCapabilityError };

type BoundedPeriod = {
  startTimestamp: number;
  endTimestamp: number;
  startAt: string;
  endAt: string;
  days: number;
};

const clampInteger = (value: number | undefined, fallback: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value as number)));
};

const resolvePeriod = (endAt: string, days?: number): CoachCanonicalCapabilityResult<BoundedPeriod> => {
  const endTimestamp = Date.parse(endAt);
  if (!Number.isFinite(endTimestamp)) {
    return {
      ok: false,
      error: { code: 'invalid_end_at', message: 'A valid endAt timestamp is required.' },
    };
  }

  const boundedDays = clampInteger(days, DEFAULT_HISTORY_DAYS, 1, MAX_HISTORY_DAYS);
  const startTimestamp = endTimestamp - boundedDays * DAY_MS;
  return {
    ok: true,
    data: {
      startTimestamp,
      endTimestamp,
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days: boundedDays,
    },
  };
};

const parseTimestamp = (value: string | null | undefined) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

export type CoachCurrentProgramData = {
  available: boolean;
  program: null | {
    name: string;
    description?: string;
    goal: string;
    difficulty: TrainingProgram['difficulty'];
    durationWeeks: number;
    progression?: TrainingProgram['progression'];
    days: Array<{
      weekday: TrainingProgram['days'][number]['weekday'];
      restDay: boolean;
      workout: null | {
        title: string;
        duration: string;
        exercises: Array<{ name: string; muscleGroup?: string }>;
        exercisesTruncated: boolean;
      };
    }>;
    daysTruncated: boolean;
  };
};

export const readCurrentProgram = ({
  profile,
  trainingPrograms,
  workouts,
}: {
  profile: ProfileState;
  trainingPrograms: TrainingProgram[];
  workouts: Workout[];
}): CoachCurrentProgramData => {
  const selectedId = profile.activeTrainingProgramId;
  const program = selectedId ? trainingPrograms.find((candidate) => candidate.id === selectedId) : null;
  if (!program) return { available: false, program: null };

  const days = program.days.slice(0, MAX_PROGRAM_DAYS).map((day) => {
    const workout = day.workoutTemplateId
      ? workouts.find((candidate) => candidate.id === day.workoutTemplateId)
      : undefined;
    const exercises = workout?.exercises.slice(0, MAX_WORKOUT_EXERCISES).map((exercise) => ({
      name: exercise.name,
      ...(exercise.muscleGroup ? { muscleGroup: exercise.muscleGroup } : {}),
    })) ?? [];

    return {
      weekday: day.weekday,
      restDay: day.restDay === true,
      workout: workout
        ? {
            title: workout.title,
            duration: workout.duration,
            exercises,
            exercisesTruncated: workout.exercises.length > exercises.length,
          }
        : null,
    };
  });

  return {
    available: true,
    program: {
      name: program.name,
      ...(program.description ? { description: program.description } : {}),
      goal: program.goal,
      difficulty: program.difficulty,
      durationWeeks: program.durationWeeks,
      ...(program.progression ? { progression: { ...program.progression } } : {}),
      days,
      daysTruncated: program.days.length > days.length,
    },
  };
};

export type CoachProfileFacts = {
  heightCm: number | null;
  currentWeightKg: number | null;
  goal: string;
  targetWeightKg: number;
  goalType: ProfileState['goalType'];
  weeklyWeightChangeGoalKg: number;
  trainingDaysPerWeek: number;
  dateOfBirth: string | null;
  calculationSex: ProfileState['calculationSex'];
  trainingExperience: ProfileState['trainingExperience'];
  activityLevel: string;
  activeLimitations: Array<{
    kind: UserLimitation['kind'];
    bodyRegion: UserLimitation['bodyRegion'];
    side: UserLimitation['side'];
    severity: UserLimitation['severity'];
    trainingImpact: UserLimitation['trainingImpact'];
    movementPatterns: UserLimitation['movementPatterns'];
    onsetDate: string | null;
  }>;
};

const toFiniteNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const readCoachProfileFacts = ({
  profile,
  userLimitations,
}: {
  profile: ProfileState;
  userLimitations: UserLimitation[];
}): CoachProfileFacts => ({
  heightCm: toFiniteNumber(profile.height),
  currentWeightKg: toFiniteNumber(profile.weight),
  goal: profile.goal,
  targetWeightKg: profile.targetWeight,
  goalType: profile.goalType,
  weeklyWeightChangeGoalKg: profile.weeklyWeightChangeGoal,
  trainingDaysPerWeek: profile.trainingDaysPerWeek,
  dateOfBirth: profile.dateOfBirth,
  calculationSex: profile.calculationSex,
  trainingExperience: profile.trainingExperience,
  activityLevel: profile.activityLevel,
  activeLimitations: userLimitations
    .filter((limitation) => limitation.status === 'active')
    .map((limitation) => ({
      kind: limitation.kind,
      bodyRegion: limitation.bodyRegion,
      side: limitation.side,
      severity: limitation.severity,
      trainingImpact: limitation.trainingImpact,
      movementPatterns: [...limitation.movementPatterns],
      onsetDate: limitation.onsetDate,
    })),
});

export type CoachBodyMetricsData = {
  period: { startAt: string; endAt: string; days: number };
  weights: Array<{ date: string; weightKg: number }>;
  measurements: Array<{
    recordedAt: string;
    label: string;
    metric?: BodyMeasurement['metric'];
    value: string;
    numericValue?: number;
    unit?: BodyMeasurement['unit'];
  }>;
  weightsTruncated: boolean;
  measurementsTruncated: boolean;
};

export const readBodyMetrics = ({
  weightHistory,
  bodyMeasurements,
  endAt,
  days,
  limit,
}: {
  weightHistory: WeightEntry[];
  bodyMeasurements: BodyMeasurement[];
  endAt: string;
  days?: number;
  limit?: number;
}): CoachCanonicalCapabilityResult<CoachBodyMetricsData> => {
  const periodResult = resolvePeriod(endAt, days);
  if (!periodResult.ok) return periodResult;
  const period = periodResult.data;
  const boundedLimit = clampInteger(limit, DEFAULT_BODY_ENTRY_LIMIT, 1, MAX_BODY_ENTRY_LIMIT);
  const weights = weightHistory
    .map((entry) => ({ entry, timestamp: parseTimestamp(entry.date) }))
    .filter((item): item is { entry: WeightEntry; timestamp: number } =>
      item.timestamp !== null && item.timestamp >= period.startTimestamp && item.timestamp <= period.endTimestamp)
    .sort((a, b) => b.timestamp - a.timestamp);
  const measurements = bodyMeasurements
    .map((entry) => ({ entry, timestamp: parseTimestamp(entry.createdAt) }))
    .filter((item): item is { entry: BodyMeasurement; timestamp: number } =>
      item.timestamp !== null && item.timestamp >= period.startTimestamp && item.timestamp <= period.endTimestamp)
    .sort((a, b) => b.timestamp - a.timestamp);

  return {
    ok: true,
    data: {
      period: { startAt: period.startAt, endAt: period.endAt, days: period.days },
      weights: weights.slice(0, boundedLimit).map(({ entry }) => ({ date: entry.date, weightKg: entry.weight })),
      measurements: measurements.slice(0, boundedLimit).map(({ entry }) => ({
        recordedAt: entry.createdAt,
        label: entry.label,
        value: entry.value,
        ...(entry.metric ? { metric: entry.metric } : {}),
        ...(entry.numericValue !== undefined ? { numericValue: entry.numericValue } : {}),
        ...(entry.unit ? { unit: entry.unit } : {}),
      })),
      weightsTruncated: weights.length > boundedLimit,
      measurementsTruncated: measurements.length > boundedLimit,
    },
  };
};

export type CoachNutritionSummaryData = {
  period: { startAt: string; endAt: string; days: number };
  targets: NutritionTargets;
  days: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    entryCount: number;
  }>;
};

export const readNutritionSummary = ({
  foodEntries,
  nutritionTargets,
  endAt,
  days,
}: {
  foodEntries: FoodEntry[];
  nutritionTargets: NutritionTargets;
  endAt: string;
  days?: number;
}): CoachCanonicalCapabilityResult<CoachNutritionSummaryData> => {
  const periodResult = resolvePeriod(endAt, days);
  if (!periodResult.ok) return periodResult;
  const period = periodResult.data;
  const totals = new Map<string, CoachNutritionSummaryData['days'][number]>();

  foodEntries.forEach((entry) => {
    const timestamp = parseTimestamp(entry.date);
    if (timestamp === null || timestamp < period.startTimestamp || timestamp > period.endTimestamp) return;
    const current = totals.get(entry.date) ?? {
      date: entry.date,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      entryCount: 0,
    };
    current.calories += entry.calories;
    current.protein += entry.protein;
    current.carbs += entry.carbs;
    current.fats += entry.fats;
    current.entryCount += 1;
    totals.set(entry.date, current);
  });

  return {
    ok: true,
    data: {
      period: { startAt: period.startAt, endAt: period.endAt, days: period.days },
      targets: { ...nutritionTargets },
      days: Array.from(totals.values()).sort((a, b) => b.date.localeCompare(a.date)),
    },
  };
};

export type CoachLabMarkerInput = {
  canonical_name: string;
  display_name: string;
  category: string;
  canonical_unit: string;
  numeric_value: number | null;
  value_text: string | null;
  status: 'normal' | 'low' | 'high' | 'critical' | 'unknown';
  reference_range_text?: string | null;
  reference_low?: number | null;
  reference_high?: number | null;
  delta_absolute?: number | null;
  delta_percent?: number | null;
  previous_value?: number | null;
};

export type CoachLabResultInput = {
  status: 'draft' | 'confirmed';
  lab_name?: string | null;
  collected_at?: string | null;
  created_at: string;
  confirmed_at?: string | null;
  markers: CoachLabMarkerInput[];
};

export type CoachConfirmedLabsData = {
  results: Array<{
    labName: string | null;
    collectedAt: string | null;
    confirmedAt: string | null;
    markers: Array<{
      canonicalName: string;
      displayName: string;
      category: string;
      unit: string;
      numericValue: number | null;
      valueText: string | null;
      status: CoachLabMarkerInput['status'];
      referenceRangeText: string | null;
      referenceLow: number | null;
      referenceHigh: number | null;
      deltaAbsolute: number | null;
      deltaPercent: number | null;
      previousValue: number | null;
    }>;
    markersTruncated: boolean;
  }>;
  totalConfirmedResults: number;
  resultsTruncated: boolean;
};

export const readConfirmedLabs = ({
  results,
  limit,
}: {
  results: CoachLabResultInput[];
  limit?: number;
}): CoachConfirmedLabsData => {
  const boundedLimit = clampInteger(limit, DEFAULT_LAB_RESULT_LIMIT, 1, MAX_LAB_RESULT_LIMIT);
  const confirmed = results
    .filter((result) => result.status === 'confirmed')
    .map((result) => ({
      result,
      timestamp: parseTimestamp(result.collected_at) ?? parseTimestamp(result.confirmed_at) ?? parseTimestamp(result.created_at) ?? 0,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
  const bounded = confirmed.slice(0, boundedLimit);

  return {
    results: bounded.map(({ result }) => {
      const markers = result.markers.slice(0, MAX_LAB_MARKERS);
      return {
        labName: result.lab_name ?? null,
        collectedAt: result.collected_at ?? null,
        confirmedAt: result.confirmed_at ?? null,
        markers: markers.map((marker) => ({
          canonicalName: marker.canonical_name,
          displayName: marker.display_name,
          category: marker.category,
          unit: marker.canonical_unit,
          numericValue: marker.numeric_value,
          valueText: marker.value_text,
          status: marker.status,
          referenceRangeText: marker.reference_range_text ?? null,
          referenceLow: marker.reference_low ?? null,
          referenceHigh: marker.reference_high ?? null,
          deltaAbsolute: marker.delta_absolute ?? null,
          deltaPercent: marker.delta_percent ?? null,
          previousValue: marker.previous_value ?? null,
        })),
        markersTruncated: result.markers.length > markers.length,
      };
    }),
    totalConfirmedResults: confirmed.length,
    resultsTruncated: confirmed.length > bounded.length,
  };
};
