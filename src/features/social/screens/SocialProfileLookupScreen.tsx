import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { getSocialDiscoveryCopy } from '../socialDiscoveryCopy';
import { getSocialPublicProfileCopy } from '../socialPublicProfileCopy';
import {
  normalizeSocialLookupUsername,
  validateSocialLookupUsername,
} from '../socialPublicProfileModel';

type DiscoveryTab = 'profiles' | 'communities' | 'subscriptions';

export default function SocialProfileLookupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { locale, t } = useLocalization();
  const { isAuthenticated, ready } = useAuthSession();
  const profileCopy = getSocialPublicProfileCopy(locale);
  const copy = getSocialDiscoveryCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('profiles');
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const validation = validateSocialLookupUsername(username);
  const validationMessage =
    submitted && validation
      ? validation === 'required'
        ? profileCopy.validationRequired
        : profileCopy.validationFormat
      : undefined;

  const openProfile = () => {
    setSubmitted(true);
    if (validation) return;
    router.push({
      pathname: '/social/[username]',
      params: { username: normalizeSocialLookupUsername(username) },
    });
  };

  const renderTab = (tab: DiscoveryTab, label: string) => {
    const selected = activeTab === tab;
    return (
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        key={tab}
        onPress={() => setActiveTab(tab)}
        style={({ pressed }) => [
          styles.tab,
          selected && styles.tabSelected,
          pressed && styles.tabPressed,
        ]}>
        <Text numberOfLines={1} style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.eight,
          paddingTop: insets.top + Spacing.four,
        },
      ]}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <LiquidGlassIconButton
            accessibilityLabel={t('common.back')}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>
        </View>

        {!ready ? (
          <AppCard>
            <LoadingState label={profileCopy.loading} />
          </AppCard>
        ) : null}

        {ready && !isAuthenticated ? (
          <AppCard>
            <Text style={styles.cardTitle}>{profileCopy.signInTitle}</Text>
            <Text style={styles.body}>{profileCopy.signInBody}</Text>
            <PrimaryButton
              label={profileCopy.signInAction}
              onPress={() => router.push('/auth/sign-in')}
            />
          </AppCard>
        ) : null}

        {ready && isAuthenticated ? (
          <>
            <View accessibilityRole="tablist" style={styles.tabs}>
              {renderTab('profiles', copy.profilesTab)}
              {renderTab('communities', copy.communitiesTab)}
              {renderTab('subscriptions', copy.subscriptionsTab)}
            </View>

            {activeTab === 'profiles' ? (
              <AppCard style={styles.card}>
                <Text style={styles.cardTitle}>{copy.profileSectionTitle}</Text>
                <FormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorMessage={validationMessage}
                  helperText={profileCopy.usernameHelp}
                  label={profileCopy.username}
                  maxLength={30}
                  onChangeText={setUsername}
                  onSubmitEditing={openProfile}
                  placeholder={profileCopy.usernamePlaceholder}
                  returnKeyType="search"
                  textContentType="username"
                  value={username}
                />
                <PrimaryButton label={profileCopy.openProfile} onPress={openProfile} />
                <SecondaryButton
                  label={copy.manageProfile}
                  onPress={() => router.push('/settings/social-profile')}
                />
              </AppCard>
            ) : null}

            {activeTab === 'communities' ? (
              <AppCard style={styles.card}>
                <Text style={styles.cardTitle}>{copy.communitiesTitle}</Text>
                <Text style={styles.body}>{copy.communitiesBody}</Text>
                <SecondaryButton
                  label={copy.communityGuidelines}
                  onPress={() => router.push('/social/guidelines')}
                />
              </AppCard>
            ) : null}

            {activeTab === 'subscriptions' ? (
              <AppCard style={styles.card}>
                <Text style={styles.cardTitle}>{copy.subscriptionsTitle}</Text>
                <Text style={styles.body}>{copy.subscriptionsBody}</Text>
                <PrimaryButton
                  label={copy.relationships}
                  onPress={() => router.push('/social/relationships')}
                />
                <SecondaryButton
                  label={copy.followingFeed}
                  onPress={() => router.push('/social/feed')}
                />
              </AppCard>
            ) : null}
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    card: { gap: Spacing.three },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    container: {
      alignSelf: 'center',
      gap: Spacing.four,
      maxWidth: MaxContentWidth,
      minWidth: 0,
      width: '100%',
    },
    content: {
      flexGrow: 1,
      minWidth: 0,
      paddingHorizontal: Spacing.four,
      width: '100%',
    },
    eyebrow: {
      color: colors.accent,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      letterSpacing: 1.2,
    },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    headerRow: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    screen: { backgroundColor: colors.background, flex: 1 },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    tab: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: Radii.full,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: 'center',
      minHeight: 42,
      minWidth: 0,
      paddingHorizontal: Spacing.one,
    },
    tabLabel: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
    },
    tabLabelSelected: { color: colors.textPrimary },
    tabPressed: { opacity: 0.72 },
    tabSelected: { backgroundColor: colors.surfaceSecondary },
    tabs: {
      flexDirection: 'row',
      gap: Spacing.one,
      minWidth: 0,
      width: '100%',
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
  });
