import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { SyncSettingsCard } from '@/features/settings/SyncSettingsCard';
import { getSyncStatusCopy } from '@/features/settings/syncStatusCopy';
import { useLocalization } from '@/localization';

export default function DataSyncSettingsScreen() {
  const { t } = useLocalization();
  const copy = getSyncStatusCopy(t);

  return (
    <SettingsScreenLayout title={copy.section}>
      <SyncSettingsCard />
    </SettingsScreenLayout>
  );
}
