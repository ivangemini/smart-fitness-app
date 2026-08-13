import { AboutSettingsCard } from '@/features/settings/PrivacyAboutCards';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';

export default function AboutSettingsScreen() {
  const { t } = useLocalization();

  return (
    <SettingsScreenLayout title={t('about.section')}>
      <AboutSettingsCard />
    </SettingsScreenLayout>
  );
}
