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
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useProgressState } from '@/context/ProgressStateContext';
import {
  buildBodyMeasurementProgressAnalytics,
  type BodyMeasurementSeriesGroup,
} from '@/lib/progress/bodyMeasurementSeries';
import { useLocalization } from '@/localization';
import { getMeasurementProgressCopy } from '@/localization/measurementProgressCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { lengthFromCm, useUnitPreferences } from '@/units';

type PeriodKey = '30' | '90' | '180';

const PERIOD_OPTIONS = [
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
  { label: '180D', value: '180' },
] as const;
const PERIOD_DAYS: Record<PeriodKey, number> = { '30': 30, '90': 90, '180': 180 };

export default function MeasurementProgressScreen() {
  const { colors } = useAppTheme();
  const { bodyMeasurements } = useProgressState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatLengthValue, length: lengthUnit } = useUnitPreferences();
  const copy = getMeasurementProgressCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [anchorAt] = useState(() => new Date().toISOString());
  const [periodKey, setPeriodKey] = useState<PeriodKey>('90');
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const analytics = useMemo(
    () =>
      buildBodyMeasurementProgressAnalytics(bodyMeasurements, {
        endAt: anchorAt,
        periodDays: PERIOD_DAYS[periodKey],
      }),
    [anchorAt, bodyMeasurements, periodKey],
  );

  useEffect(() => {
    if (analytics.groups.length === 0) {
      setSelectedGroupKey(null);
      return;
    }
    if (!analytics.groups.some((group) => group.key === selectedGroupKey)) {
      setSelectedGroupKey(analytics.groups[0].key);
    }
  }, [analytics.groups, selectedGroupKey]);

  const selectedGroup =
    analytics.groups.find((group) => group.key === selectedGroupKey) ?? null;

  const displayValue = (group: BodyMeasurementSeriesGroup, canonicalValue: number) =>
    group.canonicalUnit === 'percent'
      ? `${formatNumber(canonicalValue, { maximumFractionDigits: 1 })} %`
      : `${formatLengthValue(canonicalValue)} ${lengthUnit}`;
  const displayDelta = (group: BodyMeasurementSeriesGroup) => {
    const delta = group.periodDeltaCanonical;
    if (delta === null) return copy.noData;
    if (group.canonicalUnit === 'percent') {
      return `${delta > 0 ? '+' : ''}${formatNumber(delta, {
        maximumFractionDigits: 1,
      })} ${copy.percentPointsUnit}`;
    }
    const converted = lengthFromCm(delta, lengthUnit);
    return `${converted > 0 ? '+' : ''}${formatNumber(converted, {
      maximumFractionDigits: 1,
    })} ${lengthUnit}`;
  };
  const chartPoints = useMemo<ProgressTrendPoint[]>(() => {
    if (!selectedGroup) return [];
    return selectedGroup.points.map((point) => ({
      key: point.id,
      label: formatDate(point.recordedAt, { day: 'numeric', month: 'short' }),
      value:
        selectedGroup.canonicalUnit === 'percent'
          ? point.canonicalValue
          : lengthFromCm(point.canonicalValue, lengthUnit),
      displayValue: displayValue(selectedGroup, point.canonicalValue),
    }));
  }, [formatDate, lengthUnit, selectedGroup]);
  const chartValues = chartPoints.map((point) => point.value);
  const recentPoints = selectedGroup ? [...selectedGroup.points].reverse().slice(0, 10) : [];
  const summaryRows = selectedGroup
    ? [
        {
          label: copy.current,
          value: displayValue(selectedGroup, selectedGroup.currentCanonicalValue),
        },
        { label: copy.periodChange, value: displayDelta(selectedGroup) },
        { label: copy.entries, value: formatNumber(selectedGroup.totalMatchingPoints) },
      ]
    : [];
  const displayUnit = selectedGroup?.canonicalUnit === 'percent' ? '%' : lengthUnit;

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

        {analytics.groups.length > 0 ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{copy.metric}</Text>
            <View style={styles.metricGrid}>
              {analytics.groups.map((group) => (
                <AppButton
                  key={group.key}
                  label={group.label}
                  onPress={() => setSelectedGroupKey(group.key)}
                  selected={group.key === selectedGroupKey}
                  style={styles.metricButton}
                  variant="secondary"
                />
              ))}
            </View>
            {analytics.groupsTruncated ? (
              <Text selectable style={styles.detail}>{copy.groupsTruncated}</Text>
            ) : null}
            {analytics.unresolvedEntryCount > 0 ? (
              <Text selectable style={styles.detail}>
                {copy.unresolved(formatNumber(analytics.unresolvedEntryCount))}
              </Text>
            ) : null}
          </AppCard>
        ) : (
          <AppCard>
            <Text selectable style={styles.detail}>{copy.noData}</Text>
            {analytics.unresolvedEntryCount > 0 ? (
              <Text selectable style={styles.detail}>
                {copy.unresolved(formatNumber(analytics.unresolvedEntryCount))}
              </Text>
            ) : null}
          </AppCard>
        )}

        {selectedGroup ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{selectedGroup.label}</Text>
            <View style={styles.summaryList}>
              {summaryRows.map((row) => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text selectable style={styles.summaryLabel}>{row.label}</Text>
                  <Text selectable style={styles.summaryValue}>{row.value}</Text>
                </View>
              ))}
            </View>
            {selectedGroup.pointsTruncated ? (
              <Text selectable style={styles.detail}>
                {copy.pointsTruncated(formatNumber(selectedGroup.totalMatchingPoints))}
              </Text>
            ) : null}
          </AppCard>
        ) : null}

        {selectedGroup ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{copy.trend}</Text>
            {chartPoints.length >= 2 ? (
              <ProgressTrendChart
                emptyLabel={copy.chartNeedsData}
                maxLabel={`${formatNumber(Math.max(...chartValues), {
                  maximumFractionDigits: 1,
                })} ${displayUnit}`}
                minLabel={`${formatNumber(Math.min(...chartValues), {
                  maximumFractionDigits: 1,
                })} ${displayUnit}`}
                points={chartPoints}
              />
            ) : (
              <Text selectable style={styles.detail}>{copy.chartNeedsData}</Text>
            )}
          </AppCard>
        ) : null}

        {selectedGroup && recentPoints.length > 0 ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>{copy.recentEntries}</Text>
            <View style={styles.summaryList}>
              {recentPoints.map((point) => (
                <View key={point.id} style={styles.summaryRow}>
                  <Text selectable style={styles.summaryLabel}>
                    {formatDate(point.recordedAt, { day: 'numeric', month: 'short' })}
                  </Text>
                  <Text selectable style={styles.summaryValue}>
                    {displayValue(selectedGroup, point.canonicalValue)}
                  </Text>
                </View>
              ))}
            </View>
          </AppCard>
        ) : null}

        {selectedGroup ? (
          <AppButton
            label={copy.askCoach}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/coach',
                params: {
                  contextSource: 'progress',
                  contextIntent: 'body_progress',
                  metric: 'measurement',
                  measurementKey: selectedGroup.key,
                  days: String(PERIOD_DAYS[periodKey]),
                  endAt: anchorAt,
                },
              })
            }
          />
        ) : null}

        <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
      marginBottom: Spacing.two,
    },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    detail: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      marginTop: Spacing.two,
    },
    metricButton: { flexBasis: '48%', flexGrow: 1 },
    metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    screen: { backgroundColor: colors.background, flex: 1 },
    summaryLabel: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: Typography.label.fontSize,
      lineHeight: Typography.label.lineHeight,
    },
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
      fontSize: Typography.body.fontSize,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      textAlign: 'right',
    },
  });
