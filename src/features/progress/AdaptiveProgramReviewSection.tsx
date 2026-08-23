import { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { useAppActions } from '@/context/AppContext';
import { exerciseRepository, type Exercise } from '@/features/exercises';
import { useLocalization } from '@/localization';
import type { RecoveryCheckIn, TrainingProgram, Workout, WorkoutSession } from '@/types';

import { AdaptiveProgramReviewCard } from './AdaptiveProgramReviewCard';
import { buildAdaptiveProgramReview } from './adaptiveProgramEngine';
import { buildAdaptiveRecoveryEvidence } from './adaptiveRecoveryEvidence';
import {
  buildCanonicalTrainingIntelligence,
  type TrainingIntelligenceWindowDays,
} from './trainingIntelligence';

export function AdaptiveProgramReviewSection({
  endAt,
  program,
  recoveryCheckIns,
  windowDays,
  workouts,
  workoutSessions,
}: {
  endAt: string;
  program: TrainingProgram;
  recoveryCheckIns: RecoveryCheckIn[];
  windowDays: TrainingIntelligenceWindowDays;
  workouts: Workout[];
  workoutSessions: WorkoutSession[];
}) {
  const { locale } = useLocalization();
  const { applyWorkoutPrescriptionPatch } = useAppActions();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    void exerciseRepository.getAllExercises()
      .then((next) => {
        if (!cancelled) {
          setExercises(next);
          setLoadState('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState('error');
      });
    return () => { cancelled = true; };
  }, []);

  const review = useMemo(() => {
    if (loadState !== 'ready') return null;
    const analytics = buildCanonicalTrainingIntelligence({
      exercises,
      sessions: workoutSessions,
      endAt,
      windowDays,
    });
    return buildAdaptiveProgramReview({
      endAt,
      findings: analytics.findings,
      program,
      recoveryCheckIns,
      workouts,
    });
  }, [endAt, exercises, loadState, program, recoveryCheckIns, windowDays, workouts, workoutSessions]);

  const evidence = useMemo(
    () => review
      ? buildAdaptiveRecoveryEvidence({
          endAt,
          exercises,
          proposals: review.proposals,
          recoveryCheckIns,
          sessions: workoutSessions,
        })
      : null,
    [endAt, exercises, recoveryCheckIns, review, workoutSessions],
  );

  if (loadState === 'error') {
    return (
      <AppCard>
        <Text selectable>
          {locale === 'ru'
            ? 'Не удалось загрузить данные для адаптивных предложений.'
            : 'Adaptive proposal evidence could not be loaded.'}
        </Text>
      </AppCard>
    );
  }
  if (!review || !evidence) return null;
  return (
    <AdaptiveProgramReviewCard
      evidence={evidence}
      onApplyPrescriptionPatch={applyWorkoutPrescriptionPatch}
      review={review}
      workouts={workouts}
    />
  );
}
