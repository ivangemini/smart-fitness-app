import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import type { LabResultDto } from '@/features/labs/types';
import { useAppTheme } from '@/theme/AppThemeProvider';

type LabTrendChartProps = {
  results: readonly LabResultDto[];
};

const CHART_PADDING_X = 16;
const CHART_PADDING_Y = 18;

export function LabTrendChart({ results }: LabTrendChartProps) {
  const { colors } = useAppTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ordered = useMemo(
    () => [...results].sort((a, b) => a.collectedAt.localeCompare(b.collectedAt)),
    [results],
  );

  const geometry = useMemo(() => {
    if (size.width <= 0 || size.height <= 0 || ordered.length === 0) return null;
    const values = ordered.map((result) => result.value).filter(Number.isFinite);
    if (values.length === 0) return null;

    const latestInterval = ordered.at(-1)?.referenceInterval;
    if (latestInterval?.low !== null && latestInterval?.low !== undefined) {
      values.push(latestInterval.low);
    }
    if (latestInterval?.high !== null && latestInterval?.high !== undefined) {
      values.push(latestInterval.high);
    }

    let min = Math.min(...values);
    let max = Math.max(...values);
    if (min === max) {
      const spread = Math.max(Math.abs(min) * 0.1, 1);
      min -= spread;
      max += spread;
    } else {
      const spread = (max - min) * 0.12;
      min -= spread;
      max += spread;
    }

    const plotWidth = Math.max(1, size.width - CHART_PADDING_X * 2);
    const plotHeight = Math.max(1, size.height - CHART_PADDING_Y * 2);
    const xForIndex = (index: number) =>
      CHART_PADDING_X +
      (ordered.length === 1 ? plotWidth / 2 : (index / (ordered.length - 1)) * plotWidth);
    const yForValue = (value: number) =>
      CHART_PADDING_Y + ((max - value) / (max - min)) * plotHeight;

    const line = Skia.Path.Make();
    ordered.forEach((result, index) => {
      const x = xForIndex(index);
      const y = yForValue(result.value);
      if (index === 0) line.moveTo(x, y);
      else line.lineTo(x, y);
    });

    const referencePaths = [latestInterval?.low, latestInterval?.high]
      .filter(
        (value): value is number =>
          value !== null && value !== undefined && Number.isFinite(value),
      )
      .map((value) => {
        const path = Skia.Path.Make();
        const y = yForValue(value);
        path.moveTo(CHART_PADDING_X, y);
        path.lineTo(size.width - CHART_PADDING_X, y);
        return path;
      });

    return {
      line,
      points: ordered.map((result, index) => ({
        x: xForIndex(index),
        y: yForValue(result.value),
      })),
      referencePaths,
      min,
      max,
    };
  }, [ordered, size.height, size.width]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  };

  if (ordered.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <View
        onLayout={handleLayout}
        style={[styles.chart, { backgroundColor: colors.surfaceSecondary }]}>
        {geometry ? (
          <Canvas style={StyleSheet.absoluteFill}>
            {geometry.referencePaths.map((path, index) => (
              <Path
                color={colors.borderStrong}
                key={index}
                path={path}
                style="stroke"
                strokeWidth={1}
              />
            ))}
            <Path
              color={colors.accent}
              path={geometry.line}
              style="stroke"
              strokeCap="round"
              strokeJoin="round"
              strokeWidth={3}
            />
            {geometry.points.map((point, index) => (
              <Circle
                color={colors.accent}
                cx={point.x}
                cy={point.y}
                key={index}
                r={4}
              />
            ))}
          </Canvas>
        ) : null}
      </View>
      {geometry ? (
        <View style={styles.scaleRow}>
          <Text style={[styles.scaleText, { color: colors.textMuted }]}>
            {geometry.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.scaleText, { color: colors.textMuted }]}>
            {geometry.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    aspectRatio: 1.8,
    borderCurve: 'continuous',
    borderRadius: 18,
    overflow: 'hidden',
    width: '100%',
  },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scaleText: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
  },
  wrapper: { gap: Spacing.one, width: '100%' },
});
