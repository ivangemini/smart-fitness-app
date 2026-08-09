import { BlurMask, Canvas, Circle } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

export function HomeLiquidBackdrop() {
  const { resolvedAppearance } = useAppTheme();
  const { height, width } = useWindowDimensions();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const shortSide = Math.min(width, height);

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: glass.backgroundBase }]}>
      <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Circle
          color={glass.backgroundGlowPrimary}
          cx={width * 0.92}
          cy={height * 0.14}
          r={Math.max(110, shortSide * 0.38)}>
          <BlurMask blur={72} style="solid" />
        </Circle>
        <Circle
          color={glass.backgroundGlowSecondary}
          cx={width * 0.04}
          cy={height * 0.48}
          r={Math.max(100, shortSide * 0.34)}>
          <BlurMask blur={82} style="solid" />
        </Circle>
        <Circle
          color={glass.backgroundGlowTertiary}
          cx={width * 0.92}
          cy={height * 0.82}
          r={Math.max(105, shortSide * 0.36)}>
          <BlurMask blur={86} style="solid" />
        </Circle>
      </Canvas>
    </View>
  );
}
