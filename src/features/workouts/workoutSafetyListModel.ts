import type { WorkoutSafetyIssue, WorkoutSafetyRestriction } from '@/types';

export type WorkoutSafetyRestrictionRow = {
  id: string;
  index: number;
  kind: 'restriction';
  restriction: WorkoutSafetyRestriction;
};

export type WorkoutSafetyIssueRow = {
  id: string;
  index: number;
  issue: WorkoutSafetyIssue;
  kind: 'issue';
};

export type WorkoutSafetyListRow = WorkoutSafetyRestrictionRow | WorkoutSafetyIssueRow;

const nextSemanticId = (base: string, occurrences: Map<string, number>): string => {
  const occurrence = (occurrences.get(base) ?? 0) + 1;
  occurrences.set(base, occurrence);
  return occurrence === 1 ? base : `${base}:${occurrence}`;
};

export const buildWorkoutSafetyListRows = (
  restrictions: readonly WorkoutSafetyRestriction[],
  issues: readonly WorkoutSafetyIssue[],
): WorkoutSafetyListRow[] => {
  const restrictionOccurrences = new Map<string, number>();
  const issueOccurrences = new Map<string, number>();

  const restrictionRows: WorkoutSafetyRestrictionRow[] = restrictions.map(
    (restriction, index) => {
      const baseId = `safety-restriction:${restriction.limitationId}`;
      return {
        id: nextSemanticId(baseId, restrictionOccurrences),
        index,
        kind: 'restriction',
        restriction,
      };
    },
  );

  const issueRows: WorkoutSafetyIssueRow[] = issues.map((issue, index) => {
    const baseId = `safety-issue:${issue.code}:${issue.severity}:${issue.message}`;
    return {
      id: nextSemanticId(baseId, issueOccurrences),
      index,
      issue,
      kind: 'issue',
    };
  });

  return [...restrictionRows, ...issueRows];
};
