import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PublishedKnowledgeArticleSummary } from '@/api/knowledge';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Radii, Spacing, Typography } from '@/constants/theme';
import type { SupportedLocale } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import {
  getKnowledgeCategoryLabel,
  getKnowledgeCopy,
  getKnowledgeFormatLabel,
} from './knowledgeCopy';

export function KnowledgeArticleCard({
  article,
  locale,
  onOpen,
  onSelectConcept,
}: {
  article: PublishedKnowledgeArticleSummary;
  locale: SupportedLocale;
  onOpen(): void;
  onSelectConcept(conceptId: string): void;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = getKnowledgeCopy(locale);

  return (
    <AppCard>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{getKnowledgeCategoryLabel(locale, article.category)}</Text>
        <Text style={styles.meta}>{getKnowledgeFormatLabel(locale, article.format)}</Text>
        <Text style={styles.meta}>{copy.publishedVersion(article.version)}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.summary}>{article.summary}</Text>
      </View>
      <View style={styles.concepts}>
        {article.conceptIds.map((conceptId) => (
          <Pressable
            accessibilityRole="button"
            key={conceptId}
            onPress={() => onSelectConcept(conceptId)}
            style={({ pressed }) => [styles.conceptChip, pressed && styles.pressed]}
          >
            <Text style={styles.conceptText}>{conceptId.replaceAll('_', ' ')}</Text>
          </Pressable>
        ))}
      </View>
      <AppButton label={copy.openArticle} onPress={onOpen} variant="secondary" />
    </AppCard>
  );
}

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    meta: {
      ...Typography.caption,
      color: colors.textMuted,
    },
    textBlock: {
      gap: Spacing.two,
    },
    title: {
      ...Typography.cardTitle,
      color: colors.textPrimary,
    },
    summary: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    concepts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    conceptChip: {
      minHeight: 36,
      justifyContent: 'center',
      borderRadius: Radii.pill,
      paddingHorizontal: Spacing.three,
      backgroundColor: colors.surfaceSecondary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderSubtle,
    },
    conceptText: {
      ...Typography.caption,
      color: colors.textSecondary,
      textTransform: 'capitalize',
    },
    pressed: {
      opacity: 0.7,
    },
  });
