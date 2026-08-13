import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

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
  const { colors } = useAppTheme();
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
          borderColor: colors.borderSubtle,
          borderCurve: 'continuous',
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          minHeight: 36,
          minWidth: 52,
          paddingHorizontal: Spacing.two,
          paddingVertical: Spacing.one,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors.borderSubtle],
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
            style={[
              styles.option,
              { backgroundColor: selected ? colors.surfaceSecondary : colors.surfacePrimary },
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
