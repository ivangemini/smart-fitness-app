import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  COACH_QUESTION_MAX_LENGTH,
  createCoachApi,
  type CoachQuestionResponse,
  type CoachQuestionUnsupportedReason,
} from '@/api/coach';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const COPY = {
  en: {
    title: 'Ask Coach',
    description:
      'Ask about your recorded training, nutrition, recovery, labs, or saved goal. Coach uses only the data needed for the question.',
    label: 'Question',
    placeholder: 'How am I progressing toward my saved goal?',
    ask: 'Ask Coach',
    signIn: 'Sign in to ask Coach',
    signInBody: 'Questions use your private account data and require an authenticated session.',
    unavailable: 'Structured Coach questions are not available on this server right now.',
    answer: 'Coach answer',
    evidence: 'Evidence used',
    limited: 'Limited data',
    sufficient: 'Recorded data available',
    unsupported: 'This question cannot be answered from the currently supported Coach data.',
    error: 'Coach could not answer this question right now.',
    caveat: 'Some evidence is limited or incomplete.',
    characters: (used: number, max: number) => `${used} / ${max}`,
  },
  ru: {
    title: 'Спросить Coach',
    description:
      'Спроси о записанных тренировках, питании, восстановлении, анализах или сохранённой цели. Coach использует только нужные для вопроса данные.',
    label: 'Вопрос',
    placeholder: 'Как я продвигаюсь к своей сохранённой цели?',
    ask: 'Спросить Coach',
    signIn: 'Войти, чтобы спросить Coach',
    signInBody: 'Вопросы используют приватные данные аккаунта и требуют авторизации.',
    unavailable: 'Структурированные вопросы Coach сейчас недоступны на этом сервере.',
    answer: 'Ответ Coach',
    evidence: 'Использованные данные',
    limited: 'Данных мало',
    sufficient: 'Записанных данных достаточно',
    unsupported: 'На этот вопрос пока нельзя ответить из поддерживаемых данных Coach.',
    error: 'Сейчас Coach не смог ответить на этот вопрос.',
    caveat: 'Часть данных ограничена или неполна.',
    characters: (used: number, max: number) => `${used} / ${max}`,
  },
} as const;

const unsupportedMessage = (
  locale: 'en' | 'ru',
  reason: CoachQuestionUnsupportedReason,
) => {
  const details = {
    en: {
      labs_context_not_available: 'The required confirmed Labs context is not available.',
      body_metrics_context_not_available: 'The required body-metrics context is not available.',
      outside_coach_scope: 'The question is outside the supported fitness Coach scope.',
      insufficient_question_detail: 'Add a little more detail so Coach can choose a safe data scope.',
    },
    ru: {
      labs_context_not_available: 'Нужный подтверждённый контекст анализов недоступен.',
      body_metrics_context_not_available: 'Нужный контекст измерений тела недоступен.',
      outside_coach_scope: 'Вопрос выходит за поддерживаемую фитнес-область Coach.',
      insufficient_question_detail: 'Добавь немного деталей, чтобы Coach мог выбрать безопасный набор данных.',
    },
  } as const;
  return details[locale][reason];
};

type CapabilityState = 'idle' | 'checking' | 'available' | 'unavailable';

export function CoachQuestionCard() {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const { ready, refresh, session } = useAuthSession();
  const copy = COPY[locale];
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<CoachQuestionResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capabilityState, setCapabilityState] = useState<CapabilityState>('idle');
  const isAuthenticated = Boolean(session?.tokens.accessToken);
  const normalizedQuestion = question.trim();

  const coachApi = useMemo(
    () =>
      createCoachApi({
        getAccessToken: async () => session?.tokens.accessToken ?? null,
        refreshAccessToken: async () => (await refresh())?.tokens.accessToken ?? null,
      }),
    [refresh, session?.tokens.accessToken],
  );

  useEffect(() => {
    let cancelled = false;
    if (!ready || !isAuthenticated) {
      setCapabilityState('idle');
      return () => {
        cancelled = true;
      };
    }
    setCapabilityState('checking');
    void coachApi
      .getCapabilities()
      .then((capabilities) => {
        if (cancelled) return;
        setCapabilityState(
          capabilities.questions?.structuredAnswer === true &&
            capabilities.questions.readOnly === true &&
            capabilities.questions.automaticApplication === false
            ? 'available'
            : 'unavailable',
        );
      })
      .catch(() => {
        if (!cancelled) setCapabilityState('unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [coachApi, isAuthenticated, ready]);

  const canSubmit =
    ready &&
    isAuthenticated &&
    capabilityState === 'available' &&
    !busy &&
    normalizedQuestion.length > 0 &&
    normalizedQuestion.length <= COACH_QUESTION_MAX_LENGTH;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    setResponse(null);
    try {
      setResponse(await coachApi.askQuestion(normalizedQuestion));
    } catch {
      setError(copy.error);
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <AppCard>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.body}>{copy.description}</Text>
      </AppCard>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppCard>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.body}>{copy.signInBody}</Text>
        <AppButton label={copy.signIn} onPress={() => router.push('/auth/sign-in')} />
      </AppCard>
    );
  }

  return (
    <AppCard>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.body}>{copy.description}</Text>
      <FormField
        accessibilityLabel={copy.label}
        autoCapitalize="sentences"
        editable={!busy && capabilityState === 'available'}
        helperText={copy.characters(question.length, COACH_QUESTION_MAX_LENGTH)}
        label={copy.label}
        maxLength={COACH_QUESTION_MAX_LENGTH}
        multiline
        onChangeText={setQuestion}
        placeholder={copy.placeholder}
        returnKeyType="default"
        style={styles.input}
        textAlignVertical="top"
        value={question}
      />
      <AppButton
        disabled={!canSubmit}
        label={copy.ask}
        loading={busy || capabilityState === 'checking'}
        onPress={() => void submit()}
      />
      {capabilityState === 'unavailable' ? (
        <Text style={styles.meta}>{copy.unavailable}</Text>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {response?.status === 'unsupported' ? (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>{copy.unsupported}</Text>
          <Text style={styles.body}>{unsupportedMessage(locale, response.reason)}</Text>
        </View>
      ) : null}

      {response?.status === 'answered' ? (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>{copy.answer}</Text>
          <Text selectable style={styles.answer}>
            {response.answer.answer}
          </Text>
          <Text style={styles.meta}>
            {response.answer.dataQuality === 'limited' ? copy.limited : copy.sufficient}
          </Text>
          <Text style={styles.resultTitle}>{copy.evidence}</Text>
          {response.answer.evidenceSummary.map((item, index) => (
            <Text selectable key={`${index}:${item}`} style={styles.body}>
              • {item}
            </Text>
          ))}
          {response.answer.caveatCodes.length > 0 ? (
            <Text style={styles.meta}>{copy.caveat}</Text>
          ) : null}
        </View>
      ) : null}
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    answer: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    error: {
      color: colors.error,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    input: {
      minHeight: 112,
    },
    meta: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    result: {
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    resultTitle: {
      color: colors.textPrimary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
