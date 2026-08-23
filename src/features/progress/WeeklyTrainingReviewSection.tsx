import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing } from '@/constants/theme';
import { exerciseRepository, type Exercise } from '@/features/exercises';
import { getCanonicalMuscleLabel } from '@/features/exercises/muscleLabels';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type {
  RecoveryCheckIn,
  TrainingProgram,
  Workout,
  WorkoutSession,
} from '@/types';

import {
  buildAdaptiveProgramReview,
  buildRecoveryModifier,
} from './adaptiveProgramEngine';
import { buildTrainingCoverage } from './trainingCoverage';
import {
  buildCanonicalTrainingIntelligence,
  type TrainingFinding,
} from './trainingIntelligence';
import { getTrainingIntelligenceCopy } from './trainingIntelligenceCopy';
import { buildTrainingIntelligenceReview } from './trainingIntelligenceReview';
import { WeeklyTrainingReviewCoachExplanation } from './WeeklyTrainingReviewCoachExplanation';
import {
  buildWeeklyTrainingReview,
  WEEKLY_TRAINING_REVIEW_WINDOW_DAYS,
} from './weeklyTrainingReview';
import { getWeeklyTrainingReviewCopy } from './weeklyTrainingReviewCopy';

export function WeeklyTrainingReviewSection({
  endAt,
  program,
  recoveryCheckIns,
  workouts,
  workoutSessions,
}: {
  endAt: string;
  program: TrainingProgram | null;
  recoveryCheckIns: RecoveryCheckIn[];
  workouts: Workout[];
  workoutSessions: WorkoutSession[];
}) {
  const { colors } = useAppTheme();
  const { formatNumber, locale } = useLocalization();
  const copy = useMemo(() => getWeeklyTrainingReviewCopy(locale), [locale]);
  const trainingCopy = useMemo(() => getTrainingIntelligenceCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    void exerciseRepository
      .getAllExercises()
      .then((next) => {
        if (!cancelled) {
          setExercises(next);
          setLoadState('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const result = useMemo(() => {
    if (loadState !== 'ready') return null;

    const analytics = buildCanonicalTrainingIntelligence({
      exercises,
      sessions: workoutSessions,
      endAt,
      windowDays: WEEKLY_TRAINING_REVIEW_WINDOW_DAYS,
    });
    const coverage = buildTrainingCoverage({
      exercises,
      sessions: workoutSessions,
      endAt,
      windowDays: WEEKLY_TRAINING_REVIEW_WINDOW_DAYS,
    });
    const trainingReview = buildTrainingIntelligenceReview({
      coverage,
      findings: analytics.findings,
      program,
      sessions: workoutSessions,
    });
    const recovery = buildRecoveryModifier(recoveryCheckIns, endAt);
    const adaptiveReview = program
      ? buildAdaptiveProgramReview({
          endAt,
          findings: analytics.findings,
          program,
          recoveryCheckIns,
          workouts,
        })
      : null;

    return buildWeeklyTrainingReview({
      trainingReview,
      recovery,
      adaptiveReview,
    });
  }, [endAt, exercises, loadState, program, recoveryCheckIns, workouts, workoutSessions]);

  const findingLabel = (finding: TrainingFinding) => {
    const scope = finding.exerciseName
      ? finding.exerciseName
      : finding.muscleId
        ? getCanonicalMuscleLabel(finding.muscleId, locale)
        : null;
    const title = trainingCopy.findingTitle(finding.kind, finding.prType);
    return scope ? `${title} · ${scope}` : title;
  };

  if (loadState === 'error' || (result && result.status === 'unavailable')) {
    return (
      <AppCard>
        <Text selectable style={styles.title}>{copy.title}</Text>
        <Text selectable style={styles.detail}>{copy.unavailable}</Text>
      </AppCard>
    );
  }

  if (loadState === 'loading' || !result) {
    return (
      <AppCard>
        <Text selectable style={styles.title}>{copy.title}</Text>
        <Text selectable style={styles.detail}>{copy.loading}</Text>
      </AppCard>
    );
  }

  const review = result.review;
  const adaptive = review.adaptive;

  return (
    <AppCard>
      <View style={styles.stack}>
        <View style={styles.block}>
          <Text selectable style={styles.title}>{copy.title}</Text>
          <Text selectable style={styles.detail}>{copy.subtitle}</Text>
        </View>

        <View style={styles.block}>
          <Text selectable style={styles.sectionTitle}>{copy.plan}</Text>
          {review.plan.status === 'unavailable' ? (
            <Text selectable style={styles.detail}>{copy.planUnavailable}</Text>
          ) : (
            <>
              <Text selectable style={styles.detail}>
                {copy.completedPlanned}: {formatNumber(review.plan.completedPlannedSessionCount)} / {formatNumber(review.plan.plannedSessionCount)}
              </Text>
              {review.plan.otherCompletedSessionCount > 0 ? (
                <Text selectable style={styles.detail}>
                  {copy.otherSessions}: {formatNumber(review.plan.otherCompletedSessionCount)}
                </Text>
              ) : null}
              {review.plan.unresolvedPlannedSessionCount > 0 ? (
                <Text selectable style={styles.detail}>
                  {copy.unresolvedSlots}: {formatNumber(review.plan.unresolvedPlannedSessionCount)}
                </Text>
              ) : null}
            </>
          )}
        </View>

        <View style={styles.block}>
          <Text selectable style={styles.sectionTitle}>{copy.coverage}</Text>
          <Text selectable style={styles.detail}>
            {formatNumber(review.coverage.eligibleWorkingSetCount)} {copy.workingSets} · {formatNumber(review.coverage.activeMuscleCount)} {copy.activeMuscles} · {formatNumber(review.coverage.reviewedMovementPatternCount)} {copy.movementPatterns}
          </Text>
        </View>

        <View style={styles.block}>
          <Text selectable style={styles.sectionTitle}>{copy.recovery}</Text>
          <Text selectable style={styles.detail}>
            {copy.recoveryLabel(review.recovery.state)}
          </Text>
          {review.recovery.signals.length > 0 ? (
            <Text selectable style={styles.detail}>
              {copy.recoverySignals(formatNumber(review.recovery.signals.length))}
            </Text>
          ) : null}
        </View>

        <View style={styles.block}>
          <Text selectable style={styles.sectionTitle}>{copy.adaptive}</Text>
          {adaptive.available ? (
            <>
              <Text selectable style={styles.detail}>
                {formatNumber(adaptive.actionCounts.progress)} {copy.progress} · {formatNumber(adaptive.actionCounts.maintain)} {copy.maintain} · {formatNumber(adaptive.actionCounts.review)} {copy.review}
              </Text>
              {adaptive.adjustedByRecoveryCount > 0 ? (
                <Text selectable style={styles.detail}>
                  {formatNumber(adaptive.adjustedByRecoveryCount)} {copy.recoveryAdjusted}
                </Text>
              ) : null}
            </>
          ) : (
            <Text selectable style={styles.detail}>{copy.adaptiveUnavailable}</Text>
          )}
        </View>

        <View style={styles.block}>
          <Text selectable style={styles.sectionTitle}>{copy.keySignals}</Text>
          {review.keyFindings.length > 0 ? (
            review.keyFindings.map((finding) => (
              <Text key={finding.id} selectable style={styles.detail}>
                • {findingLabel(finding)}
              </Text>
            ))
          ) : (
            <Text selectable style={styles.detail}>{copy.noSignals}</Text>
          )}
        </View>

        <Text selectable style={styles.hint}>{copy.deterministicHint}</Text>
        <WeeklyTrainingReviewCoachExplanation review={review} />
        <AppButton
          label={copy.openDetails}
          onPress={() =>
            router.push({
              pathname: '/training-progress',
              params: { period: '7' },
            })
          }
          variant="secondary"
        />
      </View>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    block: { gap: Spacing.half },
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
    sectionTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
    stack: { gap: Spacing.three },
    title: { color: colors.textPrimary, fontSize: 18, fontWeight: '900' },
  });
