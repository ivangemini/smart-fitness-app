import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type {
  CoachInputCoverage,
  CoachRunInputSummary,
  NutritionInputCoverage,
  SafetyRecoveryInputCoverage,
  StrengthInputCoverage,
} from '@/api/coach';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { getCoachInputSummaryCopy } from '../coachInputSummaryCopy';

type CoachInputSummaryCardProps = {
  summary?: CoachRunInputSummary;
  invalid?: boolean;
};

type Styles = ReturnType<typeof createStyles>;

function Row({ label, styles, value }: { label: string; styles: Styles; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function NutritionRows({
  source,
  copy,
  formatCount,
  styles,
}: {
  source: NutritionInputCoverage;
  copy: ReturnType<typeof getCoachInputSummaryCopy>;
  formatCount: (value: number) => string;
  styles: Styles;
}) {
  return (
    <>
      <Row
        label={copy.lookback}
        styles={styles}
        value={source.lookbackDays === null ? copy.notRecorded : copy.days(source.lookbackDays)}
      />
      <Row label={copy.foodEntries} styles={styles} value={formatCount(source.foodEntryCount)} />
      <Row label={copy.loggedDays} styles={styles} value={formatCount(source.loggedDayCount)} />
      <Row
        label={copy.weightEntries}
        styles={styles}
        value={formatCount(source.weightEntryCount)}
      />
      <Row
        label={copy.latestWeight}
        styles={styles}
        value={source.hasLatestWeight ? copy.yes : copy.no}
      />
      <Row
        label={copy.activeTarget}
        styles={styles}
        value={source.hasActiveTarget ? copy.yes : copy.no}
      />
      <Row
        label={copy.fitnessProfile}
        styles={styles}
        value={source.hasFitnessProfile ? copy.yes : copy.no}
      />
    </>
  );
}

function StrengthRows({
  source,
  copy,
  formatCount,
  styles,
}: {
  source: StrengthInputCoverage;
  copy: ReturnType<typeof getCoachInputSummaryCopy>;
  formatCount: (value: number) => string;
  styles: Styles;
}) {
  return (
    <>
      <Row
        label={copy.specificSession}
        styles={styles}
        value={source.requestedSpecificSession ? copy.yes : copy.no}
      />
      <Row
        label={copy.historyLimit}
        styles={styles}
        value={
          source.requestedHistoryLimit === null
            ? copy.notRecorded
            : formatCount(source.requestedHistoryLimit)
        }
      />
      <Row label={copy.sessions} styles={styles} value={formatCount(source.sessionCount)} />
      <Row
        label={copy.completedSets}
        styles={styles}
        value={formatCount(source.completedSetCount)}
      />
      <Row
        label={copy.exercises}
        styles={styles}
        value={formatCount(source.distinctExerciseCount)}
      />
      <Row
        label={copy.rpeSets}
        styles={styles}
        value={formatCount(source.setsWithActualRpeCount)}
      />
      <Row
        label={copy.latestWeight}
        styles={styles}
        value={source.hasLatestWeight ? copy.yes : copy.no}
      />
    </>
  );
}

function SafetyRows({
  source,
  copy,
  formatCount,
  styles,
}: {
  source: SafetyRecoveryInputCoverage;
  copy: ReturnType<typeof getCoachInputSummaryCopy>;
  formatCount: (value: number) => string;
  styles: Styles;
}) {
  return (
    <>
      <Row
        label={copy.lookback}
        styles={styles}
        value={source.lookbackDays === null ? copy.notRecorded : copy.days(source.lookbackDays)}
      />
      <Row
        label={copy.limitations}
        styles={styles}
        value={formatCount(source.activeLimitationCount)}
      />
      <Row
        label={copy.pauseTraining}
        styles={styles}
        value={formatCount(source.pauseTrainingCount)}
      />
      <Row
        label={copy.avoidMovement}
        styles={styles}
        value={formatCount(source.avoidMovementCount)}
      />
      <Row
        label={copy.reduceLoad}
        styles={styles}
        value={formatCount(source.reduceLoadCount)}
      />
      <Row
        label={copy.checkIns}
        styles={styles}
        value={formatCount(source.recoveryCheckInCount)}
      />
      <Row
        label={copy.limitationNotes}
        styles={styles}
        value={formatCount(source.limitationNotesPresentCount)}
      />
      <Row
        label={copy.checkInNotes}
        styles={styles}
        value={formatCount(source.checkInNotesPresentCount)}
      />
    </>
  );
}

function SourceRows({
  source,
  copy,
  formatCount,
  styles,
}: {
  source: CoachInputCoverage;
  copy: ReturnType<typeof getCoachInputSummaryCopy>;
  formatCount: (value: number) => string;
  styles: Styles;
}) {
  if (!source.available) {
    return <Text style={styles.notice}>{copy.sourceUnavailable}</Text>;
  }
  if (source.domain === 'nutrition') {
    return (
      <NutritionRows source={source} copy={copy} formatCount={formatCount} styles={styles} />
    );
  }
  if (source.domain === 'strength') {
    return <StrengthRows source={source} copy={copy} formatCount={formatCount} styles={styles} />;
  }
  return <SafetyRows source={source} copy={copy} formatCount={formatCount} styles={styles} />;
}

export function CoachInputSummaryCard({
  summary,
  invalid = false,
}: CoachInputSummaryCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { locale, formatNumber } = useLocalization();
  const copy = getCoachInputSummaryCopy(locale);
  if (!invalid && (!summary || summary.sources.length === 0)) return null;

  const formatCount = (value: number) => formatNumber(value, { maximumFractionDigits: 0 });

  return (
    <AppCard>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.description}>{copy.description}</Text>
      {invalid ? (
        <Text style={styles.notice}>{copy.unavailable}</Text>
      ) : (
        summary?.sources.map((source) => (
          <View key={source.domain} style={styles.sourceBlock}>
            <Text style={styles.sourceTitle}>{copy.domain(source.domain)}</Text>
            <SourceRows
              source={source}
              copy={copy}
              formatCount={formatCount}
              styles={styles}
            />
          </View>
        ))
      )}
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    description: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    label: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: Typography.caption.fontSize,
    },
    notice: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    row: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    sourceBlock: {
      borderTopColor: colors.borderSubtle,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: Spacing.one,
      paddingTop: Spacing.two,
    },
    sourceTitle: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: '700',
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
    },
    value: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: Typography.caption.fontSize,
      textAlign: 'right',
    },
  });
