import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
// @ts-ignore - expo-updates types are not available in this workspace, but the runtime module exists on device.
import * as Updates from 'expo-updates';

import { ProfileRuntimeInfoCard } from '@/components/profile/ProfileRuntimeInfoCard';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { getSettingsNavigationCopy } from '@/features/settings/settingsNavigationCopy';
import { useLocalization } from '@/localization';

type OtaValueSource = Record<string, unknown>;

export default function UpdateSettingsScreen() {
  const { formatDate, locale, t } = useLocalization();
  const copy = useMemo(() => getSettingsNavigationCopy(locale), [locale]);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const russian = locale.toLowerCase().startsWith('ru');

  const formatOtaValue = (value: unknown) => {
    if (value === null || value === undefined || value === '') return t('common.notAvailable');
    if (value instanceof Date) {
      return formatDate(value, { dateStyle: 'medium', timeStyle: 'short' });
    }
    return String(value);
  };

  const handleCheckForOtaUpdate = async () => {
    if (checkingUpdate) return;
    setCheckingUpdate(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      if (!update.isAvailable) {
        Alert.alert(t('settings.noUpdateAvailable'));
        return;
      }
      await Updates.fetchUpdateAsync();
      Alert.alert(t('settings.updateDownloaded'));
      await Updates.reloadAsync();
    } catch {
      Alert.alert(t('settings.otaUpdateErrorTitle'), t('settings.otaUpdateErrorBody'));
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <SettingsScreenLayout
      subtitle={
        russian
          ? 'Проверяйте и устанавливайте доступные OTA-обновления приложения.'
          : 'Check and install available OTA app updates.'
      }
      title={copy.updates}>
      <ProfileRuntimeInfoCard
        channel={formatOtaValue((Updates as OtaValueSource).channel)}
        createdAt={formatOtaValue((Updates as OtaValueSource).createdAt)}
        onCheckForOtaUpdate={handleCheckForOtaUpdate}
        runtimeVersion={formatOtaValue((Updates as OtaValueSource).runtimeVersion)}
        updateId={formatOtaValue((Updates as OtaValueSource).updateId)}
      />
    </SettingsScreenLayout>
  );
}
