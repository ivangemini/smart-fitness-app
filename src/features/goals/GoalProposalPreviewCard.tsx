import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { getGoalTypeLabel } from '@/features/progress/progressLocalization';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { formatWeightValue, useUnitPreferences } from '@/units';

import { getGoalProposalCopy } from './goalProposalCopy';
import type { GoalProposal, GoalProposalChange } from './goalProposal';

const formatChangeValue = ({
  change,
  localeNumber,
  goalTypeLabel,
  weightUnit,
  perWeek,
}: {
  change: GoalProposalChange;
  localeNumber(value: number): string;
  goalTypeLabel(value: 'lose_fat' | 'maintain' | 'gain_muscle'): string;
  weightUnit: 'kg' | 'lb';
  perWeek: string;
}) => {
  if (change.field === 'goalType') {
    return {
      current: goalTypeLabel(change.current),
      proposed: goalTypeLabel(change.proposed),
    };
  }
  if (change.field === 'trainingDaysPerWeek') {
    return {
      current: localeNumber(change.current),
      proposed: localeNumber(change.proposed),
    };
  }

  const suffix =
    change.field === 'weeklyWeightChangeGoal'
      ? ` ${weightUnit}${perWeek}`
      : ` ${weightUnit}`;
  return {
    current: `${formatWeightValue(change.current, weightUnit)}${suffix}`,
    proposed: `${formatWeightValue(change.proposed, weightUnit)}${suffix}`,
  };
};

export function GoalProposalPreviewCard({
  onApply,
  onCancel,
  proposal,
}: {
  proposal: GoalProposal;
  onApply(): void;
  onCancel(): void;
}) {
  const { colors } = useAppTheme();
  const { formatNumber, locale, t } = useLocalization();
  const { weight: weightUnit } = useUnitPreferences();
  const copy = getGoalProposalCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <AppCard>
      <Text style={styles.title}>{copy.reviewTitle}</Text>
      <Text style={styles.body}>{copy.reviewBody}</Text>

      <View style={styles.changes}>
        {proposal.changes.map((change) => {
          const values = formatChangeValue({
            change,
            localeNumber: (value) =>
              formatNumber(value, { maximumFractionDigits: 2 }),
            goalTypeLabel: (value) => getGoalTypeLabel(t, value),
            weightUnit,
            perWeek: copy.perWeek,
          });
          return (
            <View key={change.field} style={styles.changeRow}>
              <Text style={styles.label}>{copy.fieldLabels[change.field]}</Text>
              <Text selectable style={styles.value}>
                {values.current} → {values.proposed}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.boundary}>{copy.boundary}</Text>
      <AppButton label={copy.apply} onPress={onApply} />
      <AppButton label={copy.cancel} onPress={onCancel} variant="secondary" />
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    boundary: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    changeRow: {
      gap: Spacing.one,
    },
    changes: {
      gap: Spacing.three,
    },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    value: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
  });
