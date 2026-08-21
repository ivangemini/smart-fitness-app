import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import type { CoachLearnSelection } from '@/api/coach/learn';
import type { KnowledgeLocale } from '@/api/knowledge/contracts';
import { AppCard } from '@/components/ui/AppCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { getCoachLearnCopy } from '../coachLearnCopy';

export function CoachLearnCard({
  learn,
  locale,
}: {
  learn: CoachLearnSelection;
  locale: KnowledgeLocale;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const copy = getCoachLearnCopy(locale);

  if (learn.recommendations.length === 0) return null;

  return (
    <AppCard>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.intro}>{copy.intro}</Text>
      {learn.recommendations.map((recommendation) => (
        <View
          key={recommendation.article.articleVersionId}
          style={styles.recommendation}>
          <Text style={styles.lessonTitle}>{recommendation.article.title}</Text>
          <Text style={styles.summary}>{recommendation.article.summary}</Text>
          <PrimaryButton
            label={copy.openLesson}
            onPress={() =>
              router.push({
                pathname: '/knowledge/[slug]',
                params: {
                  slug: recommendation.article.slug,
                  expectedArticleVersionId:
                    recommendation.article.articleVersionId,
                },
              })
            }
          />
        </View>
      ))}
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    intro: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    lessonTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
    },
    recommendation: {
      borderTopColor: colors.borderSubtle,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: Spacing.two,
      paddingTop: Spacing.three,
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
    },
  });
