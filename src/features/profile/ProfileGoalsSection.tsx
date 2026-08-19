import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileGoalsCard } from '@/components/profile/ProfileGoalsCard';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Colors, Spacing } from '@/constants/theme';
import { useAppActions } from '@/context/AppContext';
import { useProfileState } from '@/context/ProfileStateContext';
import { GoalProposalPreviewCard } from '@/features/goals/GoalProposalPreviewCard';
import {
  buildGoalProposal,
  type GoalProposal,
} from '@/features/goals/goalProposal';
import { getGoalProposalCopy } from '@/features/goals/goalProposalCopy';
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
  const proposalCopy = getGoalProposalCopy(locale);
  const { weight: weightUnit } = useUnitPreferences();
  const [expanded, setExpanded] = useState(false);
  const [proposal, setProposal] = useState<GoalProposal | null>(null);
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
    setProposal(null);
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

  const clearProposal = () => setProposal(null);

  const applyProposal = async (currentProposal: GoalProposal) => {
    const status = await updateProfileGoals(currentProposal.proposed, {
      expectedCurrent: currentProposal.source,
    });
    if (status === 'stale') {
      setProposal(null);
      Alert.alert(proposalCopy.staleTitle, proposalCopy.staleBody);
      return;
    }

    setProposal(null);
    setExpanded(false);
    Alert.alert(proposalCopy.savedTitle, proposalCopy.savedBody);
  };

  const reviewChanges = () => {
    if (isSaveDisabled) return;

    const nextProposal = buildGoalProposal({
      source: getProfileGoalsSnapshot(profile),
      proposed: {
        targetWeight: canonicalTargetWeight,
        goalType,
        weeklyWeightChangeGoal: canonicalWeeklyWeightChangeGoal,
        trainingDaysPerWeek: parsedTrainingDaysPerWeek,
      },
    });

    if (!nextProposal) {
      setProposal(null);
      Alert.alert(proposalCopy.noChangesTitle, proposalCopy.noChangesBody);
      return;
    }

    setProposal(nextProposal);
  };

  const toggleExpanded = () => {
    if (expanded) setProposal(null);
    setExpanded((current) => !current);
  };

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={toggleExpanded}
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
        <>
          <ProfileGoalsCard
            goalType={goalType}
            isSaveDisabled={isSaveDisabled}
            onGoalTypeChange={(value) => {
              clearProposal();
              setGoalType(value);
            }}
            onSaveGoals={reviewChanges}
            onTargetWeightChange={(value) => {
              clearProposal();
              setTargetWeight(value);
            }}
            onTrainingDaysPerWeekChange={(value) => {
              clearProposal();
              setTrainingDaysPerWeek(value);
            }}
            onWeeklyWeightChangeGoalChange={(value) => {
              clearProposal();
              setWeeklyWeightChangeGoal(value);
            }}
            primaryActionLabel={proposalCopy.reviewChanges}
            targetWeight={targetWeight}
            trainingDaysPerWeek={trainingDaysPerWeek}
            validationErrors={validationErrors}
            weeklyWeightChangeGoal={weeklyWeightChangeGoal}
            weightUnit={weightUnit}
          />
          {proposal ? (
            <GoalProposalPreviewCard
              onApply={() => void applyProposal(proposal)}
              onCancel={clearProposal}
              proposal={proposal}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    chevron: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 26,
    },
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
