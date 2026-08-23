import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { ProgressShareCardViewModel } from '@/features/progress/progressShareCardModel';
import { buildProgressShareCardPresentation } from '@/features/progress/progressShareCardPresentation';
import { useLocalization } from '@/localization/LocalizationProvider';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences } from '@/units';

type ProgressShareCardRendererProps = {
  card: ProgressShareCardViewModel;
  testID?: string;
};

export function ProgressShareCardRenderer({
  card,
  testID,
}: ProgressShareCardRendererProps) {
  const { colors } = useAppTheme();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { weight } = useUnitPreferences();
  const presentation = buildProgressShareCardPresentation(card, {
    locale,
    weightUnit: weight,
    formatDate,
    formatNumber,
  });

  const accessibilityLabel = [
    presentation.title,
    presentation.subjectLabel,
    `${presentation.heroLabel}: ${presentation.heroValue}`,
    presentation.dateLabel,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfacePrimary,
          borderColor: colors.borderSubtle,
        },
      ]}
      testID={testID}
    >
      <View style={[styles.accent, { backgroundColor: colors.accent }]} />

      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.accent }]}>
          {presentation.brand}
        </Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>
          {presentation.dateLabel}
        </Text>
      </View>

      <View style={styles.heading}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {presentation.title}
        </Text>
        {presentation.subjectLabel ? (
          <Text
            numberOfLines={2}
            style={[styles.subject, { color: colors.textSecondary }]}
          >
            {presentation.subjectLabel}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.hero,
          {
            backgroundColor: colors.surfaceAccent,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>
          {presentation.heroLabel}
        </Text>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.heroValue, { color: colors.textPrimary }]}
        >
          {presentation.heroValue}
        </Text>
      </View>

      {presentation.rows.length > 0 ? (
        <View style={styles.rows}>
          {presentation.rows.map((row, index) => (
            <View
              key={`${row.label}-${index}`}
              style={[
                styles.row,
                index > 0
                  ? { borderTopColor: colors.divider, borderTopWidth: 1 }
                  : null,
              ]}
            >
              <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
                {row.label}
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.rowValue, { color: colors.textPrimary }]}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          {presentation.footer}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accent: {
    borderRadius: 999,
    height: 5,
    width: 56,
  },
  brand: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  card: {
    alignSelf: 'stretch',
    borderRadius: 28,
    borderWidth: 1,
    gap: Spacing.four,
    minHeight: 420,
    overflow: 'hidden',
    padding: Spacing.five,
  },
  date: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: Spacing.two,
  },
  footerText: {
    fontSize: 11,
    lineHeight: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  heading: {
    gap: Spacing.one,
  },
  hero: {
    borderRadius: 22,
    borderWidth: 1,
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  heroValue: {
    fontSize: 38,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 44,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  rows: {
    gap: 0,
  },
  rowValue: {
    flexShrink: 1,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    lineHeight: 18,
    maxWidth: '58%',
    textAlign: 'right',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
});
