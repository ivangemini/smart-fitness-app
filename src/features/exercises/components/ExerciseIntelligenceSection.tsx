import { Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import type { SupportedLocale } from '@/localization/messages';

import {
  getReviewedExerciseIntelligence,
  selectExerciseIntelligenceText,
} from '../exerciseIntelligence';
import { getExerciseIntelligenceCopy } from '../exerciseIntelligenceCopy';
import { ExerciseDetailTextList } from './ExerciseDetailTextList';
import { SmartReplacementSection } from './SmartReplacementSection';

type ExerciseIntelligenceSectionProps = {
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

export function ExerciseIntelligenceSection({
  exerciseId,
  locale,
  onOpenExercise,
  styles,
}: ExerciseIntelligenceSectionProps) {
  const intelligence = getReviewedExerciseIntelligence(exerciseId);
  if (!intelligence) return null;

  const copy = getExerciseIntelligenceCopy(locale);
  const localize = (value: Parameters<typeof selectExerciseIntelligenceText>[0]) =>
    selectExerciseIntelligenceText(value, locale);
  const technique = intelligence.techniqueCues.map(localize);
  const commonErrors = intelligence.commonErrors.map(localize);
  const rangeOfMotion = intelligence.rangeOfMotion.map(localize);

  return (
    <>
      <AppCard>
        <Text style={styles.cardTitle}>{copy.title}</Text>
        <Text style={styles.secondaryText}>{copy.reviewed}</Text>
        <Text style={styles.bodyText}>
          {copy.movementPattern}: {copy.movementPatterns[intelligence.movementPattern]}
        </Text>
        <Text style={styles.bodyText}>
          {copy.fatigueCost}: {copy.fatigue[intelligence.fatigueCost]}
        </Text>
        <Text style={styles.secondaryText}>{copy.fatigueDisclaimer}</Text>
      </AppCard>

      <AppCard>
        <Text style={styles.cardTitle}>{copy.technique}</Text>
        <ExerciseDetailTextList emptyLabel="" items={technique} styles={styles} />

        <Text style={styles.cardTitle}>{copy.commonErrors}</Text>
        <ExerciseDetailTextList emptyLabel="" items={commonErrors} styles={styles} />

        <Text style={styles.cardTitle}>{copy.rangeOfMotion}</Text>
        <ExerciseDetailTextList emptyLabel="" items={rangeOfMotion} styles={styles} />
      </AppCard>

      <SmartReplacementSection
        exerciseId={exerciseId}
        locale={locale}
        onOpenExercise={onOpenExercise}
        styles={styles}
      />
    </>
  );
}
