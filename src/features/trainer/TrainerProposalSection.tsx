import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Crypto from 'expo-crypto';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { Colors, Spacing, Typography } from '@/constants/theme';
import {
  formatLocalizedDateTime,
  type SupportedLocale,
} from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import type { TrainerCollaborationApi } from './trainerCollaborationApi';
import type { TrainerWorkoutTemplateItem } from './trainerCollaborationC3Model';
import { getTrainerCollaborationC4Copy } from './trainerCollaborationC4Copy';
import {
  TRAINER_PROPOSAL_TYPE,
  type TrainerProposal,
  type TrainerWorkoutTemplateMetadataPatch,
} from './trainerCollaborationC4Model';
import type { TrainerRelationshipView } from './trainerCollaborationModel';

type Props = {
  accessToken: string;
  api: TrainerCollaborationApi;
  locale: SupportedLocale;
  relationship: TrainerRelationshipView;
};

type Draft = {
  name: string;
  goal: string;
  difficulty: string;
  durationWeeks: string;
  cadencePerWeek: string;
  message: string;
};

const EMPTY_DRAFT: Draft = {
  name: '',
  goal: '',
  difficulty: '',
  durationWeeks: '',
  cadencePerWeek: '',
  message: '',
};

const templateDraft = (template: TrainerWorkoutTemplateItem): Draft => ({
  name: template.name,
  goal: template.goal ?? '',
  difficulty: template.difficulty ?? '',
  durationWeeks: template.durationWeeks?.toString() ?? '',
  cadencePerWeek: template.cadencePerWeek?.toString() ?? '',
  message: '',
});

const parseBoundedInteger = (
  value: string,
  min: number,
  max: number,
): number | null => {
  if (!/^\d+$/.test(value.trim())) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
};

const buildPatch = (
  template: TrainerWorkoutTemplateItem,
  draft: Draft,
): TrainerWorkoutTemplateMetadataPatch | null => {
  const patch: TrainerWorkoutTemplateMetadataPatch = {};
  const name = draft.name.trim();
  const goal = draft.goal.trim();
  const difficulty = draft.difficulty.trim();
  if (name !== template.name) {
    if (!name || name.length > 160) return null;
    patch.name = name;
  }
  if (goal !== (template.goal ?? '')) {
    if (!goal || goal.length > 160) return null;
    patch.goal = goal;
  }
  if (difficulty !== (template.difficulty ?? '')) {
    if (!difficulty || difficulty.length > 32) return null;
    patch.difficulty = difficulty;
  }
  if (draft.durationWeeks.trim() !== (template.durationWeeks?.toString() ?? '')) {
    const value = parseBoundedInteger(draft.durationWeeks, 1, 104);
    if (value === null) return null;
    patch.durationWeeks = value;
  }
  if (draft.cadencePerWeek.trim() !== (template.cadencePerWeek?.toString() ?? '')) {
    const value = parseBoundedInteger(draft.cadencePerWeek, 1, 14);
    if (value === null) return null;
    patch.cadencePerWeek = value;
  }
  return Object.keys(patch).length > 0 ? patch : null;
};

export function TrainerProposalSection({ accessToken, api, locale, relationship }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = useMemo(() => getTrainerCollaborationC4Copy(locale), [locale]);
  const [proposals, setProposals] = useState<TrainerProposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [withdrawErrorId, setWithdrawErrorId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TrainerWorkoutTemplateItem[] | null>(null);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState(false);
  const [selected, setSelected] = useState<TrainerWorkoutTemplateItem | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [attemptKey, setAttemptKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const loadProposals = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setProposals(await api.listProposals(accessToken, relationship.id));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [accessToken, api, relationship.id]);

  useEffect(() => {
    setProposals([]);
    setTemplates(null);
    setSelected(null);
    setDraft(EMPTY_DRAFT);
    setAttemptKey(null);
    void loadProposals();
  }, [loadProposals]);

  const loadTemplates = async () => {
    if (
      relationship.role !== 'trainer' ||
      !relationship.scopes.includes('workout_templates')
    ) {
      return;
    }
    setTemplatesLoading(true);
    setTemplatesError(false);
    try {
      const evidence = await api.loadEvidence(
        accessToken,
        relationship.id,
        'workout_templates',
      );
      if (evidence.scope !== 'workout_templates') throw new Error('Unexpected trainer evidence');
      setTemplates(evidence.data);
    } catch {
      setTemplates(null);
      setTemplatesError(true);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const chooseTemplate = (template: TrainerWorkoutTemplateItem) => {
    setSelected(template);
    setDraft(templateDraft(template));
    setAttemptKey(null);
    setSubmitError(false);
  };

  const updateDraft = (key: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setAttemptKey(null);
    setSubmitError(false);
  };

  const patch = selected ? buildPatch(selected, draft) : null;
  const note = draft.message.trim();
  const canSubmit = Boolean(
    selected &&
      patch &&
      note.length <= 2000 &&
      !submitting,
  );

  const submit = async () => {
    if (!selected || !patch || !canSubmit) return;
    const idempotencyKey = attemptKey ?? Crypto.randomUUID();
    if (!attemptKey) setAttemptKey(idempotencyKey);
    setSubmitting(true);
    setSubmitError(false);
    try {
      const proposal = await api.createProposal(accessToken, relationship.id, {
        proposalType: TRAINER_PROPOSAL_TYPE,
        targetId: selected.id,
        patch,
        message: note || null,
        idempotencyKey,
      });
      setProposals((current) => [proposal, ...current.filter((item) => item.id !== proposal.id)]);
      setSelected(null);
      setDraft(EMPTY_DRAFT);
      setAttemptKey(null);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const withdraw = async (proposalId: string) => {
    if (relationship.role !== 'trainer' || withdrawingId) return;
    setWithdrawingId(proposalId);
    setWithdrawErrorId(null);
    try {
      const proposal = await api.withdrawProposal(accessToken, relationship.id, proposalId);
      setProposals((current) =>
        current.map((item) => (item.id === proposal.id ? proposal : item)),
      );
    } catch {
      setWithdrawErrorId(proposalId);
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <AppCard>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.hint}>{copy.subtitle}</Text>
        <Text style={styles.hint}>{copy.noApply}</Text>
      </View>
      <AppButton
        disabled={loading}
        label={copy.refresh}
        loading={loading}
        onPress={() => void loadProposals()}
        variant="secondary"
      />
      {loadError ? <Text style={styles.error}>{copy.unavailable}</Text> : null}
      {!loading && !loadError && proposals.length === 0 ? (
        <Text style={styles.hint}>{copy.empty}</Text>
      ) : null}
      <View style={styles.list}>
        {proposals.map((proposal) => (
          <View key={proposal.id} style={styles.proposal}>
            <View style={styles.rowBetween}>
              <Text style={styles.proposalTitle}>
                {proposal.author.displayName?.trim() || copy.humanTrainer}
              </Text>
              <Text style={styles.meta}>{copy.statuses[proposal.status]}</Text>
            </View>
            <Text style={styles.meta}>
              {copy.createdAt}: {formatLocalizedDateTime(proposal.createdAt, locale)}
            </Text>
            <Text style={styles.meta}>
              {copy.targetState}: {copy.targetStates[proposal.target.state]}
            </Text>
            <Text style={styles.meta}>
              {copy.targetRevision}: {proposal.target.expectedRevision}
              {proposal.target.currentRevision
                ? ` → ${proposal.target.currentRevision}`
                : ''}
            </Text>
            {proposal.message ? (
              <View style={styles.block}>
                <Text style={styles.label}>{copy.message}</Text>
                <Text style={styles.body}>{proposal.message}</Text>
              </View>
            ) : null}
            <View style={styles.block}>
              <Text style={styles.label}>{copy.changes}</Text>
              {proposal.changes.map((change) => (
                <View key={change.field} style={styles.change}>
                  <Text style={styles.changeLabel}>{copy.fields[change.field]}</Text>
                  <Text style={styles.meta}>
                    {copy.before}: {String(change.before)}
                  </Text>
                  <Text style={styles.body}>
                    {copy.after}: {String(change.after)}
                  </Text>
                </View>
              ))}
            </View>
            {proposal.target.state === 'stale' ? (
              <Text style={styles.warning}>{copy.staleHint}</Text>
            ) : null}
            {proposal.status === 'withdrawn' ? (
              <Text style={styles.hint}>{copy.withdrawnHint}</Text>
            ) : null}
            {relationship.role === 'trainer' && proposal.status === 'pending' ? (
              <AppButton
                disabled={Boolean(withdrawingId)}
                label={copy.withdraw}
                loading={withdrawingId === proposal.id}
                onPress={() => void withdraw(proposal.id)}
                variant="secondary"
              />
            ) : null}
            {withdrawErrorId === proposal.id ? (
              <Text style={styles.error}>{copy.withdrawFailed}</Text>
            ) : null}
          </View>
        ))}
      </View>

      {relationship.role === 'trainer' ? (
        <View style={styles.authoring}>
          <Text style={styles.title}>{copy.authoringTitle}</Text>
          <Text style={styles.hint}>{copy.authoringHint}</Text>
          {!relationship.scopes.includes('workout_templates') ? (
            <Text style={styles.warning}>{copy.scopeRequired}</Text>
          ) : (
            <AppButton
              disabled={templatesLoading}
              label={copy.loadTemplates}
              loading={templatesLoading}
              onPress={() => void loadTemplates()}
              variant="secondary"
            />
          )}
          {templatesError ? <Text style={styles.error}>{copy.templatesFailed}</Text> : null}
          {templates && templates.length === 0 ? (
            <Text style={styles.hint}>{copy.templatesEmpty}</Text>
          ) : null}
          {templates ? (
            <View style={styles.templateList}>
              {templates.map((template) => (
                <View key={template.id} style={styles.templateRow}>
                  <View style={styles.flex}>
                    <Text style={styles.proposalTitle}>{template.name}</Text>
                    <Text style={styles.meta}>{template.goal ?? '—'}</Text>
                  </View>
                  <AppButton
                    label={copy.choose}
                    onPress={() => chooseTemplate(template)}
                    variant="secondary"
                  />
                </View>
              ))}
            </View>
          ) : null}
          {selected ? (
            <View style={styles.form}>
              <Text style={styles.label}>{copy.selected}: {selected.name}</Text>
              <FormField label={copy.nameLabel} onChangeText={(v) => updateDraft('name', v)} value={draft.name} />
              <FormField label={copy.goalLabel} onChangeText={(v) => updateDraft('goal', v)} value={draft.goal} />
              <FormField label={copy.difficultyLabel} onChangeText={(v) => updateDraft('difficulty', v)} value={draft.difficulty} />
              <FormField keyboardType="number-pad" label={copy.durationLabel} onChangeText={(v) => updateDraft('durationWeeks', v)} value={draft.durationWeeks} />
              <FormField keyboardType="number-pad" label={copy.cadenceLabel} onChangeText={(v) => updateDraft('cadencePerWeek', v)} value={draft.cadencePerWeek} />
              <FormField label={copy.noteLabel} maxLength={2000} multiline onChangeText={(v) => updateDraft('message', v)} placeholder={copy.notePlaceholder} value={draft.message} />
              {!patch ? <Text style={styles.hint}>{copy.invalidForm}</Text> : null}
              {submitError ? <Text style={styles.error}>{copy.submitFailed}</Text> : null}
              <AppButton disabled={!canSubmit} label={copy.submit} loading={submitting} onPress={() => void submit()} />
              <AppButton label={copy.reset} onPress={() => chooseTemplate(selected)} variant="secondary" />
            </View>
          ) : null}
        </View>
      ) : null}
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    authoring: { borderTopColor: colors.divider, borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.three, paddingTop: Spacing.four },
    block: { gap: Spacing.one },
    body: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    change: { borderTopColor: colors.divider, borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.one, paddingTop: Spacing.two },
    changeLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', lineHeight: 19 },
    error: { color: colors.error, fontSize: 13, lineHeight: 19 },
    flex: { flex: 1, minWidth: 0 },
    form: { gap: Spacing.three },
    hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
    label: { color: colors.textSecondary, fontSize: Typography.label.fontSize, fontWeight: Typography.label.fontWeight, lineHeight: Typography.label.lineHeight },
    list: { gap: Spacing.four },
    meta: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
    proposal: { borderTopColor: colors.divider, borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.two, paddingTop: Spacing.three },
    proposalTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', lineHeight: 20 },
    rowBetween: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two, justifyContent: 'space-between' },
    sectionHeader: { gap: Spacing.one },
    templateList: { gap: Spacing.two },
    templateRow: { alignItems: 'center', borderTopColor: colors.divider, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: Spacing.three, paddingTop: Spacing.two },
    title: { color: colors.textPrimary, fontSize: Typography.cardTitle.fontSize, fontWeight: Typography.cardTitle.fontWeight, lineHeight: Typography.cardTitle.lineHeight },
    warning: { color: colors.warning, fontSize: 12, lineHeight: 18 },
  });
