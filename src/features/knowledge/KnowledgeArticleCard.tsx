import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PublishedKnowledgeArticleSummary } from '@/api/knowledge';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { getKnowledgeCopy } from './knowledgeCopy';

export function KnowledgeArticleCard({
  article,
}: {
  article: PublishedKnowledgeArticleSummary;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = getKnowledgeCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <AppCard>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{copy.category(article.category)}</Text>
        <Text style={styles.meta}>{copy.format(article.format)}</Text>
      </View>
      <Text selectable style={styles.title}>
        {article.title}
      </Text>
      <Text selectable style={styles.summary}>
        {article.summary}
      </Text>
      <Text selectable style={styles.version}>
        {copy.version(article.version)} · {copy.riskTier(article.riskTier)}
      </Text>
      <AppButton
        label={copy.openArticle}
        onPress={() =>
          router.push({
            pathname: '/knowledge/[slug]',
            params: { slug: article.slug },
          })
        }
        variant="secondary"
      />
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    meta: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.caption.fontWeight,
      lineHeight: Typography.caption.lineHeight,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    summary: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    version: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
  });
