import { PrivacySettingsCard } from '@/features/settings/PrivacyAboutCards';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';

export default function PrivacySettingsScreen() {
  const { t } = useLocalization();

  return (
    <SettingsScreenLayout title={t('privacy.section')}>
      <PrivacySettingsCard />
    </SettingsScreenLayout>
  );
}
