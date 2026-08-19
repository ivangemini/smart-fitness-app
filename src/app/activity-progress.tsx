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
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import { buildActivityProgressAnalytics } from '@/lib/progress';
import { useLocalization } from '@/localization';
import { getActivityProgressCopy } from '@/localization/activityProgressCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';

type PeriodKey = '28' | '90' | '180';

const PERIOD_OPTIONS = [
  { label: '28D', value: '28' },
  { label: '90D', value: '90' },
  { label: '180D', value: '180' },
] as const;
const PERIOD_DAYS: Record<PeriodKey, number> = {
  '28': 28,
  '90': 90,
  '180': 180,
};

export default function ActivityProgressScreen() {
  const { colors } = useAppTheme();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const copy = getActivityProgressCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [anchorAt] = useState(() => new Date().toISOString());
  const [periodKey, setPeriodKey] = useState<PeriodKey>('28');
  const analytics = useMemo(
    () =>
      buildActivityProgressAnalytics(workoutSessions, {
        endAt: anchorAt,
        periodDays: PERIOD_DAYS[periodKey],
      }),
    [anchorAt, periodKey, workoutSessions],
  );
  const cadencePoints = useMemo<ProgressTrendPoint[]>(
    () =>
      analytics.buckets.map((bucket) => ({
        key: bucket.key,
        label: formatDate(bucket.startAt, { day: 'numeric', month: 'short' }),
        value: bucket.sessionCount,
        displayValue: copy.bucketSessions(formatNumber(bucket.sessionCount)),
      })),
    [analytics.buckets, copy, formatDate, formatNumber],
  );
  const cadenceValues = cadencePoints.map((point) => point.value);
  const summaryRows = [
    { label: copy.sessions, value: formatNumber(analytics.sessionCount) },
    { label: copy.activeDays, value: formatNumber(analytics.activeDayCount) },
    {
      label: copy.workoutsPerWeek,
      value: formatNumber(analytics.workoutsPerWeek, {
        maximumFractionDigits: 1,
      }),
    },
    {
      label: copy.sessionsLast7Days,
      value: formatNumber(analytics.sessionsLast7Days),
    },
    {
      label: copy.latestWorkout,
      value: analytics.latestWorkoutAt
        ? formatDate(analytics.latestWorkoutAt, {
            day: 'numeric',
            month: 'short',
          })
        : '—',
    },
  ];

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
          <Text selectable style={styles.cardTitle}>
            {copy.period}
          </Text>
          <SegmentedControl
            accessibilityLabel={copy.periodAccessibility}
            onChange={setPeriodKey}
            options={PERIOD_OPTIONS}
            value={periodKey}
          />
        </AppCard>

        <AppCard>
          <Text selectable style={styles.cardTitle}>
            {copy.summary}
          </Text>
          {analytics.sessionCount > 0 ? (
            <View style={styles.summaryList}>
              {summaryRows.map((row) => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text selectable style={styles.summaryLabel}>
                    {row.label}
                  </Text>
                  <Text selectable style={styles.summaryValue}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text selectable style={styles.detail}>
              {copy.noData}
            </Text>
          )}
        </AppCard>

        <AppCard>
          <Text selectable style={styles.cardTitle}>
            {copy.cadence}
          </Text>
          {analytics.sessionCount > 0 && cadencePoints.length >= 2 ? (
            <ProgressTrendChart
              emptyLabel={copy.cadenceNeedsData}
              maxLabel={formatNumber(Math.max(...cadenceValues))}
              minLabel={formatNumber(Math.min(...cadenceValues))}
              points={cadencePoints}
            />
          ) : (
            <Text selectable style={styles.detail}>
              {copy.cadenceNeedsData}
            </Text>
          )}
        </AppCard>

        {analytics.recentSessions.length > 0 ? (
          <AppCard>
            <Text selectable style={styles.cardTitle}>
              {copy.recentSessions}
            </Text>
            <View style={styles.summaryList}>
              {analytics.recentSessions.map((session) => (
                <View key={session.sessionId} style={styles.summaryRow}>
                  <Text
                    selectable
                    numberOfLines={2}
                    style={styles.summaryLabel}>
                    {session.workoutTitle}
                  </Text>
                  <Text selectable style={styles.summaryValue}>
                    {formatDate(session.completedAt, {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
              ))}
            </View>
            {analytics.recentSessionsTruncated ? (
              <Text selectable style={styles.detail}>
                {copy.recentSessionsTruncated}
              </Text>
            ) : null}
          </AppCard>
        ) : null}

        <AppButton
          label={copy.askCoach}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/coach',
              params: {
                contextSource: 'progress',
                contextIntent: 'training_overview',
                metric: 'activity',
                days: String(PERIOD_DAYS[periodKey]),
                endAt: anchorAt,
              },
            })
          }
        />
        <AppButton
          label={copy.openWorkoutHistory}
          onPress={() => router.push('/workout-history')}
          variant="secondary"
        />
        <AppButton
          label={copy.back}
          onPress={() => router.back()}
          variant="secondary"
        />
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
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
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
      fontWeight: '700',
      textAlign: 'right',
    },
  });
