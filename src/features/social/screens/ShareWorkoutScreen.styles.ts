import { StyleSheet } from "react-native";

import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import type { LiquidGlassPalette } from "@/theme/liquidGlass";

export const createShareWorkoutStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 15,
      lineHeight: 21,
    },
    captionInput: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: "continuous",
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: 15,
      minHeight: 96,
      padding: Spacing.two,
    },
    captionInputDisabled: {
      backgroundColor: glass.disabledFill,
      borderColor: glass.disabledBorder,
      color: colors.textMuted,
    },
    cardTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 17,
      fontWeight: "800",
      lineHeight: 22,
    },
    container: {
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      width: "100%",
    },
    content: {
      alignItems: "center",
      flexGrow: 1,
      paddingHorizontal: Spacing.three,
    },
    fieldLabel: {
      color: colors.textPrimary,
      flex: 1,
      flexShrink: 1,
      fontSize: 15,
      fontWeight: "700",
      minWidth: 0,
    },
    fieldRow: {
      alignItems: "center",
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      gap: Spacing.two,
      minHeight: 52,
      paddingVertical: Spacing.one,
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      gap: Spacing.two,
    },
    headerCopy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    loadingState: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.three,
    },
    mediaHeader: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: Spacing.two,
    },
    mediaHeaderCopy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    mediaPreview: {
      aspectRatio: 4 / 3,
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: "continuous",
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      width: "100%",
    },
    mediaWarning: {
      color: colors.warning,
      flexShrink: 1,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 20,
    },
    previewGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.one,
    },
    previewItem: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: "continuous",
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      flexGrow: 1,
      gap: 2,
      minWidth: "47%",
      padding: Spacing.two,
    },
    previewLabel: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: 12,
      fontWeight: "700",
    },
    previewTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 17,
      fontWeight: "800",
      lineHeight: 22,
    },
    previewValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 15,
      fontWeight: "800",
    },
    progressFill: {
      backgroundColor: colors.accent,
      borderRadius: 999,
      height: "100%",
    },
    progressTrack: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      height: 8,
      overflow: "hidden",
      width: "100%",
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    section: {
      gap: Spacing.two,
    },
    successMark: {
      color: colors.accent,
      fontSize: 34,
      fontWeight: "900",
      textAlign: "center",
    },
    switchControl: {
      flexShrink: 0,
      transform: [{ scaleX: 0.86 }, { scaleY: 0.86 }],
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 24,
      fontWeight: "900",
      lineHeight: 29,
    },
  });

export type ShareWorkoutStyles = ReturnType<typeof createShareWorkoutStyles>;
