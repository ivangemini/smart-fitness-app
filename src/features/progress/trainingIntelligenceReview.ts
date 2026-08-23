import type { TrainingProgram, WeekdayKey, WorkoutSession } from '@/types';

import type { TrainingCoverage, TrainingCoverageMovementFact } from './trainingCoverage';
import type { TrainingFinding } from './trainingIntelligence';

const DAY_MS = 24 * 60 * 60 * 1000;
const UTC_WEEKDAYS: WeekdayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export type TrainingPlanComparisonStatus = 'unavailable' | 'partial' | 'available';

export type TrainingPlanSlotEvidence = {
  date: string;
  weekday: WeekdayKey;
  workoutTemplateId: string;
  workoutTemplateName: string | null;
  completedSessionId: string | null;
};

export type TrainingPlanComparison = {
  status: TrainingPlanComparisonStatus;
  plannedSessionCount: number;
  completedPlannedSessionCount: number;
  unresolvedPlannedSessionCount: number;
  otherCompletedSessionCount: number;
  slots: TrainingPlanSlotEvidence[];
};

export type TrainingIntelligenceReview = {
  endAt: string;
  windowDays: number;
  plan: TrainingPlanComparison;
  eligibleWorkingSetCount: number;
  activeMuscleCount: number;
  reviewedMovementPatternCount: number;
  topMovementPatterns: TrainingCoverageMovementFact[];
  keyFindings: TrainingFinding[];
};

const timestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const sessionFinishedAt = (session: WorkoutSession) => session.finishedAt || session.startedAt;

const dateKey = (value: string) => {
  const at = timestamp(value);
  return at === null ? null : new Date(at).toISOString().slice(0, 10);
};

const utcWeekday = (date: string): WeekdayKey => {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return UTC_WEEKDAYS[day];
};

const buildWindowDateKeys = (endAt: string, windowDays: number) => {
  const parsedEnd = timestamp(endAt);
  if (parsedEnd === null) {
    throw new Error('buildTrainingIntelligenceReview requires a valid endAt timestamp');
  }

  const endDate = new Date(parsedEnd);
  const endMidnight = Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate(),
  );

  return Array.from({ length: windowDays }, (_, index) =>
    new Date(endMidnight - index * DAY_MS).toISOString().slice(0, 10),
  ).reverse();
};

const buildPlanComparison = (input: {
  endAt: string;
  windowDays: number;
  program: TrainingProgram | null;
  sessions: readonly WorkoutSession[];
}): TrainingPlanComparison => {
  if (!input.program) {
    return {
      status: 'unavailable',
      plannedSessionCount: 0,
      completedPlannedSessionCount: 0,
      unresolvedPlannedSessionCount: 0,
      otherCompletedSessionCount: 0,
      slots: [],
    };
  }

  const endAt = timestamp(input.endAt);
  if (endAt === null) {
    throw new Error('buildTrainingIntelligenceReview requires a valid endAt timestamp');
  }

  const windowDateKeys = buildWindowDateKeys(input.endAt, input.windowDays);
  const windowDates = new Set(windowDateKeys);
  const sessions = input.sessions
    .map((session) => ({
      session,
      at: timestamp(sessionFinishedAt(session)),
      date: dateKey(sessionFinishedAt(session)),
    }))
    .filter(
      (entry): entry is { session: WorkoutSession; at: number; date: string } =>
        entry.at !== null &&
        entry.at <= endAt &&
        entry.date !== null &&
        windowDates.has(entry.date),
    )
    .sort((left, right) => left.at - right.at || left.session.id.localeCompare(right.session.id));

  const sessionsByDate = new Map<string, WorkoutSession[]>();
  for (const entry of sessions) {
    const bucket = sessionsByDate.get(entry.date) ?? [];
    bucket.push(entry.session);
    sessionsByDate.set(entry.date, bucket);
  }

  const usedSessionIds = new Set<string>();
  const slots: TrainingPlanSlotEvidence[] = [];
  let unresolvedPlannedSessionCount = 0;

  for (const date of windowDateKeys) {
    const weekday = utcWeekday(date);
    const plannedDays = input.program.days.filter(
      (day) => day.weekday === weekday && day.restDay !== true,
    );

    for (const day of plannedDays) {
      const workoutTemplateId = day.workoutTemplateId?.trim() ?? '';
      if (!workoutTemplateId) {
        unresolvedPlannedSessionCount += 1;
        continue;
      }

      const match = (sessionsByDate.get(date) ?? []).find(
        (session) =>
          !usedSessionIds.has(session.id) &&
          session.workoutId.trim() === workoutTemplateId,
      );
      if (match) usedSessionIds.add(match.id);

      slots.push({
        date,
        weekday,
        workoutTemplateId,
        workoutTemplateName: day.workoutTemplateName?.trim() || null,
        completedSessionId: match?.id ?? null,
      });
    }
  }

  return {
    status: unresolvedPlannedSessionCount > 0 ? 'partial' : 'available',
    plannedSessionCount: slots.length,
    completedPlannedSessionCount: slots.filter((slot) => slot.completedSessionId !== null).length,
    unresolvedPlannedSessionCount,
    otherCompletedSessionCount: sessions.filter(
      (entry) => !usedSessionIds.has(entry.session.id),
    ).length,
    slots,
  };
};

const FINDING_PRIORITY: Record<TrainingFinding['kind'], number> = {
  new_pr: 8,
  regression: 7,
  volume_spike: 6,
  rep_progression: 5,
  muscle_gap: 4,
  exercise_gap: 4,
  muscle_exposure_imbalance: 3,
  plateau: 2,
};

const findingScopeKey = (finding: TrainingFinding) =>
  [
    finding.kind,
    finding.prType ?? '',
    finding.exerciseId ?? '',
    finding.muscleId ?? '',
  ].join(':');

export const selectTrainingReviewFindings = (
  findings: readonly TrainingFinding[],
  limit = 4,
): TrainingFinding[] => {
  const sorted = [...findings].sort((left, right) => {
    const priority = FINDING_PRIORITY[right.kind] - FINDING_PRIORITY[left.kind];
    if (priority !== 0) return priority;
    return (timestamp(right.occurredAt) ?? 0) - (timestamp(left.occurredAt) ?? 0) ||
      left.id.localeCompare(right.id);
  });
  const seen = new Set<string>();
  const selected: TrainingFinding[] = [];

  for (const finding of sorted) {
    const key = findingScopeKey(finding);
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(finding);
    if (selected.length >= Math.max(0, limit)) break;
  }

  return selected;
};

export function buildTrainingIntelligenceReview(input: {
  coverage: TrainingCoverage;
  findings: readonly TrainingFinding[];
  program: TrainingProgram | null;
  sessions: readonly WorkoutSession[];
}): TrainingIntelligenceReview {
  const activeMuscleCount = input.coverage.muscleExposure.filter(
    (fact) => fact.primarySets > 0 || fact.secondarySets > 0,
  ).length;

  return {
    endAt: input.coverage.endAt,
    windowDays: input.coverage.windowDays,
    plan: buildPlanComparison({
      endAt: input.coverage.endAt,
      windowDays: input.coverage.windowDays,
      program: input.program,
      sessions: input.sessions,
    }),
    eligibleWorkingSetCount: input.coverage.eligibleWorkingSetCount,
    activeMuscleCount,
    reviewedMovementPatternCount: input.coverage.movementPatterns.length,
    topMovementPatterns: input.coverage.movementPatterns.slice(0, 3),
    keyFindings: selectTrainingReviewFindings(input.findings),
  };
}
