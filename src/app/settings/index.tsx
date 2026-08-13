import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import {
  CircleUserRound,
  Database,
  Info,
  KeyRound,
  Languages,
  Palette,
  Ruler,
  ShieldCheck,
  Wrench,
} from 'lucide-react-native';

import { SettingsNavigationGroup } from '@/features/settings/SettingsNavigationGroup';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { getSettingsNavigationCopy } from '@/features/settings/settingsNavigationCopy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences } from '@/units';

const supportDiagnosticsEnabled =
  __DEV__ || process.env.EXPO_PUBLIC_SUPPORT_MODE?.trim().toLowerCase() === 'true';

export default function SettingsScreen() {
  const router = useRouter();
  const { languagePreference, locale, t } = useLocalization();
  const { mode } = useAppTheme();
  const { energy, length, weight } = useUnitPreferences();
  const copy = useMemo(() => getSettingsNavigationCopy(locale), [locale]);

  const languageValue =
    languagePreference === 'system'
      ? t('common.system')
      : languagePreference === 'ru'
        ? t('common.russian')
        : t('common.english');
  const appearanceValue =
    mode === 'system' ? t('common.system') : mode === 'dark' ? t('common.dark') : t('common.light');
  const unitsValue = `${weight} · ${length} · ${energy}`;

  return (
    <SettingsScreenLayout subtitle={copy.rootSubtitle} title={t('settings.title')}>
      <SettingsNavigationGroup
        rows={[
          {
            Icon: KeyRound,
            key: 'account-security',
            label: t('account.title'),
            onPress: () => router.push('/settings/account'),
          },
          {
            Icon: CircleUserRound,
            key: 'profile',
            label: copy.profile,
            onPress: () => router.push('/settings/profile'),
          },
        ]}
        title={copy.account}
      />

      <SettingsNavigationGroup
        rows={[
          {
            Icon: Palette,
            key: 'appearance',
            label: copy.appearance,
            onPress: () => router.push('/settings/appearance'),
            value: appearanceValue,
          },
          {
            Icon: Languages,
            key: 'language',
            label: copy.language,
            onPress: () => router.push('/settings/language'),
            value: languageValue,
          },
          {
            Icon: Ruler,
            key: 'units',
            label: copy.units,
            onPress: () => router.push('/settings/units'),
            value: unitsValue,
          },
        ]}
        title={copy.preferences}
      />

      <SettingsNavigationGroup
        rows={[
          {
            Icon: Database,
            key: 'data-sync',
            label: copy.dataSync,
            onPress: () => router.push('/settings/data-sync'),
          },
          {
            Icon: ShieldCheck,
            key: 'privacy',
            label: copy.privacy,
            onPress: () => router.push('/settings/privacy'),
          },
        ]}
        title={copy.dataPrivacy}
      />

      <SettingsNavigationGroup
        rows={[
          {
            Icon: Info,
            key: 'about',
            label: copy.about,
            onPress: () => router.push('/settings/about'),
          },
        ]}
        title={copy.support}
      />

      {supportDiagnosticsEnabled ? (
        <SettingsNavigationGroup
          rows={[
            {
              Icon: Wrench,
              key: 'developer',
              label: copy.developerTools,
              onPress: () => router.push('/settings/developer'),
            },
          ]}
          title={copy.developer}
        />
      ) : null}
    </SettingsScreenLayout>
  );
}
