import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

type SettingsNavigationRow = {
  Icon: LucideIcon;
  key: string;
  label: string;
  onPress: () => void;
  value?: string;
};

type SettingsNavigationGroupProps = {
  rows: readonly SettingsNavigationRow[];
  title: string;
};

export function SettingsNavigationGroup({ rows, title }: SettingsNavigationGroupProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <LiquidGlassSurface style={styles.group}>
        {rows.map(({ Icon, key, label, onPress, value }, index) => (
          <View key={key}>
            {index > 0 ? <View style={[styles.divider, { backgroundColor: colors.border }]} /> : null}
            <Pressable
              accessibilityLabel={label}
              accessibilityRole="button"
              onPress={onPress}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: colors.backgroundSelected },
              ]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
                <Icon color={colors.textSecondary} size={18} strokeWidth={2} />
              </View>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
              {value ? (
                <Text numberOfLines={1} style={[styles.value, { color: colors.textSecondary }]}>
                  {value}
                </Text>
              ) : null}
              <ChevronRight color={colors.textMuted} size={18} strokeWidth={2} />
            </Pressable>
          </View>
        ))}
      </LiquidGlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 52 },
  group: { overflow: 'hidden', padding: 0 },
  iconWrap: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 9,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  label: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    lineHeight: Typography.body.lineHeight,
    minWidth: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 58,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  section: { gap: Spacing.two },
  sectionTitle: {
    fontSize: Typography.sectionTitle.fontSize,
    fontWeight: Typography.sectionTitle.fontWeight,
    letterSpacing: Typography.sectionTitle.letterSpacing,
    paddingHorizontal: Spacing.one,
    textTransform: Typography.sectionTitle.textTransform,
  },
  value: {
    flexShrink: 1,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    maxWidth: '38%',
  },
});
