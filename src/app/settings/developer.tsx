import { useState } from 'react';
import { Alert } from 'react-native';
import { Redirect } from 'expo-router';
// @ts-ignore - expo-updates types are not available in this workspace, but the runtime module exists on device.
import * as Updates from 'expo-updates';

import { ProfileActionsCard } from '@/components/profile/ProfileActionsCard';
import { ProfileRuntimeInfoCard } from '@/components/profile/ProfileRuntimeInfoCard';
import { LocalPerformanceDiagnosticsCard } from '@/features/settings/LocalPerformanceDiagnosticsCard';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useAppActions } from '@/context/AppContext';
import { useLocalization } from '@/localization';

type OtaValueSource = Record<string, unknown>;

const supportDiagnosticsEnabled =
  __DEV__ || process.env.EXPO_PUBLIC_SUPPORT_MODE?.trim().toLowerCase() === 'true';

export default function DeveloperSettingsScreen() {
  const { resetOnboarding } = useAppActions();
  const { formatDate, t } = useLocalization();
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  if (!supportDiagnosticsEnabled) {
    return <Redirect href="/settings" />;
  }

  const formatOtaValue = (value: unknown) => {
    if (value === null || value === undefined || value === '') return t('common.notAvailable');
    if (value instanceof Date) {
      return formatDate(value, { dateStyle: 'medium', timeStyle: 'short' });
    }
    return String(value);
  };

  const handleResetOnboarding = () => {
    Alert.alert(t('settings.resetOnboardingTitle'), t('settings.resetOnboardingBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.reset'), style: 'destructive', onPress: resetOnboarding },
    ]);
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
      subtitle={t('settings.developerToolsDescription')}
      title={t('settings.developerTools')}>
      <ProfileActionsCard onResetOnboarding={handleResetOnboarding} />
      <ProfileRuntimeInfoCard
        channel={formatOtaValue((Updates as OtaValueSource).channel)}
        createdAt={formatOtaValue((Updates as OtaValueSource).createdAt)}
        onCheckForOtaUpdate={handleCheckForOtaUpdate}
        runtimeVersion={formatOtaValue((Updates as OtaValueSource).runtimeVersion)}
        updateId={formatOtaValue((Updates as OtaValueSource).updateId)}
      />
      <LocalPerformanceDiagnosticsCard />
    </SettingsScreenLayout>
  );
}
