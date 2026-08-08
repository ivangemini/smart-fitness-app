import { useMemo } from 'react';
import { Settings } from 'lucide-react-native';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { ProfilePreferencesCard } from '@/components/profile/ProfilePreferencesCard';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useProfileState } from '@/context/ProfileStateContext';
import { ProfileGoalsSection } from '@/features/profile/ProfileGoalsSection';
import {
  getGoalTypeLabel,
  getStoredActivityLevelLabel,
} from '@/features/progress/progressLocalization';
import { SocialProfileEntryCard } from '@/features/social/SocialProfileEntryCard';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { profile } = useProfileState();
  const { t } = useLocalization();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: getFloatingTabBarBottomClearance(safeAreaInsets.bottom) },
      ]}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Pressable
            accessibilityLabel={t('profile.settingsAction')}
            accessibilityRole="button"
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}>
            <Settings color={colors.textPrimary} size={22} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.summary')}</Text>
          <ProfilePreferencesCard
            activityLevel={getStoredActivityLevelLabel(t, profile.activityLevel)}
            goalType={getGoalTypeLabel(t, profile.goalType)}
            trainingDaysPerWeek={`${profile.trainingDaysPerWeek}`}
          />
        </View>

        <SocialProfileEntryCard />
        <ProfileGoalsSection />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { gap: Spacing.four, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    pressed: { opacity: 0.72 },
    screen: { backgroundColor: colors.background, flex: 1 },
    section: { gap: Spacing.two },
    sectionTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 18,
      fontWeight: '800',
    },
    settingsButton: {
      alignItems: 'center',
      backgroundColor: colors.surfacePrimary,
      borderColor: colors.borderSubtle,
      borderRadius: 22,
      borderWidth: StyleSheet.hairlineWidth,
      flexShrink: 0,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    title: {
      color: colors.textPrimary,
      flex: 1,
      flexShrink: 1,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      lineHeight: Typography.screenTitle.lineHeight,
      minWidth: 0,
    },
  });
