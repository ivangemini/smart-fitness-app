import { forwardRef, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';
import { InlineError } from './InlineError';

type FormFieldProps = TextInputProps & {
  errorMessage?: string | null;
  helperText?: string;
  label: string;
  value: string;
};

export const FormField = forwardRef<TextInput, FormFieldProps>(function FormField(
  {
    accessibilityState,
    errorMessage,
    helperText,
    label,
    onBlur,
    onFocus,
    style,
    value,
    ...inputProps
  },
  ref,
) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const [focused, setFocused] = useState(false);
  const disabled = inputProps.editable === false;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={inputProps.accessibilityLabel ?? label}
        accessibilityState={{ ...accessibilityState, disabled }}
        placeholderTextColor={colors.textMuted}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        style={[
          styles.input,
          focused && !disabled && styles.inputFocused,
          errorMessage && !disabled && styles.inputError,
          disabled && styles.inputDisabled,
          style,
        ]}
        value={value}
        {...inputProps}
      />
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      <InlineError message={errorMessage} />
    </View>
  );
});

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    container: {
      gap: Spacing.one,
    },
    helper: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    input: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      minHeight: 48,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.two,
    },
    inputDisabled: {
      backgroundColor: glass.disabledFill,
      borderColor: glass.disabledBorder,
      color: colors.textMuted,
    },
    inputError: {
      borderColor: colors.error,
    },
    inputFocused: {
      backgroundColor: glass.controlPressedFill,
      borderColor: colors.accent,
    },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
  });
