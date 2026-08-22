import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutSet } from '@/context/AppContext';
import { Colors } from '@/constants/theme';
import { buildWorkoutAssistantSetGuides } from '@/features/workouts/workoutAssistantGuide';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { WorkoutPrescriptionSet } from '@/types';
import { displayWeightInputToKg, formatWeightValue, useUnitPreferences } from '@/units';

import { SessionEmptySets } from './SessionEmptySets';
import { SessionSetRow } from './SessionSetRow';
import { SESSION_TABLE_COLUMNS, SESSION_TABLE_GAPS, SESSION_TABLE_TOTAL_WIDTH } from './sessionTableLayout';
import type { SessionDraftInputs } from './types';

type SessionSetTableProps = {
  draftInputs: SessionDraftInputs;
  exerciseId: string;
  onCommitRowInputs: (setId: string) => void;
  onEditSetRpe: (setId: string) => void;
  onLongPressRow: (setId: string) => void;
  onPlannedRepsChange: (index: number, value: string) => void;
  onPlannedToggleSetCompletion: (index: number) => void;
  onPlannedWeightChange: (index: number, value: string) => void;
  onRepsChange: (setId: string, value: string) => void;
  onToggleSetCompletion: (setId: string) => void;
  onWeightChange: (setId: string, value: string) => void;
  plannedTargetReps?: number;
  prescription?: readonly WorkoutPrescriptionSet[];
  previousSets?: Array<{ actualRpe?: WorkoutSet['actualRpe']; reps: number; weight: number }>;
  sets: WorkoutSet[];
  targetSetCount: number;
};

export const SessionSetTable = memo(function SessionSetTable({
  draftInputs,
  exerciseId,
  onCommitRowInputs,
  onEditSetRpe,
  onLongPressRow,
  onPlannedRepsChange,
  onPlannedToggleSetCompletion,
  onPlannedWeightChange,
  onRepsChange,
  onToggleSetCompletion,
  onWeightChange,
  plannedTargetReps,
  prescription = [],
  previousSets = [],
  sets,
  targetSetCount,
}: SessionSetTableProps) {
  const { colors } = useAppTheme();
  const { formatNumber, t } = useLocalization();
  const { weight: weightUnit } = useUnitPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const warmupSets = sets.filter((set) => set.setType === 'warmup');
  const workingSets = sets.filter((set) => set.setType !== 'warmup');
  const prescriptionSetCount = prescription.filter((set) => set.exerciseId === exerciseId).length;
  const workingRowCount = Math.max(workingSets.length, targetSetCount, prescriptionSetCount);
  const guides = useMemo(
    () =>
      buildWorkoutAssistantSetGuides({
        exerciseId,
        plannedTargetReps,
        prescription,
        previousSets,
        rowCount: workingRowCount,
      }),
    [exerciseId, plannedTargetReps, prescription, previousSets, workingRowCount],
  );
  const previousLabel = (index: number) => {
    const previous = guides[index]?.previous;
    if (!previous) return '—';
    const rpe = previous.actualRpe !== undefined
      ? ` @${formatNumber(previous.actualRpe, { maximumFractionDigits: 1 })}`
      : '';
    return `${formatWeightValue(previous.weight, weightUnit)}×${formatNumber(previous.reps, { maximumFractionDigits: 0 })}${rpe}`;
  };
  const targetValue = (index: number) => {
    const guide = guides[index];
    if (!guide) return undefined;
    const weight = guide.targetWeight !== null
      ? formatWeightValue(guide.targetWeight, weightUnit)
      : undefined;
    const reps = guide.targetReps !== null
      ? formatNumber(guide.targetReps, { maximumFractionDigits: 0 })
      : undefined;
    return weight || reps ? { weight, reps } : undefined;
  };
  const renderStoredSet = (set: WorkoutSet, index: number, workingIndex?: number) => {
    const canonicalDraft = draftInputs[set.id] ?? {
      reps: `${set.reps}`,
      weight: `${set.weight}`,
    };
    const numericWeight = Number(canonicalDraft.weight);
    const displayDraft = {
      reps: canonicalDraft.reps,
      weight: Number.isFinite(numericWeight)
        ? formatWeightValue(numericWeight, weightUnit)
        : canonicalDraft.weight,
    };

    return (
      <SessionSetRow
        key={set.id}
        completed={set.completed !== false}
        draftValue={displayDraft}
        index={index}
        actualRpe={set.actualRpe}
        onCommit={() => onCommitRowInputs(set.id)}
        onEditRpe={() => onEditSetRpe(set.id)}
        onLongPress={() => onLongPressRow(set.id)}
        onRepsChange={(value) => onRepsChange(set.id, value)}
        onToggle={() => onToggleSetCompletion(set.id)}
        onWeightChange={(value) =>
          onWeightChange(set.id, displayWeightInputToKg(value, weightUnit))
        }
        previousLabel={workingIndex === undefined ? '—' : previousLabel(workingIndex)}
        setType={set.setType}
        supersetLinked={Boolean(set.supersetId)}
        targetValue={workingIndex === undefined ? undefined : targetValue(workingIndex)}
      />
    );
  };

  if (warmupSets.length === 0 && workingRowCount === 0) return <SessionEmptySets />;

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={[styles.headerCell, styles.colSet]}>
          <Text style={styles.headerText}>{t('workouts.session.set')}</Text>
        </View>
        <View style={[styles.headerCell, styles.colPrevious, styles.headerCellPrevious]}>
          <Text numberOfLines={1} style={styles.headerText}>
            {t('workouts.session.previous')}
          </Text>
        </View>
        <View style={[styles.headerCell, styles.colWeight, styles.headerCellWeight]}>
          <Text numberOfLines={1} style={styles.headerText}>
            {weightUnit}
          </Text>
        </View>
        <View style={[styles.headerCell, styles.colReps, styles.headerCellReps]}>
          <Text numberOfLines={1} style={styles.headerText}>
            {t('workouts.session.reps')}
          </Text>
        </View>
        <View style={[styles.headerCell, styles.colCompletion, styles.headerCellCompletion]}>
          <Text style={styles.headerText}>✓</Text>
        </View>
      </View>

      <View style={styles.tableBody}>
        {warmupSets.map((set, index) => renderStoredSet(set, index))}
        {Array.from({ length: workingRowCount }, (_, index) => {
          const set = workingSets[index];
          if (set) return renderStoredSet(set, index, index);

          return (
            <SessionSetRow
              key={`planned-${index}`}
              completed={false}
              draftValue={{ reps: '', weight: '' }}
              index={index}
              onCommit={() => undefined}
              onLongPress={() => undefined}
              onRepsChange={(value) => onPlannedRepsChange(index, value)}
              onToggle={() => onPlannedToggleSetCompletion(index)}
              onWeightChange={(value) =>
                onPlannedWeightChange(index, displayWeightInputToKg(value, weightUnit))
              }
              previousLabel={previousLabel(index)}
              targetValue={targetValue(index)}
            />
          );
        })}
      </View>
    </View>
  );
});

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    colCompletion: { width: SESSION_TABLE_COLUMNS.completion },
    colPrevious: {
      alignItems: 'flex-start',
      flexBasis: 0,
      flexGrow: SESSION_TABLE_COLUMNS.previous,
      minWidth: 0,
    },
    colReps: {
      flexBasis: 0,
      flexGrow: SESSION_TABLE_COLUMNS.reps,
      minWidth: 0,
    },
    colSet: { width: SESSION_TABLE_COLUMNS.set },
    colWeight: {
      flexBasis: 0,
      flexGrow: SESSION_TABLE_COLUMNS.weight,
      minWidth: 0,
    },
    headerCell: { alignItems: 'center' },
    headerText: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: 13,
      fontWeight: '500',
      lineHeight: 18,
      textAlign: 'center',
    },
    table: {
      alignSelf: 'center',
      gap: 8,
      maxWidth: SESSION_TABLE_TOTAL_WIDTH,
      width: '100%',
    },
    tableBody: { gap: 0 },
    tableHeader: {
      alignItems: 'center',
      columnGap: 0,
      flexDirection: 'row',
      minHeight: 22,
      width: '100%',
    },
    headerCellPrevious: { marginLeft: SESSION_TABLE_GAPS.setToPrevious },
    headerCellWeight: { marginLeft: SESSION_TABLE_GAPS.previousToWeight },
    headerCellReps: { marginLeft: SESSION_TABLE_GAPS.weightToReps },
    headerCellCompletion: { marginLeft: SESSION_TABLE_GAPS.repsToCompletion },
  });
