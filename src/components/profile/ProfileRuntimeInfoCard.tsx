import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { getMobileApiBaseUrl } from '@/api';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export function ProfileRuntimeInfoCard({
  channel,
  createdAt,
  onCheckForOtaUpdate,
  runtimeVersion,
  updateId,
}: {
  channel: string;
  createdAt: string;
  onCheckForOtaUpdate: () => void;
  runtimeVersion: string;
  updateId: string;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useLocalization();
  const apiBaseUrl = getMobileApiBaseUrl();

  return (
    <AppCard>
      <Text style={styles.title}>{t('developer.runtimeMetadata')}</Text>

      <View style={styles.otaCard}>
        <View style={styles.otaRow}>
          <Text style={styles.otaLabel}>API base URL</Text>
          <Text selectable style={styles.otaValue}>
            {apiBaseUrl}
          </Text>
        </View>

        <Text style={styles.otaTitle}>{t('developer.otaUpdate')}</Text>

        <View style={styles.otaRow}>
          <Text style={styles.otaLabel}>runtimeVersion</Text>
          <Text style={styles.otaValue}>{runtimeVersion}</Text>
        </View>
        <View style={styles.otaRow}>
          <Text style={styles.otaLabel}>updateId</Text>
          <Text style={styles.otaValue}>{updateId}</Text>
        </View>
        <View style={styles.otaRow}>
          <Text style={styles.otaLabel}>{t('developer.createdAt')}</Text>
          <Text style={styles.otaValue}>{createdAt}</Text>
        </View>
        <View style={styles.otaRow}>
          <Text style={styles.otaLabel}>{t('developer.channel')}</Text>
          <Text style={styles.otaValue}>{channel}</Text>
        </View>

        <AppButton
          label={t('developer.checkOtaUpdate')}
          onPress={onCheckForOtaUpdate}
          variant="secondary"
        />
      </View>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) => ({
  otaCard: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  otaLabel: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: Typography.metricSmall.fontSize,
    fontWeight: Typography.metricSmall.fontWeight,
    lineHeight: Typography.metricSmall.lineHeight,
    textTransform: Typography.metricSmall.textTransform,
  },
  otaRow: {
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row' as const,
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  otaTitle: {
    color: colors.textPrimary,
    fontSize: Typography.bodyStrong.fontSize,
    fontWeight: Typography.bodyStrong.fontWeight,
    lineHeight: Typography.bodyStrong.lineHeight,
  },
  otaValue: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    textAlign: 'right' as const,
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
