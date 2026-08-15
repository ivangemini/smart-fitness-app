import { useMemo, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Spacing, Typography } from '@/constants/theme';
import { usePushRuntime } from '@/features/notifications/PushRuntimeContext';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function NotificationSettingsScreen() {
  const { locale } = useLocalization();
  const { colors } = useAppTheme();
  const { permission, registration, requestPermission, syncRegistration } =
    usePushRuntime();
  const [busy, setBusy] = useState(false);
  const russian = locale.toLowerCase().startsWith('ru');
  const styles = useMemo(() => createStyles(colors), [colors]);

  const permissionLabel =
    permission === 'granted' || permission === 'provisional'
      ? russian
        ? 'Разрешены'
        : 'Allowed'
      : permission === 'denied'
        ? russian
          ? 'Запрещены в системе'
          : 'Blocked in system settings'
        : russian
          ? 'Не включены'
          : 'Not enabled';
  const registrationLabel =
    registration === 'registered'
      ? russian
        ? 'Устройство зарегистрировано'
        : 'Device registered'
      : registration === 'error'
        ? russian
          ? 'Не удалось синхронизировать устройство'
          : 'Device sync failed'
        : russian
          ? 'Ожидает синхронизации'
          : 'Waiting for sync';

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsScreenLayout
      subtitle={
        russian
          ? 'Управляйте системным разрешением и регистрацией push-уведомлений.'
          : 'Manage system permission and push-device registration.'
      }
      title={russian ? 'Уведомления' : 'Notifications'}>
      <AppCard>
        <View style={styles.copy}>
          <Text style={styles.label}>{russian ? 'Разрешение' : 'Permission'}</Text>
          <Text style={styles.value}>{permissionLabel}</Text>
          <Text style={styles.label}>{russian ? 'Доставка' : 'Delivery'}</Text>
          <Text style={styles.value}>{registrationLabel}</Text>
        </View>
      </AppCard>

      {permission === 'not_requested' ? (
        <AppButton
          label={russian ? 'Включить уведомления' : 'Enable notifications'}
          loading={busy}
          onPress={() => void run(requestPermission)}
        />
      ) : permission === 'denied' ? (
        <AppButton
          label={russian ? 'Открыть настройки системы' : 'Open system settings'}
          onPress={() => void Linking.openSettings()}
        />
      ) : permission === 'granted' || permission === 'provisional' ? (
        <AppButton
          label={russian ? 'Синхронизировать устройство' : 'Sync device'}
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
