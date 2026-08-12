import { AppCard } from '@/components/ui/AppCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization, type LanguagePreference } from '@/localization';

export default function LanguageSettingsScreen() {
  const { languagePreference, setLanguagePreference, t } = useLocalization();
  const options: ReadonlyArray<{ label: string; value: LanguagePreference }> = [
    { label: t('common.system'), value: 'system' },
    { label: t('common.english'), value: 'en' },
    { label: t('common.russian'), value: 'ru' },
  ];

  return (
    <SettingsScreenLayout
      subtitle={t('settings.languageDescription')}
      title={t('settings.language')}>
      <AppCard>
        <SegmentedControl
          accessibilityLabel={t('settings.language')}
          onChange={setLanguagePreference}
          options={options}
          value={languagePreference}
        />
      </AppCard>
    </SettingsScreenLayout>
  );
}
