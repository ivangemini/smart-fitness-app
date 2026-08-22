import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import { getPreviousCompletedSetsForExercise } from '@/features/workouts/sessionScreenModel';
import { createStyles } from '@/features/workouts/styles/workoutSessionScreenStyles';
import type { WorkoutSessionDraft } from '@/features/workouts/types';
import { getWorkoutContextualAdjustment } from '@/features/workouts/workoutContextualAdjustment';
import {
  findWorkoutSupersetPartnerSet,
  getNextWorkoutSetType,
} from '@/features/workouts/workoutSessionAssistantModel';
import {
  adjustWorkoutRestTimer,
  formatWorkoutRestTimer,
  getWorkoutRestTimerRemainingSeconds,
  pauseWorkoutRestTimer,
  resumeWorkoutRestTimer,
  startWorkoutRestTimer,
  type WorkoutRestTimerState,
} from '@/features/workouts/workoutRestTimer';
import {
  buildWorkoutWarmupProposal,
  type WorkoutWarmupSetProposal,
} from '@/features/workouts/workoutWarmupGuide';
import { useLocalization } from '@/localization';
import { getWorkoutAssistantCopy } from '@/localization/workoutAssistantCopy';
import type { WorkoutSession, WorkoutSetType } from '@/types';

import { SessionExerciseSection } from './SessionExerciseSection';
import { SessionHeader } from './SessionHeader';
import type { SessionDraftInputs, SessionExercise } from './types';
import { WorkoutAdjustmentSuggestion } from './WorkoutAdjustmentSuggestion';
import { WorkoutRestTimerBar } from './WorkoutRestTimerBar';
import { WorkoutSessionEmptyWorkoutCard } from './WorkoutSessionEmptyWorkoutCard';
import { WorkoutSessionFooterActions } from './WorkoutSessionFooterActions';

type WorkoutSessionStyles = ReturnType<typeof createStyles>;
type PlannedSetField = 'weight' | 'reps';

type AdjustmentOptions = {
  loadMultiplier?: number;
  targetReps?: number;
  targetRepsByIndex?: readonly number[];
  targetSetCount?: number;
  targetWeightsByIndex?: readonly number[];
};

export function WorkoutSessionBody({
  bottomInset,
  canFinish,
  completedReps,
  completedSetCount,
  completedVolume,
  draft,
  draftInputs,
  elapsedLabel,
  expandedExerciseId,
  isEmptyWorkout,
  onAddExercises,
  onAddSet,
  onAddWarmupSets,
  onApplyAdjustment,
  onBack,
  onEditSetRpe,
  onFinish,
  onLongPressExercise,
  onOverflow,
  onPlannedSetChange,
  onPlannedToggleSetCompletion,
  onRemoveSet,
  onSetChange,
  onSetTypeChange,
  onTestGif,
  onToggleExpanded,
  onToggleSetCompletion,
  onToggleSuperset,
  styles,
  visibleExercises,
  workoutSessions,
  workoutTitle,
}: {
  bottomInset: number;
  canFinish: boolean;
  completedReps: number;
  completedSetCount: number;
  completedVolume: number;
  draft: WorkoutSessionDraft;
  draftInputs: SessionDraftInputs;
  elapsedLabel: string;
  expandedExerciseId: string | null;
  isEmptyWorkout: boolean;
  onAddExercises(): void;
  onAddSet(exerciseId: string): void;
  onAddWarmupSets(exerciseId: string, proposal: readonly WorkoutWarmupSetProposal[]): void;
  onApplyAdjustment(setId: string, adjustedWeight: number, options: AdjustmentOptions): void;
  onBack(): void;
  onEditSetRpe(setId: string): void;
  onFinish(): void;
  onLongPressExercise(exerciseId: string, exerciseName: string): void;
  onOverflow(): void;
  onPlannedSetChange(
    exerciseId: string,
    index: number,
    field: PlannedSetField,
    value: string,
  ): void;
  onPlannedToggleSetCompletion(exerciseId: string, index: number): void;
  onRemoveSet(setId: string): void;
  onSetChange(setId: string, field: PlannedSetField, value: string): void;
  onSetTypeChange(setId: string, setType: WorkoutSetType): void;
  onTestGif(): void;
  onToggleExpanded(exerciseId: string): void;
  onToggleSetCompletion(setId: string): void;
  onToggleSuperset(sourceSetId: string, partnerSetId: string): void;
  styles: WorkoutSessionStyles;
  visibleExercises: SessionExercise[];
  workoutSessions: WorkoutSession[];
  workoutTitle: string;
}) {
  const { locale, t } = useLocalization();
  const copy = useMemo(() => getWorkoutAssistantCopy(locale), [locale]);
  const { workouts } = useWorkoutState();
  const [restTimer, setRestTimer] = useState<WorkoutRestTimerState | null>(null);
  const [restNowMs, setRestNowMs] = useState(Date.now());
  const [skippedWarmups, setSkippedWarmups] = useState<Set<string>>(() => new Set());
  const [dismissedAdjustments, setDismissedAdjustments] = useState<Set<string>>(
    () => new Set(),
  );
  const prescription = workouts.find((workout) => workout.id === draft.workoutId)?.prescription ?? [];
  const visibleExerciseIds = useMemo(
    () => Array.from(visibleExercises, (exercise) => exercise.id),
    [visibleExercises],
  );
  const restRemainingSeconds = restTimer
    ? getWorkoutRestTimerRemainingSeconds(restTimer, restNowMs)
    : 0;

  useEffect(() => {
    const interval = setInterval(() => setRestNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (restTimer?.status === 'running' && restRemainingSeconds <= 0) {
      setRestTimer(null);
    }
  }, [restRemainingSeconds, restTimer?.status]);

  const startRestForExercise = (exerciseId: string) => {
    const exercise = visibleExercises.find((item) => item.id === exerciseId);
    const nowMs = Date.now();
    setRestNowMs(nowMs);
    setRestTimer(
      startWorkoutRestTimer({
        exerciseId,
        restSeconds: exercise?.restSeconds,
        nowMs,
      }),
    );
  };

  const handleToggleSetCompletion = (setId: string) => {
    const set = draft.sets.find((item) => item.id === setId);
    const willComplete = Boolean(set && set.completed !== true);
    onToggleSetCompletion(setId);
    if (willComplete && set) startRestForExercise(set.exerciseId);
  };

  const handlePlannedToggleSetCompletion = (exerciseId: string, index: number) => {
    const workingSets = draft.sets.filter(
      (set) => set.exerciseId === exerciseId && set.setType !== 'warmup',
    );
    const currentSet = workingSets[index];
    const willComplete = currentSet?.completed !== true;
    onPlannedToggleSetCompletion(exerciseId, index);
    if (willComplete) startRestForExercise(exerciseId);
  };

  const handlePauseResumeRest = () => {
    const nowMs = Date.now();
    setRestNowMs(nowMs);
    setRestTimer((current) => {
      if (!current) return null;
      return current.status === 'paused'
        ? resumeWorkoutRestTimer(current, nowMs)
        : pauseWorkoutRestTimer(current, nowMs);
    });
  };

  const handleAdjustRest = (deltaSeconds: number) => {
    const nowMs = Date.now();
    setRestNowMs(nowMs);
    setRestTimer((current) =>
      current ? adjustWorkoutRestTimer(current, deltaSeconds, nowMs) : null,
    );
  };

  const setTypeLabel = (type: WorkoutSetType) => {
    if (type === 'warmup') return copy.warmup;
    if (type === 'backoff') return copy.backoff;
    if (type === 'drop') return copy.drop;
    if (type === 'amrap') return copy.amrap;
    return copy.working;
  };

  const openSetActions = (setId: string) => {
    const set = draft.sets.find((item) => item.id === setId);
    if (!set) return;
    const nextType = getNextWorkoutSetType(set.setType);
    const partner = findWorkoutSupersetPartnerSet(
      draft,
      setId,
      visibleExerciseIds,
    );
    const openEditActions = () =>
      Alert.alert(t('workouts.session.setActions'), undefined, [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: copy.nextSetType(setTypeLabel(nextType)),
          onPress: () => onSetTypeChange(setId, nextType),
        },
        ...(partner
          ? [
              {
                text:
                  set.supersetId && set.supersetId === partner.supersetId
                    ? copy.unlinkSuperset
                    : copy.linkSuperset(partner.exerciseName),
                onPress: () => onToggleSuperset(setId, partner.id),
              },
            ]
          : []),
      ]);

    Alert.alert(t('workouts.session.setActions'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: copy.editSet, onPress: openEditActions },
      {
        text: t('workouts.session.deleteSet'),
        style: 'destructive',
        onPress: () => onRemoveSet(setId),
      },
    ]);
  };

  return (
    <>
      <SessionHeader
        elapsedLabel={elapsedLabel}
        finishDisabled={!canFinish}
        onBack={onBack}
        onFinish={onFinish}
        onOverflow={onOverflow}
        reps={completedReps}
        sets={completedSetCount}
        title={workoutTitle}
        volume={completedVolume}
      />

      {restTimer && restRemainingSeconds > 0 ? (
        <WorkoutRestTimerBar
          onAdjust={handleAdjustRest}
          onPauseResume={handlePauseResumeRest}
          onSkip={() => setRestTimer(null)}
          paused={restTimer.status === 'paused'}
          remainingLabel={formatWorkoutRestTimer(restRemainingSeconds)}
        />
      ) : null}

      <FlatList
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInset + Spacing.five },
        ]}
        data={visibleExercises}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(exercise) => exercise.id}
        ListFooterComponent={
          visibleExercises.length > 0 ? (
            <View style={styles.container}>
              <WorkoutSessionFooterActions
                onAddExercises={onAddExercises}
                onTestGif={onTestGif}
                styles={styles}
                visible
              />
            </View>
          ) : null
        }
        ListHeaderComponent={
          isEmptyWorkout && draft.sets.length === 0 ? (
            <View style={styles.container}>
              <WorkoutSessionEmptyWorkoutCard
                onAddExercises={onAddExercises}
                onTestGif={onTestGif}
                styles={styles}
              />
            </View>
          ) : null
        }
        renderItem={({ item: exercise }) => {
          const exerciseSets = draft.sets.filter((set) => set.exerciseId === exercise.id);
          const workingSets = exerciseSets.filter((set) => set.setType !== 'warmup');
          const previousSets = getPreviousCompletedSetsForExercise(exercise.id, workoutSessions);
          const prescriptionSets = prescription.filter((set) => set.exerciseId === exercise.id);
          const hasWarmup = exerciseSets.some((set) => set.setType === 'warmup');
          const warmupProposal =
            !hasWarmup && !skippedWarmups.has(exercise.id)
              ? buildWorkoutWarmupProposal({ exerciseId: exercise.id, prescription })
              : [];
          let evidenceIndex = -1;
          for (let index = workingSets.length - 1; index >= 0; index -= 1) {
            const candidate = workingSets[index];
            if (candidate?.completed !== false && candidate?.actualRpe !== undefined) {
              evidenceIndex = index;
              break;
            }
          }
          const evidenceSet = evidenceIndex >= 0 ? workingSets[evidenceIndex] : undefined;
          const adjustment =
            evidenceSet && !dismissedAdjustments.has(evidenceSet.id)
              ? getWorkoutContextualAdjustment({
                  completedSet: evidenceSet,
                  prescription,
                  workingSetIndex: evidenceIndex,
                })
              : null;
          const targetSetCount = Math.max(
            exercise.targetSets ?? 0,
            prescriptionSets.length,
            workingSets.length,
          );

          return (
            <View style={styles.container}>
              <SessionExerciseSection
                draftInputs={draftInputs}
                exercise={exercise}
                exerciseCompleted={
                  exerciseSets.length > 0 &&
                  exerciseSets.every((set) => set.completed !== false)
                }
                exerciseSets={exerciseSets}
                expanded={expandedExerciseId === exercise.id}
                onAddSet={onAddSet}
                onAddWarmupSets={() => {
                  onAddWarmupSets(exercise.id, warmupProposal);
                  setSkippedWarmups((current) => new Set([...current, exercise.id]));
                }}
                onCommitRowInputs={() => undefined}
                onLongPressExercise={onLongPressExercise}
                onLongPressRow={openSetActions}
                onNotesPress={
                  exercise.notes
                    ? () => Alert.alert(t('workouts.session.notes'), exercise.notes ?? '')
                    : undefined
                }
                onEditSetRpe={onEditSetRpe}
                onRepsChange={(setId, value) => onSetChange(setId, 'reps', value)}
                onPlannedRepsChange={onPlannedSetChange}
                onPlannedToggleSetCompletion={handlePlannedToggleSetCompletion}
                onPlannedWeightChange={onPlannedSetChange}
                onSkipWarmup={() =>
                  setSkippedWarmups((current) => new Set([...current, exercise.id]))
                }
                onToggleExpanded={onToggleExpanded}
                onToggleSetCompletion={handleToggleSetCompletion}
                onWeightChange={(setId, value) => onSetChange(setId, 'weight', value)}
                prescriptionSets={prescriptionSets}
                previousSets={previousSets}
                warmupProposal={warmupProposal}
              />
              {expandedExerciseId === exercise.id && adjustment ? (
                <WorkoutAdjustmentSuggestion
                  adjustment={adjustment}
                  onApply={() => {
                    onApplyAdjustment(adjustment.sourceSetId, adjustment.adjustedWeight, {
                      loadMultiplier: adjustment.loadMultiplier,
                      targetReps: exercise.targetReps,
                      targetRepsByIndex: prescriptionSets.map((set) => set.reps),
                      targetSetCount,
                      targetWeightsByIndex: prescriptionSets.map((set) => set.weight),
                    });
                    setDismissedAdjustments((current) =>
                      new Set([...current, adjustment.sourceSetId]),
                    );
                  }}
                  onIgnore={() =>
                    setDismissedAdjustments((current) =>
                      new Set([...current, adjustment.sourceSetId]),
                    )
                  }
                />
              ) : null}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      />
    </>
  );
}
