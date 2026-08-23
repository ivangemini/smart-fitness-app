import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

export const createTemplateSmartReplaceModalStyles = (
  colors: typeof Colors.light,
) =>
  StyleSheet.create({
    actions: {
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    arrow: {
      color: colors.textSecondary,
      fontSize: 22,
      fontWeight: '700',
    },
    comparisonColumn: {
      flex: 1,
      gap: Spacing.half,
      minWidth: 0,
    },
    comparisonRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
    },
    comparisonValue: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '800',
    },
    errorText: {
      color: colors.error,
      fontSize: 13,
      lineHeight: 18,
    },
    headerContent: {
      gap: Spacing.three,
      paddingBottom: Spacing.three,
    },
    headerCopy: {
      flex: 1,
      gap: Spacing.half,
      minWidth: 0,
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    listContent: {
      gap: Spacing.two,
      padding: Spacing.three,
    },
    loadingRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.one,
    },
    option: {
      borderColor: colors.borderSubtle,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.half,
      minHeight: 56,
      padding: Spacing.two,
    },
    optionDetail: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    optionPressed: {
      opacity: 0.7,
    },
    optionTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      paddingHorizontal: Spacing.three,
      zIndex: 20,
    },
    panel: {
      flex: 1,
      maxHeight: '92%',
      maxWidth: 560,
      minHeight: 0,
      overflow: 'hidden',
      width: '100%',
    },
    previewBody: {
      gap: Spacing.three,
      padding: Spacing.three,
    },
    reason: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '700',
    },
    reviewedList: {
      gap: Spacing.one,
    },
    searchInput: {
      borderColor: colors.borderSubtle,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: 15,
      minHeight: 46,
      paddingHorizontal: Spacing.two,
    },
    secondaryText: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '800',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '900',
    },
  });
