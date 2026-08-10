import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { TertiaryButton } from './TertiaryButton';

type ScreenHeaderProps = {
  actionLabel?: string;
  onActionPress?: () => void;
  subtitle?: string;
  title: string;
};

export function ScreenHeader({ actionLabel, onActionPress, subtitle, title }: ScreenHeaderProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {actionLabel && onActionPress ? (
        <TertiaryButton label={actionLabel} onPress={onActionPress} />
      ) : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.three,
      justifyContent: 'space-between',
    },
    copy: {
      flex: 1,
      gap: 4,
      minWidth: 0,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: Typography.callout.fontSize,
      lineHeight: Typography.callout.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.largeTitle.fontSize,
      fontWeight: Typography.largeTitle.fontWeight,
      letterSpacing: Typography.largeTitle.letterSpacing,
      lineHeight: Typography.largeTitle.lineHeight,
    },
  });
