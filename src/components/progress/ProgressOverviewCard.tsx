import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

type ProgressOverviewRow = {
  label: string;
  value: string;
  detail?: string;
};

type ProgressOverviewCardProps = {
  actions?: ReactNode;
  emptyMessage?: string;
  rows: ProgressOverviewRow[];
  subtitle?: string;
  title: string;
};

export function ProgressOverviewCard({
  actions,
  emptyMessage,
  rows,
  subtitle,
  title,
}: ProgressOverviewCardProps) {
  const { colors } = useAppTheme();

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text selectable style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text selectable style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>

      {rows.length > 0 ? (
        <View style={styles.rows}>
          {rows.map((row) => (
            <View key={`${row.label}-${row.value}`} style={styles.row}>
              <View style={styles.rowCopy}>
                <Text selectable style={[styles.label, { color: colors.textSecondary }]}>
                  {row.label}
                </Text>
                {row.detail ? (
                  <Text selectable style={[styles.detail, { color: colors.textSecondary }]}>
                    {row.detail}
                  </Text>
                ) : null}
              </View>
              <Text selectable style={[styles.value, { color: colors.textPrimary }]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      ) : emptyMessage ? (
        <Text selectable style={[styles.empty, { color: colors.textSecondary }]}>
          {emptyMessage}
        </Text>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: 'flex-end', flexShrink: 0 },
  detail: { fontSize: 12, lineHeight: 17 },
  empty: { fontSize: 14, lineHeight: 20, marginTop: Spacing.two },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  headerCopy: { flex: 1, gap: 2, minWidth: 0 },
  label: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  rowCopy: { flex: 1, gap: 1, minWidth: 0 },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  subtitle: { fontSize: 13, lineHeight: 18 },
  title: { fontSize: 18, fontWeight: '800' },
  value: {
    flexShrink: 1,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    maxWidth: '48%',
    textAlign: 'right',
  },
});
