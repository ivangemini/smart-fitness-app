import { X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors, Spacing } from '@/constants/theme';
import { createWorkoutDraftFromWorkout } from '@/features/workouts/programEditorModel';
import { useLocalization } from '@/localization';
import { getWorkoutBuilderCopy } from '@/localization/workoutBuilderCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { Workout } from '@/types';

import { WorkoutBuilderCard } from './WorkoutBuilderCard';
import type { DraftWorkoutExercise } from './workout-builder-types';

type ProgramWorkoutEditorModalProps = {
  visible: boolean;
  workout?: Workout | null;
  onClose: () => void;
  onSaveWorkout: (payload: {
    title: string;
    description?: string;
    exercises: string[];
  }) => void;
};

export function ProgramWorkoutEditorModal({
  visible,
  workout,
  onClose,
  onSaveWorkout,
}: ProgramWorkoutEditorModalProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const insets = useSafeAreaInsets();
  const copy = getWorkoutBuilderCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const initialDraft = useMemo(() => createWorkoutDraftFromWorkout(workout), [workout]);
  const [workoutTitle, setWorkoutTitle] = useState(initialDraft.title);
  const [workoutDescription, setWorkoutDescription] = useState(initialDraft.description);
  const [draftExerciseName, setDraftExerciseName] = useState('');
  const [draftExercises, setDraftExercises] = useState<DraftWorkoutExercise[]>(
    initialDraft.exercises,
  );
  const [isExpanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setWorkoutTitle(initialDraft.title);
    setWorkoutDescription(initialDraft.description);
    setDraftExercises(initialDraft.exercises);
    setDraftExerciseName('');
    setExpanded(true);
  }, [initialDraft, visible]);

  if (!visible) return null;

  const addExercise = () => {
    const trimmed = draftExerciseName.trim();
    if (!trimmed) return;

    setDraftExercises((current) => [
      ...current,
      {
        id: `draft-exercise-${Date.now()}-${current.length + 1}`,
        name: trimmed,
        notes: '',
        restSeconds: '90',
        targetReps: '8',
        targetSets: '3',
      },
    ]);
    setDraftExerciseName('');
  };

  const updateExercise = (exerciseId: string, patch: Partial<DraftWorkoutExercise>) => {
    setDraftExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...patch } : exercise,
      ),
    );
  };

  const removeExercise = (exerciseId: string) => {
    setDraftExercises((current) =>
      current.filter((exercise) => exercise.id !== exerciseId),
    );
  };

  const duplicateExercise = (exerciseId: string) => {
    setDraftExercises((current) => {
      const index = current.findIndex((exercise) => exercise.id === exerciseId);
      if (index === -1) return current;
      const source = current[index];
      const next = [...current];
      next.splice(index + 1, 0, {
        ...source,
        id: `draft-exercise-${Date.now()}-${index + 1}`,
      });
      return next;
    });
  };

  const moveExercise = (exerciseId: string, direction: -1 | 1) => {
    setDraftExercises((current) => {
      const index = current.findIndex((exercise) => exercise.id === exerciseId);
      if (index === -1) return current;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  };

  const saveDisabled = workoutTitle.trim().length === 0 || draftExercises.length === 0;
  const saveWorkout = () => {
    if (saveDisabled) return;
    onSaveWorkout({
      title: workoutTitle.trim(),
      description: workoutDescription.trim() || undefined,
      exercises: draftExercises.map((exercise) => exercise.name.trim()).filter(Boolean),
    });
  };

  return (
    <View
      style={[
        styles.overlay,
        {
          paddingBottom: insets.bottom + Spacing.three,
          paddingTop: insets.top + Spacing.three,
        },
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.fill}>
        <LiquidGlassSurface radius={28} style={styles.panel} variant="elevated">
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>
                {workout ? copy.editWorkout : copy.createNewWorkout}
              </Text>
              <Text style={styles.subtitle}>{copy.editorSubtitle}</Text>
            </View>
            <View style={styles.headerActions}>
              <LiquidGlassIconButton
                accessibilityLabel={workout ? copy.back : copy.cancel}
                Icon={X}
                onPress={onClose}
              />
              <PrimaryButton
                disabled={saveDisabled}
                label={copy.save}
                onPress={saveWorkout}
                style={styles.saveAction}
              />
            </View>
          </View>

          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={styles.scrollContent}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <WorkoutBuilderCard
              draftExerciseName={draftExerciseName}
              draftExercises={draftExercises}
              editingWorkoutId={workout?.id}
              isExpanded={isExpanded}
              isSaveWorkoutDisabled={saveDisabled}
              onAddExercise={addExercise}
              onCancelEdit={onClose}
              onDraftExerciseNameChange={setDraftExerciseName}
              onDuplicateExercise={duplicateExercise}
              onExerciseChange={updateExercise}
              onMoveExercise={moveExercise}
              onRemoveDraftExercise={removeExercise}
              onSaveWorkout={saveWorkout}
              onToggleExpanded={() => setExpanded((current) => !current)}
              onWorkoutDescriptionChange={setWorkoutDescription}
              onWorkoutTitleChange={setWorkoutTitle}
              workoutDescription={workoutDescription}
              workoutTitle={workoutTitle}
            />
          </ScrollView>
        </LiquidGlassSurface>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    fill: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      width: '100%',
    },
    header: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
      justifyContent: 'space-between',
      marginBottom: Spacing.two,
    },
    headerActions: {
      alignItems: 'center',
      flexDirection: 'row',
      flexShrink: 0,
      gap: Spacing.one,
    },
    headerCopy: {
      flex: 1,
      gap: Spacing.half,
      minWidth: 180,
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      paddingHorizontal: Spacing.three,
    },
    panel: {
      maxHeight: '94%',
      maxWidth: 560,
      overflow: 'hidden',
      padding: Spacing.three,
      width: '100%',
    },
    saveAction: {
      alignSelf: 'auto',
      minWidth: 88,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: Spacing.two,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 22,
      fontWeight: '900',
    },
  });
