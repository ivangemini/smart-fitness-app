import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Ellipsis, Share2 } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  useAppActions,
  useAppInfrastructure,
  useWorkoutState,
} from '@/context/AppContext';
import { getWorkoutsHubWorkoutTitle } from '@/features/workouts/workoutsHubLocalization';
import { useWorkoutTheme } from '@/features/workouts/workoutTheme';
import {
  getWorkoutTemplateById,
  hydrateActiveWorkoutSessionDraft,
  isWorkoutTemplateFavorite,
  parseWorkoutPlanDescription,
  startWorkoutSession,
  toggleWorkoutTemplateFavorite,
} from '@/lib/workouts';
import { useLocalization } from '@/localization';
import { getWorkoutTemplateDetailCopy } from '@/localization/workoutTemplateDetailCopy';

export default function WorkoutTemplateDetailScreen() {
  const params = useLocalSearchParams<{ workoutId?: string }>();
  const workoutId = Array.isArray(params.workoutId) ? params.workoutId[0] : params.workoutId;
  const { deleteWorkoutTemplate } = useAppActions();
  const { isRestoringState } = useAppInfrastructure();
  const { workouts } = useWorkoutState();
  const { colors } = useWorkoutTheme();
  const { formatNumber, locale, t } = useLocalization();
  const copy = getWorkoutTemplateDetailCopy(locale);
  const insets = useSafeAreaInsets();
  const { height: viewportHeight } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    void hydrateActiveWorkoutSessionDraft();
  }, []);

  const workout = useMemo(
    () => (workoutId ? getWorkoutTemplateById(workoutId, workouts) : null),
    [workoutId, workouts],
  );
  const parsedPlan = useMemo(
    () => parseWorkoutPlanDescription(workout?.description),
    [workout?.description],
  );

  if (isRestoringState) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingState}>
          <Text style={styles.loadingLabel}>{copy.loading}</Text>
        </View>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingState}>
          <Text style={styles.emptyTitle}>{copy.notFound}</Text>
          <Pressable
            accessibilityLabel={copy.backToWorkouts}
            accessibilityRole="button"
            onPress={() => router.replace('/workouts')}
            style={({ pressed }) => [styles.backToWorkouts, pressed && styles.pressed]}>
            <Text style={styles.backToWorkoutsLabel}>{copy.backToWorkouts}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const displayTitle = getWorkoutsHubWorkoutTitle(t, workout);

  const openMenu = () => {
    const favorite = isWorkoutTemplateFavorite(workout.id);
    Alert.alert(displayTitle, undefined, [
      { text: copy.cancel, style: 'cancel' },
      {
        text: favorite ? copy.removeFavorite : copy.addFavorite,
        onPress: () => toggleWorkoutTemplateFavorite(workout.id),
      },
      ...(workout.isCustom
        ? [
            {
              text: copy.deleteWorkout,
              style: 'destructive' as const,
              onPress: () => {
                Alert.alert(copy.deleteTitle, copy.deleteBody, [
                  { text: copy.cancel, style: 'cancel' },
                  {
                    text: copy.delete,
                    style: 'destructive',
                    onPress: () => {
                      deleteWorkoutTemplate(workout.id);
                      router.replace('/workouts');
                    },
                  },
                ]);
              },
            },
          ]
        : []),
    ]);
  };

  const startWorkout = () => {
    startWorkoutSession(workout);
    router.push({ pathname: '/workout-session', params: { workoutId: workout.id } });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.one }]}>
        <View style={styles.headerSide}>
          <LiquidGlassIconButton
            accessibilityLabel={copy.back}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
        </View>
        <Text numberOfLines={2} style={styles.headerTitle}>
          {copy.headerTitle}
        </Text>
        <View style={[styles.headerSide, styles.headerActions]}>
          <Pressable
            accessibilityLabel={copy.shareUnavailable}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={styles.disabledIconButton}>
            <LiquidGlassSurface radius={22} style={styles.disabledIconSurface} variant="control">
              <Share2 color={colors.textMuted} size={21} strokeWidth={2} />
            </LiquidGlassSurface>
          </Pressable>
          <LiquidGlassIconButton
            accessibilityLabel={copy.moreOptions}
            Icon={Ellipsis}
            onPress={openMenu}
          />
        </View>
      </View>

      <FlatList
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.content,
          {
            minHeight: viewportHeight - insets.top,
            paddingBottom: footerHeight + Spacing.three,
          },
        ]}
        data={workout.exercises}
        ItemSeparatorComponent={() => <View style={styles.exerciseSeparator} />}
        keyExtractor={(exercise) => exercise.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.exerciseListHeader}>
            <Text selectable style={styles.title}>
              {displayTitle}
            </Text>
          </View>
        }
        renderItem={({ item: exercise, index }) => {
          const plan = parsedPlan.exercises[index];
          const targetSets = plan?.targetSets ?? 3;
          return (
            <View style={styles.exerciseListItem}>
              <View style={styles.exerciseRow}>
                <View style={styles.exerciseThumb}>
                  <Text style={styles.exerciseThumbLabel}>
                    {exercise.name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.exerciseCopy}>
                  <Text selectable style={styles.exerciseTitle}>
                    {exercise.name}
                  </Text>
                  <Text selectable style={styles.exerciseMeta}>
                    {copy.setCount(
                      targetSets,
                      formatNumber(targetSets, { maximumFractionDigits: 0 }),
                    )}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <View
        onLayout={(event) => {
          const nextHeight = event.nativeEvent.layout.height;
          setFooterHeight((currentHeight) =>
            Math.abs(currentHeight - nextHeight) > 0.5 ? nextHeight : currentHeight,
          );
        }}
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, Spacing.two),
          },
        ]}>
        <View style={styles.container}>
          <PrimaryButton
            accessibilityHint={copy.startWorkoutHint}
            label={copy.startWorkout}
            onPress={startWorkout}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    backToWorkouts: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderCurve: 'continuous',
      borderRadius: 999,
      marginTop: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingVertical: 10,
    },
    backToWorkoutsLabel: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '900',
    },
    container: {
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.five,
    },
    disabledIconButton: {
      flexShrink: 0,
      height: 44,
      width: 44,
    },
    disabledIconSurface: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      opacity: 0.58,
      width: 44,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '900',
    },
    exerciseCopy: {
      flex: 1,
      minWidth: 0,
    },
    exerciseListHeader: {
      marginBottom: Spacing.five,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    exerciseListItem: {
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    exerciseMeta: {
      color: colors.textSecondary,
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 23,
    },
    exerciseRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.four,
      minHeight: 82,
    },
    exerciseSeparator: {
      height: Spacing.four,
    },
    exerciseThumb: {
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      height: 76,
      justifyContent: 'center',
      width: 76,
    },
    exerciseThumbLabel: {
      color: colors.textPrimary,
      fontSize: 26,
      fontWeight: '300',
    },
    exerciseTitle: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '400',
      lineHeight: 28,
    },
    footer: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      bottom: 0,
      left: 0,
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.two,
      position: 'absolute',
      right: 0,
    },
    header: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderBottomColor: colors.divider,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.two,
      paddingBottom: Spacing.two,
      paddingHorizontal: Spacing.two,
    },
    headerActions: {
      flexDirection: 'row',
      gap: Spacing.one,
      justifyContent: 'flex-end',
    },
    headerSide: {
      flexDirection: 'row',
      minWidth: 96,
    },
    headerTitle: {
      color: colors.textPrimary,
      flex: 1,
      flexShrink: 1,
      fontSize: 19,
      fontWeight: '500',
      lineHeight: 24,
      minWidth: 0,
      textAlign: 'center',
    },
    list: {
      flex: 1,
    },
    loadingLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '700',
    },
    loadingState: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: Spacing.three,
    },
    pressed: {
      opacity: 0.72,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 32,
      fontWeight: '400',
      lineHeight: 38,
    },
  });
