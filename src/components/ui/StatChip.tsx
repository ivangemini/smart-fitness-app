import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

type StatChipProps = {
  detail?: string;
  label: string;
  tone?: 'neutral' | 'positive' | 'warning';
  value: string;
};

export function StatChip({ detail, label, tone = 'neutral', value }: StatChipProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);

  return (
    <View
      style={[
        styles.chip,
        tone === 'positive' && styles.chipPositive,
        tone === 'warning' && styles.chipWarning,
      ]}>
      <Text selectable style={styles.label}>
        {label}
      </Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
      {detail ? (
        <Text selectable style={styles.detail}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    chip: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      gap: 4,
      minWidth: 148,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.three,
    },
    chipPositive: {
      backgroundColor: glass.semanticPositiveFill,
      borderColor: glass.semanticPositiveBorder,
    },
    chipWarning: {
      backgroundColor: glass.semanticWarningFill,
      borderColor: glass.semanticWarningBorder,
    },
    detail: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
      textTransform: 'uppercase',
    },
    value: {
      color: colors.textPrimary,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.bodyEmphasized.lineHeight,
    },
  });
