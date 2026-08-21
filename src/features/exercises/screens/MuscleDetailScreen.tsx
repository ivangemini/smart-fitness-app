import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import { exerciseRepository, type Exercise } from '@/features/exercises';
import { MuscleMap } from '@/features/exercises/components/MuscleMap';
import { getCanonicalMuscleLabel } from '@/features/exercises/muscleLabels';
import {
  CANONICAL_MUSCLES,
  mapMuscleNamesToCanonicalIds,
  type CanonicalMuscleId,
  type MuscleHighlightMap,
} from '@/features/exercises/muscleTaxonomy';
import { useLocalization } from '@/localization';
import { getMuscleDetailCopy } from '@/localization/muscleDetailCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';

const normalizeParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default function MuscleDetailScreen() {
  const { muscleId: rawMuscleId } = useLocalSearchParams<{ muscleId?: string | string[] }>();
  const { workoutSessions } = useWorkoutState();
  const { colors } = useAppTheme();
  const { formatDate, formatNumber, locale } = useLocalization();
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getMuscleDetailCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const muscleId = normalizeParam(rawMuscleId);
  const muscle = CANONICAL_MUSCLES.find((candidate) => candidate.id === muscleId);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const next = await exerciseRepository.getAllExercises();
        if (!cancelled) {
          setExercises(next);
          setLoadState('ready');
        }
      } catch {
        if (!cancelled) setLoadState('error');
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const relevantExercises = useMemo(() => {
    if (!muscle) return [];
    return exercises.filter((exercise) => {
      const primary = mapMuscleNamesToCanonicalIds(exercise.primaryMuscles);
      const secondary = mapMuscleNamesToCanonicalIds(exercise.secondaryMuscles);
      return primary.includes(muscle.id) || secondary.includes(muscle.id);
    });
  }, [exercises, muscle]);

  const historyByExerciseId = useMemo(() => {
    const next = new Map<string, { sessionCount: number; setCount: number; lastTrainedAt: string | null }>();
    for (const exercise of relevantExercises) {
      const matchingSessions = workoutSessions
        .map((session) => ({
          session,
          sets: session.sets.filter((set) => set.completed !== false && set.exerciseId === exercise.id),
        }))
        .filter((entry) => entry.sets.length > 0);
      const lastTrainedAt = matchingSessions.reduce<string | null>((latest, entry) => {
        const value = entry.session.finishedAt || entry.session.startedAt;
        if (!latest) return value;
        return Date.parse(value) > Date.parse(latest) ? value : latest;
      }, null);
      next.set(exercise.id, {
        sessionCount: matchingSessions.length,
        setCount: matchingSessions.reduce((total, entry) => total + entry.sets.length, 0),
        lastTrainedAt,
      });
    }
    return next;
  }, [relevantExercises, workoutSessions]);

  if (!muscle) {
    return (
      <View style={[styles.invalid, { paddingBottom: insets.bottom + Spacing.four, paddingTop: insets.top + Spacing.four }]}>
        <Text style={styles.title}>{copy.invalidMuscle}</Text>
        <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  const label = getCanonicalMuscleLabel(muscle.id, locale);
  const highlights: MuscleHighlightMap = { [muscle.id]: 'primary' };
  const header = (
    <View style={styles.headerStack}>
      <SectionHeader title={label} subtitle={copy.subtitle} />
      <View style={styles.mapWrap}>
        <MuscleMap highlights={highlights} side={muscle.side} sideLabel={label} />
      </View>
      {loadState === 'loading' ? (
        <AppCard>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.detail}>{copy.loading}</Text>
        </AppCard>
      ) : null}
      {loadState === 'error' ? (
        <AppCard><Text style={styles.detail}>{copy.loadError}</Text></AppCard>
      ) : null}
      {loadState === 'ready' && relevantExercises.length === 0 ? (
        <AppCard><Text style={styles.detail}>{copy.noExercises}</Text></AppCard>
      ) : null}
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      ListFooterComponent={
        <View style={styles.footer}>
          <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
        </View>
      }
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.eight, paddingTop: insets.top + Spacing.three },
      ]}
      data={loadState === 'ready' ? relevantExercises : []}
      keyExtractor={(exercise) => exercise.id}
      renderItem={({ item }) => {
        const primary = mapMuscleNamesToCanonicalIds(item.primaryMuscles).includes(muscle.id);
        const history = historyByExerciseId.get(item.id);
        return (
          <AppCard style={styles.exerciseCard}>
            <Text selectable style={styles.exerciseName}>{item.name}</Text>
            <Text selectable style={styles.detail}>{primary ? copy.primary : copy.secondary}</Text>
            <Text selectable style={styles.detail}>
              {copy.sessions}: {formatNumber(history?.sessionCount ?? 0)} · {copy.completedSets}: {formatNumber(history?.setCount ?? 0)}
            </Text>
            <Text selectable style={styles.detail}>
              {copy.lastTrained}: {history?.lastTrainedAt ? formatDate(history.lastTrainedAt, { day: 'numeric', month: 'short', year: 'numeric' }) : copy.noHistory}
            </Text>
            <AppButton
              label={copy.openExercise}
              onPress={() => router.push({ pathname: '/exercises/[exerciseId]', params: { exerciseId: item.id } })}
              variant="secondary"
            />
          </AppCard>
        );
      }}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    />
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    content: { alignSelf: 'center', gap: Spacing.three, maxWidth: MaxContentWidth, paddingHorizontal: Spacing.three, width: '100%' },
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    exerciseCard: { gap: Spacing.two, marginTop: Spacing.three },
    exerciseName: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
    footer: { marginTop: Spacing.three },
    headerStack: { gap: Spacing.three },
    invalid: { backgroundColor: colors.background, flex: 1, gap: Spacing.three, justifyContent: 'center', paddingHorizontal: Spacing.three },
    mapWrap: { alignSelf: 'center', width: 190 },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  });