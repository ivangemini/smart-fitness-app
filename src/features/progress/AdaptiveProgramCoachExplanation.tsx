import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createCoachApi, type CoachQuestionResponse } from '@/api/coach';
import { AppButton } from '@/components/ui/AppButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import type {
  AdaptiveProgramProposal,
  RecoveryModifierEvidence,
} from './adaptiveProgramEngine';
import {
  buildAdaptiveProgramCoachQuestion,
  supportsAdaptiveProgramCoachExplanation,
} from './adaptiveProgramCoachExplanation';

const COPY = {
  en: {
    explain: 'Explain with Coach',
    signIn: 'Sign in to ask Coach',
    answer: 'Coach explanation',
    evidence: 'Coach evidence',
    unavailable: 'Read-only Coach explanations are not available on this server.',
    unsupported: 'Coach could not explain this proposal from the supported question scope.',
    error: 'Coach could not explain this proposal right now.',
    boundary:
      'Coach explains the existing deterministic proposal only. It cannot change the action or apply a template update.',
  },
  ru: {
    explain: 'Объяснить с Coach',
    signIn: 'Войти, чтобы спросить Coach',
    answer: 'Объяснение Coach',
    evidence: 'Данные Coach',
    unavailable: 'Read-only объяснения Coach недоступны на этом сервере.',
    unsupported: 'Coach не смог объяснить это предложение в поддерживаемой области вопросов.',
    error: 'Сейчас Coach не смог объяснить это предложение.',
    boundary:
      'Coach только объясняет уже рассчитанное детерминированное предложение. Он не может изменить action или применить изменение шаблона.',
  },
} as const;

export function AdaptiveProgramCoachExplanation({
  proposal,
  recovery,
}: {
  proposal: AdaptiveProgramProposal;
  recovery: RecoveryModifierEvidence;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const { ready, refresh, session } = useAuthSession();
  const copy = COPY[locale];
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<CoachQuestionResponse | null>(null);
  const isAuthenticated = Boolean(session?.tokens.accessToken);
  const question = useMemo(
    () => buildAdaptiveProgramCoachQuestion({ locale, proposal, recovery }),
    [locale, proposal, recovery],
  );
  const coachApi = useMemo(
    () =>
      createCoachApi({
        getAccessToken: async () => session?.tokens.accessToken ?? null,
        refreshAccessToken: async () => (await refresh())?.tokens.accessToken ?? null,
      }),
    [refresh, session?.tokens.accessToken],
  );

  const explain = async () => {
    if (!ready || busy) return;
    if (!isAuthenticated) {
      router.push('/auth/sign-in');
      return;
    }

    setBusy(true);
    setError(null);
    setResponse(null);
    try {
      const capabilities = await coachApi.getCapabilities();
      if (!supportsAdaptiveProgramCoachExplanation(capabilities)) {
        setError(copy.unavailable);
        return;
      }
      const next = await coachApi.askQuestion(question);
      setResponse(next);
      if (next.status === 'unsupported') setError(copy.unsupported);
    } catch {
      setError(copy.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppButton
        disabled={!ready || busy}
        label={isAuthenticated ? copy.explain : copy.signIn}
        loading={busy}
        onPress={() => void explain()}
        variant="secondary"
      />
      <Text selectable style={styles.boundary}>{copy.boundary}</Text>
      {error ? <Text selectable style={styles.error}>{error}</Text> : null}
      {response?.status === 'answered' ? (
        <View style={styles.answerBlock}>
          <Text selectable style={styles.answerTitle}>{copy.answer}</Text>
          <Text selectable style={styles.answer}>{response.answer.answer}</Text>
          <Text selectable style={styles.evidenceTitle}>{copy.evidence}</Text>
          {response.answer.evidenceSummary.map((item, index) => (
            <Text selectable key={`${index}:${item}`} style={styles.evidenceItem}>
              • {item}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    answer: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    answerBlock: { gap: Spacing.one, marginTop: Spacing.one },
    answerTitle: {
      color: colors.textPrimary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    boundary: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    container: { gap: Spacing.one, marginTop: Spacing.one },
    error: {
      color: colors.error,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    evidenceItem: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    evidenceTitle: {
      color: colors.textPrimary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '700',
      lineHeight: Typography.caption.lineHeight,
      marginTop: Spacing.one,
    },
  });
