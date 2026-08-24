import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { getTrainerCollaborationC3Copy } from './trainerCollaborationC3Copy';
import type { TrainerEvidence } from './trainerCollaborationC3Model';

type TrainerEvidenceViewProps = {
  evidence: TrainerEvidence;
  locale: string;
};

type Fact = { label: string; value: string };

const formatTimestamp = (value: string, locale: string) =>
  new Date(value).toLocaleString(locale, {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const optional = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === '' ? '—' : String(value);

function EvidenceRecord({ facts, title }: { facts: Fact[]; title: string }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.record}>
      <Text style={styles.recordTitle}>{title}</Text>
      {facts.map((fact) => (
        <View key={`${fact.label}-${fact.value}`} style={styles.factRow}>
          <Text style={styles.factLabel}>{fact.label}</Text>
          <Text style={styles.factValue}>{fact.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function TrainerEvidenceView({ evidence, locale }: TrainerEvidenceViewProps) {
  const { colors } = useAppTheme();
  const copy = useMemo(() => getTrainerCollaborationC3Copy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const f = copy.fields;

  if (evidence.scope === 'workout_history_summary') {
    if (evidence.data.length === 0) return <Text style={styles.empty}>{copy.evidenceEmpty}</Text>;
    return (
      <View style={styles.list}>
        {evidence.data.map((item) => (
          <EvidenceRecord
            facts={[
              { label: f.date, value: formatTimestamp(item.startedAt, locale) },
              { label: f.duration, value: `${optional(item.durationMinutes)} min` },
              { label: f.exercises, value: String(item.exerciseCount) },
              { label: f.sets, value: String(item.completedSetCount) },
              { label: f.volume, value: String(item.volume) },
            ]}
            key={item.sessionId}
            title={formatTimestamp(item.startedAt, locale)}
          />
        ))}
      </View>
    );
  }

  if (evidence.scope === 'workout_templates') {
    if (evidence.data.length === 0) return <Text style={styles.empty}>{copy.evidenceEmpty}</Text>;
    return (
      <View style={styles.list}>
        {evidence.data.map((item) => (
          <EvidenceRecord
            facts={[
              { label: f.goal, value: optional(item.goal) },
              { label: f.difficulty, value: optional(item.difficulty) },
              { label: f.weeks, value: optional(item.durationWeeks) },
              { label: f.cadence, value: optional(item.cadencePerWeek) },
            ]}
            key={item.id}
            title={item.name}
          />
        ))}
      </View>
    );
  }

  if (evidence.scope === 'training_programs') {
    if (evidence.data.length === 0) return <Text style={styles.empty}>{copy.evidenceEmpty}</Text>;
    return (
      <View style={styles.list}>
        {evidence.data.map((item) => (
          <EvidenceRecord
            facts={[
              { label: f.goal, value: optional(item.goal) },
              { label: f.difficulty, value: optional(item.difficulty) },
              { label: f.weeks, value: optional(item.durationWeeks) },
              { label: f.active, value: item.isActive ? f.yes : f.no },
              {
                label: f.date,
                value: item.startedAt ? formatTimestamp(item.startedAt, locale) : '—',
              },
            ]}
            key={item.id}
            title={item.name}
          />
        ))}
      </View>
    );
  }

  if (evidence.scope === 'progress_summary') {
    if (evidence.data.weights.length === 0 && evidence.data.measurements.length === 0) {
      return <Text style={styles.empty}>{copy.evidenceEmpty}</Text>;
    }
    return (
      <View style={styles.list}>
        {evidence.data.weights.map((item) => (
          <EvidenceRecord
            facts={[
              { label: f.date, value: formatTimestamp(item.measuredAt, locale) },
              { label: f.weight, value: `${item.value} ${item.unit}` },
            ]}
            key={item.id}
            title={f.weight}
          />
        ))}
        {evidence.data.measurements.map((item) => (
          <EvidenceRecord
            facts={[
              { label: f.date, value: formatTimestamp(item.measuredAt, locale) },
              {
                label: f.measurement,
                value: `${optional(item.bodyPart || item.measurementType)} · ${item.value} ${item.unit}`,
              },
            ]}
            key={item.id}
            title={optional(item.bodyPart || item.measurementType)}
          />
        ))}
      </View>
    );
  }

  if (evidence.data.length === 0) return <Text style={styles.empty}>{copy.evidenceEmpty}</Text>;
  return (
    <View style={styles.list}>
      {evidence.data.map((item) => (
        <EvidenceRecord
          facts={[
            { label: f.date, value: formatTimestamp(item.recordedAt, locale) },
            { label: f.sleepDuration, value: optional(item.sleepDurationHours) },
            { label: f.sleepQuality, value: optional(item.sleepQuality) },
            { label: f.fatigue, value: optional(item.fatigue) },
            { label: f.soreness, value: optional(item.soreness) },
            { label: f.stress, value: optional(item.stress) },
            { label: f.painInterference, value: optional(item.painInterference) },
            { label: f.readiness, value: optional(item.readiness) },
          ]}
          key={item.id}
          title={formatTimestamp(item.recordedAt, locale)}
        />
      ))}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    empty: {
      color: colors.textMuted,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    factLabel: { color: colors.textMuted, flex: 1, fontSize: 12, lineHeight: 18 },
    factRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    factValue: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'right',
    },
    list: { gap: Spacing.three },
    record: {
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: Spacing.one,
      paddingTop: Spacing.three,
    },
    recordTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  });
