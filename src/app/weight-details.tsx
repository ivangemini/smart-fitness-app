import { router } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { useProgressState } from '@/context/ProgressStateContext';
import {
  getWeightAnalytics,
  getWeightTrendEntries,
  type WeightTrendRange,
} from '@/lib/progress';
import { useLocalization } from '@/localization';
import { getWeightDetailsCopy } from '@/localization/weightDetailsCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences, weightFromKg } from '@/units';

type WeightRangeKey = '7' | '30' | '90';

const RANGE_OPTIONS = [
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
] as const;

const RANGE_DAYS: Record<WeightRangeKey, WeightTrendRange> = {
  '7': 7,
  '30': 30,
  '90': 90,
};

export default function WeightDetailsScreen() {
  const { colors } = useAppTheme();
  const { weightHistory } = useProgressState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const copy = getWeightDetailsCopy(locale);
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const safeAreaInsets = useSafeAreaInsets();
  const [rangeKey, setRangeKey] = useState<WeightRangeKey>('30');
  const rangeDays = RANGE_DAYS[rangeKey];

  const analytics = useMemo(() => getWeightAnalytics(weightHistory), [weightHistory]);
  const selectedEntries = useMemo(
    () => getWeightTrendEntries(weightHistory, rangeDays),
    [rangeDays, weightHistory],
  );
  const points = useMemo<ProgressTrendPoint[]>(
    () =>
      selectedEntries.map((entry) => ({
        key: entry.id,
        label: formatDate(entry.createdAt, { day: 'numeric', month: 'short' }),
        value: weightFromKg(entry.weight, weightUnit),
        displayValue: `${formatWeightValue(entry.weight)} ${weightUnit}`,
      })),
    [formatDate, formatWeightValue, selectedEntries, weightUnit],
  );
  const recentEntries = useMemo(
    () => [...analytics.recentEntries].reverse().slice(0, 10),
    [analytics.recentEntries],
  );

  const latestWeight =
    analytics.currentWeight !== null
      ? `${formatWeightValue(analytics.currentWeight)} ${weightUnit}`
      : '—';
  const latestSelectedEntry = selectedEntries.at(-1) ?? null;
  const periodDeltaKg =
    selectedEntries.length > 1
      ? selectedEntries[selectedEntries.length - 1].weight - selectedEntries[0].weight
      : null;
  const periodDelta =
    periodDeltaKg === null ? null : weightFromKg(periodDeltaKg, weightUnit);
  const trend =
    periodDelta === null
      ? copy.noComparisonForDays(rangeDays)
      : copy.trendForDays(
          `${periodDelta > 0 ? '+' : ''}${formatNumber(periodDelta, {
            maximumFractionDigits: 1,
          })}`,
          weightUnit,
          rangeDays,
        );
  const chartValues = points.map((point) => point.value);

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
          <Text selectable style={styles.title}>{copy.currentWeight}</Text>
          <Text selectable style={styles.value}>{latestWeight}</Text>
          <Text selectable style={styles.detail}>{trend}</Text>
          <View style={styles.cardAction}>
            <AppButton label={copy.logWeight} onPress={() => router.push('/weight-entry')} />
          </View>
        </AppCard>

        <AppCard>
          <View style={styles.trendHeader}>
            <Text selectable style={styles.title}>{copy.trend}</Text>
            <Text selectable style={styles.periodLabel}>{copy.period}</Text>
          </View>
          <SegmentedControl
            accessibilityLabel={copy.periodAccessibility}
            onChange={setRangeKey}
            options={RANGE_OPTIONS}
            value={rangeKey}
          />
          <View style={styles.chartArea}>
            {points.length > 1 ? (
              <ProgressTrendChart
                emptyLabel={copy.chartEmpty}
                maxLabel={`${formatNumber(Math.max(...chartValues), {
                  maximumFractionDigits: 1,
                })} ${weightUnit}`}
                minLabel={`${formatNumber(Math.min(...chartValues), {
                  maximumFractionDigits: 1,
                })} ${weightUnit}`}
                points={points}
              />
            ) : (
              <Text selectable style={styles.detail}>{copy.addAnother}</Text>
            )}
          </View>
        </AppCard>

        {latestSelectedEntry ? (
          <AppButton
            label={copy.openInCoach}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/coach',
                params: {
                  contextSource: 'progress',
                  contextIntent: 'body_progress',
                  metric: 'weight',
                  days: String(rangeDays),
                  endAt: latestSelectedEntry.createdAt,
                },
              })
            }
          />
        ) : null}

        <AppCard>
          <Text selectable style={styles.title}>{copy.recentWeighIns}</Text>
          {recentEntries.length > 0 ? (
            <View style={styles.historyList}>
              {recentEntries.map((entry, index) => (
                <View
                  key={entry.id}
                  style={[styles.historyRow, index > 0 && styles.historyRowWithBorder]}>
                  <Text selectable style={styles.historyDate}>
                    {formatDate(entry.createdAt, { day: 'numeric', month: 'short' })}
                  </Text>
                  <Text selectable style={styles.historyValue}>
                    {formatWeightValue(entry.weight)} {weightUnit}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text selectable style={styles.detail}>{copy.noWeighIns}</Text>
          )}
        </AppCard>

        <AppCard>
          <Text selectable style={styles.title}>{copy.trainingHistory}</Text>
          <Text selectable style={styles.detail}>{copy.trainingHistoryBody}</Text>
          <View style={styles.cardAction}>
            <AppButton
              label={copy.openWorkoutHistory}
              onPress={() => router.push('/workout-history')}
              variant="secondary"
            />
          </View>
        </AppCard>

        <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    cardAction: { marginTop: Spacing.three },
    chartArea: { marginTop: Spacing.three },
    container: {
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      flexGrow: 1,
      padding: Spacing.three,
    },
    detail: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    historyDate: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 13,
      lineHeight: 18,
      minWidth: 0,
    },
    historyList: { marginTop: Spacing.one },
    historyRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      minHeight: 44,
      minWidth: 0,
      paddingVertical: Spacing.one,
    },
    historyRowWithBorder: {
      borderColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    historyValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 15,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      maxWidth: '48%',
      textAlign: 'right',
    },
    periodLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: Spacing.one,
    },
    trendHeader: { marginBottom: Spacing.two },
    value: {
      color: colors.textPrimary,
      fontSize: 34,
      fontVariant: ['tabular-nums'],
      fontWeight: '900',
      lineHeight: 40,
    },
  });
