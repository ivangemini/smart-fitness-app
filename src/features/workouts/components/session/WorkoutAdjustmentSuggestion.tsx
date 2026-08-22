import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import type { WorkoutContextualAdjustment } from '@/features/workouts/workoutContextualAdjustment';
import { useLocalization } from '@/localization';
import { getWorkoutAssistantCopy } from '@/localization/workoutAssistantCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { formatWeightValue, useUnitPreferences } from '@/units';

export function WorkoutAdjustmentSuggestion({
  adjustment,
  onApply,
  onIgnore,
}: {
  adjustment: WorkoutContextualAdjustment;
  onApply(): void;
  onIgnore(): void;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = useMemo(() => getWorkoutAssistantCopy(locale), [locale]);
  const { weight: weightUnit } = useUnitPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const directionLabel =
    adjustment.direction === 'decrease' ? copy.adjustmentDecrease : copy.adjustmentIncrease;
  const weight = `${formatWeightValue(adjustment.adjustedWeight, weightUnit)} ${weightUnit}`;

  return (
    <View style={styles.row}>
      <Text numberOfLines={2} style={styles.summary}>
        {directionLabel} · {weight}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onApply}
        style={({ pressed }) => [styles.action, styles.primaryAction, pressed && styles.pressed]}>
        <Text style={styles.primaryLabel}>{copy.adjustmentApply}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onIgnore}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
        <Text style={styles.secondaryLabel}>{copy.adjustmentIgnore}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    action: {
      borderRadius: Radii.pill,
      justifyContent: 'center',
      minHeight: 30,
      paddingHorizontal: Spacing.two,
    },
    pressed: { opacity: 0.65 },
    primaryAction: { backgroundColor: colors.accentSoft },
    primaryLabel: { color: colors.accent, fontSize: 12, fontWeight: '800' },
    row: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderRadius: Radii.small,
      flexDirection: 'row',
      gap: Spacing.one,
      minHeight: 40,
      paddingHorizontal: Spacing.two,
    },
    secondaryLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
    summary: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: 12,
      fontVariant: ['tabular-nums'],
      fontWeight: '600',
    },
  });
