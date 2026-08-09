import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import type { HomeSnapshotItem } from '@/lib/home';
import { useAppTheme } from '@/theme/AppThemeProvider';

type HomeSnapshotCardProps = {
  items: HomeSnapshotItem[];
  subtitle: string;
  title: string;
};

type HomeSnapshotStyles = ReturnType<typeof createStyles>;

function SnapshotTile({
  detail,
  label,
  styles,
  tone = 'neutral',
  value,
}: HomeSnapshotItem & { styles: HomeSnapshotStyles }) {
  return (
    <View
      style={[
        styles.tile,
        tone === 'positive' && styles.tilePositive,
        tone === 'warning' && styles.tileWarning,
      ]}>
      <Text selectable style={styles.tileLabel}>
        {label}
      </Text>
      <Text selectable style={styles.tileValue}>
        {value}
      </Text>
      <Text selectable style={styles.tileDetail}>
        {detail}
      </Text>
    </View>
  );
}

export function HomeSnapshotCard({ items, subtitle, title }: HomeSnapshotCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <AppCard>
      <View style={styles.header}>
        <Text selectable style={styles.title}>
          {title}
        </Text>
        <Text selectable style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.grid}>
        {items.map((item) => (
          <SnapshotTile key={item.id} {...item} styles={styles} />
        ))}
      </View>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    header: { gap: 4, marginBottom: Spacing.two },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.callout.fontSize,
      lineHeight: Typography.callout.lineHeight,
    },
    tile: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      flexGrow: 1,
      gap: 2,
      minWidth: 150,
      padding: Spacing.three,
    },
    tileDetail: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    tileLabel: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
      textTransform: 'uppercase',
    },
    tilePositive: { backgroundColor: colors.successSoft, borderColor: colors.success },
    tileValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.bodyEmphasized.lineHeight,
    },
    tileWarning: { backgroundColor: colors.warningSoft, borderColor: colors.warning },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
