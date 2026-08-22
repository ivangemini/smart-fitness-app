import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { getWorkoutAssistantCopy } from '@/localization/workoutAssistantCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';

export function WorkoutRestTimerBar({
  paused,
  remainingLabel,
  onAdjust,
  onPauseResume,
  onSkip,
}: {
  paused: boolean;
  remainingLabel: string;
  onAdjust(deltaSeconds: number): void;
  onPauseResume(): void;
  onSkip(): void;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = useMemo(() => getWorkoutAssistantCopy(locale), [locale]);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        action: {
          alignItems: 'center',
          borderRadius: Radii.pill,
          justifyContent: 'center',
          minHeight: 32,
          minWidth: 40,
          paddingHorizontal: Spacing.two,
        },
        actionLabel: {
          color: colors.textSecondary,
          fontSize: 12,
          fontWeight: '800',
        },
        controls: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.one,
        },
        pauseAction: {
          backgroundColor: colors.surfaceSecondary,
        },
        pauseLabel: {
          color: colors.textPrimary,
          fontSize: 14,
          fontWeight: '900',
        },
        shell: {
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: colors.surfacePrimary,
          borderBottomColor: colors.borderSubtle,
          borderBottomWidth: StyleSheet.hairlineWidth,
          flexDirection: 'row',
          justifyContent: 'space-between',
          maxWidth: MaxContentWidth,
          minHeight: 44,
          paddingHorizontal: Spacing.three,
          width: '100%',
        },
        timerLabel: {
          color: colors.accent,
          fontSize: 16,
          fontVariant: ['tabular-nums'],
          fontWeight: '900',
          letterSpacing: 0.2,
        },
      }),
    [colors],
  );

  return (
    <View accessibilityLabel={copy.restTimer(remainingLabel)} style={styles.shell}>
      <Text style={styles.timerLabel}>{remainingLabel}</Text>
      <View style={styles.controls}>
        <Pressable
          accessibilityLabel={copy.reduce15Seconds}
          hitSlop={8}
          onPress={() => onAdjust(-15)}
          style={styles.action}
        >
          <Text style={styles.actionLabel}>−15</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={paused ? copy.resumeRest : copy.pauseRest}
          hitSlop={8}
          onPress={onPauseResume}
          style={[styles.action, styles.pauseAction]}
        >
          <Text style={styles.pauseLabel}>{paused ? '▶' : 'Ⅱ'}</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={copy.add15Seconds}
          hitSlop={8}
          onPress={() => onAdjust(15)}
          style={styles.action}
        >
          <Text style={styles.actionLabel}>+15</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={copy.skipRest}
          hitSlop={8}
          onPress={onSkip}
          style={styles.action}
        >
          <Text style={styles.actionLabel}>×</Text>
        </Pressable>
      </View>
    </View>
  );
}
