import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { ProgressTrendChart } from '@/components/progress/ProgressTrendChart';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { MetricCard } from '@/components/ui/MetricCard';
import { getExerciseDetailCopy } from '@/localization/exerciseDetailCopy';
import { useLocalization } from '@/localization';
import { useUnitPreferences, weightFromKg } from '@/units';

import { getExerciseProgressCopy } from '../exerciseProgressCopy';
import type { ExerciseHistoryGroup } from '../history';
import {
  calculateExerciseProgressMetrics,
  type ExerciseProgressTopSet,
} from '../progress';
import type { ExerciseDetailStyles } from '../screens/ExerciseDetailScreen.styles';

export function ExerciseProgressSection({
  historyGroups,
  styles,
}: {
  historyGroups: ExerciseHistoryGroup[];
  styles: ExerciseDetailStyles;
}) {
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const copy = useMemo(() => getExerciseDetailCopy(locale), [locale]);
  const progressCopy = useMemo(() => getExerciseProgressCopy(locale), [locale]);
  const metrics = useMemo(
    () => calculateExerciseProgressMetrics(historyGroups),
    [historyGroups],
  );

  const formatWeight = (valueKg: number) => `${formatWeightValue(valueKg)} ${weightUnit}`;
  const formatVolume = (valueKg: number) =>
    `${formatNumber(weightFromKg(valueKg, weightUnit), {
      maximumFractionDigits: 0,
    })} ${weightUnit}`;
  const formatTopSet = (topSet: ExerciseProgressTopSet | null) => {
    if (!topSet) return progressCopy.notEnoughEvidence;
    const rpe =
      topSet.actualRpe === null
        ? ''
        : ` · RPE ${formatNumber(topSet.actualRpe, { maximumFractionDigits: 1 })}`;
    return `${formatWeight(topSet.weight)} × ${formatNumber(topSet.reps, {
      maximumFractionDigits: 0,
    })}${rpe}`;
  };
  const formatPercentDelta = (value: number | null) =>
    value === null
      ? progressCopy.notEnoughEvidence
      : `${value > 0 ? '+' : ''}${formatNumber(value, { maximumFractionDigits: 1 })}%`;
  const toDisplayTrend = (points: typeof metrics.volumeTrend, digits: number) =>
    points.map((point) => {
      const value = weightFromKg(point.value, weightUnit);
      return {
        key: point.key,
        label: formatDate(point.finishedAt, { month: 'short', day: 'numeric' }),
        value,
        displayValue: `${formatNumber(value, { maximumFractionDigits: digits })} ${weightUnit}`,
      };
    });
  const loadTrend = toDisplayTrend(metrics.loadTrend, 1);
  const estimatedOneRepMaxTrend = toDisplayTrend(metrics.estimatedOneRepMaxTrend, 1);
  const volumeTrend = toDisplayTrend(metrics.volumeTrend, 0);

  if (metrics.recentSessions.length === 0) {
    return (
      <EmptyState
        title={copy.noProgressTitle}
        description={copy.noProgressDescription}
      />
    );
  }

  return (
    <View style={styles.stack}>
      {metrics.recentComparison ? (
        <AppCard>
          <Text style={styles.cardTitle}>{progressCopy.latestPerformance}</Text>
          <Text style={styles.secondaryText}>
            {formatDate(metrics.recentComparison.latest.finishedAt, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            · {metrics.recentComparison.latest.workoutTitle}
          </Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label={progressCopy.latestTopSet}
              value={formatTopSet(metrics.recentComparison.latest.topSet)}
            />
            <MetricCard
              label={progressCopy.previousTopSet}
              value={
                metrics.recentComparison.previous
                  ? formatTopSet(metrics.recentComparison.previous.topSet)
                  : progressCopy.notEnoughEvidence
              }
            />
            <MetricCard
              label={progressCopy.averageRpe}
              value={
                metrics.recentComparison.latest.averageActualRpe === null
                  ? progressCopy.notRecorded
                  : formatNumber(metrics.recentComparison.latest.averageActualRpe, {
                      maximumFractionDigits: 1,
                    })
              }
            />
            <MetricCard
              label={progressCopy.estimatedOneRepMaxChange}
              value={formatPercentDelta(metrics.recentComparison.estimatedOneRepMaxDeltaPercent)}
            />
            <MetricCard
              label={progressCopy.volumeChange}
              value={formatPercentDelta(metrics.recentComparison.volumeDeltaPercent)}
            />
          </View>
        </AppCard>
      ) : null}

      <View style={styles.metricsGrid}>
        <MetricCard label={copy.bestWeight} value={formatWeight(metrics.bestWeight)} />
        <MetricCard
          label={copy.bestReps}
          value={formatNumber(metrics.bestReps, { maximumFractionDigits: 0 })}
        />
        <MetricCard label={copy.volume} value={formatVolume(metrics.totalVolume)} />
        <MetricCard
          label={copy.estimatedOneRepMax}
          value={formatWeight(metrics.estimatedOneRepMax)}
        />
      </View>

      <TrendCard
        emptyLabel={progressCopy.trendEmpty}
        points={loadTrend}
        styles={styles}
        title={progressCopy.loadTrend}
        unit={weightUnit}
      />
      <TrendCard
        emptyLabel={progressCopy.trendEmpty}
        points={estimatedOneRepMaxTrend}
        styles={styles}
        title={progressCopy.estimatedOneRepMaxTrend}
        unit={weightUnit}
      />
      <TrendCard
        emptyLabel={copy.volumeTrendEmpty}
        points={volumeTrend}
        styles={styles}
        title={copy.volumeTrend}
        unit={weightUnit}
      />
    </View>
  );
}

function TrendCard({
  emptyLabel,
  points,
  styles,
  title,
  unit,
}: {
  emptyLabel: string;
  points: Array<{ key: string; label: string; value: number; displayValue: string }>;
  styles: ExerciseDetailStyles;
  title: string;
  unit: string;
}) {
  const { locale } = useLocalization();
  const copy = useMemo(() => getExerciseDetailCopy(locale), [locale]);
  return (
    <AppCard>
      <Text style={styles.cardTitle}>{title}</Text>
      <ProgressTrendChart
        emptyLabel={emptyLabel}
        maxLabel={copy.high(unit)}
        minLabel={copy.low(unit)}
        points={points}
      />
    </AppCard>
  );
}
