import type { ResolvedAppearance } from '@/constants/theme';

export type LiquidGlassPalette = {
  accentBorder: string;
  accentFill: string;
  accentPressedFill: string;
  accentText: string;
  backgroundBase: string;
  backgroundGlowPrimary: string;
  backgroundGlowSecondary: string;
  backgroundGlowTertiary: string;
  blurTint: 'systemMaterialDark' | 'systemMaterialLight';
  cardBorder: string;
  cardFill: string;
  cardHighlight: string;
  controlBorder: string;
  controlFill: string;
  controlPressedFill: string;
  disabledBorder: string;
  disabledFill: string;
  elevatedFill: string;
  navActiveIcon: string;
  navBlobFill: string;
  navBlobGlow: string;
  navBlobGradientEnd: string;
  navBlobGradientStart: string;
  navBlobStroke: string;
  navEdgeSoft: string;
  navEdgeStrong: string;
  navInactiveIcon: string;
  navPanelFill: string;
  navPanelShadow: string;
  semanticAccentFill: string;
  semanticPositiveBorder: string;
  semanticPositiveFill: string;
  semanticWarningBorder: string;
  semanticWarningFill: string;
  shadowColor: string;
  shadowOpacity: number;
};

const darkGlass: LiquidGlassPalette = {
  accentBorder: 'rgba(255, 255, 255, 0.18)',
  accentFill: 'rgba(10, 132, 255, 0.82)',
  accentPressedFill: 'rgba(10, 132, 255, 0.96)',
  accentText: '#FFFFFF',
  backgroundBase: '#030507',
  backgroundGlowPrimary: 'rgba(10, 132, 255, 0.20)',
  backgroundGlowSecondary: 'rgba(52, 199, 89, 0.09)',
  backgroundGlowTertiary: 'rgba(94, 92, 230, 0.10)',
  blurTint: 'systemMaterialDark',
  cardBorder: 'rgba(255, 255, 255, 0.14)',
  cardFill: 'rgba(22, 22, 28, 0.62)',
  cardHighlight: 'rgba(255, 255, 255, 0.22)',
  controlBorder: 'rgba(255, 255, 255, 0.16)',
  controlFill: 'rgba(255, 255, 255, 0.08)',
  controlPressedFill: 'rgba(255, 255, 255, 0.14)',
  disabledBorder: 'rgba(255, 255, 255, 0.08)',
  disabledFill: 'rgba(255, 255, 255, 0.04)',
  elevatedFill: 'rgba(28, 28, 34, 0.72)',
  navActiveIcon: '#FFFFFF',
  navBlobFill: 'rgba(255, 255, 255, 0.13)',
  navBlobGlow: 'rgba(255, 255, 255, 0.10)',
  navBlobGradientEnd: 'rgba(255, 255, 255, 0.07)',
  navBlobGradientStart: 'rgba(255, 255, 255, 0.19)',
  navBlobStroke: 'rgba(255, 255, 255, 0.22)',
  navEdgeSoft: 'rgba(255, 255, 255, 0.08)',
  navEdgeStrong: 'rgba(255, 255, 255, 0.16)',
  navInactiveIcon: '#8F8F98',
  navPanelFill: 'rgba(18, 18, 22, 0.54)',
  navPanelShadow: 'rgba(6, 6, 10, 0.38)',
  semanticAccentFill: 'rgba(10, 132, 255, 0.15)',
  semanticPositiveBorder: 'rgba(46, 214, 111, 0.30)',
  semanticPositiveFill: 'rgba(46, 214, 111, 0.12)',
  semanticWarningBorder: 'rgba(255, 214, 10, 0.30)',
  semanticWarningFill: 'rgba(255, 214, 10, 0.12)',
  shadowColor: '#08080C',
  shadowOpacity: 0.28,
};

const lightGlass: LiquidGlassPalette = {
  accentBorder: 'rgba(255, 255, 255, 0.70)',
  accentFill: 'rgba(27, 138, 122, 0.84)',
  accentPressedFill: 'rgba(22, 114, 102, 0.94)',
  accentText: '#FFFFFF',
  backgroundBase: '#F3F7FA',
  backgroundGlowPrimary: 'rgba(27, 138, 122, 0.16)',
  backgroundGlowSecondary: 'rgba(10, 132, 255, 0.11)',
  backgroundGlowTertiary: 'rgba(94, 92, 230, 0.07)',
  blurTint: 'systemMaterialLight',
  cardBorder: 'rgba(17, 24, 39, 0.10)',
  cardFill: 'rgba(255, 255, 255, 0.66)',
  cardHighlight: 'rgba(255, 255, 255, 0.92)',
  controlBorder: 'rgba(17, 24, 39, 0.11)',
  controlFill: 'rgba(255, 255, 255, 0.52)',
  controlPressedFill: 'rgba(255, 255, 255, 0.78)',
  disabledBorder: 'rgba(17, 24, 39, 0.07)',
  disabledFill: 'rgba(255, 255, 255, 0.34)',
  elevatedFill: 'rgba(255, 255, 255, 0.78)',
  navActiveIcon: '#111827',
  navBlobFill: 'rgba(255, 255, 255, 0.42)',
  navBlobGlow: 'rgba(255, 255, 255, 0.34)',
  navBlobGradientEnd: 'rgba(255, 255, 255, 0.18)',
  navBlobGradientStart: 'rgba(255, 255, 255, 0.58)',
  navBlobStroke: 'rgba(255, 255, 255, 0.72)',
  navEdgeSoft: 'rgba(255, 255, 255, 0.40)',
  navEdgeStrong: 'rgba(255, 255, 255, 0.74)',
  navInactiveIcon: '#66717D',
  navPanelFill: 'rgba(244, 247, 250, 0.62)',
  navPanelShadow: 'rgba(17, 24, 39, 0.16)',
  semanticAccentFill: 'rgba(27, 138, 122, 0.12)',
  semanticPositiveBorder: 'rgba(22, 129, 94, 0.24)',
  semanticPositiveFill: 'rgba(22, 129, 94, 0.10)',
  semanticWarningBorder: 'rgba(160, 106, 30, 0.24)',
  semanticWarningFill: 'rgba(160, 106, 30, 0.10)',
  shadowColor: '#111827',
  shadowOpacity: 0.12,
};

export function resolveLiquidGlassPalette(
  appearance: ResolvedAppearance,
): LiquidGlassPalette {
  return appearance === 'dark' ? darkGlass : lightGlass;
}
