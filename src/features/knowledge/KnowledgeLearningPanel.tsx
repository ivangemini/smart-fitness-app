import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  KnowledgeQuizSubmissionResult,
  PublishedKnowledgeArticle,
} from '@/api/knowledge';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Radii, Spacing, Typography } from '@/constants/theme';
import type { SupportedLocale } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import {
  getKnowledgeLearningCopy,
  getKnowledgeLearningStateLabel,
} from './knowledgeLearningCopy';
import { canSubmitKnowledgeQuiz } from './knowledgeLearningPolicy';
import { useKnowledgeLearningState } from './useKnowledgeLearningState';

type Props = {
  article: PublishedKnowledgeArticle;
  locale: SupportedLocale;
};

export function KnowledgeLearningPanel({ article, locale }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = getKnowledgeLearningCopy(locale);
  const {
    evaluateQuiz,
    learningState,
    loading,
    markRead,
    markingRead,
    pendingRead,
    quizIssue,
    refresh,
    submittingQuiz,
    syncIssue,
  } = useKnowledgeLearningState(article.articleVersionId);
  const [selectedByItem, setSelectedByItem] = useState<Record<string, string>>({});
  const [result, setResult] = useState<KnowledgeQuizSubmissionResult | null>(null);
  const [showAnswerAll, setShowAnswerAll] = useState(false);

  useEffect(() => {
    setSelectedByItem({});
    setResult(null);
    setShowAnswerAll(false);
  }, [article.articleVersionId]);

  const allAnswered = article.quizItems.every(
    (item) => selectedByItem[item.id] !== undefined,
  );
  const evaluationByItem = useMemo(
    () => new Map(result?.evaluations.map((item) => [item.quizItemId, item]) ?? []),
    [result],
  );
  const stateLabel = learningState
    ? getKnowledgeLearningStateLabel(locale, learningState.state)
    : copy.stateUnavailable;
  const canMarkRead = !pendingRead && learningState?.evidenceState == null;
  const quizReady = canSubmitKnowledgeQuiz({ learningState, pendingRead });
  const quizInteractionDisabled = !quizReady || submittingQuiz;

  const selectOption = (quizItemId: string, optionId: string) => {
    if (!quizReady || submittingQuiz) return;
    setSelectedByItem((current) => ({ ...current, [quizItemId]: optionId }));
    setResult(null);
    setShowAnswerAll(false);
  };

  const submit = async () => {
    if (!quizReady) return;
    if (!allAnswered) {
      setShowAnswerAll(true);
      return;
    }
    const nextResult = await evaluateQuiz(
      article.quizItems.map((item) => ({
        quizItemId: item.id,
        selectedOptionId: selectedByItem[item.id]!,
      })),
    );
    if (nextResult) setResult(nextResult);
  };

  return (
    <>
      <AppCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.cardTitle}>{copy.learningTitle}</Text>
          <Text style={styles.stateLabel}>{loading ? '…' : stateLabel}</Text>
        </View>

        {pendingRead ? <Text style={styles.body}>{copy.pendingRead}</Text> : null}
        {syncIssue ? (
          <View style={styles.stackSmall}>
            <Text style={styles.body}>{copy.syncIssue}</Text>
            <AppButton
              label={copy.retrySync}
              onPress={refresh}
              variant="secondary"
            />
          </View>
        ) : null}
        {canMarkRead ? (
          <AppButton
            disabled={markingRead}
            label={markingRead ? copy.markingRead : copy.markRead}
            loading={markingRead}
            onPress={() => void markRead()}
            variant="secondary"
          />
        ) : null}
      </AppCard>

      <AppCard>
        <Text style={styles.cardTitle}>{copy.quizTitle}</Text>
        <Text style={styles.body}>{copy.quizBody}</Text>
        {!quizReady ? (
          <Text style={styles.notice}>{copy.quizReadRequired}</Text>
        ) : null}

        <View style={styles.quizStack}>
          {article.quizItems.map((item, itemIndex) => {
            const evaluation = evaluationByItem.get(item.id);
            return (
              <View key={item.id} style={styles.questionBlock}>
                <Text selectable style={styles.question}>
                  {itemIndex + 1}. {item.question}
                </Text>
                <View style={styles.optionStack}>
                  {item.options.map((option) => {
                    const selected = selectedByItem[item.id] === option.id;
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{
                          disabled: quizInteractionDisabled,
                          selected,
                        }}
                        disabled={quizInteractionDisabled}
                        key={option.id}
                        onPress={() => selectOption(item.id, option.id)}
                        style={({ pressed }) => [
                          styles.option,
                          selected && styles.optionSelected,
                          quizInteractionDisabled && styles.optionDisabled,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.radio,
                            selected && styles.radioSelected,
                          ]}
                        />
                        <Text selectable style={styles.optionLabel}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {evaluation ? (
                  <View style={styles.feedback}>
                    <Text style={styles.feedbackLabel}>
                      {evaluation.correct ? copy.correct : copy.review}
                    </Text>
                    <Text selectable style={styles.body}>
                      {evaluation.feedback}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        {showAnswerAll ? <Text style={styles.notice}>{copy.answerAll}</Text> : null}
        {quizIssue ? <Text style={styles.notice}>{copy.quizUnavailable}</Text> : null}
        {result ? (
          <View style={styles.resultBlock}>
            <Text style={styles.resultTitle}>
              {result.passed ? copy.quizPassed : copy.quizNeedsReview}
            </Text>
            <Text style={styles.body}>
              {copy.resultCount(result.correctCount, result.totalCount)}
            </Text>
          </View>
        ) : null}

        <AppButton
          disabled={quizInteractionDisabled}
          label={submittingQuiz ? copy.submittingQuiz : copy.submitQuiz}
          loading={submittingQuiz}
          onPress={() => void submit()}
        />
      </AppCard>
    </>
  );
}

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.three,
    },
    cardTitle: {
      ...Typography.cardTitle,
      color: colors.textPrimary,
    },
    stateLabel: {
      ...Typography.callout,
      color: colors.accent,
      flexShrink: 1,
      textAlign: 'right',
    },
    body: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    notice: {
      ...Typography.callout,
      color: colors.textSecondary,
    },
    stackSmall: {
      gap: Spacing.two,
    },
    quizStack: {
      gap: Spacing.five,
    },
    questionBlock: {
      gap: Spacing.three,
    },
    question: {
      ...Typography.callout,
      color: colors.textPrimary,
    },
    optionStack: {
      gap: Spacing.two,
    },
    option: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderSubtle,
      backgroundColor: colors.surfaceSecondary,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    optionSelected: {
      borderColor: colors.accent,
    },
    optionDisabled: {
      opacity: 0.55,
    },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.textMuted,
    },
    radioSelected: {
      borderWidth: 5,
      borderColor: colors.accent,
    },
    optionLabel: {
      ...Typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
    feedback: {
      gap: Spacing.one,
      borderLeftWidth: 2,
      borderLeftColor: colors.borderSubtle,
      paddingLeft: Spacing.three,
    },
    feedbackLabel: {
      ...Typography.callout,
      color: colors.textPrimary,
    },
    resultBlock: {
      gap: Spacing.one,
    },
    resultTitle: {
      ...Typography.callout,
      color: colors.textPrimary,
    },
    pressed: {
      opacity: 0.7,
    },
  });
