import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import {
  buildProgressHighlightAnalytics,
  type ProgressHighlightItem,
} from '@/lib/progress';
import { useLocalization } from '@/localization';
import { getProgressHighlightsCopy } from '@/localization/progressHighlightsCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences } from '@/units';

type PeriodKey = '28' | '90' | '180';

type HighlightGroupProps = {
  items: ProgressHighlightItem[];
  title: string;
  truncated: boolean;
  detailFor: (item: ProgressHighlightItem) => string;
  emptyLabel: string;
  truncatedLabel: string;
  styles: ReturnType<typeof createStyles>;
};

const PERIOD_OPTIONS = [
  { label: '28D', value: '28' },
  { label: '90D', value: '90' },
  { label: '180D', value: '180' },
] as const;
const PERIOD_DAYS: Record<PeriodKey, number> = { '28': 28, '90': 90, '180': 180 };

function HighlightGroup({
  detailFor,
  emptyLabel,
  items,
  styles,
  title,
  truncated,
  truncatedLabel,
}: HighlightGroupProps) {
  return (
    <AppCard>
      <Text selectable style={styles.cardTitle}>{title}</Text>
      {items.length > 0 ? (
        <View style={styles.list}>
          {items.map((item, index) => (
            <View
              key={`${item.exerciseId}:${item.exerciseName}`}
              style={[styles.row, index > 0 && styles.rowWithBorder]}>
              <Text selectable numberOfLines={2} style={styles.rowLabel}>{item.exerciseName}</Text>
              <Text selectable style={styles.rowValue}>{detailFor(item)}</Text>
            </View>
          ))}
          {truncated ? <Text selectable style={styles.detail}>{truncatedLabel}</Text> : null}
        </View>
      ) : (
        <Text selectable style={styles.detail}>{emptyLabel}</Text>
      )}
    </AppCard>
  );
}

export default function ProgressHighlightsScreen() {
  const { colors } = useAppTheme();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const copy = getProgressHighlightsCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [anchorAt] = useState(() => new Date().toISOString());
  const [periodKey, setPeriodKey] = useState<PeriodKey>('28');
  const analytics = useMemo(
    () =>
      buildProgressHighlightAnalytics(workoutSessions, {
        endAt: anchorAt,
        periodDays: PERIOD_DAYS[periodKey],
      }),
    [anchorAt, periodKey, workoutSessions],
  );
  const summaryRows = [
    { label: copy.records, value: formatNumber(analytics.counts.records) },
    { label: copy.improving, value: formatNumber(analytics.counts.improving) },
    { label: copy.declining, value: formatNumber(analytics.counts.declining) },
    { label: copy.stable, value: formatNumber(analytics.counts.stable) },
    { label: copy.sessions, value: formatNumber(analytics.evidence.sessionCount) },
    { label: copy.comparableSets, value: formatNumber(analytics.evidence.estimated1RmSetCount) },
  ];
  const recordDetail = (item: ProgressHighlightItem) =>
    item.allTimeEstimated1Rm !== null && item.recordAt
      ? copy.recordDetail(
          formatWeightValue(item.allTimeEstimated1Rm),
          weightUnit,
          formatDate(item.recordAt, { day: 'numeric', month: 'short' }),
        )
      : '—';
  const trendDetail = (item: ProgressHighlightItem) =>
    item.previousEstimated1Rm !== null && item.recentEstimated1Rm !== null
      ? copy.trendDetail(
          formatWeightValue(item.previousEstimated1Rm),
          formatWeightValue(item.recentEstimated1Rm),
          weightUnit,
        )
      : '—';

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

        <AppCard>
          <Text selectable style={styles.cardTitle}>{copy.summary}</Text>
          {analytics.evidence.sessionCount > 0 ? (
            <View style={styles.list}>
              {summaryRows.map((row, index) => (
                <View key={row.label} style={[styles.row, index > 0 && styles.rowWithBorder]}>
                  <Text selectable style={styles.rowLabel}>{row.label}</Text>
                  <Text selectable style={styles.summaryValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text selectable style={styles.detail}>{copy.noTraining}</Text>
          )}
        </AppCard>

        <HighlightGroup
          detailFor={recordDetail}
          emptyLabel={copy.noItems}
          items={analytics.recordExercises}
          styles={styles}
          title={copy.records}
          truncated={analytics.truncated.records}
          truncatedLabel={copy.truncated}
        />
        <HighlightGroup
          detailFor={trendDetail}
          emptyLabel={copy.noItems}
          items={analytics.improvingExercises}
          styles={styles}
          title={copy.improving}
          truncated={analytics.truncated.improving}
          truncatedLabel={copy.truncated}
        />
        <HighlightGroup
          detailFor={trendDetail}
          emptyLabel={copy.noItems}
          items={analytics.decliningExercises}
          styles={styles}
          title={copy.declining}
          truncated={analytics.truncated.declining}
          truncatedLabel={copy.truncated}
        />
        <HighlightGroup
          detailFor={trendDetail}
          emptyLabel={copy.noItems}
          items={analytics.stableExercises}
          styles={styles}
          title={copy.stable}
          truncated={analytics.truncated.stable}
          truncatedLabel={copy.truncated}
        />

        <AppButton label={copy.openStrength} onPress={() => router.push('/training-progress')} />
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
    },
    list: { gap: 0 },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      minHeight: 44,
      paddingVertical: Spacing.one,
    },
    rowLabel: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: Typography.label.fontSize,
      lineHeight: Typography.label.lineHeight,
      minWidth: 0,
    },
    rowValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontVariant: ['tabular-nums'],
      fontWeight: '700',
      maxWidth: '58%',
      textAlign: 'right',
    },
    rowWithBorder: {
      borderColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
    summaryValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      textAlign: 'right',
    },
  });
