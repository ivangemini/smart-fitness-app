import { useEffect, useMemo, useState } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { getSmartReplaceCopy } from '@/localization/smartReplaceCopy';
import type { SupportedLocale } from '@/localization/messages';

import { selectExerciseIntelligenceText } from '../exerciseIntelligence';
import {
  loadSmartReplacementCandidates,
  type SmartReplacementCandidate,
} from '../smartReplace';

type SmartReplacementSectionProps = {
  exerciseId: string;
  locale: SupportedLocale;
  onOpenExercise: (exerciseId: string) => void;
  styles: {
    bodyText: StyleProp<TextStyle>;
    cardTitle: StyleProp<TextStyle>;
    list: StyleProp<ViewStyle>;
    secondaryText: StyleProp<TextStyle>;
  };
};

export function SmartReplacementSection({
  exerciseId,
  locale,
  onOpenExercise,
  styles,
}: SmartReplacementSectionProps) {
  const copy = useMemo(() => getSmartReplaceCopy(locale), [locale]);
  const [candidates, setCandidates] = useState<SmartReplacementCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    const load = async () => {
      try {
        const nextCandidates = await loadSmartReplacementCandidates(exerciseId);
        if (!cancelled) setCandidates(nextCandidates);
      } catch {
        if (!cancelled) {
          setCandidates([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  const localize = (value: SmartReplacementCandidate['label']) =>
    selectExerciseIntelligenceText(value, locale);

  return (
    <AppCard>
      <Text style={styles.cardTitle}>{copy.title}</Text>
      <Text style={styles.secondaryText}>{copy.description}</Text>
      {loading ? <Text style={styles.secondaryText}>{copy.loading}</Text> : null}
      {!loading && error ? <Text style={styles.secondaryText}>{copy.error}</Text> : null}
      {!loading && !error && candidates.length === 0 ? (
        <Text style={styles.secondaryText}>{copy.empty}</Text>
      ) : null}
      {!loading && !error && candidates.length > 0 ? (
        <View style={styles.list}>
          {candidates.map((candidate) => {
            const label = localize(candidate.label);
            return (
              <View key={candidate.exerciseId}>
                <AppButton
                  label={copy.open(label)}
                  onPress={() => onOpenExercise(candidate.exerciseId)}
                  variant="secondary"
                />
                <Text style={styles.secondaryText}>{localize(candidate.rationale)}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
      <Text style={styles.secondaryText}>{copy.disclaimer}</Text>
    </AppCard>
  );
}
