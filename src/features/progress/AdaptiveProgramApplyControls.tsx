import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Colors, Spacing } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { Workout, WorkoutPrescriptionPatch, WorkoutPrescriptionPatchStatus } from '@/types';
import { useUnitPreferences } from '@/units';

import {
  buildAdaptiveProgramPrescriptionPreview,
  type AdaptiveProgramApplyUnavailableReason,
} from './adaptiveProgramApply';
import type { AdaptiveProgramProposal } from './adaptiveProgramEngine';

const unavailableLabel = (reason: AdaptiveProgramApplyUnavailableReason, ru: boolean) => {
  const labels: Record<AdaptiveProgramApplyUnavailableReason, [string, string]> = {
    proposal_not_progress: ['Apply is disabled by the current proposal state.', 'Apply отключён текущим состоянием предложения.'],
    ambiguous_template: ['Exercise belongs to multiple exact templates.', 'Упражнение входит в несколько точных шаблонов.'],
    template_unresolved: ['Exact workout template is unavailable.', 'Точный шаблон тренировки недоступен.'],
    template_not_custom: ['Built-in templates are read-only.', 'Встроенные шаблоны доступны только для чтения.'],
    prescription_missing: ['Exact saved prescription is required.', 'Нужен точный сохранённый prescription.'],
    unsupported_finding: ['This finding has no unambiguous target field to apply.', 'У этого finding нет однозначного target-поля для применения.'],
    invalid_evidence: ['The source finding evidence is incomplete.', 'Данные исходного finding неполные.'],
    already_applied: ['This finding was already applied to the template.', 'Этот finding уже применён к шаблону.'],
    no_change: ['The bounded rule would not change the prescription.', 'Ограниченное правило не изменит prescription.'],
  };
  return labels[reason][ru ? 1 : 0];
};

export function AdaptiveProgramApplyControls({
  onApply,
  proposal,
  workouts,
}: {
  onApply: (patch: WorkoutPrescriptionPatch) => Promise<WorkoutPrescriptionPatchStatus>;
  proposal: AdaptiveProgramProposal;
  workouts: readonly Workout[];
}) {
  const { colors } = useAppTheme();
  const { formatNumber, locale } = useLocalization();
  const { formatWeightValue, weight: weightUnit } = useUnitPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ru = locale === 'ru';
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<WorkoutPrescriptionPatchStatus | null>(null);
  const previewResult = buildAdaptiveProgramPrescriptionPreview({ proposal, workouts });

  if (previewResult.status === 'unavailable') {
    if (proposal.action !== 'progress' && previewResult.reason === 'proposal_not_progress') return null;
    return <Text selectable style={styles.note}>{unavailableLabel(previewResult.reason, ru)}</Text>;
  }

  const { preview } = previewResult;
  const handleApply = async () => {
    if (applying) return;
    setApplying(true);
    setResult(null);
    const status = await onApply(preview.patch);
    setResult(status);
    setApplying(false);
    if (status === 'applied') setExpanded(false);
  };

  if (!expanded) {
    return (
      <View style={styles.controls}>
        <AppButton
          label={ru ? 'Предпросмотр изменения' : 'Preview change'}
          onPress={() => {
            setResult(null);
            setExpanded(true);
          }}
          variant="secondary"
        />
        {result === 'applied' ? (
          <Text selectable style={styles.success}>{ru ? 'Изменение применено к будущему шаблону.' : 'Change applied to the future template.'}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.preview}>
      <Text selectable style={styles.previewTitle}>{ru ? 'Предпросмотр' : 'Preview'} · {preview.templateTitle}</Text>
      <Text selectable style={styles.note}>
        {preview.strategy === 'load_ratio'
          ? ru
            ? `Вес масштабируется по подтверждённому load PR, максимум +5% за одно применение. Фактический multiplier: ${formatNumber(preview.loadMultiplier ?? 1, { maximumFractionDigits: 3 })}.`
            : `Load follows the confirmed load-PR ratio, capped at +5% for one application. Actual multiplier: ${formatNumber(preview.loadMultiplier ?? 1, { maximumFractionDigits: 3 })}.`
          : ru
            ? `Целевые повторы увеличиваются на ${formatNumber(preview.repIncrement ?? 0)}, максимум на 2 за одно применение.`
            : `Target reps increase by ${formatNumber(preview.repIncrement ?? 0)}, capped at 2 for one application.`}
      </Text>

      <View style={styles.rows}>
        {preview.rows.map((row) => (
          <View key={row.index} style={styles.row}>
            <Text selectable style={styles.rowTitle}>{ru ? 'Строка' : 'Row'} {formatNumber(row.index + 1)}</Text>
            <Text selectable style={styles.note}>
              {formatWeightValue(row.currentWeight)} {weightUnit} × {formatNumber(row.currentReps)} → {formatWeightValue(row.nextWeight)} {weightUnit} × {formatNumber(row.nextReps)} · RPE {formatNumber(row.targetRpe)}
            </Text>
          </View>
        ))}
      </View>

      <Text selectable style={styles.warning}>
        {ru
          ? 'Подтверждение изменит только сохранённые цели будущего custom template. Завершённые workout sessions и их история останутся неизменными.'
          : 'Confirmation changes only saved targets for the future custom template. Completed workout sessions and their history remain unchanged.'}
      </Text>

      {result === 'stale' ? (
        <Text selectable style={styles.warning}>{ru ? 'Шаблон изменился после предпросмотра. Открой предпросмотр заново.' : 'The template changed after preview. Reopen the preview before applying.'}</Text>
      ) : null}
      {result === 'blocked' ? (
        <Text selectable style={styles.warning}>{ru ? 'Изменение больше нельзя применить к текущему шаблону.' : 'The change can no longer be applied to the current template.'}</Text>
      ) : null}

      <View style={styles.controls}>
        <AppButton
          label={applying ? (ru ? 'Применение…' : 'Applying…') : (ru ? 'Применить к будущему шаблону' : 'Apply to future template')}
          onPress={() => { void handleApply(); }}
        />
        <AppButton
          label={ru ? 'Отмена' : 'Cancel'}
          onPress={() => {
            if (!applying) {
              setExpanded(false);
              setResult(null);
            }
          }}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  controls: { gap: Spacing.one, marginTop: Spacing.one },
  note: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  preview: { borderTopColor: colors.borderSubtle, borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.one, marginTop: Spacing.one, paddingTop: Spacing.two },
  previewTitle: { color: colors.textPrimary, fontSize: 13, fontWeight: '800' },
  row: { gap: Spacing.one },
  rowTitle: { color: colors.textPrimary, fontSize: 12, fontWeight: '700' },
  rows: { gap: Spacing.two },
  success: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', lineHeight: 17 },
  warning: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', lineHeight: 17 },
});
