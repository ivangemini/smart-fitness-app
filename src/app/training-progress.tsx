import { router, useLocalSearchParams } from 'expo-router';
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
import { TrainingIntelligenceSection } from '@/features/progress/TrainingIntelligenceSection';
import type { TrainingIntelligenceWindowDays } from '@/features/progress/trainingIntelligence';
import { getRequestedTrainingProgressExerciseKey } from '@/features/progress/trainingProgressSelection';
import {
  buildExerciseProgressSeries,
  buildTrainingProgressAnalytics,
} from '@/lib/progress';
import { useLocalization } from '@/localization';
import { getTrainingProgressCopy } from '@/localization/trainingProgressCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences, weightFromKg } from '@/units';

type PeriodKey = '7' | '30' | '90';

type TrainingProgressSearchParams = {
  exerciseId?: string | string[];
  exerciseName?: string | string[];
};

const PERIOD_OPTIONS = [
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
] as const;

const PERIOD_DAYS: Record<PeriodKey, TrainingIntelligenceWindowDays> = {
  '7': 7,
  '30': 30,
  '90': 90,
};
const getExerciseKey = (exercise: { exerciseId: string; exerciseName: string }) =>
  exercise.exerciseId.trim() || `name:${exercise.exerciseName.trim().toLocaleLowerCase()}`;

export default function TrainingProgressScreen() {
  const { colors } = useAppTheme();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const searchParams = useLocalSearchParams<TrainingProgressSearchParams>();
  const copy = getTrainingProgressCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [anchorAt] = useState(() => new Date().toISOString());
  const [periodKey, setPeriodKey] = useState<PeriodKey>('30');
  const [selectedExerciseKey, setSelectedExerciseKey] = useState<string | null>(null);
  const requestedExerciseKey = useMemo(
    () => getRequestedTrainingProgressExerciseKey(searchParams),
    [searchParams],
  );
  const periodDays = PERIOD_DAYS[periodKey];
  const analytics = useMemo(
    () => buildTrainingProgressAnalytics(workoutSessions, { endAt: anchorAt, maxExercises: 12, periodDays }),
    [anchorAt, periodDays, workoutSessions],
  );
  const exercises = analytics.exercises;

  useEffect(() => {
    if (exercises.length === 0) {
      setSelectedExerciseKey(null);
      return;
    }
    if (!exercises.some((exercise) => getExerciseKey(exercise) === selectedExerciseKey)) {
      const requested = requestedExerciseKey
        ? exercises.find((exercise) => getExerciseKey(exercise) === requestedExerciseKey)
        : null;
      setSelectedExerciseKey(getExerciseKey(requested ?? exercises[0]));
    }
  }, [exercises, requestedExerciseKey, selectedExerciseKey]);

  const selectedExercise = exercises.find((exercise) => getExerciseKey(exercise) === selectedExerciseKey) ?? null;
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
          value: selectedExercise.periodBestWeight === null
            ? copy.unavailable
            : `${formatWeightValue(selectedExercise.periodBestWeight)} ${weightUnit}`,
        },
        {
          label: copy.bestEstimated1Rm,
          value: selectedExercise.periodBestEstimated1Rm === null
            ? copy.unavailable
            : `${formatWeightValue(selectedExercise.periodBestEstimated1Rm)} ${weightUnit}`,
        },
        {
          label: copy.latestVolume,
          value: latestPoint === null
            ? copy.unavailable
            : `${formatNumber(weightFromKg(latestPoint.totalVolume, weightUnit), { maximumFractionDigits: 0 })} ${weightUnit}·reps`,
        },
      ]
    : [];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingBottom: safeAreaInsets.bottom + Spacing.eight }]}
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
          <AppCard><Text selectable style={styles.detail}>{copy.noExercises}</Text></AppCard>
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
            {series?.pointsTruncated ? <Text selectable style={styles.detail}>{copy.truncated(series.totalMatchingSessions)}</Text> : null}
          </AppCard>
        ) : null}

        {selectedExercise ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{copy.strengthTrend}</Text>
            {comparablePoints.length >= 2 ? (
              <ProgressTrendChart
                emptyLabel={copy.chartNeedsData}
                maxLabel={`${formatNumber(Math.max(...chartValues), { maximumFractionDigits: 1 })} ${weightUnit}`}
                minLabel={`${formatNumber(Math.min(...chartValues), { maximumFractionDigits: 1 })} ${weightUnit}`}
                points={comparablePoints}
              />
            ) : <Text selectable style={styles.detail}>{copy.chartNeedsData}</Text>}
          </AppCard>
        ) : null}

        <TrainingIntelligenceSection
          endAt={anchorAt}
          windowDays={periodDays}
          workoutSessions={workoutSessions}
        />

        {analytics.frequency.sessionCount === 0 ? <AppCard><Text selectable style={styles.detail}>{copy.noTraining}</Text></AppCard> : null}
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
        <AppButton label={copy.openWorkoutHistory} onPress={() => router.push('/workout-history')} variant="secondary" />
        <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  cardTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800', marginBottom: Spacing.two },
  container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
  content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
  detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  exerciseButton: { flexBasis: '48%', flexGrow: 1 },
  exerciseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  screen: { backgroundColor: colors.background, flex: 1 },
  summaryLabel: { color: colors.textSecondary, flex: 1, fontSize: 13, lineHeight: 18 },
  summaryList: { gap: Spacing.two },
  summaryRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two, justifyContent: 'space-between', minHeight: 36 },
  summaryValue: { color: colors.textPrimary, flexShrink: 1, fontSize: 14, fontVariant: ['tabular-nums'], fontWeight: '800', textAlign: 'right' },
});