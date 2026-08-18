import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ProgressTrendChart,
  type ProgressTrendPoint,
} from '@/components/progress/ProgressTrendChart';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import {
  buildExerciseProgressSeries,
  buildTrainingProgressAnalytics,
} from '@/lib/progress';
import { buildTrainingSignalAnalytics } from '@/lib/progress/trainingSignals';
import { useLocalization } from '@/localization';
import { getTrainingProgressCopy } from '@/localization/trainingProgressCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences, weightFromKg } from '@/units';

type PeriodKey = '28' | '90' | '180';

const PERIOD_OPTIONS = [
  { label: '28D', value: '28' },
  { label: '90D', value: '90' },
  { label: '180D', value: '180' },
] as const;

const PERIOD_DAYS: Record<PeriodKey, number> = { '28': 28, '90': 90, '180': 180 };
const getExerciseKey = (exercise: { exerciseId: string; exerciseName: string }) =>
  exercise.exerciseId.trim() || `name:${exercise.exerciseName.trim().toLocaleLowerCase()}`;

export default function TrainingProgressScreen() {
  const { colors } = useAppTheme();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const copy = getTrainingProgressCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [anchorAt] = useState(() => new Date().toISOString());
  const [periodKey, setPeriodKey] = useState<PeriodKey>('28');
  const [selectedExerciseKey, setSelectedExerciseKey] = useState<string | null>(null);
  const periodDays = PERIOD_DAYS[periodKey];
  const analytics = useMemo(
    () =>
      buildTrainingProgressAnalytics(workoutSessions, {
        endAt: anchorAt,
        maxExercises: 12,
        periodDays,
      }),
    [anchorAt, periodDays, workoutSessions],
  );
  const signalAnalytics = useMemo(
    () =>
      buildTrainingSignalAnalytics(workoutSessions, {
        endAt: anchorAt,
        maxExercises: 30,
        periodDays,
      }),
    [anchorAt, periodDays, workoutSessions],
  );
  const exercises = analytics.exercises;

  useEffect(() => {
    if (exercises.length === 0) {
      setSelectedExerciseKey(null);
      return;
    }
    if (!exercises.some((exercise) => getExerciseKey(exercise) === selectedExerciseKey)) {
      setSelectedExerciseKey(getExerciseKey(exercises[0]));
    }
  }, [exercises, selectedExerciseKey]);

  const selectedExercise =
    exercises.find((exercise) => getExerciseKey(exercise) === selectedExerciseKey) ?? null;
  const selectedSignal =
    signalAnalytics.exercises.find(
      (exercise) => getExerciseKey(exercise) === selectedExerciseKey,
    ) ?? null;
  const series = useMemo(() => {
    if (!selectedExercise) return null;
    return buildExerciseProgressSeries({
      sessions: workoutSessions,
      endAt: anchorAt,
      ...(selectedExercise.exerciseId.trim()
        ? { exerciseId: selectedExercise.exerciseId }
        : { exerciseName: selectedExercise.exerciseName }),
      periodDays,
      maxPoints: 24,
    });
  }, [anchorAt, periodDays, selectedExercise, workoutSessions]);
  const comparablePoints = useMemo<ProgressTrendPoint[]>(
    () =>
      series?.points
        .filter((point) => point.bestEstimated1Rm !== null)
        .map((point) => ({
          key: point.sessionId,
          label: formatDate(point.completedAt, { day: 'numeric', month: 'short' }),
          value: weightFromKg(point.bestEstimated1Rm as number, weightUnit),
          displayValue: `${formatWeightValue(point.bestEstimated1Rm as number)} ${weightUnit} e1RM`,
        })) ?? [],
    [formatDate, formatWeightValue, series, weightUnit],
  );
  const chartValues = comparablePoints.map((point) => point.value);
  const latestPoint = series?.points.at(-1) ?? null;
  const summaryRows = selectedExercise
    ? [
        { label: copy.sessions, value: formatNumber(selectedExercise.sessionCount) },
        { label: copy.workingSets, value: formatNumber(selectedExercise.workingSetCount) },
        {
          label: copy.bestWeight,
          value:
            selectedExercise.periodBestWeight === null
              ? copy.unavailable
              : `${formatWeightValue(selectedExercise.periodBestWeight)} ${weightUnit}`,
        },
        {
          label: copy.bestEstimated1Rm,
          value:
            selectedExercise.periodBestEstimated1Rm === null
              ? copy.unavailable
              : `${formatWeightValue(selectedExercise.periodBestEstimated1Rm)} ${weightUnit}`,
        },
        {
          label: copy.latestVolume,
          value:
            latestPoint === null
              ? copy.unavailable
              : `${formatNumber(weightFromKg(latestPoint.totalVolume, weightUnit), {
                  maximumFractionDigits: 0,
                })} ${weightUnit}·reps`,
        },
      ]
    : [];
  const signalRows = selectedExercise
    ? [
        {
          label: copy.progressSignal,
          value: copy.progressSignalValue(
            selectedSignal?.progressSignal ?? 'insufficient_data',
          ),
        },
        {
          label: copy.comparableSessions,
          value: formatNumber(selectedSignal?.comparableSessionCount ?? 0),
        },
        {
          label: copy.evidenceSpan,
          value:
            selectedSignal?.comparableSpanDays === null ||
            selectedSignal?.comparableSpanDays === undefined
              ? copy.unavailable
              : copy.daysValue(
                  formatNumber(selectedSignal.comparableSpanDays, {
                    maximumFractionDigits: 1,
                  }),
                ),
        },
        {
          label: copy.averageRpe,
          value:
            selectedSignal?.averageActualRpe === null ||
            selectedSignal?.averageActualRpe === undefined
              ? copy.unavailable
              : formatNumber(selectedSignal.averageActualRpe, {
                  maximumFractionDigits: 1,
                }),
        },
        {
          label: copy.recordedRpe,
          value: copy.recordedSetsValue(
            formatNumber(signalAnalytics.rpe.recordedSetCount),
            formatNumber(signalAnalytics.rpe.workingSetCount),
          ),
        },
        {
          label: copy.rpeCoverage,
          value: `${formatNumber(signalAnalytics.rpe.coverage * 100, {
            maximumFractionDigits: 0,
          })}%`,
        },
        {
          label: copy.rpeTrend,
          value: copy.rpeTrendValue(signalAnalytics.rpe.trend),
        },
      ]
    : [];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: safeAreaInsets.bottom + Spacing.eight },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <SectionHeader title={copy.title} subtitle={copy.subtitle} />
        <AppCard>
          <Text selectable style={styles.cardTitle}>{copy.period}</Text>
          <SegmentedControl
            accessibilityLabel={copy.periodAccessibility}
            onChange={setPeriodKey}
            options={PERIOD_OPTIONS}
            value={periodKey}
          />
        </AppCard>

        {exercises.length > 0 ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{copy.exercise}</Text>
            <View style={styles.exerciseGrid}>
              {exercises.map((exercise) => {
                const key = getExerciseKey(exercise);
                return (
                  <AppButton
                    key={key}
                    label={exercise.exerciseName}
                    onPress={() => setSelectedExerciseKey(key)}
                    selected={key === selectedExerciseKey}
                    style={styles.exerciseButton}
                    variant="secondary"
                  />
                );
              })}
            </View>
          </AppCard>
        ) : (
          <AppCard>
            <Text selectable style={styles.detail}>{copy.noExercises}</Text>
          </AppCard>
        )}

        {selectedExercise ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{selectedExercise.exerciseName}</Text>
            <View style={styles.summaryList}>
              {summaryRows.map((row) => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text selectable style={styles.summaryLabel}>{row.label}</Text>
                  <Text selectable style={styles.summaryValue}>{row.value}</Text>
                </View>
              ))}
            </View>
            {series?.pointsTruncated ? (
              <Text selectable style={styles.detail}>
                {copy.truncated(series.totalMatchingSessions)}
              </Text>
            ) : null}
          </AppCard>
        ) : null}

        {selectedExercise ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{copy.trainingSignals}</Text>
            <View style={styles.summaryList}>
              {signalRows.map((row) => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text selectable style={styles.summaryLabel}>{row.label}</Text>
                  <Text selectable style={styles.summaryValue}>{row.value}</Text>
                </View>
              ))}
            </View>
            <Text selectable style={styles.signalNote}>{copy.signalMethodNote}</Text>
          </AppCard>
        ) : null}

        {selectedExercise ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{copy.strengthTrend}</Text>
            {comparablePoints.length >= 2 ? (
              <ProgressTrendChart
                emptyLabel={copy.chartNeedsData}
                maxLabel={`${formatNumber(Math.max(...chartValues), {
                  maximumFractionDigits: 1,
                })} ${weightUnit}`}
                minLabel={`${formatNumber(Math.min(...chartValues), {
                  maximumFractionDigits: 1,
                })} ${weightUnit}`}
                points={comparablePoints}
              />
            ) : (
              <Text selectable style={styles.detail}>{copy.chartNeedsData}</Text>
            )}
          </AppCard>
        ) : null}

        {analytics.frequency.sessionCount === 0 ? (
          <AppCard>
            <Text selectable style={styles.detail}>{copy.noTraining}</Text>
          </AppCard>
        ) : null}
        {selectedExercise ? (
          <AppButton
            label={copy.openInCoach}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/coach',
                params: {
                  contextSource: 'progress',
                  contextIntent: 'exercise_progress',
                  exerciseId: selectedExercise.exerciseId,
                  exerciseName: selectedExercise.exerciseName,
                  days: String(periodDays),
                  endAt: anchorAt,
                },
              })
            }
          />
        ) : null}
        <AppButton
          label={copy.openWorkoutHistory}
          onPress={() => router.push('/workout-history')}
          variant="secondary"
        />
        <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    cardTitle: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '800',
      marginBottom: Spacing.two,
    },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    exerciseButton: { flexBasis: '48%', flexGrow: 1 },
    exerciseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    screen: { backgroundColor: colors.background, flex: 1 },
    signalNote: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginTop: Spacing.three,
    },
    summaryLabel: { color: colors.textSecondary, flex: 1, fontSize: 13, lineHeight: 18 },
    summaryList: { gap: Spacing.two },
    summaryRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      minHeight: 36,
    },
    summaryValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 14,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      textAlign: 'right',
    },
  });
