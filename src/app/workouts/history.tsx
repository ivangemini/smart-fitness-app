import { useMemo, useState } from 'react';
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WorkoutHistorySessionCard } from '@/components/workouts/WorkoutHistorySessionCard';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppActions, useWorkoutState } from '@/context/AppContext';
import { getSessionExercises, getSessionVolume } from '@/lib/workouts';
import { useLocalization } from '@/localization';
import { getWorkoutHistoryCopy } from '@/localization/workoutHistoryCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { WorkoutSession } from '@/types';
import { parseDisplayNumber, useUnitPreferences, weightToKg } from '@/units';

const isSameLocalDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

type WorkoutHistorySection = {
  title: string;
  data: WorkoutSession[];
};

export default function WorkoutHistoryRoute() {
  const { deleteWorkoutSession, updateWorkoutSession } = useAppActions();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight } = useUnitPreferences();
  const { colors } = useAppTheme();
  const copy = getWorkoutHistoryCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [editingSessionId, setEditingSessionId] = useState<string | undefined>();
  const [editingSessionSetId, setEditingSessionSetId] = useState<string | undefined>();
  const [sessionDraftSets, setSessionDraftSets] = useState<WorkoutSession['sets']>([]);
  const [sessionExerciseName, setSessionExerciseName] = useState('');
  const [sessionReps, setSessionReps] = useState('');
  const [sessionWeight, setSessionWeight] = useState('');
  const insets = useSafeAreaInsets();

  const completedSessions = useMemo(
    () =>
      [...workoutSessions].sort((left, right) =>
        right.finishedAt.localeCompare(left.finishedAt),
      ),
    [workoutSessions],
  );
  const sections = useMemo<WorkoutHistorySection[]>(() => {
    const groups = new Map<string, WorkoutSession[]>();
    completedSessions.forEach((session) => {
      const key = formatDate(session.finishedAt, { month: 'long', year: 'numeric' });
      groups.set(key, [...(groups.get(key) ?? []), session]);
    });
    return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
  }, [completedSessions, formatDate]);

  const formatFinishedAt = (finishedAt: string) => {
    const date = new Date(finishedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const time = formatDate(date, { hour: 'numeric', minute: '2-digit' });
    if (isSameLocalDay(date, today)) return `${copy.today}, ${time}`;
    if (isSameLocalDay(date, yesterday)) return `${copy.yesterday}, ${time}`;
    return formatDate(date, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const resetSetEditor = () => {
    setEditingSessionSetId(undefined);
    setSessionExerciseName('');
    setSessionReps('');
    setSessionWeight('');
  };

  const handleEditSession = (session: WorkoutSession) => {
    setEditingSessionId(session.id);
    setSessionDraftSets(session.sets.map((set) => ({ ...set })));
    resetSetEditor();
  };

  const handleEditSessionSet = (set: WorkoutSession['sets'][number]) => {
    setEditingSessionSetId(set.id);
    setSessionExerciseName(set.exerciseName);
    setSessionReps(String(set.reps));
    setSessionWeight(formatWeightValue(set.weight));
  };

  const handleSaveSessionSet = () => {
    if (!editingSessionId || sessionExerciseName.trim().length === 0) {
      Alert.alert(copy.editWorkout, copy.exerciseRequired);
      return;
    }
    const displayWeight = parseDisplayNumber(sessionWeight);
    const reps = Number.parseInt(sessionReps, 10);
    if (!Number.isFinite(displayWeight) || displayWeight < 0 || !Number.isSafeInteger(reps) || reps < 1) {
      Alert.alert(copy.editWorkout, copy.validWeightReps);
      return;
    }

    const weightKg = weightToKg(displayWeight, weight);
    const slug = sessionExerciseName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const nextSet = {
      id: editingSessionSetId ?? `${editingSessionId}-${Date.now()}`,
      exerciseId: editingSessionSetId ?? `${slug || editingSessionId}-${Date.now()}`,
      exerciseName: sessionExerciseName.trim(),
      reps,
      weight: weightKg,
    };

    setSessionDraftSets((current) =>
      editingSessionSetId
        ? current.map((set) => (set.id === editingSessionSetId ? nextSet : set))
        : [...current, nextSet],
    );
    resetSetEditor();
  };

  const handleSaveSessionChanges = (session: WorkoutSession) => {
    if (sessionDraftSets.length === 0) {
      Alert.alert(copy.editWorkout, copy.addSetBeforeSaving);
      return;
    }
    updateWorkoutSession(session.id, { ...session, sets: sessionDraftSets });
    setEditingSessionId(undefined);
    setSessionDraftSets([]);
    resetSetEditor();
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(copy.deleteWorkout, copy.deleteWorkoutBody, [
      { text: copy.cancel, style: 'cancel' },
      {
        text: copy.delete,
        style: 'destructive',
        onPress: () => deleteWorkoutSession(sessionId),
      },
    ]);
  };

  const handleCancelSessionEdit = () => {
    setEditingSessionId(undefined);
    setSessionDraftSets([]);
    resetSetEditor();
  };

  const renderSession = ({ item: session }: { item: WorkoutSession }) => {
    const isEditingSession = editingSessionId === session.id;
    const visibleSets = isEditingSession ? sessionDraftSets : session.sets;
    const sessionExercises = getSessionExercises({ ...session, sets: visibleSets });
    const sessionVolume = getSessionVolume({ ...session, sets: visibleSets });

    return (
      <View style={styles.container}>
        <WorkoutHistorySessionCard
          editingSessionSetId={editingSessionSetId}
          formatFinishedAt={formatFinishedAt}
          isEditing={isEditingSession}
          onCancelSessionEdit={handleCancelSessionEdit}
          onCancelSessionSetEdit={resetSetEditor}
          onDeleteSession={() => handleDeleteSession(session.id)}
          onDeleteSessionSet={(setId) =>
            setSessionDraftSets((current) => current.filter((set) => set.id !== setId))
          }
          onEditSession={() => handleEditSession(session)}
          onEditSessionSet={handleEditSessionSet}
          onSaveSessionChanges={() => handleSaveSessionChanges(session)}
          onSaveSessionSet={handleSaveSessionSet}
          onSessionExerciseNameChange={setSessionExerciseName}
          onSessionRepsChange={setSessionReps}
          onSessionWeightChange={setSessionWeight}
          session={session}
          sessionExerciseName={sessionExerciseName}
          sessionExercises={sessionExercises}
          sessionReps={sessionReps}
          sessionVolume={sessionVolume}
          sessionWeight={sessionWeight}
          visibleSets={visibleSets}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <SectionList
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.six },
        ]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(session) => session.id}
        ListEmptyComponent={
          <View style={styles.container}>
            <EmptyState compact message={copy.emptyMessage} title={copy.emptyTitle} />
          </View>
        }
        ListHeaderComponent={
          <View style={styles.container}>
            <SectionHeader subtitle={copy.subtitle} title={copy.title} />
          </View>
        }
        renderItem={renderSession}
        renderSectionHeader={({ section }) => (
          <View style={styles.container}>
            <AppCard>
              <Text selectable style={styles.monthTitle}>
                {section.title}
              </Text>
              <Text selectable style={styles.monthMeta}>
                {copy.sessions(
                  section.data.length,
                  formatNumber(section.data.length, { maximumFractionDigits: 0 }),
                )}
              </Text>
            </AppCard>
          </View>
        )}
        sections={sections}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        style={styles.list}
      />
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      gap: Spacing.two,
      padding: Spacing.three,
    },
    list: {
      backgroundColor: colors.background,
      flex: 1,
    },
    monthMeta: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    monthTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '900',
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
  });
