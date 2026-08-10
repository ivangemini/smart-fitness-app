import { X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors, Spacing } from '@/constants/theme';
import { getWorkoutsHubWorkoutTitle } from '@/features/workouts/workoutsHubLocalization';
import { useLocalization } from '@/localization';
import { getWorkoutBuilderCopy } from '@/localization/workoutBuilderCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { Workout } from '@/types';

type ProgramWorkoutPickerModalProps = {
  visible: boolean;
  availableWorkouts: Workout[];
  onClose: () => void;
  onCreateNew: () => void;
  onAddWorkouts: (workoutIds: string[]) => void;
};

export function ProgramWorkoutPickerModal({
  visible,
  availableWorkouts,
  onAddWorkouts,
  onClose,
  onCreateNew,
}: ProgramWorkoutPickerModalProps) {
  const { colors } = useAppTheme();
  const { formatNumber, locale, t } = useLocalization();
  const insets = useSafeAreaInsets();
  const copy = getWorkoutBuilderCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [mode, setMode] = useState<'choice' | 'existing'>('choice');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedCount = useMemo(() => selectedIds.length, [selectedIds]);

  useEffect(() => {
    if (!visible) return;
    setMode('choice');
    setSelectedIds([]);
  }, [visible]);

  if (!visible) return null;

  const toggleWorkout = (workoutId: string) => {
    setSelectedIds((current) =>
      current.includes(workoutId)
        ? current.filter((id) => id !== workoutId)
        : [...current, workoutId],
    );
  };

  const addLabel =
    selectedCount > 0
      ? copy.addWorkoutCount(
          selectedCount,
          formatNumber(selectedCount, { maximumFractionDigits: 0 }),
        )
      : copy.addSelected;

  return (
    <View
      style={[
        styles.overlay,
        {
          paddingBottom: insets.bottom + Spacing.three,
          paddingTop: insets.top + Spacing.three,
        },
      ]}>
      <LiquidGlassSurface radius={28} style={styles.panel} variant="elevated">
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{copy.addWorkout}</Text>
            <Text style={styles.subtitle}>{copy.addWorkoutSubtitle}</Text>
          </View>
          <LiquidGlassIconButton
            accessibilityLabel={copy.cancel}
            Icon={X}
            onPress={onClose}
          />
        </View>

        {mode === 'choice' ? (
          <ScrollView
            contentContainerStyle={styles.choiceGroup}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.choiceScroll}>
            <Pressable
              accessibilityLabel={copy.chooseExistingWorkout}
              accessibilityRole="button"
              onPress={() => setMode('existing')}
              style={({ pressed }) => [styles.choiceButton, pressed && styles.pressed]}>
              <Text style={styles.choiceTitle}>{copy.chooseExistingWorkout}</Text>
              <Text style={styles.choiceSubtitle}>{copy.chooseExistingWorkoutBody}</Text>
            </Pressable>
            <Pressable
              accessibilityLabel={copy.createNewWorkout}
              accessibilityRole="button"
              onPress={onCreateNew}
              style={({ pressed }) => [styles.choiceButton, pressed && styles.pressed]}>
              <Text style={styles.choiceTitle}>{copy.createNewWorkout}</Text>
              <Text style={styles.choiceSubtitle}>{copy.createNewWorkoutBody}</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <View style={styles.existingGroup}>
            <Pressable
              accessibilityLabel={copy.back}
              accessibilityRole="button"
              onPress={() => setMode('choice')}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <Text style={styles.backLabel}>{copy.back}</Text>
            </Pressable>

            {availableWorkouts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>{copy.noReusableWorkouts}</Text>
                <Text style={styles.emptySubtitle}>{copy.noReusableWorkoutsBody}</Text>
              </View>
            ) : (
              <FlatList
                contentContainerStyle={styles.listContent}
                data={availableWorkouts}
                initialNumToRender={6}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(workout) => workout.id}
                maxToRenderPerBatch={6}
                renderItem={({ item: workout }) => {
                  const selected = selectedIds.includes(workout.id);
                  const displayTitle = getWorkoutsHubWorkoutTitle(t, workout);
                  return (
                    <Pressable
                      accessibilityLabel={displayTitle}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      onPress={() => toggleWorkout(workout.id)}
                      style={({ pressed }) => [
                        styles.row,
                        selected && styles.rowSelected,
                        pressed && styles.pressed,
                      ]}>
                      <View style={styles.rowCopy}>
                        <Text numberOfLines={2} style={styles.rowTitle}>
                          {displayTitle}
                        </Text>
                        <Text numberOfLines={1} style={styles.rowMeta}>
                          {copy.exerciseCount(
                            workout.exercises.length,
                            formatNumber(workout.exercises.length, {
                              maximumFractionDigits: 0,
                            }),
                          )}
                        </Text>
                      </View>
                      <Text accessibilityElementsHidden style={styles.checkmark}>
                        {selected ? '✓' : ''}
                      </Text>
                    </Pressable>
                  );
                }}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                windowSize={5}
              />
            )}

            <View style={styles.footer}>
              <PrimaryButton
                disabled={selectedCount === 0}
                label={addLabel}
                onPress={() => {
                  onAddWorkouts(selectedIds);
                  onClose();
                }}
              />
            </View>
          </View>
        )}
      </LiquidGlassSurface>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    backButton: {
      alignSelf: 'flex-start',
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: Spacing.one,
      paddingVertical: Spacing.one,
    },
    backLabel: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '800',
    },
    checkmark: {
      color: colors.accent,
      flexShrink: 0,
      fontSize: 18,
      fontWeight: '900',
      minWidth: 18,
      textAlign: 'right',
    },
    choiceButton: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.half,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.four,
    },
    choiceGroup: {
      flexGrow: 1,
      gap: Spacing.two,
      paddingBottom: Spacing.one,
    },
    choiceScroll: {
      flexShrink: 1,
      minHeight: 0,
    },
    choiceSubtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    choiceTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 16,
      fontWeight: '900',
    },
    emptyState: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.half,
      padding: Spacing.three,
    },
    emptySubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '800',
    },
    existingGroup: {
      flex: 1,
      gap: Spacing.two,
      minHeight: 0,
    },
    footer: {
      flexShrink: 0,
      paddingTop: Spacing.one,
    },
    header: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      marginBottom: Spacing.two,
    },
    headerCopy: {
      flex: 1,
      gap: Spacing.half,
      minWidth: 0,
    },
    list: {
      flex: 1,
      minHeight: 0,
    },
    listContent: {
      gap: Spacing.two,
      paddingBottom: Spacing.one,
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      paddingHorizontal: Spacing.three,
    },
    panel: {
      maxHeight: '92%',
      maxWidth: 540,
      overflow: 'hidden',
      padding: Spacing.three,
      width: '100%',
    },
    pressed: {
      opacity: 0.72,
    },
    row: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      justifyContent: 'space-between',
      minHeight: 64,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.three,
    },
    rowCopy: {
      flex: 1,
      minWidth: 0,
      paddingRight: Spacing.two,
    },
    rowMeta: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 12,
      fontWeight: '700',
      marginTop: Spacing.half,
    },
    rowSelected: {
      borderColor: colors.accent,
      borderWidth: 1,
    },
    rowTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 15,
      fontWeight: '800',
    },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
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
