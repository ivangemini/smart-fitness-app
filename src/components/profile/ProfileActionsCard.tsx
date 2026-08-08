import { useMemo } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';

import { AppCard } from '@/components/ui/AppCard';
import { DestructiveButton } from '@/components/ui/DestructiveButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

type ProfileActionsCardProps = {
  onResetOnboarding: () => void;
};

export function ProfileActionsCard({ onResetOnboarding }: ProfileActionsCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useLocalization();

  return (
    <AppCard>
      <Text style={styles.title}>{t('developer.settingsTitle')}</Text>
      <Text style={styles.badge}>{t('developer.badge')}</Text>
      <SecondaryButton
        accessibilityHint={t('developer.strengthPreviewHint')}
        label={t('developer.strengthPreview')}
        onPress={() => router.push('/workouts/coach')}
      />
      <SecondaryButton
        accessibilityHint={t('developer.nutritionPreviewHint')}
        label={t('developer.nutritionPreview')}
        onPress={() => router.push('/nutrition/coach')}
      />
      <SecondaryButton
        accessibilityHint={t('developer.nutritionProposalHint')}
        label={t('developer.nutritionProposal')}
        onPress={() => router.push('/nutrition/coach-proposal')}
      />
      <DestructiveButton
        accessibilityHint={t('developer.resetOnboardingHint')}
        label={t('developer.resetOnboarding')}
        onPress={onResetOnboarding}
      />
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) => ({
  badge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: colors.backgroundSelected,
    borderRadius: 999,
    color: colors.textSecondary,
    fontSize: Typography.caption.fontSize,
    fontWeight: '700' as const,
    marginBottom: Spacing.two,
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: Typography.sectionTitle.fontSize,
    fontWeight: Typography.sectionTitle.fontWeight,
    letterSpacing: Typography.sectionTitle.letterSpacing,
    lineHeight: Typography.sectionTitle.lineHeight,
    textTransform: Typography.sectionTitle.textTransform,
  },
});
