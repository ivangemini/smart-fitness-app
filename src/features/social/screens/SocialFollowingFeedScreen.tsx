import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { getSocialFollowingFeedCopy } from '../socialFollowingFeedCopy';
import { SocialWorkoutPostCard } from '../SocialWorkoutPostCard';
import { getSocialWorkoutPostSurfaceCopy } from '../socialWorkoutPostSurfaceCopy';
import { useSocialFollowingFeed } from '../useSocialFollowingFeed';
import { createSocialWorkoutPostSurfaceStyles } from './SocialWorkoutPostSurface.styles';

export default function SocialFollowingFeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { locale, t } = useLocalization();
  const copy = getSocialFollowingFeedCopy(locale);
  const postCopy = getSocialWorkoutPostSurfaceCopy(locale);
  const styles = useMemo(() => createSocialWorkoutPostSurfaceStyles(colors), [colors]);
  const feed = useSocialFollowingFeed();

  const openPost = (postId: string) => {
    router.push({ pathname: '/social/workout-post/[postId]', params: { postId } });
  };

  const errorMessage =
    feed.loadError === 'offline'
      ? copy.loadErrorOffline
      : feed.loadError === 'session_expired'
        ? copy.loadErrorSession
        : feed.loadError === 'invalid_cursor'
          ? copy.loadErrorCursor
          : copy.loadErrorGeneric;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.eight,
          paddingTop: insets.top + Spacing.four,
        },
      ]}
      refreshControl={
        feed.ready && feed.isAuthenticated ? (
          <RefreshControl
            accessibilityLabel={copy.refreshing}
            onRefresh={() => void feed.loadFirstPage(true)}
            refreshing={feed.refreshing}
            tintColor={colors.accent}
          />
        ) : undefined
      }
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel={t('common.back')}
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>
        </View>

        {!feed.ready ||
        (feed.ready &&
          feed.isAuthenticated &&
          (feed.status === 'idle' || feed.status === 'loading')) ? (
          <AppCard>
            <LoadingState label={copy.loading} />
          </AppCard>
        ) : null}

        {feed.ready && !feed.isAuthenticated ? (
          <StateCard body={copy.signInBody} styles={styles} title={copy.signInTitle}>
            <PrimaryButton
              label={copy.signInAction}
              onPress={() => router.push('/auth/sign-in')}
            />
          </StateCard>
        ) : null}

        {feed.ready && feed.isAuthenticated && feed.status === 'error' ? (
          <StateCard body={errorMessage} styles={styles} title={copy.loadErrorTitle}>
            <SecondaryButton
              label={copy.retry}
              onPress={() => void feed.loadFirstPage(false)}
            />
          </StateCard>
        ) : null}

        {feed.ready &&
        feed.isAuthenticated &&
        feed.status === 'ready' &&
        feed.showingCachedFeed ? (
          <AppCard>
            <Text style={styles.body}>{copy.cachedNotice}</Text>
          </AppCard>
        ) : null}

        {feed.ready &&
        feed.isAuthenticated &&
        feed.status === 'ready' &&
        feed.posts.length === 0 ? (
          <StateCard body={copy.emptyBody} styles={styles} title={copy.emptyTitle}>
            <PrimaryButton label={copy.findProfiles} onPress={() => router.push('/social')} />
            <SecondaryButton
              label={copy.manageFollowing}
              onPress={() => router.push('/social/relationships')}
            />
          </StateCard>
        ) : null}

        {feed.ready && feed.isAuthenticated && feed.status === 'ready'
          ? feed.posts.map((post) => (
              <SocialWorkoutPostCard
                copy={postCopy}
                key={post.id}
                locale={locale}
                onOpen={openPost}
                post={post}
                styles={styles}
              />
            ))
          : null}

        {feed.ready && feed.isAuthenticated && feed.status === 'ready' && feed.loadError ? (
          <>
            <InlineError message={errorMessage} />
            <SecondaryButton
              label={copy.retry}
              onPress={() => void feed.loadFirstPage(true)}
            />
          </>
        ) : null}

        {feed.ready &&
        feed.isAuthenticated &&
        feed.status === 'ready' &&
        feed.nextCursor &&
        !feed.loadError &&
        !feed.showingCachedFeed ? (
          <SecondaryButton
            disabled={feed.loadingMore}
            label={copy.loadMore}
            loading={feed.loadingMore}
            onPress={() => void feed.loadMore()}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

function StateCard({
  body,
  children,
  styles,
  title,
}: {
  body: string;
  children?: React.ReactNode;
  styles: ReturnType<typeof createSocialWorkoutPostSurfaceStyles>;
  title: string;
}) {
  return (
    <AppCard>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {children}
    </AppCard>
  );
}
