import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

import type { LabInterpretationState } from './labInterpretationState';
import { getLabInterpretationCopy } from './labInterpretationCopy';

export type LabInterpretationCardProps = {
  documentId: string;
  interpretationDocumentId: string | null;
  locale: string;
  onInterpret(documentId: string): Promise<LabInterpretationState>;
  state: LabInterpretationState;
};

export function LabInterpretationCard({
  documentId,
  interpretationDocumentId,
  locale,
  onInterpret,
  state,
}: LabInterpretationCardProps) {
  const { colors } = useAppTheme();
  const copy = useMemo(() => getLabInterpretationCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const interpretation =
    interpretationDocumentId === documentId ? state.interpretation : null;
  const running = state.status === 'running' && interpretationDocumentId === documentId;
  const failed = state.status === 'error' && interpretationDocumentId === documentId;
  const findings = interpretation?.output.findings ?? [];

  return (
    <AppCard>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.body}>{copy.body}</Text>

      {state.available !== true ? (
        <Text style={styles.muted}>{copy.unavailable}</Text>
      ) : (
        <>
          {findings.length > 0 ? (
            <View style={styles.findings}>
              {findings.map((finding, index) => (
                <View key={`${finding.kind}-${index}`} style={styles.finding}>
                  <Text style={styles.kind}>{copy.kinds[finding.kind]}</Text>
                  <Text style={styles.body}>{finding.summary}</Text>
                </View>
              ))}
            </View>
          ) : interpretation ? (
            <Text style={styles.muted}>{copy.noFindings}</Text>
          ) : null}

          {interpretation ? (
            <Text style={styles.provenance}>
              {copy.providerContext}: {interpretation.output.provider} · {interpretation.output.model}
            </Text>
          ) : null}

          {failed ? <Text style={styles.warning}>{copy.failed}</Text> : null}
          {running ? (
            <View style={styles.runningRow}>
              <ActivityIndicator color={colors.textPrimary} />
              <Text style={styles.body}>{copy.running}</Text>
            </View>
          ) : null}

          <AppButton
            disabled={running}
            label={
              failed ? copy.retry : interpretation ? copy.rerun : copy.run
            }
            onPress={() => void onInterpret(documentId)}
            variant="secondary"
          />
        </>
      )}
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    finding: {
      gap: Spacing.one,
    },
    findings: {
      gap: Spacing.three,
    },
    kind: {
      color: colors.textPrimary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '600',
      lineHeight: Typography.caption.lineHeight,
    },
    muted: {
      color: colors.textMuted,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    provenance: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    runningRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    warning: {
      color: colors.error,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
  });
