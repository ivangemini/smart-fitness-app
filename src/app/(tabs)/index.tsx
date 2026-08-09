import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SocialWorkoutPostDto } from '@/api/social';
import { HomeDailyMetricsPanel } from '@/components/home/HomeDailyMetricsPanel';
import { HomeLiquidBackdrop } from '@/components/home/HomeLiquidBackdrop';
import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import {
  useAppInfrastructure,
  useNutritionState,
  useWorkoutState,
} from '@/context/AppContext';
import { useProfileState } from '@/context/ProfileStateContext';
import { useProgressState } from '@/context/ProgressStateContext';
import { getHomeRecoveryStatusLabel } from '@/features/home/homeLocalization';
import { getHomeSocialCopy } from '@/features/home/homeSocialCopy';
import { getCurrentWorkoutStreak } from '@/lib/home';
import { getRecoveryAdvisor } from '@/lib/intelligence';
import { formatLocalDate } from '@/lib';
import { sumNutritionTotals } from '@/lib/nutrition';
import { getProgressAnalytics } from '@/lib/progress';
import {
  getActiveWorkoutSessionDraft,
  getWorkoutProgramSchedule,
  getWorkoutPrograms,
  hydrateActiveWorkoutSessionDraft,
} from '@/lib/workouts';
import { formatPlural, useLocalization } from '@/localization';
import { getSocialFollowingFeedCopy } from '@/features/social/socialFollowingFeedCopy';
import { SocialWorkoutPostCard } from '@/features/social/SocialWorkoutPostCard';
import { getSocialWorkoutPostSurfaceCopy } from '@/features/social/socialWorkoutPostSurfaceCopy';
import { useSocialFollowingFeed } from '@/features/social/useSocialFollowingFeed';
import { createSocialWorkoutPostSurfaceStyles } from '@/features/social/screens/SocialWorkoutPostSurface.styles';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';
import {
  formatEnergyValue,
  formatWeightValue,
  useUnitPreferences,
} from '@/units';

const progressRatio = (current: number, target: number) =>
  target > 0 ? Math.max(0, Math.min(1, current / target)) : current > 0 ? 1 : 0;

export default function HomeScreen() {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const { bodyMeasurements, weightHistory } = useProgressState();
  const { exercises, workoutSessions, workouts } = useWorkoutState();
  const { foodEntries, nutritionTargets } = useNutritionState();
  const { onboardingCompleted, profile } = useProfileState();
  const { isRestoringState } = useAppInfrastructure();
  const { formatNumber, locale, t } = useLocalization();
  const { energy: energyUnit, weight: weightUnit } = useUnitPreferences();
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const socialStyles = useMemo(
    () => createSocialWorkoutPostSurfaceStyles(colors),
    [colors],
  );
  const safeAreaInsets = useSafeAreaInsets();
  const homeCopy = getHomeSocialCopy(locale);
  const feedCopy = getSocialFollowingFeedCopy(locale);
  const postCopy = getSocialWorkoutPostSurfaceCopy(locale);
  const feed = useSocialFollowingFeed();
  const todayKey = formatLocalDate(new Date());
  const [activeDraftReady, setActiveDraftReady] = useState(false);

  useEffect(() => {
    if (isRestoringState) return;
    if (!onboardingCompleted) router.replace('/auth');
  }, [isRestoringState, onboardingCompleted]);

  useEffect(() => {
    let cancelled = false;
    void hydrateActiveWorkoutSessionDraft().then(() => {
      if (!cancelled) setActiveDraftReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const currentProgram = useMemo(() => getWorkoutPrograms(workouts)[0] ?? null, [workouts]);
  const programSchedule = useMemo(
    () => (currentProgram ? getWorkoutProgramSchedule(currentProgram) : null),
    [currentProgram],
  );
  const scheduledWorkout = useMemo(() => {
    const workoutId = programSchedule?.currentDay?.workoutTemplateId;
    return workoutId ? workouts.find((workout) => workout.id === workoutId) ?? null : null;
  }, [programSchedule?.currentDay?.workoutTemplateId, workouts]);
  const nextWorkout = useMemo(() => {
    const workoutId = programSchedule?.nextWorkout?.workoutTemplateId;
    return workoutId ? workouts.find((workout) => workout.id === workoutId) ?? null : null;
  }, [programSchedule?.nextWorkout?.workoutTemplateId, workouts]);
  const currentWorkoutStreak = useMemo(
    () => getCurrentWorkoutStreak(workoutSessions),
    [workoutSessions],
  );
  const progressAnalytics = useMemo(
    () =>
      getProgressAnalytics({
        bodyMeasurements,
        exercises,
        weightHistory,
        workoutSessions,
      }),
    [bodyMeasurements, exercises, weightHistory, workoutSessions],
  );
  const todaysFoodEntries = useMemo(
    () => foodEntries.filter((entry) => entry.date === todayKey),
    [foodEntries, todayKey],
  );
  const todaysNutrition = useMemo(
    () => sumNutritionTotals(todaysFoodEntries),
    [todaysFoodEntries],
  );
  const recoveryAdvisor = useMemo(
    () => getRecoveryAdvisor({ exercises, workoutSessions, workouts }),
    [exercises, workoutSessions, workouts],
  );

  const activeWorkout = activeDraftReady ? getActiveWorkoutSessionDraft() : null;
  const primaryWorkoutRoute = activeWorkout
    ? {
        pathname: '/workout-session' as const,
        params: { workoutId: activeWorkout.workoutId },
      }
    : '/(tabs)/workouts';
  const primaryWorkoutLabel = t(
    activeWorkout ? 'home.continueWorkout' : 'home.startWorkout',
  );
  const workoutStatus = activeWorkout
    ? primaryWorkoutLabel
    : scheduledWorkout
      ? homeCopy.todaysWorkout
      : programSchedule?.isRestDayToday
        ? homeCopy.restDay
        : nextWorkout
          ? homeCopy.nextWorkout
          : homeCopy.noWorkout;
  const workoutTitle =
    activeWorkout?.workoutTitle ?? scheduledWorkout?.title ?? nextWorkout?.title ?? homeCopy.noWorkout;

  const latestWeightEntry = progressAnalytics.weight.currentWeightEntry;
  const currentWeightLabel = latestWeightEntry
    ? `${formatWeightValue(latestWeightEntry.weight, weightUnit)} ${weightUnit}`
    : profile.weight
      ? `${formatWeightValue(Number(profile.weight), weightUnit)} ${weightUnit}`
      : '—';
  const recoveryLabel = getHomeRecoveryStatusLabel(t, recoveryAdvisor.status);
  const streakLabel = currentWorkoutStreak
    ? formatPlural(locale, currentWorkoutStreak.days, {
        one: t('home.streak.one'),
        few: t('home.streak.few'),
        many: t('home.streak.many'),
        other: t('home.streak.other'),
      })
    : '—';
  const caloriesCurrent = formatEnergyValue(todaysNutrition.calories, energyUnit);
  const caloriesTarget = formatEnergyValue(nutritionTargets.calories, energyUnit);
  const macroMetrics = [
    {
      label: homeCopy.proteinShort,
      current: formatNumber(Math.round(todaysNutrition.protein)),
      target: formatNumber(Math.round(nutritionTargets.protein)),
      progress: progressRatio(todaysNutrition.protein, nutritionTargets.protein),
    },
    {
      label: homeCopy.fatShort,
      current: formatNumber(Math.round(todaysNutrition.fats)),
      target: formatNumber(Math.round(nutritionTargets.fats)),
      progress: progressRatio(todaysNutrition.fats, nutritionTargets.fats),
    },
    {
      label: homeCopy.carbsShort,
      current: formatNumber(Math.round(todaysNutrition.carbs)),
      target: formatNumber(Math.round(nutritionTargets.carbs)),
      progress: progressRatio(todaysNutrition.carbs, nutritionTargets.carbs),
    },
  ];

  const feedErrorMessage =
    feed.loadError === 'offline'
      ? feedCopy.loadErrorOffline
      : feed.loadError === 'session_expired'
        ? feedCopy.loadErrorSession
        : feed.loadError === 'invalid_cursor'
          ? feedCopy.loadErrorCursor
          : feedCopy.loadErrorGeneric;

  const openPost = (postId: string) => {
    router.push({ pathname: '/social/workout-post/[postId]', params: { postId } });
  };

  if (isRestoringState || !onboardingCompleted) {
    return <View style={styles.screen} />;
  }

  const listHeader = (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{t('tabs.home')}</Text>
        <LiquidGlassIconButton
          accessibilityLabel={t('home.openProfile')}
          Icon={User}
          onPress={() => router.push('/(tabs)/profile')}
          testID="home-profile-glass-button"
        />
      </View>

      <HomeDailyMetricsPanel
        caloriesCurrent={caloriesCurrent}
        caloriesProgress={progressRatio(todaysNutrition.calories, nutritionTargets.calories)}
        caloriesTarget={caloriesTarget}
        copy={homeCopy}
        macros={macroMetrics}
        onAddFood={() => router.push('/(tabs)/nutrition')}
        onLogWeight={() => router.push('/weight-entry')}
        onWorkoutPress={() => router.push(primaryWorkoutRoute)}
        recoveryLabel={recoveryLabel}
        stepsValue="—"
        streakLabel={streakLabel}
        weightLabel={currentWeightLabel}
        workoutActionLabel={primaryWorkoutLabel}
        workoutStatus={workoutStatus}
        workoutTitle={workoutTitle}
      />

      <View style={styles.feedHeader}>
        <Text style={styles.feedTitle}>{homeCopy.feedTitle}</Text>
      </View>

      {feed.ready && feed.isAuthenticated && feed.status === 'ready' && feed.showingCachedFeed ? (
        <AppCard>
          <Text style={socialStyles.body}>{feedCopy.cachedNotice}</Text>
        </AppCard>
      ) : null}
    </View>
  );

  const emptyFeed = !feed.ready ||
    (feed.ready && feed.isAuthenticated && (feed.status === 'idle' || feed.status === 'loading')) ? (
      <AppCard style={styles.feedState}>
        <LoadingState label={feedCopy.loading} />
      </AppCard>
    ) : feed.ready && !feed.isAuthenticated ? (
      <AppCard style={styles.feedState}>
        <Text style={socialStyles.cardTitle}>{feedCopy.signInTitle}</Text>
        <Text style={socialStyles.body}>{feedCopy.signInBody}</Text>
        <PrimaryButton
          label={feedCopy.signInAction}
          onPress={() => router.push('/auth/sign-in')}
        />
      </AppCard>
    ) : feed.ready && feed.isAuthenticated && feed.status === 'error' ? (
      <AppCard style={styles.feedState}>
        <Text style={socialStyles.cardTitle}>{feedCopy.loadErrorTitle}</Text>
        <Text style={socialStyles.body}>{feedErrorMessage}</Text>
        <SecondaryButton
          label={feedCopy.retry}
          onPress={() => void feed.loadFirstPage(false)}
        />
      </AppCard>
    ) : feed.ready && feed.isAuthenticated && feed.status === 'ready' ? (
      <AppCard style={styles.feedState}>
        <Text style={socialStyles.cardTitle}>{feedCopy.emptyTitle}</Text>
        <Text style={socialStyles.body}>{feedCopy.emptyBody}</Text>
        <PrimaryButton label={feedCopy.findProfiles} onPress={() => router.push('/social')} />
      </AppCard>
    ) : null;

  const feedFooter =
    feed.ready && feed.isAuthenticated && feed.status === 'ready' ? (
      <View style={styles.feedFooter}>
        {feed.loadError ? (
          <>
            <InlineError message={feedErrorMessage} />
            <SecondaryButton
              label={feedCopy.retry}
              onPress={() => void feed.loadFirstPage(true)}
            />
          </>
        ) : null}
        {feed.nextCursor && !feed.loadError && !feed.showingCachedFeed ? (
          <SecondaryButton
            disabled={feed.loadingMore}
            label={feedCopy.loadMore}
            loading={feed.loadingMore}
            onPress={() => void feed.loadMore()}
          />
        ) : null}
      </View>
    ) : null;

  return (
    <View style={styles.screen}>
      <HomeLiquidBackdrop />
      <FlatList<SocialWorkoutPostDto>
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: getFloatingTabBarBottomClearance(safeAreaInsets.bottom),
            paddingTop: safeAreaInsets.top + Spacing.three,
          },
        ]}
        data={feed.ready && feed.isAuthenticated && feed.status === 'ready' ? feed.posts : []}
        ItemSeparatorComponent={() => <View style={styles.feedGap} />}
        keyExtractor={(post) => post.id}
        ListEmptyComponent={emptyFeed}
        ListFooterComponent={feedFooter}
        ListHeaderComponent={listHeader}
        refreshControl={
          feed.ready && feed.isAuthenticated ? (
            <RefreshControl
              accessibilityLabel={feedCopy.refreshing}
              onRefresh={() => void feed.loadFirstPage(true)}
              refreshing={feed.refreshing}
              tintColor={colors.accent}
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <SocialWorkoutPostCard
              copy={postCopy}
              locale={locale}
              onOpen={openPost}
              post={item}
              styles={socialStyles}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    content: { flexGrow: 1, paddingHorizontal: Spacing.three },
    feedFooter: {
      alignSelf: 'center',
      gap: Spacing.two,
      maxWidth: MaxContentWidth,
      paddingTop: Spacing.three,
      width: '100%',
    },
    feedGap: { height: Spacing.three },
    feedHeader: { paddingTop: Spacing.one },
    feedItem: { alignSelf: 'center', maxWidth: MaxContentWidth, width: '100%' },
    feedState: { alignSelf: 'center', maxWidth: MaxContentWidth, width: '100%' },
    feedTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    headerContent: {
      alignSelf: 'center',
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      paddingBottom: Spacing.three,
      width: '100%',
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    headerTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      lineHeight: Typography.screenTitle.lineHeight,
      minWidth: 0,
    },
    screen: { backgroundColor: glass.backgroundBase, flex: 1 },
  });
