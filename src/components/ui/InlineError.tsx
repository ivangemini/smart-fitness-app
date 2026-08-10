import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

type InlineErrorProps = {
  message?: string | null;
};

export function InlineError({ message }: InlineErrorProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!message) {
    return null;
  }

  return (
    <Text accessibilityRole="alert" style={styles.error}>
      {message}
    </Text>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    error: {
      color: colors.error,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
  });
