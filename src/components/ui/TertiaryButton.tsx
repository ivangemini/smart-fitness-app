import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';
import { resolveButtonState } from './button-state';

type TertiaryButtonProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function TertiaryButton({
  accessibilityHint,
  accessibilityLabel,
  disabled,
  label,
  loading,
  onPress,
  style,
}: TertiaryButtonProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
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
        style,
      ]}>
      <Text style={[styles.label, visuallyDisabled && styles.disabledLabel]}>
        {loading ? `${label}…` : label}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: Radii.pill,
      flexShrink: 1,
      justifyContent: 'center',
      maxWidth: '100%',
      minHeight: 44,
      minWidth: 0,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
    },
    disabledLabel: {
      color: colors.textMuted,
    },
    label: {
      color: colors.accent,
      flexShrink: 1,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
      minWidth: 0,
      textAlign: 'center',
    },
    pressed: {
      backgroundColor: glass.semanticAccentFill,
    },
  });
