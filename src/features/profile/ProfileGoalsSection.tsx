import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileGoalsCard } from '@/components/profile/ProfileGoalsCard';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Colors, Spacing } from '@/constants/theme';
import { useAppActions } from '@/context/AppContext';
import { useProfileState } from '@/context/ProfileStateContext';
import {
  buildGoalProposal,
  type GoalProposal,
  type GoalProposalChange,
} from '@/features/goals/goalProposal';
import { getGoalTypeLabel } from '@/features/progress/progressLocalization';
import { getProfileGoalsSnapshot } from '@/lib/profileGoals';
import { useLocalization } from '@/localization';
import { getProfileGoalsValidationCopy } from '@/localization/profileGoalsValidationCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';
import {
  formatWeightValue,
  parseDisplayNumber,
  useUnitPreferences,
  weightToKg,
} from '@/units';

const PROPOSAL_COPY = {
  en: {
    reviewTitle: 'Review goal changes',
    reviewBody:
      'Only your saved goal fields will change. Nutrition targets and training programs stay unchanged.',
    apply: 'Apply goals',
    noChangesTitle: 'No goal changes',
    noChangesBody: 'Your saved goals already match these values.',
    staleTitle: 'Goals changed',
    staleBody:
      'Your saved goals changed while this preview was open. Review the latest values before applying.',
    savedTitle: 'Goals updated',
    savedBody:
      'Your goal changes are saved. Nutrition targets and training programs were not changed.',
    goalType: 'Goal',
    targetWeight: 'Target weight',
    weeklyChange: 'Weekly weight change',
    trainingDays: 'Training days',
    perWeek: '/week',
  },
  ru: {
    reviewTitle: 'Проверь изменения целей',
    reviewBody:
      'Изменятся только сохранённые поля цели. Цели питания и тренировочные программы останутся без изменений.',
    apply: 'Применить цели',
    noChangesTitle: 'Изменений нет',
    noChangesBody: 'Сохранённые цели уже совпадают с этими значениями.',
    staleTitle: 'Цели изменились',
    staleBody:
      'Сохранённые цели изменились, пока было открыто это превью. Проверь актуальные значения перед применением.',
    savedTitle: 'Цели обновлены',
    savedBody:
      'Изменения целей сохранены. Цели питания и тренировочные программы не изменялись.',
    goalType: 'Цель',
    targetWeight: 'Целевой вес',
    weeklyChange: 'Изменение веса за неделю',
    trainingDays: 'Тренировочных дней',
    perWeek: '/нед.',
  },
} as const;

export function ProfileGoalsSection() {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const { profile } = useProfileState();
  const { updateProfileGoals } = useAppActions();
  const { locale, t } = useLocalization();
  const validationCopy = getProfileGoalsValidationCopy(locale);
  const proposalCopy = PROPOSAL_COPY[locale];
  const { weight: weightUnit } = useUnitPreferences();
  const [expanded, setExpanded] = useState(false);
  const [targetWeight, setTargetWeight] = useState(() =>
    formatWeightValue(profile.targetWeight, weightUnit),
  );
  const [goalType, setGoalType] = useState(profile.goalType);
  const [weeklyWeightChangeGoal, setWeeklyWeightChangeGoal] = useState(() =>
    formatWeightValue(profile.weeklyWeightChangeGoal, weightUnit),
  );
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState(
    `${profile.trainingDaysPerWeek}`,
  );

  useEffect(() => {
    setTargetWeight(formatWeightValue(profile.targetWeight, weightUnit));
    setGoalType(profile.goalType);
    setWeeklyWeightChangeGoal(
      formatWeightValue(profile.weeklyWeightChangeGoal, weightUnit),
    );
    setTrainingDaysPerWeek(`${profile.trainingDaysPerWeek}`);
  }, [
    profile.goalType,
    profile.targetWeight,
    profile.trainingDaysPerWeek,
    profile.weeklyWeightChangeGoal,
    weightUnit,
  ]);

  const parseGoalWeight = (value: string, currentKg: number) => {
    const parsed = parseDisplayNumber(value);
    const currentDisplay = parseDisplayNumber(
      formatWeightValue(currentKg, weightUnit),
    );
    return parsed === currentDisplay ? currentKg : weightToKg(parsed, weightUnit);
  };

  const canonicalTargetWeight = parseGoalWeight(
    targetWeight,
    profile.targetWeight,
  );
  const canonicalWeeklyWeightChangeGoal = parseGoalWeight(
    weeklyWeightChangeGoal,
    profile.weeklyWeightChangeGoal,
  );
  const parsedTrainingDaysPerWeek = Number(trainingDaysPerWeek);
  const validationErrors = {
    targetWeight:
      !Number.isFinite(canonicalTargetWeight) || canonicalTargetWeight <= 0
        ? validationCopy.targetWeight
        : undefined,
    weeklyWeightChange:
      !Number.isFinite(canonicalWeeklyWeightChangeGoal) ||
      canonicalWeeklyWeightChangeGoal < 0
        ? validationCopy.weeklyWeightChange
        : undefined,
    trainingDays:
      !Number.isInteger(parsedTrainingDaysPerWeek) ||
      parsedTrainingDaysPerWeek < 1 ||
      parsedTrainingDaysPerWeek > 7
        ? validationCopy.trainingDays
        : undefined,
  };
  const isSaveDisabled = Boolean(
    validationErrors.targetWeight ||
      validationErrors.weeklyWeightChange ||
      validationErrors.trainingDays,
  );

  const formatProposalChange = (change: GoalProposalChange): string => {
    if (change.field === 'goalType') {
      return `${proposalCopy.goalType}: ${getGoalTypeLabel(t, change.current)} → ${getGoalTypeLabel(t, change.proposed)}`;
    }
    if (change.field === 'targetWeight') {
      return `${proposalCopy.targetWeight}: ${formatWeightValue(change.current, weightUnit)} ${weightUnit} → ${formatWeightValue(change.proposed, weightUnit)} ${weightUnit}`;
    }
    if (change.field === 'weeklyWeightChangeGoal') {
      return `${proposalCopy.weeklyChange}: ${formatWeightValue(change.current, weightUnit)} ${weightUnit}${proposalCopy.perWeek} → ${formatWeightValue(change.proposed, weightUnit)} ${weightUnit}${proposalCopy.perWeek}`;
    }
    return `${proposalCopy.trainingDays}: ${change.current} → ${change.proposed}`;
  };

  const applyProposal = async (proposal: GoalProposal) => {
    const status = await updateProfileGoals(proposal.proposed, {
      expectedCurrent: proposal.source,
    });
    if (status === 'stale') {
      Alert.alert(proposalCopy.staleTitle, proposalCopy.staleBody);
      return;
    }

    setExpanded(false);
    Alert.alert(proposalCopy.savedTitle, proposalCopy.savedBody);
  };

  const confirmSave = () => {
    if (isSaveDisabled) return;

    const proposal = buildGoalProposal({
      source: getProfileGoalsSnapshot(profile),
      proposed: {
        targetWeight: canonicalTargetWeight,
        goalType,
        weeklyWeightChangeGoal: canonicalWeeklyWeightChangeGoal,
        trainingDaysPerWeek: parsedTrainingDaysPerWeek,
      },
    });

    if (!proposal) {
      Alert.alert(proposalCopy.noChangesTitle, proposalCopy.noChangesBody);
      return;
    }

    const summary = proposal.changes.map(formatProposalChange).join('\n');
    Alert.alert(
      proposalCopy.reviewTitle,
      `${proposalCopy.reviewBody}\n\n${summary}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: proposalCopy.apply,
          onPress: () => void applyProposal(proposal),
        },
      ],
    );
  };

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={styles.disclosurePressable}>
        {({ pressed }) => (
          <LiquidGlassSurface
            style={[styles.disclosure, pressed && styles.disclosurePressed]}
            variant="control">
            <View style={styles.copy}>
              <Text style={styles.title}>{t('goals.sectionTitle')}</Text>
              <Text style={styles.subtitle}>
                {t('goals.sectionSubtitle', {
                  goal: getGoalTypeLabel(t, profile.goalType),
                  weight: formatWeightValue(profile.targetWeight, weightUnit),
                  unit: weightUnit,
                })}
              </Text>
            </View>
            <Text style={styles.chevron}>{expanded ? '−' : '+'}</Text>
          </LiquidGlassSurface>
        )}
      </Pressable>
      {expanded ? (
        <ProfileGoalsCard
          goalType={goalType}
          isSaveDisabled={isSaveDisabled}
          onGoalTypeChange={setGoalType}
          onSaveGoals={confirmSave}
          onTargetWeightChange={setTargetWeight}
          onTrainingDaysPerWeekChange={setTrainingDaysPerWeek}
          onWeeklyWeightChangeGoalChange={setWeeklyWeightChangeGoal}
          targetWeight={targetWeight}
          trainingDaysPerWeek={trainingDaysPerWeek}
          validationErrors={validationErrors}
          weeklyWeightChangeGoal={weeklyWeightChangeGoal}
          weightUnit={weightUnit}
        />
      ) : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    chevron: { color: colors.textPrimary, fontSize: 24, fontWeight: '600', lineHeight: 26 },
    copy: { flex: 1, gap: 4 },
    disclosure: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      minHeight: 68,
      padding: Spacing.three,
      width: '100%',
    },
    disclosurePressed: { backgroundColor: glass.controlPressedFill },
    disclosurePressable: { width: '100%' },
    section: { gap: Spacing.two },
    subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
    title: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  });
