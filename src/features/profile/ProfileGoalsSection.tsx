import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileGoalsCard } from '@/components/profile/ProfileGoalsCard';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Colors, Spacing } from '@/constants/theme';
import { useAppActions } from '@/context/AppContext';
import { useProfileState } from '@/context/ProfileStateContext';
import { useProgressState } from '@/context/ProgressStateContext';
import { getGoalPlanningCopy } from '@/features/goals/goalPlanningCopy';
import {
  createGoalPlanningProposal,
  isGoalPlanningProposalStale,
  type GoalPlanningProposal,
  type GoalPlanningValues,
} from '@/features/goals/goalPlanningProposal';
import { GoalPlanningProposalPreview } from '@/features/goals/GoalPlanningProposalPreview';
import { getGoalTypeLabel } from '@/features/progress/progressLocalization';
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

import {
  calculateNutritionTargets,
  getProfileWeightKg,
  normalizeProfileActivityLevel,
} from './profilePlan';

const goalValuesFromProfile = (profile: {
  goalType: GoalPlanningValues['goalType'];
  targetWeight: number;
  weeklyWeightChangeGoal: number;
  trainingDaysPerWeek: number;
}): GoalPlanningValues => ({
  goalType: profile.goalType,
  targetWeight: profile.targetWeight,
  weeklyWeightChangeGoal: profile.weeklyWeightChangeGoal,
  trainingDaysPerWeek: profile.trainingDaysPerWeek,
});

export function ProfileGoalsSection() {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const { profile } = useProfileState();
  const { weightHistory } = useProgressState();
  const { updateNutritionTargets, updateProfileGoals } = useAppActions();
  const { locale, t } = useLocalization();
  const validationCopy = getProfileGoalsValidationCopy(locale);
  const planningCopy = getGoalPlanningCopy(locale);
  const { weight: weightUnit } = useUnitPreferences();
  const [expanded, setExpanded] = useState(false);
  const [proposal, setProposal] = useState<GoalPlanningProposal | null>(null);
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
  }, [profile, weightUnit]);

  const canonicalTargetWeight = weightToKg(
    parseDisplayNumber(targetWeight),
    weightUnit,
  );
  const canonicalWeeklyWeightChangeGoal = weightToKg(
    parseDisplayNumber(weeklyWeightChangeGoal),
    weightUnit,
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

  const reviewGoalChanges = () => {
    if (isSaveDisabled) return;
    const nextProposal = createGoalPlanningProposal({
      source: goalValuesFromProfile(profile),
      proposed: {
        targetWeight: canonicalTargetWeight,
        goalType,
        weeklyWeightChangeGoal: canonicalWeeklyWeightChangeGoal,
        trainingDaysPerWeek: parsedTrainingDaysPerWeek,
      },
    });
    if (nextProposal.changes.length === 0) {
      Alert.alert(planningCopy.noChangesTitle, planningCopy.noChangesBody);
      return;
    }
    setProposal(nextProposal);
  };

  const recalculateNutrition = (applied: GoalPlanningValues) => {
    const latestWeight = weightHistory[0]?.weight;
    const currentWeight =
      latestWeight ??
      getProfileWeightKg({
        fallbackWeight: applied.targetWeight,
        profileWeight: profile.weight,
      });
    const activityLevel =
      normalizeProfileActivityLevel(profile.activityLevel) ?? 'moderate';
    updateNutritionTargets(
      calculateNutritionTargets({
        activityLevel,
        goalType: applied.goalType,
        weightKg: currentWeight,
      }),
    );
  };

  const applyGoalProposal = () => {
    if (!proposal) return;
    if (isGoalPlanningProposalStale(proposal, goalValuesFromProfile(profile))) {
      setProposal(null);
      Alert.alert(planningCopy.staleTitle, planningCopy.staleBody);
      return;
    }

    const applied = proposal.proposed;
    updateProfileGoals(applied);
    setProposal(null);
    setExpanded(false);
    Alert.alert(planningCopy.savedTitle, planningCopy.savedBody, [
      { text: planningCopy.keepNutrition, style: 'cancel' },
      {
        text: planningCopy.recalculateNutrition,
        onPress: () => recalculateNutrition(applied),
      },
    ]);
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
            onSaveGoals={reviewGoalChanges}
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
            primaryActionLabel={planningCopy.reviewChanges}
            targetWeight={targetWeight}
            trainingDaysPerWeek={trainingDaysPerWeek}
            validationErrors={validationErrors}
            weeklyWeightChangeGoal={weeklyWeightChangeGoal}
            weightUnit={weightUnit}
          />
          {proposal ? (
            <GoalPlanningProposalPreview
              onApply={applyGoalProposal}
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
