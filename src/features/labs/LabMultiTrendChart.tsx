import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

import type { LabMultiTrendMode, LabTrendPoint } from './labMultiTrend';

export type LabMultiTrendSeries = {
  markerId: string;
  label: string;
  points: readonly LabTrendPoint[];
};

type LabMultiTrendChartProps = {
  accessibilityLabel?: string;
  mode: LabMultiTrendMode;
  series: readonly LabMultiTrendSeries[];
  absoluteUnit?: string;
};

const PADDING_X = 16;
const PADDING_Y = 18;

export function LabMultiTrendChart({
  accessibilityLabel,
  mode,
  series,
  absoluteUnit,
}: LabMultiTrendChartProps) {
  const { colors } = useAppTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const palette = [colors.chartPrimary, colors.chartSecondary, colors.warning];

  const geometry = useMemo(() => {
    const points = series.flatMap((entry) => entry.points);
    if (size.width <= 0 || size.height <= 0 || points.length === 0) return null;

    const timestamps = points.map((point) => new Date(point.collectedAt).getTime());
    const values = points.map((point) => point.value).filter(Number.isFinite);
    if (timestamps.some(Number.isNaN) || values.length === 0) return null;
    if (mode === 'relative_reference') values.push(0, 100);

    let minTime = Math.min(...timestamps);
    let maxTime = Math.max(...timestamps);
    if (minTime === maxTime) {
      minTime -= 12 * 60 * 60 * 1000;
      maxTime += 12 * 60 * 60 * 1000;
    }
    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);
    if (minValue === maxValue) {
      const spread = Math.max(Math.abs(minValue) * 0.1, 1);
      minValue -= spread;
      maxValue += spread;
    } else {
      const spread = (maxValue - minValue) * 0.12;
      minValue -= spread;
      maxValue += spread;
    }

    const plotWidth = Math.max(1, size.width - PADDING_X * 2);
    const plotHeight = Math.max(1, size.height - PADDING_Y * 2);
    const xFor = (timestamp: number) =>
      PADDING_X + ((timestamp - minTime) / (maxTime - minTime)) * plotWidth;
    const yFor = (value: number) =>
      PADDING_Y + ((maxValue - value) / (maxValue - minValue)) * plotHeight;

    const renderedSeries = series
      .map((entry) => {
        const path = Skia.Path.Make();
        const renderedPoints = entry.points.map((point, index) => {
          const x = xFor(new Date(point.collectedAt).getTime());
          const y = yFor(point.value);
          if (index === 0) path.moveTo(x, y);
          else path.lineTo(x, y);
          return { x, y };
        });
        return { markerId: entry.markerId, path, points: renderedPoints };
      })
      .filter((entry) => entry.points.length > 0);

    const referencePaths =
      mode === 'relative_reference'
        ? [0, 100].map((value) => {
            const path = Skia.Path.Make();
            const y = yFor(value);
            path.moveTo(PADDING_X, y);
            path.lineTo(size.width - PADDING_X, y);
            return path;
          })
        : [];

    return { renderedSeries, referencePaths, minValue, maxValue };
  }, [mode, series, size.height, size.width]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  };

  return (
    <View style={styles.wrapper}>
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        accessible={Boolean(accessibilityLabel)}
        onLayout={handleLayout}
        style={[styles.chart, { backgroundColor: colors.surfaceSecondary }]}>
        {geometry ? (
          <Canvas style={StyleSheet.absoluteFill}>
            {geometry.referencePaths.map((path, index) => (
              <Path
                color={colors.borderStrong}
                key={`reference-${index}`}
                path={path}
                style="stroke"
                strokeWidth={1}
              />
            ))}
            {geometry.renderedSeries.map((entry, seriesIndex) => (
              <Path
                color={palette[seriesIndex % palette.length]}
                key={entry.markerId}
                path={entry.path}
                style="stroke"
                strokeCap="round"
                strokeJoin="round"
                strokeWidth={3}
              />
            ))}
            {geometry.renderedSeries.flatMap((entry, seriesIndex) =>
              entry.points.map((point, pointIndex) => (
                <Circle
                  color={palette[seriesIndex % palette.length]}
                  cx={point.x}
                  cy={point.y}
                  key={`${entry.markerId}-${pointIndex}`}
                  r={4}
                />
              )),
            )}
          </Canvas>
        ) : null}
      </View>
      {geometry ? (
        <View style={styles.scaleRow}>
          <Text style={[styles.scaleText, { color: colors.textMuted }]}>
            {geometry.minValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            {mode === 'relative_reference' ? '%' : absoluteUnit ? ` ${absoluteUnit}` : ''}
          </Text>
          <Text style={[styles.scaleText, { color: colors.textMuted }]}>
            {geometry.maxValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            {mode === 'relative_reference' ? '%' : absoluteUnit ? ` ${absoluteUnit}` : ''}
          </Text>
        </View>
      ) : null}
      <View style={styles.legend}>
        {series.map((entry, index) => (
          <View key={entry.markerId} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: palette[index % palette.length] }]}
            />
            <Text numberOfLines={1} style={[styles.scaleText, { color: colors.textSecondary }]}>
              {entry.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    aspectRatio: 1.65,
    borderCurve: 'continuous',
    borderRadius: 18,
    overflow: 'hidden',
    width: '100%',
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  legendDot: { borderRadius: 999, height: 8, width: 8 },
  legendItem: { alignItems: 'center', flexDirection: 'row', gap: Spacing.one, maxWidth: '100%' },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scaleText: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
  },
  wrapper: { gap: Spacing.one, width: '100%' },
});
