import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { Spacing } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import { useLocalization } from '@/localization';
import { getWorkoutHistoryCopy } from '@/localization/workoutHistoryCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { WorkoutSafetyMetadata } from '@/types';
import { weightFromKg, useUnitPreferences } from '@/units';
import {
  buildWorkoutHistoryItemView,
  getWorkoutDurationMinutes,
  groupWorkoutSessionSets,
  type WorkoutHistoryExerciseGroup,
} from '../workoutHistoryViewModel';
import {
  buildWorkoutSafetyListRows,
  type WorkoutSafetyListRow,
} from '../workoutSafetyListModel';
import {
  createWorkoutHistoryDetailStyles,
  type WorkoutHistoryDetailStyles,
} from './workoutHistoryDetailScreen.styles';
import {
  WorkoutHistorySafetyDisclaimer,
  WorkoutHistorySafetyIssueRow,
  WorkoutHistorySafetyRestrictionRow,
  WorkoutHistorySafetySummaryCard,
} from './WorkoutHistorySafetyRows';

type WorkoutHistoryDetailRow =
  | {
      group: WorkoutHistoryExerciseGroup;
      id: string;
      kind: 'exercise';
    }
  | {
      id: 'safety-summary';
      kind: 'safety-summary';
      metadata?: WorkoutSafetyMetadata;
    }
  | WorkoutSafetyListRow
  | {
      id: 'safety-disclaimer';
      kind: 'safety-disclaimer';
    };

export default function WorkoutHistoryDetailScreen() {
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const copy = getWorkoutHistoryCopy(locale);
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createWorkoutHistoryDetailStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const session = useMemo(
    () => workoutSessions.find((item) => item.id === sessionId) ?? null,
    [sessionId, workoutSessions],
  );
  const summary = useMemo(
    () => (session ? buildWorkoutHistoryItemView(session) : null),
    [session],
  );
  const exerciseGroups = useMemo(
    () => (session ? groupWorkoutSessionSets(session) : []),
    [session],
  );
  const rows = useMemo<WorkoutHistoryDetailRow[]>(() => {
    if (!session || !summary) return [];

    const exerciseRows: WorkoutHistoryDetailRow[] = exerciseGroups.map((group) => ({
      group,
      id: `exercise:${group.exerciseId}:${group.exerciseName}`,
      kind: 'exercise',
    }));
    const metadata = session.safetyRecovery;
    const safetyRows = metadata
      ? buildWorkoutSafetyListRows(metadata.restrictions, metadata.issues)
      : [];

    return [
      ...exerciseRows,
      { id: 'safety-summary', kind: 'safety-summary', metadata },
      ...safetyRows,
      ...(metadata
        ? ([{ id: 'safety-disclaimer', kind: 'safety-disclaimer' }] as const)
        : []),
    ];
  }, [exerciseGroups, session, summary]);
  const formatVolume = (volumeKg: number) =>
    `${formatNumber(weightFromKg(volumeKg, weightUnit), {
      maximumFractionDigits: 0,
    })} ${weightUnit}`;
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return copy.durationMinutes(formatNumber(minutes, { maximumFractionDigits: 0 }));
    }
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return copy.durationHours(
      formatNumber(hours, { maximumFractionDigits: 0 }),
      remainder > 0 ? formatNumber(remainder, { maximumFractionDigits: 0 }) : null,
    );
  };
  const formatTimestamp = (value: string | null | undefined): string => {
    if (!value || !Number.isFinite(Date.parse(value))) return copy.unknownDate;
    return formatDate(value, { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <LiquidGlassIconButton
          accessibilityLabel={copy.back}
          Icon={ChevronLeft}
          onPress={() => router.back()}
        />
        <View style={styles.headerCopy}>
          <Text numberOfLines={1} style={styles.title}>
            {copy.detailsTitle}
          </Text>
          <Text style={styles.subtitle}>{copy.detailsSubtitle}</Text>
        </View>
      </View>

      <FlatList
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.eight },
        ]}
        data={rows}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.container}>
            {!session || !summary ? (
              <AppCard>
                <Text style={styles.cardTitle}>{copy.notFoundTitle}</Text>
                <Text style={styles.bodyText}>{copy.notFoundBody}</Text>
              </AppCard>
            ) : (
              <>
                <AppCard>
                  <Text style={styles.eyebrow}>{copy.completedWorkoutEyebrow}</Text>
                  <Text style={styles.workoutTitle}>{session.workoutTitle}</Text>
                  <Text style={styles.metaText}>{formatTimestamp(session.finishedAt)}</Text>
                  <View style={styles.metricGrid}>
                    <Metric
                      label={copy.duration}
                      value={formatDuration(getWorkoutDurationMinutes(session))}
                      styles={styles}
                    />
                    <Metric
                      label={copy.sets(summary.setCount, '').trim()}
                      value={formatNumber(summary.setCount, { maximumFractionDigits: 0 })}
                      styles={styles}
                    />
                    <Metric
                      label={copy.exercises}
                      value={formatNumber(summary.exerciseCount, { maximumFractionDigits: 0 })}
                      styles={styles}
                    />
                    <Metric
                      label={copy.volumeLabel}
                      value={formatVolume(summary.volume)}
                      styles={styles}
                    />
                  </View>
                  {session.notes ? (
                    <View style={styles.notesBlock}>
                      <Text style={styles.sectionTitle}>{copy.workoutNotes}</Text>
                      <Text style={styles.bodyText}>{session.notes}</Text>
                    </View>
                  ) : null}
                </AppCard>

                <AppCard>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.cardTitle}>{copy.loggedExercises}</Text>
                    <Text style={styles.metaText}>
                      {copy.total(
                        formatNumber(exerciseGroups.length, { maximumFractionDigits: 0 }),
                      )}
                    </Text>
                  </View>
                </AppCard>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => {
          if (item.kind === 'exercise') {
            const group = item.group;
            return (
              <View style={styles.exerciseListItem}>
                <AppCard>
                  <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseCopy}>
                      <Text style={styles.sectionTitle}>{group.exerciseName}</Text>
                      <Text style={styles.metaText}>
                        {copy.sets(
                          group.completedSetCount,
                          formatNumber(group.completedSetCount, { maximumFractionDigits: 0 }),
                        )}{' '}
                        · {formatVolume(group.volume)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.setTableHeader}>
                    <Text style={[styles.tableHeaderLabel, styles.setColumn]}>{copy.tableSet}</Text>
                    <Text style={styles.tableHeaderLabel}>{weightUnit.toUpperCase()}</Text>
                    <Text style={styles.tableHeaderLabel}>{copy.tableReps}</Text>
                    <Text style={styles.tableHeaderLabel}>RPE</Text>
                  </View>
                  {group.sets.map((set, index) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={[styles.setValue, styles.setColumn]}>
                        {formatNumber(index + 1, { maximumFractionDigits: 0 })}
                      </Text>
                      <Text style={styles.setValue}>{formatWeightValue(set.weight)}</Text>
                      <Text style={styles.setValue}>
                        {formatNumber(set.reps, { maximumFractionDigits: 0 })}
                      </Text>
                      <Text style={styles.setValue}>
                        {set.actualRpe === undefined
                          ? '—'
                          : formatNumber(set.actualRpe, { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                  ))}
                </AppCard>
              </View>
            );
          }

          if (item.kind === 'safety-summary') {
            return (
              <View style={styles.exerciseListItem}>
                <WorkoutHistorySafetySummaryCard
                  metadata={item.metadata}
                  styles={styles}
                  colors={colors}
                />
              </View>
            );
          }

          if (item.kind === 'restriction') {
            return (
              <View style={styles.exerciseListItem}>
                <WorkoutHistorySafetyRestrictionRow
                  colors={colors}
                  index={item.index}
                  restriction={item.restriction}
                  styles={styles}
                />
              </View>
            );
          }

          if (item.kind === 'issue') {
            return (
              <View style={styles.exerciseListItem}>
                <WorkoutHistorySafetyIssueRow
                  colors={colors}
                  index={item.index}
                  issue={item.issue}
                  styles={styles}
                />
              </View>
            );
          }

          return (
            <View style={styles.exerciseListItem}>
              <WorkoutHistorySafetyDisclaimer styles={styles} />
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function Metric({
  label,
  styles,
  value,
}: {
  label: string;
  styles: WorkoutHistoryDetailStyles;
  value: string;
}) {
  return (
    <View style={styles.metricCell}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}
