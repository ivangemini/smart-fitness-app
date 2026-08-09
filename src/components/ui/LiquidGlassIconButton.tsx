import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import { LiquidGlassSurface } from './LiquidGlassSurface';

type LiquidGlassIconButtonProps = {
  accessibilityHint?: string;
  accessibilityLabel: string;
  Icon: LucideIcon;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function LiquidGlassIconButton({
  accessibilityHint,
  accessibilityLabel,
  Icon,
  onPress,
  style,
  testID,
}: LiquidGlassIconButtonProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );

  const handlePress = useCallback(() => {
    void Haptics.selectionAsync().catch(() => undefined);
    onPress();
  }, [onPress]);

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.pressable, style, pressed && styles.pressed]}
      testID={testID}>
      {({ pressed }) => (
        <LiquidGlassSurface
          radius={22}
          style={[
            styles.surface,
            pressed && { backgroundColor: glass.controlPressedFill },
          ]}
          variant="control">
          <Icon color={colors.textPrimary} size={22} strokeWidth={2} />
        </LiquidGlassSurface>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flexShrink: 0,
    height: 44,
    width: 44,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  surface: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
