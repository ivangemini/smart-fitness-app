import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing } from '@/constants/theme';
import { exerciseRepository, type Exercise } from '@/features/exercises';
import { MuscleMap } from '@/features/exercises/components/MuscleMap';
import { getCanonicalMuscleLabel } from '@/features/exercises/muscleLabels';
import type { CanonicalMuscleId, MuscleHighlightMap } from '@/features/exercises/muscleTaxonomy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { WorkoutSession } from '@/types';
import { useUnitPreferences, weightFromKg } from '@/units';

import { getTrainingIntelligenceCopy } from './trainingIntelligenceCopy';
import {
  buildCanonicalTrainingIntelligence,
  type TrainingFinding,
  type TrainingIntelligenceWindowDays,
} from './trainingIntelligence';

export function TrainingIntelligenceSection({
  endAt,
  windowDays,
  workoutSessions,
}: {
  endAt: string;
  windowDays: TrainingIntelligenceWindowDays;
  workoutSessions: WorkoutSession[];
}) {
  const { colors } = useAppTheme();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { weight: weightUnit } = useUnitPreferences();
  const copy = useMemo(() => getTrainingIntelligenceCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
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

  const analytics = useMemo(
    () =>
      loadState === 'ready'
        ? buildCanonicalTrainingIntelligence({ exercises, sessions: workoutSessions, endAt, windowDays })
        : null,
    [endAt, exercises, loadState, windowDays, workoutSessions],
  );
  const activeFacts = useMemo(
    () =>
      analytics?.muscleLoad
        .filter((fact) => fact.primarySets > 0 || fact.secondarySets > 0)
        .sort((a, b) => b.primaryVolume - a.primaryVolume || b.primarySets - a.primarySets)
        .slice(0, 6) ?? [],
    [analytics],
  );
  const availableMuscleIds = useMemo(
    () => analytics?.muscleLoad.filter((fact) => fact.lastTrainedAt).map((fact) => fact.id) ?? [],
    [analytics],
  );
  const maxVolume = Math.max(0, ...(analytics?.muscleLoad.map((fact) => fact.primaryVolume) ?? []));
  const maxPrimarySets = Math.max(0, ...(analytics?.muscleLoad.map((fact) => fact.primarySets) ?? []));
  const highlights = useMemo<MuscleHighlightMap>(() => {
    const next: MuscleHighlightMap = {};
    for (const fact of analytics?.muscleLoad ?? []) {
      if (fact.primarySets > 0) next[fact.id] = 'primary';
      else if (fact.secondarySets > 0) next[fact.id] = 'secondary';
    }
    return next;
  }, [analytics]);
  const intensities = useMemo<Partial<Record<CanonicalMuscleId, number>>>(() => {
    const next: Partial<Record<CanonicalMuscleId, number>> = {};
    for (const fact of analytics?.muscleLoad ?? []) {
      if (fact.primarySets > 0) {
        next[fact.id] = maxVolume > 0 ? fact.primaryVolume / maxVolume : fact.primarySets / Math.max(1, maxPrimarySets);
      } else if (fact.secondarySets > 0) {
        next[fact.id] = 0.35;
      }
    }
    return next;
  }, [analytics, maxPrimarySets, maxVolume]);

  const formatWeight = (value: number) =>
    `${formatNumber(weightFromKg(value, weightUnit), { maximumFractionDigits: 1 })} ${weightUnit}`;
  const formatVolume = (value: number) =>
    `${formatNumber(weightFromKg(value, weightUnit), { maximumFractionDigits: 0 })} ${weightUnit}·reps`;
  const openMuscle = (muscleId: CanonicalMuscleId) =>
    router.push({ pathname: '/muscles/[muscleId]', params: { muscleId } });
  const evidenceText = (finding: TrainingFinding) => {
    const evidence = finding.evidence;
    if (finding.kind === 'new_pr' && finding.prType === 'reps') {
      return `${formatWeight(Number(evidence.load))}: ${formatNumber(Number(evidence.previousBestReps))} → ${formatNumber(Number(evidence.newBestReps))} ${copy.repsShort}`;
    }
    if (finding.kind === 'new_pr' && finding.prType === 'session_volume') {
      return `${formatVolume(Number(evidence.previousBest))} → ${formatVolume(Number(evidence.newBest))}`;
    }
    if (finding.kind === 'new_pr') {
      return `${formatWeight(Number(evidence.previousBest))} → ${formatWeight(Number(evidence.newBest))}${finding.prType === 'estimated_1rm' ? ' e1RM' : ''}`;
    }
    if (finding.kind === 'plateau') {
      return `${formatWeight(Number(evidence.lowEstimated1Rm))}–${formatWeight(Number(evidence.highEstimated1Rm))} e1RM · ${formatNumber(Number(evidence.exposureCount))} ${copy.exposures}`;
    }
    if (finding.kind === 'rep_progression') {
      return `${formatWeight(Number(evidence.load))}: ${formatNumber(Number(evidence.firstReps))} → ${formatNumber(Number(evidence.latestReps))} ${copy.repsShort}`;
    }
    if (finding.kind === 'regression') {
      return `${formatWeight(Number(evidence.firstEstimated1Rm))} → ${formatWeight(Number(evidence.latestEstimated1Rm))} e1RM`;
    }
    if (finding.kind === 'volume_spike') {
      return `${formatVolume(Number(evidence.previous7DayVolume))} → ${formatVolume(Number(evidence.current7DayVolume))}`;
    }
    if (finding.kind === 'muscle_exposure_imbalance') {
      return `${formatNumber(Number(evidence.topPrimarySets))} vs ${copy.median} ${formatNumber(Number(evidence.medianActiveMusclePrimarySets))} ${copy.primarySetsEvidence}`;
    }
    if (finding.kind === 'muscle_gap' || finding.kind === 'exercise_gap') {
      return `${formatNumber(Number(evidence.gapDays))} ${copy.days} · ${formatDate(String(evidence.lastTrainedAt), { day: 'numeric', month: 'short' })}`;
    }
    return finding.rulesetVersion;
  };

  return (
    <View style={styles.stack}>
      <AppCard>
        <Text selectable style={styles.title}>{copy.title}</Text>
        <Text selectable style={styles.detail}>{copy.subtitle}</Text>
        <Text selectable style={styles.sectionTitle}>{copy.muscleLoad}</Text>
        <Text selectable style={styles.detail}>{copy.muscleLoadHint}</Text>
        {loadState === 'loading' ? <Text selectable style={styles.detail}>{copy.loading}</Text> : null}
        {loadState === 'error' ? <Text selectable style={styles.detail}>{copy.unavailable}</Text> : null}
        {analytics && activeFacts.length === 0 ? <Text selectable style={styles.detail}>{copy.noMappedData}</Text> : null}
        {analytics && activeFacts.length > 0 ? (
          <>
            <View style={styles.maps}>
              <MuscleMap
                availableMuscleIds={availableMuscleIds}
                compact
                highlights={highlights}
                intensities={intensities}
                onMusclePress={openMuscle}
                side="front"
                sideLabel={copy.front}
              />
              <MuscleMap
                availableMuscleIds={availableMuscleIds}
                compact
                highlights={highlights}
                intensities={intensities}
                onMusclePress={openMuscle}
                side="back"
                sideLabel={copy.back}
              />
            </View>
            <View style={styles.rows}>
              {activeFacts.map((fact) => (
                <View key={fact.id} style={styles.row}>
                  <Text selectable style={styles.rowTitle}>{getCanonicalMuscleLabel(fact.id, locale)}</Text>
                  <Text selectable style={styles.detail}>
                    {formatNumber(fact.primarySets)} {copy.primarySets} · {formatNumber(fact.secondarySets)} {copy.secondarySets} · {formatNumber(fact.exposureSessions)} {copy.sessions}
                  </Text>
                  <Text selectable style={styles.detail}>
                    {copy.mappedVolume}: {formatVolume(fact.primaryVolume)} · {fact.volumeChangePercent === null ? copy.newWindowData : `${fact.volumeChangePercent > 0 ? '+' : ''}${formatNumber(fact.volumeChangePercent, { maximumFractionDigits: 1 })}% ${copy.previousWindow}`}
                  </Text>
                </View>
              ))}
            </View>
            <Text selectable style={styles.detail}>
              {copy.mappedExercises}: {formatNumber(analytics.mappedExerciseCount)} · {copy.unmappedSets}: {formatNumber(analytics.unmappedWorkingSetCount)}
            </Text>
          </>
        ) : null}
      </AppCard>

      <AppCard>
        <Text selectable style={styles.title}>{copy.findings}</Text>
        <Text selectable style={styles.detail}>{copy.findingsHint}</Text>
        {analytics && analytics.findings.length > 0 ? (
          <View style={styles.rows}>
            {analytics.findings.map((finding) => (
              <View key={finding.id} style={styles.row}>
                <Text selectable style={styles.rowTitle}>{copy.findingTitle(finding.kind, finding.prType)}</Text>
                {finding.exerciseName ? <Text selectable style={styles.detail}>{finding.exerciseName}</Text> : null}
                {finding.muscleId ? <Text selectable style={styles.detail}>{getCanonicalMuscleLabel(finding.muscleId, locale)}</Text> : null}
                <Text selectable style={styles.detail}>{copy.evidence}: {evidenceText(finding)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text selectable style={styles.detail}>{copy.noFindings}</Text>
        )}
      </AppCard>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    maps: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
    row: { borderTopColor: colors.borderSubtle, borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.one, paddingTop: Spacing.two },
    rowTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
    rows: { gap: Spacing.two, marginTop: Spacing.two },
    sectionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '800', marginTop: Spacing.three },
    stack: { gap: Spacing.three },
    title: { color: colors.textPrimary, fontSize: 17, fontWeight: '800', marginBottom: Spacing.one },
  });