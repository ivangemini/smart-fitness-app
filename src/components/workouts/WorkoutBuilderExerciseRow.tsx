import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { getWorkoutBuilderCopy } from '@/localization/workoutBuilderCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';

import type { DraftWorkoutExercise } from './workout-builder-types';

type WorkoutBuilderExerciseRowProps = {
  canMoveDown: boolean;
  canMoveUp: boolean;
  exercise: DraftWorkoutExercise;
  onChange: (exerciseId: string, patch: Partial<DraftWorkoutExercise>) => void;
  onDelete: (exerciseId: string) => void;
  onDuplicate: (exerciseId: string) => void;
  onMove: (exerciseId: string, direction: -1 | 1) => void;
};

type ExerciseRowStyles = ReturnType<typeof createStyles>;

function MiniAction({
  accessibilityLabel,
  disabled = false,
  label,
  onPress,
  styles,
}: {
  accessibilityLabel: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  styles: ExerciseRowStyles;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.miniAction,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text numberOfLines={2} style={styles.miniActionLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export function WorkoutBuilderExerciseRow({
  canMoveDown,
  canMoveUp,
  exercise,
  onChange,
  onDelete,
  onDuplicate,
  onMove,
}: WorkoutBuilderExerciseRowProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = getWorkoutBuilderCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <View accessibilityElementsHidden style={styles.handle}>
          <Text style={styles.handleLabel}>≡</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.exerciseIndex}>{copy.exercise}</Text>
          <TextInput
            accessibilityLabel={copy.exercise}
            onChangeText={(value) => onChange(exercise.id, { name: value })}
            placeholder={copy.exercisePlaceholder}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={styles.nameInput}
            value={exercise.name}
          />
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaField}>
          <Text style={styles.label}>{copy.sets}</Text>
          <TextInput
            accessibilityLabel={copy.sets}
            keyboardType="number-pad"
            onChangeText={(value) => onChange(exercise.id, { targetSets: value })}
            placeholder="3"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={styles.input}
            value={exercise.targetSets}
          />
        </View>
        <View style={styles.metaField}>
          <Text style={styles.label}>{copy.reps}</Text>
          <TextInput
            accessibilityLabel={copy.reps}
            keyboardType="number-pad"
            onChangeText={(value) => onChange(exercise.id, { targetReps: value })}
            placeholder="8"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={styles.input}
            value={exercise.targetReps}
          />
        </View>
        <View style={styles.metaField}>
          <Text style={styles.label}>{copy.restSeconds}</Text>
          <TextInput
            accessibilityLabel={copy.restSeconds}
            keyboardType="number-pad"
            onChangeText={(value) => onChange(exercise.id, { restSeconds: value })}
            placeholder="90"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={styles.input}
            value={exercise.restSeconds}
          />
        </View>
      </View>

      <View style={styles.metaField}>
        <Text style={styles.label}>{copy.notes}</Text>
        <TextInput
          accessibilityLabel={copy.notes}
          multiline
          onChangeText={(value) => onChange(exercise.id, { notes: value })}
          placeholder={copy.exerciseNotesPlaceholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          style={styles.notesInput}
          value={exercise.notes}
        />
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.actionCluster}>
          <MiniAction
            accessibilityLabel={copy.moveUp}
            disabled={!canMoveUp}
            label="↑"
            onPress={() => onMove(exercise.id, -1)}
            styles={styles}
          />
          <MiniAction
            accessibilityLabel={copy.moveDown}
            disabled={!canMoveDown}
            label="↓"
            onPress={() => onMove(exercise.id, 1)}
            styles={styles}
          />
          <MiniAction
            accessibilityLabel={copy.duplicate}
            label={copy.duplicate}
            onPress={() => onDuplicate(exercise.id)}
            styles={styles}
          />
        </View>
        <MiniAction
          accessibilityLabel={copy.delete}
          label={copy.delete}
          onPress={() => onDelete(exercise.id)}
          styles={styles}
        />
      </View>

      {!canMoveUp || !canMoveDown ? (
        <Text style={styles.hint}>
          {!canMoveUp && !canMoveDown
            ? copy.singleExerciseOnly
            : copy.reorderWhenNeeded}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actionCluster: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
    },
    actionsRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
      justifyContent: 'space-between',
    },
    disabled: {
      opacity: 0.4,
    },
    exerciseIndex: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    handle: {
      alignItems: 'center',
      backgroundColor: colors.backgroundSelected,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 12,
      borderWidth: 1,
      flexShrink: 0,
      justifyContent: 'center',
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
    },
    handleLabel: {
      color: colors.textSecondary,
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 1,
    },
    headerContent: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 0,
    },
    hint: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 8,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: 15,
      minHeight: 44,
      paddingHorizontal: Spacing.two,
    },
    label: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 12,
      fontWeight: '700',
    },
    metaField: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 92,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    miniAction: {
      alignItems: 'center',
      backgroundColor: colors.backgroundSelected,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 999,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 44,
      maxWidth: '100%',
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
    },
    miniActionLabel: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
    },
    nameInput: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
      minHeight: 44,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    notesInput: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 8,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: 14,
      minHeight: 72,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.two,
      textAlignVertical: 'top',
    },
    pressed: {
      opacity: 0.78,
    },
    row: {
      backgroundColor: colors.backgroundElement,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 12,
      borderWidth: 1,
      gap: Spacing.two,
      padding: Spacing.three,
    },
    rowHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
    },
  });
