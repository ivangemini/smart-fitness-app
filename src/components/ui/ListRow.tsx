import { ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Layout, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

type ListRowProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  badge?: string;
  detail?: string;
  leading?: ReactNode;
  onPress?: () => void;
  title: string;
  trailing?: ReactNode;
  value?: string;
};

export function ListRow({ accessibilityHint, accessibilityLabel, badge, detail, leading, onPress, title, trailing, value }: ListRowProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const content = (
    <View style={styles.rowContent}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge ? <Text style={styles.badge}>{badge}</Text> : null}
        </View>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
      <View style={styles.trailing}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {trailing}
      </View>
      {onPress ? <Text style={styles.chevron}>›</Text> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

const createStyles = (colors: typeof Colors.dark) =>
  StyleSheet.create({
    badge: {
      backgroundColor: colors.accentSoft,
      borderRadius: Radii.pill,
      color: colors.accent,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.button.fontWeight,
      paddingHorizontal: Spacing.one,
      paddingVertical: 2,
    },
    chevron: {
      color: colors.textMuted,
      flexShrink: 0,
      fontSize: 24,
      lineHeight: 24,
      marginLeft: Spacing.one,
    },
    copy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    detail: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    leading: {
      alignItems: 'center',
      flexShrink: 0,
      justifyContent: 'center',
      marginRight: Spacing.two,
    },
    pressed: {
      backgroundColor: colors.backgroundSelected,
    },
    row: {
      backgroundColor: colors.surfacePrimary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      minHeight: Layout.rowHeight,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.three,
    },
    rowContent: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      minWidth: 0,
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.body.lineHeight,
      minWidth: 0,
    },
    titleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
      minWidth: 0,
    },
    trailing: {
      alignItems: 'flex-end',
      flexShrink: 1,
      gap: 2,
      marginLeft: 'auto',
      minWidth: 0,
    },
    value: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      minWidth: 0,
      textAlign: 'right',
    },
  });
