import { BlurView } from 'expo-blur';
import { PropsWithChildren, useMemo } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Radii } from '@/constants/theme';
import { useReduceTransparency } from '@/hooks/useReduceTransparency';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

type LiquidGlassVariant = 'card' | 'control' | 'elevated';

type LiquidGlassSurfaceProps = PropsWithChildren<{
  blur?: boolean;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  variant?: LiquidGlassVariant;
}>;

export function LiquidGlassSurface({
  blur = false,
  children,
  radius = Radii.large,
  style,
  variant = 'card',
}: LiquidGlassSurfaceProps) {
  const { resolvedAppearance } = useAppTheme();
  const reduceTransparency = useReduceTransparency();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );

  const backgroundColor =
    variant === 'control'
      ? glass.controlFill
      : variant === 'elevated'
        ? glass.elevatedFill
        : glass.cardFill;
  const borderColor = variant === 'control' ? glass.controlBorder : glass.cardBorder;
  const shouldBlur = blur && !reduceTransparency;

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor,
          borderColor,
          borderRadius: radius,
          borderTopColor: glass.cardHighlight,
          shadowColor: glass.shadowColor,
          shadowOpacity: glass.shadowOpacity,
        },
        style,
      ]}>
      {shouldBlur ? (
        <BlurView
          blurMethod={Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined}
          intensity={Platform.OS === 'ios' ? 34 : 50}
          pointerEvents="none"
          tint={glass.blurTint}
          style={[styles.blurLayer, { borderRadius: radius }]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  blurLayer: {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  surface: {
    borderCurve: 'continuous',
    borderTopWidth: 1,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
  },
});
