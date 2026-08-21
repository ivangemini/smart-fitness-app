import { memo, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import {
  MUSCLE_ANATOMY_REGIONS,
  MUSCLE_ANATOMY_VIEWBOX,
  type MuscleAnatomyPrimitive,
} from '../muscleAnatomy';
import type {
  CanonicalMuscleId,
  MuscleHighlightMap,
  MuscleSide,
} from '../muscleTaxonomy';

type BodyMuscleSvgProps = {
  accessibilityLabel?: string;
  availableMuscleIds?: CanonicalMuscleId[];
  height?: number | string;
  highlights?: MuscleHighlightMap;
  intensities?: Partial<Record<CanonicalMuscleId, number>>;
  onMusclePress?: (muscleId: CanonicalMuscleId) => void;
  side: MuscleSide;
  style?: StyleProp<ViewStyle>;
  width?: number | string;
};

const renderPrimitive = (primitive: MuscleAnatomyPrimitive, key: string) => {
  if (primitive.kind === 'circle') {
    return <Circle key={key} cx={primitive.cx} cy={primitive.cy} r={primitive.r} />;
  }
  if (primitive.kind === 'path') {
    return <Path key={key} d={primitive.d} />;
  }
  return (
    <Rect
      key={key}
      height={primitive.height}
      rx={primitive.rx}
      width={primitive.width}
      x={primitive.x}
      y={primitive.y}
    />
  );
};

const clampIntensity = (value: number | undefined) => {
  if (!Number.isFinite(value)) return 1;
  return Math.min(1, Math.max(0, value as number));
};

export const BodyMuscleSvg = memo(function BodyMuscleSvg({
  accessibilityLabel,
  availableMuscleIds,
  height = '100%',
  highlights = {},
  intensities = {},
  onMusclePress,
  side,
  style,
  width = '100%',
}: BodyMuscleSvgProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const available = useMemo(
    () => (availableMuscleIds ? new Set(availableMuscleIds) : null),
    [availableMuscleIds],
  );
  const baseFill = glass.elevatedFill;
  const stroke = glass.controlBorder;

  return (
    <Svg
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
      height={height}
      style={style}
      viewBox={`0 0 ${MUSCLE_ANATOMY_VIEWBOX.width} ${MUSCLE_ANATOMY_VIEWBOX.height}`}
      width={width}>
      <G fill={baseFill} stroke={stroke} strokeWidth={2}>
        <Circle cx={100} cy={44} r={24} />
        <Rect height={144} rx={22} width={48} x={76} y={68} />
        <Rect height={44} rx={18} width={70} x={65} y={198} />
        <Rect height={120} rx={10} width={20} x={36} y={92} />
        <Rect height={120} rx={10} width={20} x={144} y={92} />
        <Rect height={140} rx={14} width={28} x={66} y={238} />
        <Rect height={140} rx={14} width={28} x={106} y={238} />
      </G>

      {MUSCLE_ANATOMY_REGIONS[side].map((region) => {
        const role = highlights[region.id];
        const enabled = available ? available.has(region.id) : true;
        const fill =
          role === 'primary'
            ? colors.accent
            : role === 'secondary'
              ? colors.warning
              : baseFill;
        const intensity = clampIntensity(intensities[region.id]);
        const opacity = enabled ? (role ? 0.35 + intensity * 0.65 : 1) : 0.28;

        return (
          <G
            key={region.id}
            fill={fill}
            onPress={enabled && onMusclePress ? () => onMusclePress(region.id) : undefined}
            opacity={opacity}
            stroke={role ? fill : stroke}
            strokeWidth={2}>
            {region.primitives.map((primitive, index) =>
              renderPrimitive(primitive, `${region.id}-${index}`),
            )}
          </G>
        );
      })}
    </Svg>
  );
});