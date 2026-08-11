import { useMemo } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { getWorkoutBuilderCopy } from '@/localization/workoutBuilderCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';

import type { DraftWorkoutExercise } from './workout-builder-types';
import { WorkoutBuilderExerciseRow } from './WorkoutBuilderExerciseRow';

type WorkoutBuilderCardProps = {
  draftExerciseName: string;
  draftExercises: DraftWorkoutExercise[];
  editingWorkoutId?: string;
  isExpanded: boolean;
  isSaveWorkoutDisabled: boolean;
  onAddExercise: () => void;
  onCancelEdit: () => void;
  onDraftExerciseNameChange: (value: string) => void;
  onDuplicateExercise: (exerciseId: string) => void;
  onExerciseChange: (exerciseId: string, patch: Partial<DraftWorkoutExercise>) => void;
  onMoveExercise: (exerciseId: string, direction: -1 | 1) => void;
  onRemoveDraftExercise: (exerciseId: string) => void;
  onSaveWorkout: () => void;
  onToggleExpanded: () => void;
  onWorkoutDescriptionChange: (value: string) => void;
  onWorkoutTitleChange: (value: string) => void;
  virtualizedExerciseList?: boolean;
  workoutDescription: string;
  workoutTitle: string;
};

export function WorkoutBuilderCard({
  draftExerciseName,
  draftExercises,
  editingWorkoutId,
  isExpanded,
  onAddExercise,
  onCancelEdit,
  onDraftExerciseNameChange,
  onDuplicateExercise,
  onExerciseChange,
  onMoveExercise,
  onRemoveDraftExercise,
  onToggleExpanded,
  onWorkoutDescriptionChange,
  onWorkoutTitleChange,
  virtualizedExerciseList = false,
  workoutDescription,
  workoutTitle,
}: WorkoutBuilderCardProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = getWorkoutBuilderCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sectionTitle = editingWorkoutId ? copy.editWorkout : copy.workoutBuilder;

  const formFields = (
    <View style={styles.formFields}>
      <View style={styles.inputGroup}>
        <Text selectable style={styles.inputLabel}>
          {copy.workoutTitle}
        </Text>
        <TextInput
          accessibilityLabel={copy.workoutTitle}
          onChangeText={onWorkoutTitleChange}
          placeholder={copy.workoutTitlePlaceholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          style={styles.input}
          value={workoutTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text selectable style={styles.inputLabel}>
          {copy.workoutNotes}
        </Text>
        <TextInput
          accessibilityLabel={copy.workoutNotes}
          multiline
          onChangeText={onWorkoutDescriptionChange}
          placeholder={copy.workoutNotesPlaceholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          style={styles.notesInput}
          value={workoutDescription}
        />
      </View>

      <View style={styles.quickAddRow}>
        <View style={styles.quickAddField}>
          <Text selectable style={styles.inputLabel}>
            {copy.quickAddExercise}
          </Text>
          <TextInput
            accessibilityLabel={copy.quickAddExercise}
            onChangeText={onDraftExerciseNameChange}
            placeholder={copy.exercisePlaceholder}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={styles.input}
            value={draftExerciseName}
          />
        </View>
        <View style={styles.quickAddAction}>
          <AppButton
            disabled={draftExerciseName.trim().length === 0}
            label={copy.add}
            onPress={onAddExercise}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );

  const emptyState = (
    <EmptyState
      compact
      description={copy.noExercisesInWorkoutBody}
      message={copy.noExercisesInWorkout}
      title={copy.startBuilding}
    />
  );

  const footer = editingWorkoutId ? (
    <View style={styles.footer}>
      <AppButton label={copy.cancelEdit} onPress={onCancelEdit} variant="secondary" />
    </View>
  ) : null;

  const renderExercise = (exercise: DraftWorkoutExercise, index: number) => (
    <WorkoutBuilderExerciseRow
      canMoveDown={index < draftExercises.length - 1}
      canMoveUp={index > 0}
      exercise={exercise}
      onChange={onExerciseChange}
      onDelete={onRemoveDraftExercise}
      onDuplicate={onDuplicateExercise}
      onMove={onMoveExercise}
    />
  );

  return (
    <AppCard style={virtualizedExerciseList ? styles.virtualizedCard : undefined}>
      <Pressable
        accessibilityLabel={isExpanded ? copy.collapseBuilder : copy.expandBuilder}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggleExpanded}
        style={styles.collapsibleHeader}>
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            <Text style={styles.subtitle}>{copy.workoutBuilderSubtitle}</Text>
          </View>
          <Text accessibilityElementsHidden style={styles.toggle}>
            {isExpanded ? '−' : '+'}
          </Text>
        </View>
      </Pressable>

      {isExpanded ? (
        virtualizedExerciseList ? (
          <FlatList
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={styles.virtualizedContent}
            data={draftExercises}
            ItemSeparatorComponent={() => <View style={styles.exerciseSeparator} />}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(exercise) => exercise.id}
            ListEmptyComponent={<View style={styles.emptyState}>{emptyState}</View>}
            ListFooterComponent={footer ? <View style={styles.virtualizedFooter}>{footer}</View> : null}
            ListHeaderComponent={<View style={styles.virtualizedHeader}>{formFields}</View>}
            renderItem={({ item, index }) => renderExercise(item, index)}
            showsVerticalScrollIndicator={false}
            style={styles.virtualizedList}
          />
        ) : (
          <>
            {formFields}
            {draftExercises.length === 0 ? (
              emptyState
            ) : (
              <View style={styles.exerciseList}>
                {draftExercises.map((exercise, index) => (
                  <View key={exercise.id}>{renderExercise(exercise, index)}</View>
                ))}
              </View>
            )}
            {footer}
          </>
        )
      ) : null}
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    collapsibleHeader: {
      paddingBottom: Spacing.two,
    },
    emptyState: {
      paddingBottom: Spacing.two,
    },
    exerciseList: {
      gap: Spacing.two,
    },
    exerciseSeparator: {
      height: Spacing.two,
    },
    footer: {
      gap: Spacing.two,
    },
    formFields: {
      gap: Spacing.four,
    },
    headerContent: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 0,
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 8,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: 16,
      minHeight: 48,
      paddingHorizontal: Spacing.two,
    },
    inputGroup: {
      gap: Spacing.one,
    },
    inputLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
    },
    notesInput: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 8,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: 15,
      minHeight: 88,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.two,
      textAlignVertical: 'top',
    },
    quickAddAction: {
      flexShrink: 0,
      justifyContent: 'flex-end',
    },
    quickAddField: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 160,
    },
    quickAddRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    sectionTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 18,
      fontWeight: '800',
    },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    toggle: {
      color: colors.accent,
      flexShrink: 0,
      fontSize: 24,
      fontWeight: '700',
    },
    virtualizedCard: {
      flex: 1,
      minHeight: 0,
    },
    virtualizedContent: {
      flexGrow: 1,
    },
    virtualizedFooter: {
      paddingTop: Spacing.four,
    },
    virtualizedHeader: {
      paddingBottom: Spacing.four,
    },
    virtualizedList: {
      flex: 1,
      minHeight: 0,
    },
  });
