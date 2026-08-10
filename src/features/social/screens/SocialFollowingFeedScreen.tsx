import { useMemo } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
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
  const showReadyState =
    feed.ready && feed.isAuthenticated && feed.status === 'ready';
  const listData = showReadyState ? feed.posts : [];

  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.eight,
          paddingTop: insets.top + Spacing.four,
        },
      ]}
      data={listData}
      ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
      keyExtractor={(post) => post.id}
      ListFooterComponent={
        showReadyState && feed.loadError ? (
          <View style={styles.listFooter}>
            <InlineError message={errorMessage} />
            <SecondaryButton
              label={copy.retry}
              onPress={() => void feed.loadFirstPage(true)}
            />
          </View>
        ) : showReadyState &&
          feed.nextCursor &&
          !feed.showingCachedFeed ? (
          <View style={styles.listFooter}>
            <SecondaryButton
              disabled={feed.loadingMore}
              label={copy.loadMore}
              loading={feed.loadingMore}
              onPress={() => void feed.loadMore()}
            />
          </View>
        ) : null
      }
      ListHeaderComponent={
        <View
          style={[
            styles.container,
            listData.length > 0 && styles.listHeaderWithItems,
          ]}>
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

          {!feed.ready ||
          (feed.ready &&
            feed.isAuthenticated &&
            (feed.status === 'idle' || feed.status === 'loading')) ? (
            <AppCard>
              <LoadingState label={copy.loading} />
            </AppCard>
          ) : null}

          {feed.ready && !feed.isAuthenticated ? (
            <StateCard
              body={copy.signInBody}
              styles={styles}
              title={copy.signInTitle}>
              <PrimaryButton
                label={copy.signInAction}
                onPress={() => router.push('/auth/sign-in')}
              />
            </StateCard>
          ) : null}

          {feed.ready && feed.isAuthenticated && feed.status === 'error' ? (
            <StateCard
              body={errorMessage}
              styles={styles}
              title={copy.loadErrorTitle}>
              <SecondaryButton
                label={copy.retry}
                onPress={() => void feed.loadFirstPage(false)}
              />
            </StateCard>
          ) : null}

          {showReadyState && feed.showingCachedFeed ? (
            <AppCard>
              <Text style={styles.body}>{copy.cachedNotice}</Text>
            </AppCard>
          ) : null}

          {showReadyState && feed.posts.length === 0 ? (
            <StateCard body={copy.emptyBody} styles={styles} title={copy.emptyTitle}>
              <PrimaryButton
                label={copy.findProfiles}
                onPress={() => router.push('/social')}
              />
              <SecondaryButton
                label={copy.manageFollowing}
                onPress={() => router.push('/social/relationships')}
              />
            </StateCard>
          ) : null}
        </View>
      }
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
      renderItem={({ item: post }) => (
        <View style={styles.listItem}>
          <SocialWorkoutPostCard
            copy={postCopy}
            locale={locale}
            onOpen={openPost}
            post={post}
            styles={styles}
          />
        </View>
      )}
      style={styles.screen}
    />
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
