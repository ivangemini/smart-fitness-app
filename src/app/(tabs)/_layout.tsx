import { Tabs } from 'expo-router';
import { useMemo } from 'react';

import { LiquidGlassTabBar } from '@/components/navigation/LiquidGlassTabBar';
import { getLabsCopy } from '@/features/labs/labsCopy';
import { useLocalization } from '@/localization';

export default function TabsLayout() {
  const { locale, t } = useLocalization();
  const labsCopy = useMemo(() => getLabsCopy(locale), [locale]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <LiquidGlassTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="workouts" options={{ title: t('tabs.workouts') }} />
      <Tabs.Screen name="nutrition" options={{ title: t('tabs.nutrition') }} />
      <Tabs.Screen name="progress" options={{ title: t('tabs.progress') }} />
      <Tabs.Screen name="labs" options={{ title: labsCopy.tabTitle }} />
      <Tabs.Screen name="coach" options={{ href: null, title: t('tabs.coach') }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="track" options={{ href: null }} />
      <Tabs.Screen name="eat" options={{ href: null }} />
    </Tabs>
  );
}
