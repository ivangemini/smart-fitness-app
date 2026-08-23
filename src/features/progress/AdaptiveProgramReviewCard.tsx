import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing } from '@/constants/theme';
import { getCanonicalMuscleLabel } from '@/features/exercises/muscleLabels';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { Workout, WorkoutPrescriptionPatch, WorkoutPrescriptionPatchStatus } from '@/types';

import { AdaptiveProgramApplyControls } from './AdaptiveProgramApplyControls';
import { AdaptiveProgramCoachExplanation } from './AdaptiveProgramCoachExplanation';
import type {
  AdaptiveProgramAction,
  AdaptiveProgramReview,
  RecoveryModifierEvidence,
} from './adaptiveProgramEngine';
import type { AdaptiveRecoveryEvidence } from './adaptiveRecoveryEvidence';
import { getTrainingIntelligenceCopy } from './trainingIntelligenceCopy';

const actionLabel = (action: AdaptiveProgramAction, ru: boolean) => {
  const labels: Record<AdaptiveProgramAction, [string, string]> = {
    progress: ['Progress next exposure', 'Прогрессировать на следующей тренировке'],
    maintain: ['Maintain current progression', 'Сохранить текущую прогрессию'],
    review: ['Review before progressing', 'Пересмотреть перед прогрессией'],
  };
  return labels[action][ru ? 1 : 0];
};

const recoveryLabel = (recovery: RecoveryModifierEvidence, ru: boolean) => {
  if (recovery.state === 'unknown') return ru ? 'Нет свежего check-in' : 'No fresh check-in';
  if (recovery.state === 'neutral') return ru ? 'Без ограничивающих сигналов' : 'No limiting signals';
  if (recovery.state === 'strong_caution') return ru ? 'Выраженные self-reported сигналы' : 'Strong self-reported caution signals';
  return ru ? 'Есть self-reported сигналы' : 'Self-reported caution signals present';
};

const signalLabel = (signal: RecoveryModifierEvidence['signals'][number], ru: boolean) => {
  const labels: Record<RecoveryModifierEvidence['signals'][number], [string, string]> = {
    short_sleep: ['short sleep', 'короткий сон'],
    low_sleep_quality: ['low sleep quality', 'низкое качество сна'],
    high_fatigue: ['high fatigue', 'высокая усталость'],
    high_soreness: ['high soreness', 'высокая болезненность мышц'],
    high_stress: ['high stress', 'высокий стресс'],
    pain_interference: ['pain interference', 'влияние боли'],
    low_self_reported_readiness: ['low self-reported readiness', 'низкая субъективная готовность'],
  };
  return labels[signal][ru ? 1 : 0];
};

const valueOrDash = (value: number | null, formatNumber: (value: number) => string) =>
  value === null ? '—' : formatNumber(value);

export function AdaptiveProgramReviewCard({
  evidence,
  onApplyPrescriptionPatch,
  review,
  workouts,
}: {
  evidence: AdaptiveRecoveryEvidence;
  onApplyPrescriptionPatch: (patch: WorkoutPrescriptionPatch) => Promise<WorkoutPrescriptionPatchStatus>;
  review: AdaptiveProgramReview;
  workouts: readonly Workout[];
}) {
  const { colors } = useAppTheme();
  const { formatDate, formatNumber, locale } = useLocalization();
  const ru = locale === 'ru';
  const copy = useMemo(() => getTrainingIntelligenceCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const format = (value: number) => formatNumber(value, { maximumFractionDigits: 1 });

  return (
    <AppCard>
      <Text selectable style={styles.title}>{ru ? 'Адаптивная программа' : 'Adaptive program'}</Text>
      <Text selectable style={styles.detail}>
        {ru
          ? 'Детерминированные предложения из истории прогресса и свежего self-reported recovery check-in. Изменения шаблона требуют отдельного предпросмотра и подтверждения.'
          : 'Deterministic proposals from progress history and a fresh self-reported recovery check-in. Template changes require a separate preview and confirmation.'}
      </Text>

      <Text selectable style={styles.sectionTitle}>Recovery modifier</Text>
      <Text selectable style={styles.rowTitle}>{recoveryLabel(review.recovery, ru)}</Text>
      {review.recovery.recordedAt ? (
        <Text selectable style={styles.detail}>
          {formatDate(review.recovery.recordedAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
        </Text>
      ) : null}
      {review.recovery.signals.length > 0 ? (
        <Text selectable style={styles.detail}>
          {review.recovery.signals.map((signal) => signalLabel(signal, ru)).join(' · ')}
        </Text>
      ) : null}
      <Text selectable style={styles.disclaimer}>
        {ru
          ? 'Это модификатор программирования по введённым пользователем данным, а не медицинская оценка и не единый readiness score.'
          : 'This is a programming modifier from user-entered data, not a medical assessment or a universal readiness score.'}
      </Text>

      <Text selectable style={styles.sectionTitle}>{ru ? 'Данные check-in' : 'Check-in evidence'}</Text>
      {evidence.latestCheckIn ? (
        <View style={styles.evidenceBlock}>
          <Text selectable style={styles.detail}>
            {formatDate(evidence.latestCheckIn.recordedAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
            {' · '}{format(evidence.latestCheckIn.ageHours)} {ru ? 'ч назад' : 'h ago'}
          </Text>
          <Text selectable style={styles.detail}>
            {ru ? 'Сон' : 'Sleep'}: {valueOrDash(evidence.latestCheckIn.sleepDurationHours, format)} h
            {' · '}{ru ? 'качество' : 'quality'}: {valueOrDash(evidence.latestCheckIn.sleepQuality, format)}/5
          </Text>
          <Text selectable style={styles.detail}>
            {ru ? 'Усталость' : 'Fatigue'}: {valueOrDash(evidence.latestCheckIn.fatigue, format)}/5
            {' · '}{ru ? 'болезненность' : 'soreness'}: {valueOrDash(evidence.latestCheckIn.soreness, format)}/5
            {' · '}{ru ? 'стресс' : 'stress'}: {valueOrDash(evidence.latestCheckIn.stress, format)}/5
          </Text>
          <Text selectable style={styles.detail}>
            {ru ? 'Влияние боли' : 'Pain interference'}: {valueOrDash(evidence.latestCheckIn.painInterference, format)}/5
            {' · '}{ru ? 'субъективная готовность' : 'self-reported readiness'}: {valueOrDash(evidence.latestCheckIn.selfReportedReadiness, format)}/5
          </Text>
          <Text selectable style={styles.detail}>
            {ru ? 'Check-in за 7 дней' : 'Check-ins in 7 days'}: {formatNumber(evidence.recentCheckInCount)}
          </Text>
        </View>
      ) : (
        <Text selectable style={styles.detail}>{ru ? 'Сохранённых check-in нет.' : 'No stored check-in evidence.'}</Text>
      )}

      <Text selectable style={styles.sectionTitle}>{ru ? 'Предложения по упражнениям' : 'Exercise proposals'}</Text>
      {review.proposals.length === 0 ? (
        <Text selectable style={styles.detail}>
          {ru ? 'Недостаточно точных данных для предложения.' : 'Not enough exact evidence for a proposal.'}
        </Text>
      ) : (
        <View style={styles.rows}>
          {review.proposals.slice(0, 6).map((proposal) => {
            const exposure = evidence.proposalExposure.find((item) => item.exerciseId === proposal.exerciseId);
            return (
              <View key={proposal.exerciseId} style={styles.row}>
                <Text selectable style={styles.rowTitle}>{proposal.exerciseName}</Text>
                <Text selectable style={styles.action}>{actionLabel(proposal.action, ru)}</Text>
                <Text selectable style={styles.detail}>
                  {copy.findingTitle(proposal.finding.kind, proposal.finding.prType)}
                  {proposal.adjustedByRecovery
                    ? ru ? ' · скорректировано recovery modifier' : ' · adjusted by recovery modifier'
                    : ''}
                </Text>
                {exposure ? (
                  <View style={styles.evidenceBlock}>
                    <Text selectable style={styles.detail}>
                      {ru ? 'Primary muscles' : 'Primary muscles'}: {exposure.primaryMuscleIds.length > 0
                        ? exposure.primaryMuscleIds.map((muscleId) => getCanonicalMuscleLabel(muscleId, locale)).join(', ')
                        : '—'}
                    </Text>
                    <Text selectable style={styles.detail}>
                      {ru ? 'Экспозиция за' : 'Exposure in'} {formatNumber(exposure.windowHours)}h: {formatNumber(exposure.workingSetCount)} {copy.workingSets} · {formatNumber(exposure.exposureSessionCount)} {copy.sessions}
                    </Text>
                    {exposure.lastExposureAt ? (
                      <Text selectable style={styles.detail}>
                        {ru ? 'Последняя экспозиция' : 'Last exposure'}: {formatDate(exposure.lastExposureAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
                <AdaptiveProgramCoachExplanation
                  proposal={proposal}
                  recovery={review.recovery}
                />
                <AdaptiveProgramApplyControls
                  onApply={onApplyPrescriptionPatch}
                  proposal={proposal}
                  workouts={workouts}
                />
              </View>
            );
          })}
        </View>
      )}

      <Text selectable style={styles.disclaimer}>
        {ru
          ? 'Окно 72 часа показывает только недавние завершённые рабочие подходы по primary muscles. Оно не является таймером восстановления и само по себе не меняет предложение.'
          : 'The 72-hour window only shows recent completed working-set exposure for primary muscles. It is not a recovery timer and does not change the proposal by itself.'}
      </Text>
      <Text selectable style={styles.detail}>
        {ru ? 'Упражнений в каноническом плане' : 'Canonical planned exercises'}: {formatNumber(review.plannedExerciseCount)}
        {review.unresolvedTemplateCount > 0
          ? ` · ${ru ? 'неразрешённых шаблонов' : 'unresolved templates'}: ${formatNumber(review.unresolvedTemplateCount)}`
          : ''}
      </Text>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    action: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    disclaimer: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: Spacing.one },
    evidenceBlock: { gap: Spacing.one, marginTop: Spacing.one },
    row: { borderTopColor: colors.borderSubtle, borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.one, paddingTop: Spacing.two },
    rowTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
    rows: { gap: Spacing.two, marginTop: Spacing.two },
    sectionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '800', marginTop: Spacing.three },
    title: { color: colors.textPrimary, fontSize: 17, fontWeight: '800', marginBottom: Spacing.one },
  });
