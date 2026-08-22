import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { getSmartReplaceCopy } from '@/localization/smartReplaceCopy';

import {
  getReviewedExerciseIntelligence,
  selectExerciseIntelligenceText,
} from '../exerciseIntelligence';
import { loadExercisePreference } from '../preferencesRepository';
import { exerciseRepository } from '../repository';
import {
  buildSmartReplaceCandidates,
  type SmartReplaceCandidate,
} from '../smartReplace';
import type { Exercise } from '../types';

type SmartReplaceSectionProps = {
  exerciseId: string;
  locale: string;
  equipmentContext?: readonly string[];
  onOpenExercise: (exerciseId: string) => void;
  styles: {
    bodyText: StyleProp<TextStyle>;
    cardTitle: StyleProp<TextStyle>;
    list: StyleProp<ViewStyle>;
    secondaryText: StyleProp<TextStyle>;
  };
};

export function SmartReplaceSection({
  exerciseId,
  locale,
  equipmentContext,
  onOpenExercise,
  styles,
}: SmartReplaceSectionProps) {
  const copy = useMemo(() => getSmartReplaceCopy(locale), [locale]);
  const intelligence = useMemo(
    () => getReviewedExerciseIntelligence(exerciseId),
    [exerciseId],
  );
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<SmartReplaceCandidate[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const reviewedSubstitutions = intelligence?.substitutions ?? [];

      if (reviewedSubstitutions.length === 0) {
        setCandidates([]);
        setLoading(false);
        return () => {
          cancelled = true;
        };
      }

      const loadCandidates = async () => {
        setLoading(true);
        try {
          const resolved = await Promise.all(
            reviewedSubstitutions.map((substitution) =>
              exerciseRepository.getExerciseById(substitution.exerciseId),
            ),
          );
          const resolvedExercises = resolved.filter(
            (exercise): exercise is Exercise => exercise !== null,
          );
          const preferences = Object.fromEntries(
            await Promise.all(
              resolvedExercises.map(async (exercise) => [
                exercise.id,
                await loadExercisePreference(exercise.id),
              ] as const),
            ),
          );
          const nextCandidates = buildSmartReplaceCandidates({
            currentExerciseId: exerciseId,
            reviewedSubstitutions,
            resolvedExercises,
            preferences,
            equipmentContext,
          });
          if (!cancelled) setCandidates(nextCandidates);
        } catch {
          if (!cancelled) setCandidates([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      void loadCandidates();
      return () => {
        cancelled = true;
      };
    }, [equipmentContext, exerciseId, intelligence]),
  );

  if (!intelligence || intelligence.substitutions.length === 0) return null;

  const localize = (value: Parameters<typeof selectExerciseIntelligenceText>[0]) =>
    selectExerciseIntelligenceText(value, locale);

  return (
    <AppCard>
      <Text style={styles.cardTitle}>{copy.title}</Text>
      <Text style={styles.secondaryText}>{copy.description}</Text>
      {loading ? (
        <Text style={styles.secondaryText}>{copy.loading}</Text>
      ) : candidates.length === 0 ? (
        <Text style={styles.secondaryText}>{copy.noCandidates}</Text>
      ) : (
        <View style={styles.list}>
          {candidates.map((candidate) => (
            <View key={candidate.exercise.id}>
              <AppButton
                label={copy.viewCandidate(localize(candidate.reviewedSubstitution.label))}
                onPress={() => onOpenExercise(candidate.exercise.id)}
                variant="secondary"
              />
              <Text style={styles.bodyText}>
                {localize(candidate.reviewedSubstitution.rationale)}
              </Text>
              <Text style={styles.secondaryText}>
                {candidate.reasonCodes
                  .map((reason) =>
                    reason === 'equipment-match'
                      ? copy.equipmentReason
                      : copy.reviewedReason,
                  )
                  .join(' · ')}
              </Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.secondaryText}>{copy.disclaimer}</Text>
    </AppCard>
  );
}
