import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

import type { ProactiveInsightCopy } from './proactiveInsightCopy';

export function ProactiveInsightCard({
  copy,
  onDismiss,
  onOpenEvidence,
}: {
  copy: ProactiveInsightCopy;
  onDismiss: () => void;
  onOpenEvidence: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <AppCard>
      <Text selectable style={styles.eyebrow}>
        {copy.eyebrow}
      </Text>
      <Text selectable style={styles.title}>
        {copy.title}
      </Text>
      <Text selectable style={styles.body}>
        {copy.body}
      </Text>
      <View style={styles.actions}>
        <AppButton label={copy.evidenceAction} onPress={onOpenEvidence} />
        <AppButton
          label={copy.dismissAction}
          onPress={onDismiss}
          variant="secondary"
        />
      </View>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: { gap: Spacing.two, marginTop: Spacing.three },
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      marginTop: Spacing.two,
    },
    eyebrow: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '700',
      lineHeight: Typography.caption.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
      marginTop: Spacing.one,
    },
  });
