import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';

import { LiquidGlassSurface } from './LiquidGlassSurface';

type AppCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function AppCard({ children, style }: AppCardProps) {
  return <LiquidGlassSurface style={[styles.card, style]}>{children}</LiquidGlassSurface>;
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.four,
    padding: Spacing.four,
  },
});
