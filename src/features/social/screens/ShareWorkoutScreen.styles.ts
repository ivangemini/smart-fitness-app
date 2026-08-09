import { StyleSheet } from "react-native";

import { Colors, MaxContentWidth, Radii, Spacing } from "@/constants/theme";
import type { LiquidGlassPalette } from "@/theme/liquidGlass";

export const createShareWorkoutStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 21,
    },
    captionInput: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: "continuous",
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: 15,
      minHeight: 96,
      padding: Spacing.two,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: "800",
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
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 19,
      minWidth: 0,
    },
    fieldRow: {
      alignItems: "center",
      borderBottomColor: colors.borderSubtle,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      gap: Spacing.two,
      justifyContent: "space-between",
      minHeight: 48,
      paddingVertical: Spacing.one,
    },
    header: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: Spacing.three,
    },
    headerCopy: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 0,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "800",
    },
    mediaPreview: {
      aspectRatio: 4 / 3,
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: "continuous",
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      width: "100%",
    },
    mediaStatus: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    previewGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.two,
    },
    previewItem: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: "continuous",
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      gap: 2,
      minWidth: 112,
      padding: Spacing.two,
    },
    previewLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: "700",
    },
    previewTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "800",
    },
    previewValue: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: "900",
      fontVariant: ["tabular-nums"],
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
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    section: {
      gap: Spacing.two,
    },
    successMark: {
      color: colors.success,
      fontSize: 32,
      fontWeight: "900",
      lineHeight: 38,
    },
    switchControl: {
      flexShrink: 0,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: "900",
      lineHeight: 30,
    },
  });

export type ShareWorkoutStyles = ReturnType<typeof createShareWorkoutStyles>;
