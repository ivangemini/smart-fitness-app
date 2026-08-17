import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

type SegmentedOption<Value extends string> = {
  label: string;
  value: Value;
};

type SegmentedControlProps<Value extends string> = {
  accessibilityLabel: string;
  disabled?: boolean;
  onChange: (value: Value) => void;
  options: readonly SegmentedOption<Value>[];
  value: Value;
};

export function SegmentedControl<Value extends string>({
  accessibilityLabel,
  disabled = false,
  onChange,
  options,
  value,
}: SegmentedControlProps<Value>) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      accessibilityState={{ disabled }}
      style={[styles.container, disabled && styles.containerDisabled]}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.segmentSelected,
              pressed && !disabled && (selected ? styles.segmentSelectedPressed : styles.segmentPressed),
            ]}>
            <Text
              style={[
                styles.label,
                selected && styles.labelSelected,
                disabled && styles.labelDisabled,
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.one,
      minWidth: 0,
      padding: Spacing.one,
    },
    containerDisabled: {
      backgroundColor: glass.disabledFill,
      borderColor: glass.disabledBorder,
    },
    label: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
      minWidth: 0,
      textAlign: 'center',
    },
    labelDisabled: { color: colors.textMuted },
    labelSelected: {
      color: glass.accentText,
    },
    segment: {
      alignItems: 'center',
      borderCurve: 'continuous',
      borderRadius: Radii.medium,
      flex: 1,
      justifyContent: 'center',
      minHeight: 44,
      minWidth: 0,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
    },
    segmentPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    segmentSelected: {
      backgroundColor: glass.accentFill,
    },
    segmentSelectedPressed: {
      backgroundColor: glass.accentPressedFill,
    },
  });
