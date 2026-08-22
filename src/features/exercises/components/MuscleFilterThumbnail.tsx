import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  CANONICAL_MUSCLES,
  mapMuscleNameToCanonicalId,
  type MuscleHighlightMap,
} from '../muscleTaxonomy';
import { BodyMuscleSvg } from './BodyMuscleSvg';

type MuscleFilterThumbnailProps = {
  muscleName: string;
};

export const MuscleFilterThumbnail = memo(function MuscleFilterThumbnail({
  muscleName,
}: MuscleFilterThumbnailProps) {
  const muscleId = mapMuscleNameToCanonicalId(muscleName);
  const muscle = muscleId
    ? CANONICAL_MUSCLES.find((candidate) => candidate.id === muscleId)
    : undefined;
  const highlights = useMemo<MuscleHighlightMap>(
    () => (muscle ? { [muscle.id]: 'primary' } : {}),
    [muscle],
  );

  if (!muscle) return null;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.image}>
      <BodyMuscleSvg highlights={highlights} side={muscle.side} />
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    height: 34,
    width: 20,
  },
});