import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { getWorkoutSessionExercisePickerCopy } from '@/localization/workoutSessionExercisePickerCopy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette, type LiquidGlassPalette } from '@/theme/liquidGlass';

import {
  mapMuscleNameToCanonicalId,
  type CanonicalMuscleId,
  type MuscleHighlightMap,
} from '../muscleTaxonomy';
import { MuscleMap } from './MuscleMap';

type InteractiveMuscleFilterProps = {
  activeValue?: string;
  onChange: (value?: string) => void;
  options: string[];
};

export const InteractiveMuscleFilter = memo(function InteractiveMuscleFilter({
  activeValue,
  onChange,
  options,
}: InteractiveMuscleFilterProps) {
  const { locale } = useLocalization();
  const copy = useMemo(() => getWorkoutSessionExercisePickerCopy(locale), [locale]);
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const optionByMuscleId = useMemo(() => {
    const next = new Map<CanonicalMuscleId, string>();
    for (const option of options) {
      const id = mapMuscleNameToCanonicalId(option);
      if (id && !next.has(id)) next.set(id, option);
    }
    return next;
  }, [options]);
  const availableMuscleIds = useMemo(
    () => Array.from(optionByMuscleId.keys()),
    [optionByMuscleId],
  );
  const activeMuscleId = activeValue
    ? mapMuscleNameToCanonicalId(activeValue)
    : null;
  const highlights = useMemo<MuscleHighlightMap>(
    () => (activeMuscleId ? { [activeMuscleId]: 'primary' } : {}),
    [activeMuscleId],
  );

  if (availableMuscleIds.length === 0) return null;

  const handleMusclePress = (muscleId: CanonicalMuscleId) => {
    const exactOption = optionByMuscleId.get(muscleId);
    if (!exactOption) return;
    onChange(activeMuscleId === muscleId ? undefined : exactOption);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{copy.anatomyFilter}</Text>
      <Text style={styles.hint}>{copy.anatomyFilterHint}</Text>
      <View style={styles.maps}>
        <MuscleMap
          availableMuscleIds={availableMuscleIds}
          compact
          highlights={highlights}
          onMusclePress={handleMusclePress}
          side="front"
          sideLabel={copy.anatomyFront}
        />
        <MuscleMap
          availableMuscleIds={availableMuscleIds}
          compact
          highlights={highlights}
          onMusclePress={handleMusclePress}
          side="back"
          sideLabel={copy.anatomyBack}
        />
      </View>
    </View>
  );
});

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.two,
      marginTop: Spacing.two,
      padding: Spacing.three,
    },
    hint: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    maps: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    title: {
      color: colors.text,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
  });