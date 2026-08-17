import { useMemo, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Spacing, Typography } from '@/constants/theme';
import { usePushRuntime } from '@/features/notifications/PushRuntimeContext';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';
import { getNotificationSettingsCopy } from '@/localization/notificationSettingsCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function NotificationSettingsScreen() {
  const { locale } = useLocalization();
  const { colors } = useAppTheme();
  const { permission, registration, requestPermission, syncRegistration } =
    usePushRuntime();
  const [busy, setBusy] = useState(false);
  const copy = getNotificationSettingsCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const permissionLabel =
    permission === 'granted' || permission === 'provisional'
      ? copy.permissionAllowed
      : permission === 'denied'
        ? copy.permissionDenied
        : copy.permissionNotEnabled;
  const registrationLabel =
    registration === 'registered'
      ? copy.registrationRegistered
      : registration === 'error'
        ? copy.registrationError
        : copy.registrationWaiting;

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsScreenLayout subtitle={copy.subtitle} title={copy.title}>
      <AppCard>
        <View style={styles.copy}>
          <Text style={styles.label}>{copy.permission}</Text>
          <Text style={styles.value}>{permissionLabel}</Text>
          <Text style={styles.label}>{copy.delivery}</Text>
          <Text style={styles.value}>{registrationLabel}</Text>
        </View>
      </AppCard>

      {permission === 'not_requested' ? (
        <AppButton
          label={copy.enableNotifications}
          loading={busy}
          onPress={() => void run(requestPermission)}
        />
      ) : permission === 'denied' ? (
        <AppButton
          label={copy.openSystemSettings}
          onPress={() => void Linking.openSettings()}
        />
      ) : permission === 'granted' || permission === 'provisional' ? (
        <AppButton
          label={copy.syncDevice}
          loading={busy}
          onPress={() => void run(syncRegistration)}
          variant="secondary"
        />
      ) : null}
    </SettingsScreenLayout>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    copy: { gap: Spacing.one },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    value: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      marginBottom: Spacing.two,
    },
  });
