import { memo, useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette, type LiquidGlassPalette } from '@/theme/liquidGlass';

import {
  CANONICAL_MUSCLES,
  mapMuscleNameToCanonicalId,
  type CanonicalMuscleId,
  type MuscleSide,
} from '../muscleTaxonomy';

type MuscleFilterThumbnailProps = {
  muscleName: string;
};

type MuscleShape = {
  id: CanonicalMuscleId;
  shape: string;
};

const FRONT_SHAPES: MuscleShape[] = [
  { id: 'front-delts', shape: '<circle cx="34" cy="39" r="6"/><circle cx="66" cy="39" r="6"/>' },
  { id: 'side-delts', shape: '<circle cx="31" cy="42" r="5"/><circle cx="69" cy="42" r="5"/>' },
  { id: 'chest', shape: '<path d="M35 43c4-4 9-5 15-3v17H35c-3-4-3-10 0-14zm30 0c-4-4-9-5-15-3v17h15c3-4 3-10 0-14z"/>' },
  { id: 'biceps', shape: '<rect x="23" y="47" width="8" height="24" rx="4"/><rect x="69" y="47" width="8" height="24" rx="4"/>' },
  { id: 'forearms', shape: '<rect x="18" y="69" width="7" height="27" rx="3.5"/><rect x="75" y="69" width="7" height="27" rx="3.5"/>' },
  { id: 'abs', shape: '<rect x="40" y="57" width="20" height="31" rx="7"/>' },
  { id: 'obliques', shape: '<rect x="34" y="60" width="7" height="27" rx="3.5"/><rect x="59" y="60" width="7" height="27" rx="3.5"/>' },
  { id: 'quads', shape: '<rect x="35" y="96" width="12" height="34" rx="5"/><rect x="53" y="96" width="12" height="34" rx="5"/>' },
];

const BACK_SHAPES: MuscleShape[] = [
  { id: 'rear-delts', shape: '<circle cx="34" cy="39" r="6"/><circle cx="66" cy="39" r="6"/>' },
  { id: 'traps', shape: '<path d="M41 34h18l9 22H32z"/>' },
  { id: 'lats', shape: '<path d="M31 53h16v36H24z"/><path d="M53 53h16l7 36H53z"/>' },
  { id: 'triceps', shape: '<rect x="23" y="47" width="8" height="24" rx="4"/><rect x="69" y="47" width="8" height="24" rx="4"/>' },
  { id: 'lower-back', shape: '<rect x="40" y="76" width="20" height="18" rx="6"/>' },
  { id: 'glutes', shape: '<rect x="34" y="94" width="14" height="17" rx="6"/><rect x="52" y="94" width="14" height="17" rx="6"/>' },
  { id: 'hamstrings', shape: '<rect x="35" y="111" width="12" height="32" rx="5"/><rect x="53" y="111" width="12" height="32" rx="5"/>' },
  { id: 'calves', shape: '<rect x="36" y="143" width="10" height="25" rx="4"/><rect x="54" y="143" width="10" height="25" rx="4"/>' },
];

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const createSvgUri = (
  side: MuscleSide,
  muscleId: CanonicalMuscleId,
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) => {
  const shapes = side === 'front' ? FRONT_SHAPES : BACK_SHAPES;
  const baseFill = glass.elevatedFill;
  const stroke = glass.controlBorder;
  const highlighted = shapes.find((shape) => shape.id === muscleId)?.shape ?? '';

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="180" viewBox="0 0 100 180">
      <g fill="${baseFill}" stroke="${stroke}" stroke-width="1.5">
        <circle cx="50" cy="18" r="11"/>
        <rect x="38" y="30" width="24" height="66" rx="11"/>
        <rect x="32" y="90" width="36" height="20" rx="8"/>
        <rect x="19" y="43" width="9" height="55" rx="4.5"/>
        <rect x="72" y="43" width="9" height="55" rx="4.5"/>
        <rect x="34" y="106" width="13" height="62" rx="6.5"/>
        <rect x="53" y="106" width="13" height="62" rx="6.5"/>
      </g>
      <g fill="${colors.accent}" stroke="${colors.accent}" stroke-width="1">${highlighted}</g>
    </svg>
  `);
};

export const MuscleFilterThumbnail = memo(function MuscleFilterThumbnail({
  muscleName,
}: MuscleFilterThumbnailProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const muscleId = mapMuscleNameToCanonicalId(muscleName);
  const muscle = muscleId
    ? CANONICAL_MUSCLES.find((candidate) => candidate.id === muscleId)
    : undefined;
  const svgUri = useMemo(
    () => (muscle ? createSvgUri(muscle.side, muscle.id, colors, glass) : null),
    [colors, glass, muscle],
  );

  if (!muscle || !svgUri) return null;

  return (
    <Image
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      resizeMode="contain"
      source={{ uri: svgUri }}
      style={styles.image}
    />
  );
});

const styles = StyleSheet.create({
  image: {
    height: 34,
    width: 20,
  },
});
