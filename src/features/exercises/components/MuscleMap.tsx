import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

import {
  CANONICAL_MUSCLES,
  type CanonicalMuscleId,
  type MuscleHighlightMap,
  type MuscleSide,
} from '../muscleTaxonomy';
import { BodyMuscleSvg } from './BodyMuscleSvg';

type MuscleMapProps = {
  availableMuscleIds?: CanonicalMuscleId[];
  compact?: boolean;
  highlights: MuscleHighlightMap;
  onMusclePress?: (muscleId: CanonicalMuscleId) => void;
  side: MuscleSide;
  sideLabel?: string;
};

export const MuscleMap = memo(function MuscleMap({
  availableMuscleIds,
  compact = false,
  highlights,
  onMusclePress,
  side,
  sideLabel,
}: MuscleMapProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const highlightedLabels = CANONICAL_MUSCLES
    .filter((muscle) => muscle.side === side && highlights[muscle.id])
    .map((muscle) => muscle.label)
    .join(', ');
  const resolvedSideLabel = sideLabel ?? (side === 'front' ? 'Front' : 'Back');

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={[styles.image, compact && styles.compactImage]}>
        <BodyMuscleSvg
          accessibilityLabel={`${resolvedSideLabel} muscle map${highlightedLabels ? ` highlighting ${highlightedLabels}` : ''}.`}
          availableMuscleIds={availableMuscleIds}
          highlights={highlights}
          onMusclePress={onMusclePress}
          side={side}
        />
      </View>
      <Text style={styles.label}>{resolvedSideLabel}</Text>
    </View>
  );
});

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      gap: Spacing.two,
      minWidth: 0,
      padding: Spacing.three,
    },
    compactContainer: {
      padding: Spacing.two,
    },
    compactImage: {
      height: 168,
      width: 84,
    },
    image: {
      aspectRatio: 0.5,
      width: '100%',
    },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
  });