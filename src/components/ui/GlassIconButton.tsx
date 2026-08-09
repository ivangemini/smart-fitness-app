import { PropsWithChildren, useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

type GlassIconButtonProps = PropsWithChildren<{
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function GlassIconButton({
  accessibilityLabel,
  children,
  disabled = false,
  onPress,
  size = 44,
  style,
}: GlassIconButtonProps) {
  const { resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled
            ? glass.disabledFill
            : pressed
              ? glass.controlPressedFill
              : glass.controlFill,
          borderColor: disabled ? glass.disabledBorder : glass.controlBorder,
          borderTopColor: disabled ? glass.disabledBorder : glass.cardHighlight,
          height: size,
          shadowColor: glass.shadowColor,
          shadowOpacity: disabled ? 0 : glass.shadowOpacity * 0.55,
          width: size,
        },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 999,
    borderTopWidth: 1,
    borderWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 12,
  },
});
