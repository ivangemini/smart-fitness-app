import { AuthGateCard } from '@/components/auth';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';

export default function AccountSettingsScreen() {
  const { t } = useLocalization();

  return (
    <SettingsScreenLayout title={t('account.title')}>
      <AuthGateCard />
    </SettingsScreenLayout>
  );
}
