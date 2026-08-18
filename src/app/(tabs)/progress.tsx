import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import { useProgressState } from '@/context/ProgressStateContext';
import { useDailySteps } from '@/features/health/useDailySteps';
import { getBodyMeasurementDisplayLabel } from '@/features/progress/progressLocalization';
import {
  countImprovingExercises,
  getRecentTrainingHighlights,
} from '@/features/progress/progressSummaryModel';
import {
  buildTrainingProgressAnalytics,
  getMeasurementInsights,
  getWeightAnalytics,
} from '@/lib/progress';
import { getProgressOverviewCopy } from '@/localization/progressOverviewCopy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { weightFromKg, useUnitPreferences } from '@/units';

const TRAINING_PERIOD_DAYS = 28;

type ProgressStyles = ReturnType<typeof createStyles>;

function DomainHeader({ period, styles, title }: { period: string; styles: ProgressStyles; title: string }) {
  return (
    <View style={styles.domainHeader}>
      <Text selectable style={styles.domainTitle}>{title}</Text>
      <Text selectable style={styles.period}>{period}</Text>
    </View>
  );
}

function MetricRow({ label, styles, value }: { label: string; styles: ProgressStyles; value: string }) {
  return (
    <View style={styles.metricRow}>
      <Text selectable style={styles.metricLabel}>{label}</Text>
      <Text selectable style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function ProgressScreen() {
  const { colors } = useAppTheme();
  const { bodyMeasurements, weightHistory } = useProgressState();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale, t } = useLocalization();
  const {
    formatLengthValue,
    formatWeightValue,
    length: lengthUnit,
    weight: weightUnit,
  } = useUnitPreferences();
  const copy = getProgressOverviewCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const safeAreaInsets = useSafeAreaInsets();
  const analyticsEndAt = useMemo(() => new Date().toISOString(), []);
  const dailySteps = useDailySteps();

  const weight = useMemo(() => getWeightAnalytics(weightHistory), [weightHistory]);
  const measurements = useMemo(
    () => getMeasurementInsights(bodyMeasurements),
    [bodyMeasurements],
  );
  const training = useMemo(
    () =>
      buildTrainingProgressAnalytics(workoutSessions, {
        endAt: analyticsEndAt,
        periodDays: TRAINING_PERIOD_DAYS,
      }),
    [analyticsEndAt, workoutSessions],
  );
  const highlights = useMemo(() => getRecentTrainingHighlights(training), [training]);
  const improvingExerciseCount = useMemo(() => countImprovingExercises(training), [training]);

  const latestMeasurement = measurements[0] ?? null;
  const weightValue =
    weight.currentWeight === null
      ? null
      : `${formatWeightValue(weight.currentWeight)} ${weightUnit}`;
  const convertedWeightDelta =
    weight.delta7Days === null ? null : weightFromKg(weight.delta7Days, weightUnit);
  const weightTrend =
    convertedWeightDelta === null
      ? t('progress.noRecentTrend')
      : t('progress.weightTrendWeek', {
          delta: `${convertedWeightDelta > 0 ? '+' : ''}${formatNumber(convertedWeightDelta, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })}`,
          unit: weightUnit,
        });
  const latestMeasurementValue = (() => {
    if (!latestMeasurement) return copy.bodyNoMeasurements;
    if (
      latestMeasurement.canonicalUnit === 'cm' &&
      latestMeasurement.canonicalNumericValue !== null
    ) {
      return `${formatLengthValue(latestMeasurement.canonicalNumericValue)} ${lengthUnit}`;
    }
    if (
      latestMeasurement.latestUnit === 'percent' &&
      latestMeasurement.latestNumericValue !== null
    ) {
      return `${formatNumber(latestMeasurement.latestNumericValue, { maximumFractionDigits: 1 })}%`;
    }
    return latestMeasurement.latestValue;
  })();
  const latestMeasurementLabel = latestMeasurement
    ? getBodyMeasurementDisplayLabel(t, latestMeasurement.metric, latestMeasurement.label)
    : copy.bodyLatestMeasurement;
  const firstHighlight = highlights[0] ?? null;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: getFloatingTabBarBottomClearance(safeAreaInsets.bottom) },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <SectionHeader title={t('tabs.progress')} subtitle={t('progress.subtitle')} />

        <AppCard>
          <DomainHeader period={copy.bodyPeriod} styles={styles} title={copy.body} />
          {weightValue ? (
            <>
              <Text selectable style={styles.heroValue}>{weightValue}</Text>
              <Text selectable style={styles.primaryDetail}>{weightTrend}</Text>
            </>
          ) : (
            <Text selectable style={styles.primaryDetail}>{copy.bodyNoWeight}</Text>
          )}
          <View style={styles.metrics}>
            <MetricRow
              label={latestMeasurementLabel}
              styles={styles}
              value={latestMeasurementValue}
            />
          </View>
          <View style={styles.actions}>
            {weightValue ? (
              <AppButton
                label={copy.weightDetails}
                onPress={() => router.push('/weight-details')}
                variant="secondary"
              />
            ) : null}
            <AppButton label={copy.logWeight} onPress={() => router.push('/weight-entry')} />
            <AppButton
              label={copy.measurementsDetails}
              onPress={() => router.push('/body-measurements')}
              variant="secondary"
            />
          </View>
        </AppCard>

        <AppCard>
          <DomainHeader period={copy.trainingPeriod} styles={styles} title={copy.training} />
          {training.evidence.sessionCount > 0 ? (
            <>
              <Text selectable style={styles.heroValue}>
                {formatNumber(training.frequency.sessionCount)}
              </Text>
              <Text selectable style={styles.primaryDetail}>{copy.workouts}</Text>
              <View style={styles.metrics}>
                <MetricRow
                  label={copy.workoutsPerWeek}
                  styles={styles}
                  value={formatNumber(training.frequency.workoutsPerWeek, {
                    maximumFractionDigits: 1,
                  })}
                />
                <MetricRow
                  label={copy.improvingExercises}
                  styles={styles}
                  value={formatNumber(improvingExerciseCount)}
                />
              </View>
            </>
          ) : (
            <Text selectable style={styles.primaryDetail}>{copy.trainingNoData}</Text>
          )}
          <View style={styles.actions}>
            <AppButton
              label={copy.openWorkoutHistory}
              onPress={() => router.push('/workout-history')}
              variant="secondary"
            />
          </View>
        </AppCard>

        <AppCard>
          <DomainHeader period={copy.activityPeriod} styles={styles} title={copy.activity} />
          {dailySteps.availability === 'available' && dailySteps.aggregate ? (
            <>
              <Text selectable style={styles.heroValue}>
                {formatNumber(dailySteps.aggregate.steps)}
              </Text>
              <Text selectable style={styles.primaryDetail}>{copy.steps}</Text>
            </>
          ) : dailySteps.loading ? (
            <Text selectable style={styles.primaryDetail}>—</Text>
          ) : (
            <Text selectable style={styles.primaryDetail}>{copy.activityUnavailable}</Text>
          )}
        </AppCard>

        <AppCard>
          <DomainHeader period={copy.highlightsPeriod} styles={styles} title={copy.highlights} />
          {highlights.length > 0 ? (
            <View style={styles.highlightList}>
              {highlights.map((highlight) => (
                <View key={`${highlight.exerciseId}:${highlight.recordedAt}`} style={styles.highlightRow}>
                  <Text selectable style={styles.highlightText}>
                    {copy.estimatedOneRepMaxPr(
                      highlight.exerciseName,
                      `${formatWeightValue(highlight.estimatedOneRepMax)} ${weightUnit}`,
                    )}
                  </Text>
                  <Text selectable style={styles.highlightDate}>
                    {formatDate(highlight.recordedAt, { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text selectable style={styles.primaryDetail}>{copy.highlightsEmpty}</Text>
          )}
          {firstHighlight?.exerciseId ? (
            <View style={styles.actions}>
              <AppButton
                label={copy.openExercise}
                onPress={() =>
                  router.push({
                    pathname: '/exercises/[exerciseId]',
                    params: { exerciseId: firstHighlight.exerciseId },
                  })
                }
                variant="secondary"
              />
            </View>
          ) : null}
        </AppCard>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
      marginTop: Spacing.three,
    },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    domainHeader: { gap: 2, marginBottom: Spacing.two },
    domainTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
    heroValue: {
      color: colors.textPrimary,
      fontSize: 32,
      fontVariant: ['tabular-nums'],
      fontWeight: '900',
      lineHeight: 38,
    },
    highlightDate: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
    highlightList: { gap: Spacing.two },
    highlightRow: {
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: 2,
      paddingTop: Spacing.two,
    },
    highlightText: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', lineHeight: 20 },
    metricLabel: { color: colors.textSecondary, flex: 1, fontSize: 13, minWidth: 0 },
    metricRow: {
      alignItems: 'center',
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      minHeight: 44,
      paddingTop: Spacing.two,
    },
    metricValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 14,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      maxWidth: '50%',
      textAlign: 'right',
    },
    metrics: { marginTop: Spacing.two },
    period: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
    primaryDetail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    screen: { backgroundColor: colors.background, flex: 1 },
  });
