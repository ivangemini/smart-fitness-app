import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressTrendChart } from '@/components/progress/ProgressTrendChart';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { MetricCard } from '@/components/ui/MetricCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Spacing } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import {
  getExerciseDetailCopy,
  type ExerciseDetailErrorCode,
} from '@/localization/exerciseDetailCopy';
import { getExerciseLibraryCopy } from '@/localization/exerciseLibraryCopy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences, weightFromKg } from '@/units';

import { ExerciseDetailTextList } from '../components/ExerciseDetailTextList';
import { ExerciseIntelligenceSection } from '../components/ExerciseIntelligenceSection';
import { ExerciseMediaPreview } from '../components/ExerciseMediaPreview';
import { ExercisePreferencesCard } from '../components/ExercisePreferencesCard';
import { MuscleMap } from '../components/MuscleMap';
import { getExerciseProgressCopy } from '../exerciseProgressCopy';
import { loadFavoriteExerciseIds, saveFavoriteExerciseIds } from '../favoritesRepository';
import { selectCompletedSetsByExerciseId } from '../history';
import { buildMuscleHighlights } from '../muscleTaxonomy';
import {
  calculateExerciseProgressMetrics,
  type ExerciseProgressTopSet,
} from '../progress';
import { exerciseRepository, isOssExerciseDbEnabled } from '../repository';
import type { Exercise } from '../types';
import { createExerciseDetailStyles } from './ExerciseDetailScreen.styles';

type DetailTab = 'about' | 'history' | 'progress';

export default function ExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const copy = useMemo(() => getExerciseDetailCopy(locale), [locale]);
  const progressCopy = useMemo(() => getExerciseProgressCopy(locale), [locale]);
  const libraryCopy = useMemo(() => getExerciseLibraryCopy(locale), [locale]);
  const styles = useMemo(() => createExerciseDetailStyles(colors), [colors]);
  const detailTabs = useMemo<Array<{ label: string; value: DetailTab }>>(
    () => [
      { label: copy.tabs.about, value: 'about' },
      { label: copy.tabs.history, value: 'history' },
      { label: copy.tabs.progress, value: 'progress' },
    ],
    [copy],
  );
  const { workoutSessions } = useWorkoutState();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<ExerciseDetailErrorCode | null>(null);
  const [tab, setTab] = useState<DetailTab>('about');
  const [playing, setPlaying] = useState(true);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const loadExercise = async () => {
      if (!exerciseId) {
        setErrorCode('missing');
        setLoading(false);
        return;
      }

      try {
        const [nextExercise, nextFavoriteIds] = await Promise.all([
          exerciseRepository.getExerciseById(exerciseId),
          loadFavoriteExerciseIds(),
        ]);

        if (cancelled) return;
        setExercise(nextExercise);
        setFavoriteIds(nextFavoriteIds);
        setErrorCode(nextExercise ? null : 'not_found');
      } catch {
        if (!cancelled) setErrorCode('load_failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadExercise();
    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  useEffect(() => {
    setMediaFailed(false);
  }, [exerciseId, playing]);

  const historyGroups = useMemo(
    () => (exercise ? selectCompletedSetsByExerciseId(workoutSessions, exercise.id) : []),
    [exercise, workoutSessions],
  );
  const progressMetrics = useMemo(
    () => calculateExerciseProgressMetrics(historyGroups),
    [historyGroups],
  );
  const displayVolumeTrend = useMemo(
    () =>
      progressMetrics.volumeTrend.map((point) => {
        const value = weightFromKg(point.value, weightUnit);
        return {
          key: point.key,
          label: formatDate(point.finishedAt, { month: 'short', day: 'numeric' }),
          value,
          displayValue: `${formatNumber(value, { maximumFractionDigits: 0 })} ${weightUnit}`,
        };
      }),
    [formatDate, formatNumber, progressMetrics.volumeTrend, weightUnit],
  );
  const displayLoadTrend = useMemo(
    () =>
      progressMetrics.loadTrend.map((point) => {
        const value = weightFromKg(point.value, weightUnit);
        return {
          key: point.key,
          label: formatDate(point.finishedAt, { month: 'short', day: 'numeric' }),
          value,
          displayValue: `${formatNumber(value, { maximumFractionDigits: 1 })} ${weightUnit}`,
        };
      }),
    [formatDate, formatNumber, progressMetrics.loadTrend, weightUnit],
  );
  const displayEstimatedOneRepMaxTrend = useMemo(
    () =>
      progressMetrics.estimatedOneRepMaxTrend.map((point) => {
        const value = weightFromKg(point.value, weightUnit);
        return {
          key: point.key,
          label: formatDate(point.finishedAt, { month: 'short', day: 'numeric' }),
          value,
          displayValue: `${formatNumber(value, { maximumFractionDigits: 1 })} ${weightUnit}`,
        };
      }),
    [formatDate, formatNumber, progressMetrics.estimatedOneRepMaxTrend, weightUnit],
  );
  const highlights = useMemo(
    () =>
      exercise
        ? buildMuscleHighlights(exercise.primaryMuscles, exercise.secondaryMuscles)
        : {},
    [exercise],
  );
  const isFavorite = Boolean(exercise && favoriteIds.has(exercise.id));
  const hasAnimation = Boolean(exercise?.media.animationUrl ?? exercise?.media.gifUri);
  const formatWeight = (valueKg: number) =>
    `${formatWeightValue(valueKg)} ${weightUnit}`;
  const formatVolume = (valueKg: number) =>
    `${formatNumber(weightFromKg(valueKg, weightUnit), {
      maximumFractionDigits: 0,
    })} ${weightUnit}`;
  const formatTopSet = (topSet: ExerciseProgressTopSet | null) => {
    if (!topSet) return progressCopy.notEnoughEvidence;
    const rpe =
      topSet.actualRpe === null
        ? ''
        : ` · RPE ${formatNumber(topSet.actualRpe, { maximumFractionDigits: 1 })}`;
    return `${formatWeight(topSet.weight)} × ${formatNumber(topSet.reps, {
      maximumFractionDigits: 0,
    })}${rpe}`;
  };
  const formatPercentDelta = (value: number | null) =>
    value === null
      ? progressCopy.notEnoughEvidence
      : `${value > 0 ? '+' : ''}${formatNumber(value, { maximumFractionDigits: 1 })}%`;

  const toggleFavorite = () => {
    if (!exercise) return;
    const nextFavoriteIds = new Set(favoriteIds);
    if (nextFavoriteIds.has(exercise.id)) nextFavoriteIds.delete(exercise.id);
    else nextFavoriteIds.add(exercise.id);
    setFavoriteIds(nextFavoriteIds);
    void saveFavoriteExerciseIds(nextFavoriteIds);
  };

  const shareExercise = () => {
    if (!exercise) return;
    const equipment =
      exercise.equipment.map(libraryCopy.facetLabel).join(', ') || copy.none;
    const primaryMuscles = exercise.primaryMuscles.join(', ') || copy.notSpecified;
    void Share.share({
      message: copy.shareMessage(exercise.name, equipment, primaryMuscles),
      title: exercise.name,
    });
  };

  if (loading) {
    return (
      <View
        style={[
          styles.centeredState,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + Spacing.four,
            paddingTop: insets.top + Spacing.four,
          },
        ]}>
        <LoadingState label={copy.loading} />
      </View>
    );
  }

  if (errorCode || !exercise) {
    const boundedError = errorCode ?? 'not_found';
    return (
      <View
        style={[
          styles.centeredState,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + Spacing.four,
            paddingTop: insets.top + Spacing.four,
          },
        ]}>
        <EmptyState
          title={copy.errorTitle(boundedError)}
          description={copy.errorDescription}
        />
        <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.eight,
          paddingTop: insets.top + Spacing.three,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <LiquidGlassIconButton
              accessibilityLabel={copy.back}
              Icon={ChevronLeft}
              onPress={() => router.back()}
              testID="exercise-detail-back"
            />
          </View>
          <Text numberOfLines={2} style={styles.title}>
            {exercise.name}
          </Text>
          <View style={styles.headerSide} />
        </View>

        <SegmentedControl
          accessibilityLabel={copy.sectionsAccessibility}
          options={detailTabs}
          value={tab}
          onChange={setTab}
        />

        <AppCard style={styles.mediaCard}>
          <ExerciseMediaPreview
            colors={colors}
            exercise={exercise}
            onMediaError={() => setMediaFailed(true)}
            contentFit="contain"
            playing={playing}
            resizeMode="contain"
            showLabel
            style={styles.media}
          />
          {hasAnimation && !mediaFailed ? (
            <AppButton
              label={playing ? copy.pause : copy.play}
              onPress={() => setPlaying((current) => !current)}
              style={styles.playButton}
              variant="secondary"
            />
          ) : null}
        </AppCard>

        {isOssExerciseDbEnabled() && exercise.source.provider === 'oss-exercisedb' ? (
          <Text style={styles.attribution}>{copy.attribution}</Text>
        ) : null}

        <View style={styles.actionRow}>
          <AppButton
            label={copy.shareExercise}
            onPress={shareExercise}
            variant="secondary"
            style={styles.actionButton}
          />
          <AppButton
            label={isFavorite ? copy.favorite : copy.addFavorite}
            onPress={toggleFavorite}
            style={styles.actionButton}
          />
        </View>

        {tab === 'about' ? (
          <View style={styles.stack}>
            <View style={styles.muscleMaps}>
              <MuscleMap side="front" highlights={highlights} />
              <MuscleMap side="back" highlights={highlights} />
            </View>
            <AppCard>
              <Text style={styles.cardTitle}>{copy.primaryMuscles}</Text>
              <ExerciseDetailTextList
                emptyLabel={copy.noEntries}
                items={exercise.primaryMuscles}
                styles={styles}
              />
              <Text style={styles.cardTitle}>{copy.secondaryMuscles}</Text>
              <ExerciseDetailTextList
                emptyLabel={copy.noEntries}
                items={exercise.secondaryMuscles}
                styles={styles}
              />
            </AppCard>
            <AppCard>
              <Text style={styles.cardTitle}>{copy.details}</Text>
              <Text style={styles.secondaryText}>
                {copy.bodyPart}: {libraryCopy.facetLabel(exercise.bodyPart)}
              </Text>
              <Text style={styles.secondaryText}>
                {copy.equipment}:{' '}
                {exercise.equipment.map(libraryCopy.facetLabel).join(', ') || copy.none}
              </Text>
              <Text style={styles.secondaryText}>
                {copy.aliases}: {exercise.aliases.join(', ') || copy.none}
              </Text>
            </AppCard>
            <ExercisePreferencesCard exerciseId={exercise.id} locale={locale} />
            <ExerciseIntelligenceSection
              exerciseId={exercise.id}
              locale={locale}
              onOpenExercise={(nextExerciseId) =>
                router.push({
                  pathname: '/exercises/[exerciseId]',
                  params: { exerciseId: nextExerciseId },
                })
              }
              styles={styles}
            />
            <AppCard>
              <Text style={styles.cardTitle}>{copy.instructions}</Text>
              <ExerciseDetailTextList
                emptyLabel={copy.noEntries}
                items={exercise.instructions}
                styles={styles}
              />
              <Text style={styles.cardTitle}>{copy.coachingTips}</Text>
              <ExerciseDetailTextList
                emptyLabel={copy.noEntries}
                items={exercise.coachingTips}
                styles={styles}
              />
            </AppCard>
          </View>
        ) : null}

        {tab === 'history' ? (
          <View style={styles.stack}>
            {historyGroups.length === 0 ? (
              <EmptyState
                title={copy.noHistoryTitle}
                description={copy.noHistoryDescription}
              />
            ) : (
              historyGroups.map((group) => (
                <AppCard key={group.sessionId}>
                  <Text style={styles.cardTitle}>{group.workoutTitle}</Text>
                  <Text style={styles.secondaryText}>
                    {formatDate(group.finishedAt, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  {group.sets.map((set) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.bodyText}>
                        {formatWeight(set.weight)} ×{' '}
                        {formatNumber(set.reps, { maximumFractionDigits: 0 })}
                      </Text>
                      {set.actualRpe ? (
                        <Text style={styles.secondaryText}>
                          RPE {formatNumber(set.actualRpe, { maximumFractionDigits: 0 })}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </AppCard>
              ))
            )}
          </View>
        ) : null}

        {tab === 'progress' ? (
          <View style={styles.stack}>
            {progressMetrics.recentSessions.length === 0 ? (
              <EmptyState
                title={copy.noProgressTitle}
                description={copy.noProgressDescription}
              />
            ) : (
              <>
                {progressMetrics.recentComparison ? (
                  <AppCard>
                    <Text style={styles.cardTitle}>{progressCopy.latestPerformance}</Text>
                    <Text style={styles.secondaryText}>
                      {formatDate(progressMetrics.recentComparison.latest.finishedAt, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      · {progressMetrics.recentComparison.latest.workoutTitle}
                    </Text>
                    <View style={styles.metricsGrid}>
                      <MetricCard
                        label={progressCopy.latestTopSet}
                        value={formatTopSet(progressMetrics.recentComparison.latest.topSet)}
                      />
                      <MetricCard
                        label={progressCopy.previousTopSet}
                        value={
                          progressMetrics.recentComparison.previous
                            ? formatTopSet(progressMetrics.recentComparison.previous.topSet)
                            : progressCopy.notEnoughEvidence
                        }
                      />
                      <MetricCard
                        label={progressCopy.averageRpe}
                        value={
                          progressMetrics.recentComparison.latest.averageActualRpe === null
                            ? progressCopy.notRecorded
                            : formatNumber(
                                progressMetrics.recentComparison.latest.averageActualRpe,
                                { maximumFractionDigits: 1 },
                              )
                        }
                      />
                      <MetricCard
                        label={progressCopy.estimatedOneRepMaxChange}
                        value={formatPercentDelta(
                          progressMetrics.recentComparison.estimatedOneRepMaxDeltaPercent,
                        )}
                      />
                      <MetricCard
                        label={progressCopy.volumeChange}
                        value={formatPercentDelta(
                          progressMetrics.recentComparison.volumeDeltaPercent,
                        )}
                      />
                    </View>
                  </AppCard>
                ) : null}
                <View style={styles.metricsGrid}>
                  <MetricCard
                    label={copy.bestWeight}
                    value={formatWeight(progressMetrics.bestWeight)}
                  />
                  <MetricCard
                    label={copy.bestReps}
                    value={formatNumber(progressMetrics.bestReps, {
                      maximumFractionDigits: 0,
                    })}
                  />
                  <MetricCard
                    label={copy.volume}
                    value={formatVolume(progressMetrics.totalVolume)}
                  />
                  <MetricCard
                    label={copy.estimatedOneRepMax}
                    value={formatWeight(progressMetrics.estimatedOneRepMax)}
                  />
                </View>
                <AppCard>
                  <Text style={styles.cardTitle}>{progressCopy.loadTrend}</Text>
                  <ProgressTrendChart
                    emptyLabel={progressCopy.trendEmpty}
                    maxLabel={copy.high(weightUnit)}
                    minLabel={copy.low(weightUnit)}
                    points={displayLoadTrend}
                  />
                </AppCard>
                <AppCard>
                  <Text style={styles.cardTitle}>
                    {progressCopy.estimatedOneRepMaxTrend}
                  </Text>
                  <ProgressTrendChart
                    emptyLabel={progressCopy.trendEmpty}
                    maxLabel={copy.high(weightUnit)}
                    minLabel={copy.low(weightUnit)}
                    points={displayEstimatedOneRepMaxTrend}
                  />
                </AppCard>
                <AppCard>
                  <Text style={styles.cardTitle}>{copy.volumeTrend}</Text>
                  <ProgressTrendChart
                    emptyLabel={copy.volumeTrendEmpty}
                    maxLabel={copy.high(weightUnit)}
                    minLabel={copy.low(weightUnit)}
                    points={displayVolumeTrend}
                  />
                </AppCard>
              </>
            )}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
