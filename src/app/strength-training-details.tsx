import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ProgressTrendChart,
  type ProgressTrendPoint,
} from '@/components/progress/ProgressTrendChart';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import { buildExerciseProgressSeries } from '@/lib/progress';
import { useLocalization } from '@/localization';
import { getStrengthTrainingDetailsCopy } from '@/localization/strengthTrainingDetailsCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette, type LiquidGlassPalette } from '@/theme/liquidGlass';
import { useUnitPreferences, weightFromKg } from '@/units';

type PeriodKey = '28' | '90' | '180';
type ExerciseOption = {
  key: string;
  exerciseId?: string;
  exerciseName: string;
  latestAt: number;
};

const PERIOD_OPTIONS = [
  { label: '28D', value: '28' },
  { label: '90D', value: '90' },
  { label: '180D', value: '180' },
] as const;
const MAX_EXERCISE_OPTIONS = 20;

const getExerciseOptions = (sessions: ReturnType<typeof useWorkoutState>['workoutSessions']) => {
  const byKey = new Map<string, ExerciseOption>();

  sessions.forEach((session) => {
    const latestAt = Date.parse(session.finishedAt || session.startedAt);
    if (!Number.isFinite(latestAt)) return;

    session.sets.forEach((set) => {
      if (set.completed === false || set.reps <= 0 || !Number.isFinite(set.weight) || set.weight < 0) {
        return;
      }
      const exerciseId = set.exerciseId.trim();
      const exerciseName = set.exerciseName.trim();
      if (!exerciseId && !exerciseName) return;
      const key = exerciseId ? `id:${exerciseId}` : `name:${exerciseName.toLocaleLowerCase()}`;
      const current = byKey.get(key);
      if (!current || latestAt > current.latestAt) {
        byKey.set(key, {
          key,
          ...(exerciseId ? { exerciseId } : {}),
          exerciseName,
          latestAt,
        });
      }
    });
  });

  return Array.from(byKey.values())
    .sort((a, b) => b.latestAt - a.latestAt || a.exerciseName.localeCompare(b.exerciseName))
    .slice(0, MAX_EXERCISE_OPTIONS);
};

export default function StrengthTrainingDetailsScreen() {
  const { colors, resolvedAppearance } = useAppTheme();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const safeAreaInsets = useSafeAreaInsets();
  const copy = getStrengthTrainingDetailsCopy(locale);
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const endAt = useMemo(() => new Date().toISOString(), []);
  const exerciseOptions = useMemo(() => getExerciseOptions(workoutSessions), [workoutSessions]);
  const [periodKey, setPeriodKey] = useState<PeriodKey>('28');
  const [exerciseKey, setExerciseKey] = useState<string | null>(null);

  useEffect(() => {
    if (exerciseOptions.length === 0) {
      setExerciseKey(null);
      return;
    }
    if (!exerciseKey || !exerciseOptions.some((option) => option.key === exerciseKey)) {
      setExerciseKey(exerciseOptions[0].key);
    }
  }, [exerciseKey, exerciseOptions]);

  const selectedExercise = exerciseOptions.find((option) => option.key === exerciseKey) ?? null;
  const series = useMemo(
    () =>
      selectedExercise
        ? buildExerciseProgressSeries({
            sessions: workoutSessions,
            endAt,
            ...(selectedExercise.exerciseId
              ? { exerciseId: selectedExercise.exerciseId }
              : { exerciseName: selectedExercise.exerciseName }),
            periodDays: Number(periodKey),
          })
        : null,
    [endAt, periodKey, selectedExercise, workoutSessions],
  );

  const latestPoint = series?.points.at(-1) ?? null;
  const periodBestWeight = series
    ? Math.max(...series.points.flatMap((point) => (point.bestWeight === null ? [] : [point.bestWeight])))
    : null;
  const periodBestEstimated1Rm = series
    ? Math.max(
        ...series.points.flatMap((point) =>
          point.bestEstimated1Rm === null ? [] : [point.bestEstimated1Rm],
        ),
      )
    : null;
  const safePeriodBestWeight = Number.isFinite(periodBestWeight) ? periodBestWeight : null;
  const safePeriodBestEstimated1Rm = Number.isFinite(periodBestEstimated1Rm)
    ? periodBestEstimated1Rm
    : null;

  const estimated1RmPoints = useMemo<ProgressTrendPoint[]>(
    () =>
      (series?.points ?? []).flatMap((point) =>
        point.bestEstimated1Rm === null
          ? []
          : [
              {
                key: point.sessionId,
                label: formatDate(point.completedAt, { day: 'numeric', month: 'short' }),
                value: weightFromKg(point.bestEstimated1Rm, weightUnit),
                displayValue: `${formatWeightValue(point.bestEstimated1Rm)} ${weightUnit}`,
              },
            ],
      ),
    [formatDate, formatWeightValue, series?.points, weightUnit],
  );
  const bestWeightPoints = useMemo<ProgressTrendPoint[]>(
    () =>
      (series?.points ?? []).flatMap((point) =>
        point.bestWeight === null
          ? []
          : [
              {
                key: point.sessionId,
                label: formatDate(point.completedAt, { day: 'numeric', month: 'short' }),
                value: weightFromKg(point.bestWeight, weightUnit),
                displayValue: `${formatWeightValue(point.bestWeight)} ${weightUnit}`,
              },
            ],
      ),
    [formatDate, formatWeightValue, series?.points, weightUnit],
  );
  const chartPoints = estimated1RmPoints.length >= 2 ? estimated1RmPoints : bestWeightPoints;
  const chartTitle =
    estimated1RmPoints.length >= 2 ? copy.estimated1RmTrend : copy.bestWeightTrend;
  const chartValues = chartPoints.map((point) => point.value);
  const formatNullableWeight = (value: number | null) =>
    value === null ? '—' : `${formatWeightValue(value)} ${weightUnit}`;

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
          <Text selectable style={styles.sectionTitle}>{copy.period}</Text>
          <SegmentedControl
            accessibilityLabel={copy.periodAccessibility}
            onChange={setPeriodKey}
            options={PERIOD_OPTIONS}
            value={periodKey}
          />
        </AppCard>

        <AppCard>
          <Text selectable style={styles.sectionTitle}>{copy.exercise}</Text>
          {exerciseOptions.length > 0 ? (
            <ScrollView
              contentContainerStyle={styles.exerciseRow}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {exerciseOptions.map((option) => {
                const selected = option.key === exerciseKey;
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setExerciseKey(option.key)}
                    style={({ pressed }) => [
                      styles.exerciseChip,
                      selected && styles.exerciseChipSelected,
                      pressed && styles.exerciseChipPressed,
                    ]}>
                    <Text
                      numberOfLines={1}
                      style={[styles.exerciseChipLabel, selected && styles.exerciseChipLabelSelected]}>
                      {option.exerciseName}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <EmptyState compact message={copy.noExercises} />
          )}
        </AppCard>

        {series && series.points.length > 0 ? (
          <>
            <AppCard>
              <View style={styles.factGrid}>
                <View style={styles.factCell}>
                  <Text selectable style={styles.factLabel}>{copy.sessions}</Text>
                  <Text selectable style={styles.factValue}>
                    {formatNumber(series.totalMatchingSessions)}
                  </Text>
                </View>
                <View style={styles.factCell}>
                  <Text selectable style={styles.factLabel}>{copy.latestBestWeight}</Text>
                  <Text selectable style={styles.factValue}>
                    {formatNullableWeight(latestPoint?.bestWeight ?? null)}
                  </Text>
                </View>
                <View style={styles.factCell}>
                  <Text selectable style={styles.factLabel}>{copy.periodBestWeight}</Text>
                  <Text selectable style={styles.factValue}>
                    {formatNullableWeight(safePeriodBestWeight)}
                  </Text>
                </View>
                <View style={styles.factCell}>
                  <Text selectable style={styles.factLabel}>{copy.latestEstimated1Rm}</Text>
                  <Text selectable style={styles.factValue}>
                    {formatNullableWeight(latestPoint?.bestEstimated1Rm ?? null)}
                  </Text>
                </View>
                <View style={styles.factCell}>
                  <Text selectable style={styles.factLabel}>{copy.periodBestEstimated1Rm}</Text>
                  <Text selectable style={styles.factValue}>
                    {formatNullableWeight(safePeriodBestEstimated1Rm)}
                  </Text>
                </View>
              </View>
              {series.pointsTruncated ? (
                <Text selectable style={styles.metaText}>
                  {copy.recordedSessions(series.points.length, series.totalMatchingSessions)}
                </Text>
              ) : null}
            </AppCard>

            <AppCard>
              <Text selectable style={styles.sectionTitle}>{chartTitle}</Text>
              {chartPoints.length >= 2 ? (
                <ProgressTrendChart
                  emptyLabel={copy.chartNeedsMore}
                  maxLabel={`${formatNumber(Math.max(...chartValues), {
                    maximumFractionDigits: 1,
                  })} ${weightUnit}`}
                  minLabel={`${formatNumber(Math.min(...chartValues), {
                    maximumFractionDigits: 1,
                  })} ${weightUnit}`}
                  points={chartPoints}
                />
              ) : (
                <Text selectable style={styles.metaText}>{copy.chartNeedsMore}</Text>
              )}
            </AppCard>
          </>
        ) : selectedExercise ? (
          <EmptyState compact message={copy.noSeries} />
        ) : null}

        <View style={styles.actions}>
          <AppButton
            label={copy.workoutHistory}
            onPress={() => router.push('/workout-history')}
            variant="secondary"
          />
          <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    actions: { gap: Spacing.two },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    exerciseChip: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      maxWidth: 220,
      paddingHorizontal: Spacing.three,
    },
    exerciseChipLabel: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
    exerciseChipLabelSelected: { color: glass.accentText },
    exerciseChipPressed: { opacity: 0.78 },
    exerciseChipSelected: { backgroundColor: glass.accentFill, borderColor: glass.accentBorder },
    exerciseRow: { gap: Spacing.two, paddingVertical: Spacing.one },
    factCell: { flexBasis: '45%', flexGrow: 1, gap: Spacing.one, minWidth: 132 },
    factGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
    factLabel: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
    factValue: {
      color: colors.textPrimary,
      fontSize: 17,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      lineHeight: 22,
    },
    metaText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: Spacing.two },
    screen: { backgroundColor: colors.background, flex: 1 },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: Spacing.two,
    },
  });
