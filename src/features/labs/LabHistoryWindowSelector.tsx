import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import type { LabHistoryWindow } from './labHistoryWindow';

const WINDOWS: readonly LabHistoryWindow[] = ['3m', '6m', '1y', 'all'];

export function LabHistoryWindowSelector({
  labels,
  onChange,
  value,
}: {
  labels: Readonly<Record<LabHistoryWindow, string>>;
  onChange(value: LabHistoryWindow): void;
  value: LabHistoryWindow;
}) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing.one,
        },
        label: {
          fontSize: Typography.caption.fontSize,
          fontWeight: Typography.label.fontWeight,
          lineHeight: Typography.caption.lineHeight,
        },
        option: {
          alignItems: 'center',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderCurve: 'continuous',
          borderRadius: Radii.pill,
          borderWidth: StyleSheet.hairlineWidth,
          justifyContent: 'center',
          minHeight: 36,
          minWidth: 52,
          paddingHorizontal: Spacing.two,
          paddingVertical: Spacing.one,
        },
        optionPressed: {
          backgroundColor: glass.controlPressedFill,
        },
        optionSelected: {
          backgroundColor: glass.semanticAccentFill,
          borderColor: glass.accentBorder,
        },
      }),
    [
      glass.accentBorder,
      glass.controlBorder,
      glass.controlFill,
      glass.controlPressedFill,
      glass.semanticAccentFill,
    ],
  );

  return (
    <View accessibilityRole="radiogroup" style={styles.container}>
      {WINDOWS.map((window) => {
        const selected = window === value;
        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            key={window}
            onPress={() => onChange(window)}
            style={({ pressed }) => [
              styles.option,
              selected ? styles.optionSelected : null,
              pressed ? styles.optionPressed : null,
            ]}>
            <Text
              style={[
                styles.label,
                { color: selected ? colors.textPrimary : colors.textSecondary },
              ]}>
              {labels[window]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
