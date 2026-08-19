import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { getKnowledgeCopy } from './knowledgeCopy';

export function KnowledgeLibraryCard() {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = getKnowledgeCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <AppCard>
      <Text style={styles.title}>{copy.coachLibraryTitle}</Text>
      <Text style={styles.body}>{copy.coachLibraryBody}</Text>
      <AppButton
        label={copy.library}
        onPress={() => router.push('/knowledge')}
        variant="secondary"
      />
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
