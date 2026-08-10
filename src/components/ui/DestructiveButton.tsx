import { useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveButtonState } from './button-state';

type DestructiveButtonProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function DestructiveButton({
  accessibilityHint,
  accessibilityLabel,
  disabled,
  label,
  loading,
  onPress,
  style,
}: DestructiveButtonProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const state = resolveButtonState({ disabled, loading });
  const visuallyDisabled = Boolean(disabled) && !state.loading;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={state.accessibilityState}
      disabled={state.disabled}
      onPress={state.disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !state.disabled && styles.pressed,
        visuallyDisabled && styles.disabled,
        style,
      ]}>
      <Text style={[styles.label, visuallyDisabled && styles.disabledLabel]}>
        {state.loading ? `${label}…` : label}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: colors.errorSoft,
      borderColor: colors.error,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.two,
    },
    disabled: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
    },
    disabledLabel: {
      color: colors.textMuted,
    },
    label: {
      color: colors.error,
      flexShrink: 1,
      fontSize: Typography.button.fontSize,
      fontWeight: Typography.button.fontWeight,
      lineHeight: Typography.button.lineHeight,
      minWidth: 0,
      textAlign: 'center',
    },
    pressed: {
      backgroundColor: colors.errorSoft,
      opacity: 0.86,
    },
  });
