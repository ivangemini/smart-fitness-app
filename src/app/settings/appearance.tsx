import type { AppearanceMode } from '@/constants/theme';
import { AppCard } from '@/components/ui/AppCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function AppearanceSettingsScreen() {
  const { mode, setMode } = useAppTheme();
  const { t } = useLocalization();
  const options: ReadonlyArray<{ label: string; value: AppearanceMode }> = [
    { label: t('common.system'), value: 'system' },
    { label: t('common.light'), value: 'light' },
    { label: t('common.dark'), value: 'dark' },
  ];

  return (
    <SettingsScreenLayout
      subtitle={t('settings.appearanceDescription')}
      title={t('settings.appearance')}>
      <AppCard>
        <SegmentedControl
          accessibilityLabel={t('settings.appearance')}
          onChange={setMode}
          options={options}
          value={mode}
        />
      </AppCard>
    </SettingsScreenLayout>
  );
}
