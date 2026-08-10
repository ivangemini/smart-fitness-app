import { router } from 'expo-router';
import { History } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import WorkoutsScreen from '@/features/workouts/screens/WorkoutsScreen';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

export default function WorkoutsRoute() {
  const { colors, resolvedAppearance } = useAppTheme();
  const { t } = useLocalization();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const insets = useSafeAreaInsets();
  const historyBottom = getFloatingTabBarBottomClearance(insets.bottom, Spacing.two);

  return (
    <View style={styles.screen}>
      <WorkoutsScreen />
      <Pressable
        accessibilityHint={t('workouts.historyHint')}
        accessibilityLabel={t('workouts.historyAccessibility')}
        accessibilityRole="button"
        onPress={() => router.push('/workout-history')}
        style={[styles.historyButton, { bottom: historyBottom }]}>
        {({ pressed }) => (
          <LiquidGlassSurface
            blur
            radius={Radii.pill}
            style={[
              styles.historySurface,
              pressed && styles.historySurfacePressed,
            ]}
            variant="elevated">
            <History color={colors.accent} size={18} strokeWidth={2.2} />
            <Text style={styles.historyLabel}>{t('workouts.history')}</Text>
          </LiquidGlassSurface>
        )}
      </Pressable>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    historyButton: {
      borderRadius: Radii.pill,
      left: Spacing.three,
      minHeight: 44,
      position: 'absolute',
      zIndex: 20,
    },
    historyLabel: {
      color: colors.textPrimary,
      fontSize: Typography.label.fontSize,
      fontWeight: '900',
      lineHeight: Typography.label.lineHeight,
    },
    historySurface: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.one,
      minHeight: 44,
      paddingHorizontal: Spacing.three,
    },
    historySurfacePressed: {
      backgroundColor: glass.controlPressedFill,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
  });
