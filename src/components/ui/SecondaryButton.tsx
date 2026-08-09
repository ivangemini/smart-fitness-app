import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

import { resolveButtonState } from './button-state';

type SecondaryButtonProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SecondaryButton({
  accessibilityHint,
  accessibilityLabel,
  disabled,
  label,
  loading,
  onPress,
  style,
}: SecondaryButtonProps) {
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
        visuallyDisabled && styles.disabled,
        style,
      ]}>
      <View style={styles.content}>
        {state.loading ? <ActivityIndicator color={colors.textPrimary} /> : null}
        <Text style={[styles.label, visuallyDisabled && styles.disabledLabel]}>
          {state.loading ? `${label}…` : label}
        </Text>
      </View>
    </Pressable>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderTopColor: glass.cardHighlight,
      borderTopWidth: 1,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.two,
      shadowColor: glass.shadowColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: glass.shadowOpacity * 0.6,
      shadowRadius: 14,
    },
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.one,
      justifyContent: 'center',
    },
    disabled: {
      backgroundColor: glass.disabledFill,
      borderColor: glass.disabledBorder,
      borderTopColor: glass.disabledBorder,
      shadowOpacity: 0,
    },
    disabledLabel: {
      color: colors.textMuted,
    },
    label: {
      color: colors.textPrimary,
      fontSize: Typography.button.fontSize,
      fontWeight: Typography.button.fontWeight,
      lineHeight: Typography.button.lineHeight,
    },
    pressed: {
      backgroundColor: glass.controlPressedFill,
    },
  });
