import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import type { WorkoutWarmupSetProposal } from '@/features/workouts/workoutWarmupGuide';
import { useLocalization } from '@/localization';
import { getWorkoutAssistantCopy } from '@/localization/workoutAssistantCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { formatWeightValue, useUnitPreferences } from '@/units';

export function WorkoutWarmupSuggestion({
  proposal,
  onAdd,
  onSkip,
}: {
  proposal: readonly WorkoutWarmupSetProposal[];
  onAdd(): void;
  onSkip(): void;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = useMemo(() => getWorkoutAssistantCopy(locale), [locale]);
  const { weight: weightUnit } = useUnitPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const summary = proposal
    .map((set) => `${formatWeightValue(set.weight, weightUnit)}×${set.reps}`)
    .join(' · ');

  if (proposal.length === 0) return null;

  return (
    <View style={styles.row}>
      <Text accessibilityLabel={copy.warmup} style={styles.tag}>{copy.warmupShort}</Text>
      <Text numberOfLines={1} style={styles.summary}>{summary}</Text>
      <Pressable
        accessibilityLabel={copy.warmupAdd}
        accessibilityRole="button"
        onPress={onAdd}
        style={({ pressed }) => [styles.action, styles.primaryAction, pressed && styles.pressed]}>
        <Text style={styles.primaryLabel}>+</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={copy.warmupSkip}
        accessibilityRole="button"
        onPress={onSkip}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
        <Text style={styles.secondaryLabel}>×</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    action: {
      alignItems: 'center',
      borderRadius: Radii.pill,
      height: 28,
      justifyContent: 'center',
      width: 28,
    },
    pressed: { opacity: 0.65 },
    primaryAction: { backgroundColor: colors.accentSoft },
    primaryLabel: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: '800',
      lineHeight: 20,
    },
    row: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderRadius: Radii.small,
      flexDirection: 'row',
      gap: Spacing.two,
      minHeight: 38,
      paddingHorizontal: Spacing.two,
    },
    secondaryLabel: {
      color: colors.textMuted,
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 20,
    },
    summary: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: 12,
      fontVariant: ['tabular-nums'],
      fontWeight: '600',
    },
    tag: {
      color: colors.accent,
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
  });
