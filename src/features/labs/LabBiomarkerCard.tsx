import { ChevronRight } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Spacing, Typography } from '@/constants/theme';
import type { LabResultDto } from '@/features/labs/types';
import { formatLocalizedNumber, useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

type LabBiomarkerCardProps = {
  name: string;
  result: LabResultDto;
  statusLabel: string;
  onPress: () => void;
};

const LAB_NUMBER_MAX_FRACTION_DIGITS = 20;

export function LabBiomarkerCard({ name, onPress, result, statusLabel }: LabBiomarkerCardProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const { locale } = useLocalization();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const attention =
    result.semanticState !== 'unknown' && result.semanticState !== 'in_range';
  const valueLabel = `${formatLocalizedNumber(
    result.value,
    locale,
    LAB_NUMBER_MAX_FRACTION_DIGITS,
  )} ${result.unit}`;

  return (
    <Pressable
      accessibilityLabel={`${name}, ${valueLabel}, ${statusLabel}`}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.pressable}>
      {({ pressed }) => (
        <LiquidGlassSurface
          style={[
            styles.card,
            pressed ? { backgroundColor: glass.controlPressedFill } : null,
          ]}>
          <View style={styles.copy}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{valueLabel}</Text>
            <Text
              style={[
                styles.status,
                { color: attention ? colors.warning : colors.textSecondary },
              ]}>
              {statusLabel}
            </Text>
          </View>
          <ChevronRight color={colors.textMuted} size={20} strokeWidth={2} />
        </LiquidGlassSurface>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', flexDirection: 'row', gap: Spacing.three },
  copy: { flex: 1, gap: Spacing.one, minWidth: 0 },
  name: {
    flexShrink: 1,
    fontSize: Typography.cardTitle.fontSize,
    fontWeight: Typography.cardTitle.fontWeight,
    lineHeight: Typography.cardTitle.lineHeight,
  },
  pressable: { borderCurve: 'continuous' },
  status: {
    flexShrink: 1,
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    lineHeight: Typography.caption.lineHeight,
  },
  value: {
    flexShrink: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    lineHeight: Typography.body.lineHeight,
  },
});
