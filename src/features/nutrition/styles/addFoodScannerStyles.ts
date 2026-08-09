import { StyleSheet } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createAddFoodScannerStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    scannerActions: {
      gap: Spacing.two,
    },
    scannerBarcodeText: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 16,
    },
    scannerCamera: {
      flex: 1,
    },
    scannerCameraWrap: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      overflow: 'hidden',
    },
    scannerCloseButton: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.one,
      width: 72,
    },
    scannerCloseText: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: '800',
    },
    scannerFrame: {
      borderColor: glass.accentBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: 2,
      height: 120,
      width: '82%',
    },
    scannerHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.one,
    },
    scannerHeaderSpacer: {
      width: 72,
    },
    scannerInstruction: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '800',
      marginTop: Spacing.two,
      textAlign: 'center',
    },
    scannerManualButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    scannerManualForm: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.two,
      padding: Spacing.three,
    },
    scannerManualHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    scannerManualText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '800',
    },
    scannerOverlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.three,
    },
    scannerPermissionCard: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.two,
      padding: Spacing.three,
    },
    scannerPermissionText: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    scannerPermissionTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '900',
    },
    scannerScreen: {
      backgroundColor: colors.background,
      flex: 1,
      gap: Spacing.three,
      padding: Spacing.three,
      paddingTop: Spacing.six,
    },
    scannerStatusCard: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.two,
      padding: Spacing.three,
    },
    scannerStatusText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '800',
      lineHeight: 18,
    },
    scannerTitle: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: 18,
      fontWeight: '900',
      textAlign: 'center',
    },
  });
