import { PropsWithChildren, ReactNode, useMemo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

type AppSectionProps = PropsWithChildren<{
  accessory?: ReactNode;
  bodyStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  subtitle?: string;
  title: string;
}>;

export function AppSection({
  accessory,
  bodyStyle,
  children,
  style,
  subtitle,
  title,
}: AppSectionProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <AppCard style={style}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text selectable style={styles.title}>
            {title}
          </Text>
          {subtitle ? <Text selectable style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {accessory ? <View>{accessory}</View> : null}
      </View>
      <View style={bodyStyle}>{children}</View>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    copy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    header: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: Typography.callout.fontSize,
      lineHeight: Typography.callout.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
