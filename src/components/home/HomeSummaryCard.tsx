import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

type HomeSummaryCardProps = {
  caloriesLabel: string;
  caloriesRemainingLabel: string;
  currentWeightLabel: string;
  currentWeightTitle: string;
  isCaloriesOverTarget: boolean;
  motivation: string;
  streakLabel?: string;
  streakTitle: string;
  title: string;
  todayLabel: string;
};

type HomeSummaryStyles = ReturnType<typeof createStyles>;

function Metric({
  label,
  styles,
  value,
}: {
  label: string;
  styles: HomeSummaryStyles;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <Text selectable style={styles.metricLabel}>
        {label}
      </Text>
      <Text selectable style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

export function HomeSummaryCard({
  caloriesLabel,
  caloriesRemainingLabel,
  currentWeightLabel,
  currentWeightTitle,
  isCaloriesOverTarget,
  motivation,
  streakLabel,
  streakTitle,
  title,
  todayLabel,
}: HomeSummaryCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <AppCard style={[styles.card, isCaloriesOverTarget && styles.cardWarning]}>
      <View style={styles.hero}>
        <View style={styles.headerCopy}>
          <Text selectable style={styles.kicker}>
            {todayLabel}
          </Text>
          <Text selectable style={styles.title}>
            {title}
          </Text>
          <Text selectable style={styles.subheadline}>
            {motivation}
          </Text>
        </View>

        <View style={styles.caloriesStatus}>
          <Text selectable style={styles.caloriesLabel}>
            {caloriesLabel}
          </Text>
          <Text
            selectable
            style={[styles.caloriesValue, isCaloriesOverTarget && styles.caloriesValueWarning]}>
            {caloriesRemainingLabel}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metricsRow}>
        <Metric label={currentWeightTitle} styles={styles} value={currentWeightLabel} />
        <Metric label={streakTitle} styles={styles} value={streakLabel ?? '—'} />
      </View>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    caloriesLabel: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
      textAlign: 'right',
    },
    caloriesStatus: {
      alignItems: 'flex-end',
      flexShrink: 1,
      gap: 2,
      maxWidth: '100%',
      minWidth: 0,
      paddingTop: 2,
    },
    caloriesValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.heroMetric.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
      textAlign: 'right',
    },
    caloriesValueWarning: { color: colors.warning },
    card: {
      backgroundColor: colors.surfaceAccent,
      gap: Spacing.three,
    },
    cardWarning: { backgroundColor: colors.warningSoft },
    divider: {
      backgroundColor: colors.borderSubtle,
      height: StyleSheet.hairlineWidth,
    },
    headerCopy: { flex: 1, flexBasis: 180, gap: 4, minWidth: 0 },
    hero: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
      justifyContent: 'space-between',
    },
    kicker: {
      color: colors.accent,
      flexShrink: 1,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
    metric: {
      flex: 1,
      gap: 2,
      minWidth: 120,
    },
    metricLabel: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
    metricValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.bodyEmphasized.lineHeight,
    },
    metricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.four,
    },
    subheadline: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.callout.fontSize,
      lineHeight: Typography.callout.lineHeight,
      marginTop: Spacing.one,
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
