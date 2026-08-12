import { useMemo } from 'react';
import { useRouter } from 'expo-router';

import { AuthGateCard } from '@/components/auth';
import { AppButton } from '@/components/ui/AppButton';
import { PersonalDetailsSettingsCard } from '@/features/settings/PersonalDetailsSettingsCard';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { getSettingsNavigationCopy } from '@/features/settings/settingsNavigationCopy';
import { useLocalization } from '@/localization';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { locale } = useLocalization();
  const copy = useMemo(() => getSettingsNavigationCopy(locale), [locale]);

  return (
    <SettingsScreenLayout subtitle={copy.profileSubtitle} title={copy.profile}>
      <AuthGateCard />
      <PersonalDetailsSettingsCard />
      <AppButton
        label={copy.socialProfile}
        onPress={() => router.push('/settings/social-profile')}
        variant="secondary"
      />
    </SettingsScreenLayout>
  );
}
