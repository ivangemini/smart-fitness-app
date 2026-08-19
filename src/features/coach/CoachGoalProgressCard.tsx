import { router } from 'expo-router';
import { useMemo } from 'react';
import { Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Typography } from '@/constants/theme';
import { buildGoalFacts } from '@/features/goals/goalFacts';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences } from '@/units';

import type { CoachGoalProgressContext } from './coachGoalProgressContext';
import {
  getCoachGoalProgressContextCopy,
  getCoachGoalTypeCopy,
} from './coachGoalProgressContextCopy';
import { useCoachRetrievalSources } from './useCoachRetrievalSources';

export function CoachGoalProgressCard({
  context,
}: {
  context: CoachGoalProgressContext | null;
}) {
  const { colors } = useAppTheme();
  const { formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const sources = useCoachRetrievalSources();
  const copy = getCoachGoalProgressContextCopy(locale);
  const facts = useMemo(
    () =>
      context
        ? buildGoalFacts({
            endAt: context.endAt,
            profile: sources.profile,
            weightHistory: sources.weightHistory,
            workoutSessions: sources.workoutSessions,
          })
        : null,
    [context, sources],
  );

  if (!context || !facts) return null;

  const titleStyle = {
    color: colors.textPrimary,
    fontSize: Typography.cardTitle.fontSize,
    fontWeight: Typography.cardTitle.fontWeight,
    lineHeight: Typography.cardTitle.lineHeight,
  } as const;
  const bodyStyle = {
    color: colors.textSecondary,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  } as const;
  const summaryStyle = {
    ...bodyStyle,
    color: colors.textPrimary,
    fontWeight: '700' as const,
    marginTop: 8,
  };
  const noteStyle = { ...bodyStyle, marginTop: 8 };

  return (
    <AppCard>
      <Text style={titleStyle}>{copy.title}</Text>
      <Text style={bodyStyle}>{copy.description}</Text>
      <Text selectable style={summaryStyle}>
        {copy.goal}: {getCoachGoalTypeCopy(locale, facts.goalType)}
      </Text>
      <Text selectable style={noteStyle}>
        {copy.targetWeight}:{' '}
        {facts.weight.targetWeightKg > 0
          ? `${formatWeightValue(facts.weight.targetWeightKg)} ${weightUnit}`
          : copy.unavailable}
      </Text>
      <Text selectable style={noteStyle}>
        {copy.currentWeight}:{' '}
        {facts.weight.currentWeightKg === null
          ? copy.unavailable
          : `${formatWeightValue(facts.weight.currentWeightKg)} ${weightUnit}`}
      </Text>
      <Text selectable style={noteStyle}>
        {copy.trainingDays}: {formatNumber(facts.training.activeDaysLast7Days)} /{' '}
        {formatNumber(facts.training.targetDaysPerWeek)}
      </Text>
      <AppButton
        label={copy.openProgress}
        onPress={() => router.push('/(tabs)/progress')}
        variant="secondary"
      />
    </AppCard>
  );
}
