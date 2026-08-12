import type { BottomTabBarProps } from 'expo-router/js-tabs';
import {
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Path,
  Skia,
  usePathInterpolation,
  vec,
  type SkPath,
} from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  Brain,
  Dumbbell,
  FlaskConical,
  Home,
  TrendingUp,
  Utensils,
  type LucideIcon,
} from 'lucide-react-native';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette, type LiquidGlassPalette } from '@/theme/liquidGlass';

import {
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_MIN_BOTTOM_OFFSET,
} from './floatingTabBarLayout';

const TAB_ICONS: Record<string, LucideIcon> = {
  index: Home,
  workouts: Dumbbell,
  nutrition: Utensils,
  progress: TrendingUp,
  labs: FlaskConical,
};

const VISIBLE_TABS = new Set(Object.keys(TAB_ICONS));
const TAB_COUNT = Object.keys(TAB_ICONS).length;
const PANEL_HEIGHT = FLOATING_TAB_BAR_HEIGHT;
const PANEL_RADIUS = 32;
const DEFAULT_PANEL_WIDTH = 340;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_SPRING = {
  damping: 18,
  stiffness: 340,
  mass: 0.55,
} as const;

const MORPH_SPRING = {
  damping: 19,
  stiffness: 235,
  mass: 0.72,
  overshootClamping: false,
} as const;

type TabButtonProps = {
  accessibilityLabel: string;
  activeColor: string;
  inactiveColor: string;
  isActive: boolean;
  Icon: LucideIcon;
  onLongPress: () => void;
  onPress: () => void;
  testID?: string;
};

type LiquidGeometryProps = {
  activeIndex: number;
  glass: LiquidGlassPalette;
  width: number;
};

function makePanelPath(width: number): SkPath {
  const right = width;
  const bottom = PANEL_HEIGHT;
  const radius = PANEL_RADIUS;
  const path = Skia.Path.MakeFromSVGString(
    `M ${radius} 0 H ${right - radius} ` +
      `C ${right - 12} 0 ${right} 12 ${right} ${radius} ` +
      `V ${bottom - radius} C ${right} ${bottom - 12} ${right - 12} ${bottom} ${right - radius} ${bottom} ` +
      `H ${radius} C 12 ${bottom} 0 ${bottom - 12} 0 ${bottom - radius} ` +
      `V ${radius} C 0 12 12 0 ${radius} 0 Z`,
  );

  if (!path) throw new Error('Unable to create Skia panel path');
  return path;
}

function makeBlobPath(width: number, index: number): SkPath {
  const tabWidth = width / TAB_COUNT;
  const centerX = tabWidth * (index + 0.5);
  const centerY = PANEL_HEIGHT / 2;
  const horizontalRadius = Math.min(30, tabWidth * 0.42);
  const verticalRadius = 20;
  const organicBias = index % 2 === 0 ? 1.8 : -1.8;
  const left = centerX - horizontalRadius;
  const right = centerX + horizontalRadius;
  const top = centerY - verticalRadius;
  const bottom = centerY + verticalRadius;

  const path = Skia.Path.MakeFromSVGString(
    `M ${centerX} ${top} ` +
      `C ${centerX + 13 + organicBias} ${top - 1} ${right + 1} ${centerY - 10} ${right} ${centerY} ` +
      `C ${right - 1} ${centerY + 11} ${centerX + 15 - organicBias} ${bottom + 1} ${centerX} ${bottom} ` +
      `C ${centerX - 15 - organicBias} ${bottom + 1} ${left + 1} ${centerY + 11} ${left} ${centerY} ` +
      `C ${left - 1} ${centerY - 10} ${centerX - 13 + organicBias} ${top - 1} ${centerX} ${top} Z`,
  );

  if (!path) throw new Error('Unable to create Skia blob path');
  return path;
}

const TabButton = memo(function TabButton({
  accessibilityLabel,
  activeColor,
  inactiveColor,
  isActive,
  Icon,
  onLongPress,
  onPress,
  testID,
}: TabButtonProps) {
  const pressScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    pressScale.value = withSpring(0.92, PRESS_SPRING);
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSpring(1, PRESS_SPRING);
  }, [pressScale]);

  const handlePress = useCallback(() => {
    void Haptics.selectionAsync().catch(() => undefined);
    onPress();
  }, [onPress]);

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onLongPress={onLongPress}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tabItem, animatedButtonStyle]}
      testID={testID}>
      <Icon color={isActive ? activeColor : inactiveColor} size={24} strokeWidth={2} />
    </AnimatedPressable>
  );
});

function LiquidGeometry({ activeIndex, glass, width }: LiquidGeometryProps) {
  const activePosition = useSharedValue(activeIndex);
  const panelPath = useMemo(() => makePanelPath(width), [width]);
  const blobPaths = useMemo(
    () => Array.from({ length: TAB_COUNT }, (_, index) => makeBlobPath(width, index)),
    [width],
  );

  useEffect(() => {
    activePosition.value = withSpring(activeIndex, MORPH_SPRING);
  }, [activeIndex, activePosition]);

  const blobPath = usePathInterpolation(activePosition, [0, 1, 2, 3, 4], blobPaths);

  return (
    <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Group>
        <Path path={panelPath} color={glass.navPanelShadow}>
          <BlurMask blur={18} style="outer" />
        </Path>
        <Path path={panelPath} color={glass.navPanelFill} />
        <Path path={panelPath} color={glass.navEdgeStrong} style="stroke" strokeWidth={0.75} />
        <Path path={panelPath} color={glass.navEdgeSoft} style="stroke" strokeWidth={0.35} />
      </Group>

      <Path path={blobPath} color={glass.navBlobFill}>
        <BlurMask blur={5} style="solid" />
      </Path>
      <Path path={blobPath} color={glass.navBlobGlow}>
        <LinearGradient
          start={vec(0, 8)}
          end={vec(width, PANEL_HEIGHT)}
          colors={[glass.navBlobGradientStart, glass.navBlobGradientEnd]}
        />
      </Path>
      <Path path={blobPath} color={glass.navBlobStroke} style="stroke" strokeWidth={0.7} />
    </Canvas>
  );
}

export function LiquidGlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { resolvedAppearance } = useAppTheme();
  const glass = useMemo(() => resolveLiquidGlassPalette(resolvedAppearance), [resolvedAppearance]);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
  const visibleRoutes = state.routes.filter((route) => VISIBLE_TABS.has(route.name));
  const activeRoute = state.routes[state.index];
  const activeRouteKey = activeRoute?.key;
  const activeVisibleIndex = Math.max(
    0,
    visibleRoutes.findIndex((route) => route.key === activeRouteKey),
  );
  const coachRoute = state.routes.find((route) => route.name === 'coach');
  const coachOptions = coachRoute ? descriptors[coachRoute.key]?.options : undefined;
  const coachLabel =
    typeof coachOptions?.tabBarAccessibilityLabel === 'string'
      ? coachOptions.tabBarAccessibilityLabel
      : typeof coachOptions?.title === 'string'
        ? coachOptions.title
        : 'Coach';

  const handlePanelLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    setPanelWidth((currentWidth) =>
      Math.abs(currentWidth - nextWidth) > 0.5 ? nextWidth : currentWidth,
    );
  }, []);

  if (activeRoute?.name === 'coach') return null;

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <View
        pointerEvents="box-none"
        style={[
          styles.outerContainer,
          { bottom: Math.max(insets.bottom, FLOATING_TAB_BAR_MIN_BOTTOM_OFFSET) },
        ]}>
        {coachRoute ? (
          <View style={styles.companionEntry}>
            <LiquidGlassIconButton
              accessibilityLabel={coachLabel}
              Icon={Brain}
              onPress={() => navigation.navigate(coachRoute.name, coachRoute.params)}
              testID="global-companion-entry"
            />
          </View>
        ) : null}

        <View
          pointerEvents="none"
          style={[
            styles.shadowWide,
            {
              backgroundColor: glass.navPanelShadow,
              shadowColor: glass.shadowColor,
              shadowOpacity: glass.shadowOpacity,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.shadowTight,
            {
              backgroundColor: glass.navPanelShadow,
              shadowColor: glass.shadowColor,
              shadowOpacity: glass.shadowOpacity * 0.8,
            },
          ]}
        />
        <View
          onLayout={handlePanelLayout}
          style={[styles.glassShell, { backgroundColor: glass.navPanelFill }]}>
          <BlurView
            blurMethod={Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined}
            intensity={Platform.OS === 'ios' ? 52 : 76}
            pointerEvents="none"
            tint={glass.blurTint}
            style={StyleSheet.absoluteFill}
          />
          <LiquidGeometry activeIndex={activeVisibleIndex} glass={glass} width={panelWidth} />
          <View style={styles.tabRow}>
            {visibleRoutes.map((route) => {
              const descriptor = descriptors[route.key];
              const options = descriptor.options;
              const isActive = activeRouteKey === route.key;
              const Icon = TAB_ICONS[route.name];
              const label =
                typeof options.tabBarAccessibilityLabel === 'string'
                  ? options.tabBarAccessibilityLabel
                  : typeof options.title === 'string'
                    ? options.title
                    : route.name;

              const handlePress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              const handleLongPress = () => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
                navigation.emit({ type: 'tabLongPress', target: route.key });
              };

              return (
                <TabButton
                  accessibilityLabel={label}
                  activeColor={glass.navActiveIcon}
                  Icon={Icon}
                  inactiveColor={glass.navInactiveIcon}
                  isActive={isActive}
                  key={route.key}
                  onLongPress={handleLongPress}
                  onPress={handlePress}
                  testID={options.tabBarButtonTestID}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  outerContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  companionEntry: {
    position: 'absolute',
    right: 0,
    top: -56,
    zIndex: 3,
  },
  shadowWide: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: -10,
    height: 54,
    borderCurve: 'continuous',
    borderRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 22,
    elevation: 10,
  },
  shadowTight: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: -4,
    height: 48,
    borderCurve: 'continuous',
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  glassShell: {
    width: '100%',
    height: PANEL_HEIGHT,
    borderCurve: 'continuous',
    borderRadius: PANEL_RADIUS,
    overflow: 'hidden',
  },
  tabRow: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
