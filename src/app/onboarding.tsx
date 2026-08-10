import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import OnboardingClientScreen from '@/features/onboarding/OnboardingClientScreen';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function OnboardingRoute() {
  const [isClientReady, setIsClientReady] = useState(Platform.OS !== 'web');
  const { colors } = useAppTheme();

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  if (!isClientReady) {
    return <View style={[styles.placeholder, { backgroundColor: colors.background }]} />;
  }

  return <OnboardingClientScreen />;
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
  },
});
