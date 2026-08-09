import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { FlatList, Modal, Pressable, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Colors, Spacing } from '@/constants/theme';
import { createStyles } from '@/features/workouts/styles/workoutSessionScreenStyles';
import { useLocalization } from '@/localization';

type WorkoutSessionStyles = ReturnType<typeof createStyles>;

type ExerciseTarget = {
  exerciseId: string;
  exerciseName: string;
};

type ReplacementExercise = {
  id: string;
  name: string;
  muscleGroup?: string;
  category?: string;
};

type WorkoutSheetRowProps = {
  destructive?: boolean;
  label: string;
  onPress?: () => void;
  styles: WorkoutSessionStyles;
  trailingAccessory?: ReactNode;
};

function WorkoutSheetRow({
  destructive = false,
  label,
  onPress,
  styles,
  trailingAccessory,
}: WorkoutSheetRowProps) {
  const content = (
    <>
      <View style={styles.workoutSheetRowLabelContainer}>
        <Text
          numberOfLines={1}
          style={[
            styles.workoutSheetRowLabel,
            destructive && styles.workoutSheetRowLabelDestructive,
          ]}>
          {label}
        </Text>
      </View>
      {trailingAccessory ? (
        <View style={styles.workoutSheetRowAccessory}>{trailingAccessory}</View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.workoutSheetRow,
          destructive && styles.workoutSheetRowDestructive,
          pressed && styles.pressed,
        ]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.workoutSheetRow, destructive && styles.workoutSheetRowDestructive]}>
      {content}
    </View>
  );
}

export function ExerciseOverflowModal({
  bottomInset,
  exercise,
  message,
  onCancel,
  onDelete,
  onDismiss,
  onReplace,
  styles,
}: {
  bottomInset: number;
  exercise: ExerciseTarget | null;
  message: string | null;
  onCancel(): void;
  onDelete(target: ExerciseTarget): void;
  onDismiss(): void;
  onReplace(target: ExerciseTarget): void;
  styles: WorkoutSessionStyles;
}) {
  const { t } = useLocalization();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={Boolean(exercise)}
      onRequestClose={onDismiss}>
      <Pressable
        onPress={onDismiss}
        style={[styles.overflowBackdrop, { paddingBottom: bottomInset + Spacing.three }]}>
        <Pressable onPress={() => undefined} style={styles.overflowSheetHitArea}>
          <LiquidGlassSurface radius={24} style={styles.overflowSheet} variant="elevated">
            <Text style={styles.overflowTitle}>{exercise?.exerciseName ?? ''}</Text>
            <View style={styles.overflowActions}>
              {message ? <Text style={styles.overflowMessage}>{message}</Text> : null}
              <Pressable
                onPress={() => exercise && onReplace(exercise)}
                style={({ pressed }) => [styles.overflowAction, pressed && styles.pressed]}>
                <Text style={styles.overflowActionLabel}>
                  {t('workouts.session.replaceExercise')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => exercise && onDelete(exercise)}
                style={({ pressed }) => [
                  styles.overflowAction,
                  styles.overflowDangerAction,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.overflowActionLabel, styles.overflowDangerLabel]}>
                  {t('workouts.session.deleteExercise')}
                </Text>
              </Pressable>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [styles.overflowCancel, pressed && styles.pressed]}>
                <Text style={styles.overflowCancelLabel}>{t('common.cancel')}</Text>
              </Pressable>
            </View>
          </LiquidGlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function WorkoutOverflowModal({
  bottomInset,
  colors,
  onAddExercises,
  onClose,
  onDiscard,
  onTrackRpeChange,
  styles,
  title,
  trackRpeEnabled,
  visible,
}: {
  bottomInset: number;
  colors: typeof Colors.light;
  onAddExercises(): void;
  onClose(): void;
  onDiscard(): void;
  onTrackRpeChange(enabled: boolean): void;
  styles: WorkoutSessionStyles;
  title: string;
  trackRpeEnabled: boolean;
  visible: boolean;
}) {
  const { t } = useLocalization();

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={[styles.overflowBackdrop, { paddingBottom: bottomInset + Spacing.three }]}>
        <Pressable onPress={() => undefined} style={styles.overflowSheetHitArea}>
          <LiquidGlassSurface radius={24} style={styles.overflowSheet} variant="elevated">
            <Text style={styles.overflowTitle}>{title}</Text>
            <View style={styles.overflowActions}>
              <WorkoutSheetRow
                label={t('workouts.session.trackRpe')}
                styles={styles}
                trailingAccessory={
                  <Switch
                    value={trackRpeEnabled}
                    onValueChange={onTrackRpeChange}
                    trackColor={{ false: colors.surfaceSecondary, true: colors.accent }}
                    thumbColor="#FFFFFF"
                  />
                }
              />
              <WorkoutSheetRow
                label={t('workouts.session.addExercises')}
                onPress={onAddExercises}
                styles={styles}
              />
              <WorkoutSheetRow
                destructive
                label={t('workouts.session.discard')}
                onPress={onDiscard}
                styles={styles}
              />
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.overflowCancel, pressed && styles.pressed]}>
                <Text style={styles.overflowCancelLabel}>{t('common.cancel')}</Text>
              </Pressable>
            </View>
          </LiquidGlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ReplacementExerciseModal({
  exercises,
  onClose,
  onSelect,
  styles,
  target,
}: {
  exercises: ReplacementExercise[];
  onClose(): void;
  onSelect(exercise: ReplacementExercise): void;
  styles: WorkoutSessionStyles;
  target: ExerciseTarget | null;
}) {
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={Boolean(target)}
      onRequestClose={onClose}>
      <View style={styles.replacementBackdrop}>
        <LiquidGlassSurface
          radius={24}
          style={[styles.replacementSheet, { paddingBottom: insets.bottom + Spacing.three }]}
          variant="elevated">
          <View style={styles.replacementHeader}>
            <Text numberOfLines={2} style={styles.replacementTitle}>
              {t('workouts.session.replaceExercise')}
            </Text>
            <LiquidGlassIconButton
              accessibilityLabel={t('common.cancel')}
              Icon={X}
              onPress={onClose}
            />
          </View>
          <FlatList
            contentContainerStyle={styles.replacementListContent}
            data={exercises}
            initialNumToRender={12}
            keyExtractor={(exercise) => exercise.id}
            maxToRenderPerBatch={12}
            renderItem={({ item: exercise }) => (
              <Pressable
                accessibilityLabel={exercise.name}
                accessibilityRole="button"
                onPress={() => onSelect(exercise)}
                style={({ pressed }) => [styles.replacementRow, pressed && styles.pressed]}>
                <View style={styles.replacementIcon}>
                  <Text style={styles.replacementIconLabel}>
                    {exercise.name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.replacementCopy}>
                  <Text numberOfLines={1} style={styles.replacementRowTitle}>
                    {exercise.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.replacementRowMeta}>
                    {exercise.muscleGroup ??
                      exercise.category ??
                      t('workouts.session.exerciseFallback')}
                  </Text>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            style={styles.replacementList}
            windowSize={7}
          />
        </LiquidGlassSurface>
      </View>
    </Modal>
  );
}
