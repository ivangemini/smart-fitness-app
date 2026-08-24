import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getMobileApiBaseUrl } from '@/api';
import { createApiClient } from '@/api/client';
import { AuthContext } from '@/auth';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { DestructiveButton } from '@/components/ui/DestructiveButton';
import { FormField } from '@/components/ui/FormField';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { createTrainerCollaborationApi } from './trainerCollaborationApi';
import { getTrainerCollaborationCopy } from './trainerCollaborationCopy';
import {
  isUuid,
  toTrainerRelationshipView,
  toggleTrainerScope,
  TRAINER_READ_SCOPES,
  type TrainerReadScope,
  type TrainerRelationship,
  type TrainerRelationshipView,
} from './trainerCollaborationModel';

const INVITE_BUSY_KEY = 'invite';

export function TrainerCollaborationScreen() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = useMemo(() => getTrainerCollaborationCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const api = useMemo(
    () => createTrainerCollaborationApi(createApiClient({ baseUrl: getMobileApiBaseUrl() })),
    [],
  );
  const currentUserId = auth?.user?.id ?? null;
  const accessToken = auth?.session?.tokens.accessToken ?? null;

  const [relationships, setRelationships] = useState<TrainerRelationshipView[]>([]);
  const [trainerUserId, setTrainerUserId] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<TrainerReadScope[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [mutationError, setMutationError] = useState(false);

  const toOwnedView = useCallback(
    (relationship: TrainerRelationship): TrainerRelationshipView => {
      if (!currentUserId) throw new Error('Trainer collaboration requires an authenticated user');
      const view = toTrainerRelationshipView(relationship, currentUserId);
      if (!view) throw new Error('Trainer relationship does not belong to the current account');
      return view;
    },
    [currentUserId],
  );

  const loadRelationships = useCallback(async () => {
    if (!accessToken || !currentUserId) {
      setRelationships([]);
      setLoading(false);
      setLoadError(false);
      return;
    }

    setLoading(true);
    setLoadError(false);
    try {
      const result = await api.listRelationships(accessToken);
      setRelationships(result.map(toOwnedView));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [accessToken, api, currentUserId, toOwnedView]);

  useEffect(() => {
    void loadRelationships();
  }, [loadRelationships]);

  const replaceRelationship = useCallback(
    (relationship: TrainerRelationship) => {
      const view = toOwnedView(relationship);
      setRelationships((current) => {
        const remaining = current.filter((item) => item.id !== view.id);
        return [view, ...remaining];
      });
    },
    [toOwnedView],
  );

  const normalizedTrainerId = trainerUserId.trim();
  const trainerIdValid =
    isUuid(normalizedTrainerId) &&
    normalizedTrainerId.toLowerCase() !== currentUserId?.toLowerCase();
  const canInvite = Boolean(
    accessToken && trainerIdValid && selectedScopes.length > 0 && !busyKey,
  );

  const createInvitation = async () => {
    if (!accessToken || !canInvite) return;
    setBusyKey(INVITE_BUSY_KEY);
    setMutationError(false);
    try {
      const relationship = await api.createInvitation(accessToken, {
        trainerUserId: normalizedTrainerId,
        scopes: selectedScopes,
      });
      replaceRelationship(relationship);
      setTrainerUserId('');
      setSelectedScopes([]);
    } catch {
      setMutationError(true);
    } finally {
      setBusyKey(null);
    }
  };

  const acceptInvitation = async (relationshipId: string) => {
    if (!accessToken || busyKey) return;
    setBusyKey(relationshipId);
    setMutationError(false);
    try {
      replaceRelationship(await api.acceptInvitation(accessToken, relationshipId));
    } catch {
      setMutationError(true);
    } finally {
      setBusyKey(null);
    }
  };

  const revokeRelationship = async (relationshipId: string) => {
    if (!accessToken || busyKey) return;
    setBusyKey(relationshipId);
    setMutationError(false);
    try {
      replaceRelationship(await api.revokeRelationship(accessToken, relationshipId));
    } catch {
      setMutationError(true);
    } finally {
      setBusyKey(null);
    }
  };

  const openCollaboration = (relationshipId: string) => {
    router.push({
      pathname: '/settings/trainer-collaboration/[relationshipId]',
      params: { relationshipId },
    });
  };

  const counterpartLabel = (relationship: TrainerRelationshipView) =>
    relationship.counterpart.displayName?.trim() ||
    `${copy.counterpartFallback} · ${relationship.counterpart.userId.slice(0, 8)}`;

  return (
    <SettingsScreenLayout subtitle={copy.subtitle} title={copy.title}>
      {!accessToken || !currentUserId ? (
        <AppCard>
          <Text style={styles.body}>{copy.accountRequired}</Text>
        </AppCard>
      ) : (
        <>
          <AppCard>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>{copy.inviteTitle}</Text>
              <Text style={styles.body}>{copy.inviteBody}</Text>
            </View>

            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              errorMessage={trainerUserId.length > 0 && !trainerIdValid ? copy.trainerIdInvalid : null}
              helperText={copy.trainerIdHelper}
              label={copy.trainerId}
              onChangeText={setTrainerUserId}
              value={trainerUserId}
            />

            <View style={styles.scopeBlock}>
              <Text style={styles.label}>{copy.scopes}</Text>
              <Text style={styles.hint}>{copy.scopesHint}</Text>
              <View style={styles.scopeList}>
                {TRAINER_READ_SCOPES.map((scope) => {
                  const selected = selectedScopes.includes(scope);
                  return (
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      key={scope}
                      onPress={() => setSelectedScopes((current) => toggleTrainerScope(current, scope))}
                      style={[
                        styles.scopeRow,
                        selected && styles.scopeRowSelected,
                      ]}
                    >
                      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                        <Text style={styles.checkboxMark}>{selected ? '✓' : ''}</Text>
                      </View>
                      <Text style={styles.scopeText}>{copy.scopeLabels[scope]}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {mutationError ? (
              <Text accessibilityRole="alert" style={styles.errorText}>{copy.mutationFailed}</Text>
            ) : null}

            <AppButton
              disabled={!canInvite}
              label={copy.createInvitation}
              loading={busyKey === INVITE_BUSY_KEY}
              onPress={() => void createInvitation()}
            />
          </AppCard>

          <AppCard>
            <View style={styles.relationshipHeader}>
              <Text style={styles.cardTitle}>{copy.relationships}</Text>
              <AppButton
                disabled={loading || Boolean(busyKey)}
                label={copy.refresh}
                loading={loading}
                onPress={() => void loadRelationships()}
                variant="secondary"
              />
            </View>

            {loadError ? (
              <Text accessibilityRole="alert" style={styles.errorText}>{copy.unavailable}</Text>
            ) : null}

            {!loading && !loadError && relationships.length === 0 ? (
              <Text style={styles.body}>{copy.empty}</Text>
            ) : null}

            <View style={styles.relationshipList}>
              {relationships.map((relationship) => {
                const relationshipBusy = busyKey === relationship.id;
                const canAccept = relationship.status === 'invited' && relationship.role === 'trainer';
                const canRevoke = relationship.status !== 'revoked';
                return (
                  <View key={relationship.id} style={styles.relationshipBlock}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.relationshipTitle}>{counterpartLabel(relationship)}</Text>
                      <Text style={styles.meta}>
                        {copy.role}: {copy.roleLabels[relationship.role]}
                      </Text>
                      <Text style={styles.meta}>
                        {copy.status}: {copy.statusLabels[relationship.status]}
                      </Text>
                    </View>

                    <View style={styles.scopeBlock}>
                      <Text style={styles.label}>{copy.grantedScopes}</Text>
                      {relationship.scopes.map((scope) => (
                        <Text key={scope} style={styles.meta}>• {copy.scopeLabels[scope]}</Text>
                      ))}
                    </View>

                    {relationship.status === 'invited' && relationship.role === 'client' ? (
                      <Text style={styles.hint}>{copy.awaitingAcceptance}</Text>
                    ) : null}

                    {relationship.status === 'active' ? (
                      <AppButton
                        disabled={Boolean(busyKey)}
                        label={copy.openCollaboration}
                        onPress={() => openCollaboration(relationship.id)}
                        variant="secondary"
                      />
                    ) : null}

                    {canAccept ? (
                      <AppButton
                        disabled={Boolean(busyKey)}
                        label={copy.accept}
                        loading={relationshipBusy}
                        onPress={() => void acceptInvitation(relationship.id)}
                      />
                    ) : null}

                    {canRevoke ? (
                      <DestructiveButton
                        disabled={Boolean(busyKey)}
                        label={relationship.status === 'invited' && relationship.role === 'client'
                          ? copy.cancelInvitation
                          : copy.revoke}
                        loading={relationshipBusy && !canAccept}
                        onPress={() => void revokeRelationship(relationship.id)}
                      />
                    ) : null}
                  </View>
                );
              })}
            </View>
          </AppCard>

          <AppCard>
            <Text style={styles.hint}>{copy.privacy}</Text>
          </AppCard>
        </>
      )}
    </SettingsScreenLayout>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    checkbox: {
      alignItems: 'center',
      borderColor: colors.borderSubtle,
      borderRadius: Radii.small,
      borderWidth: StyleSheet.hairlineWidth,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    checkboxMark: { color: colors.textOnAccent, fontSize: 15, fontWeight: '800' },
    checkboxSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
    errorText: { color: colors.error, fontSize: 13, lineHeight: 19 },
    hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    meta: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    relationshipBlock: {
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: Spacing.three,
      paddingTop: Spacing.four,
    },
    relationshipHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },
    relationshipList: { gap: Spacing.four },
    relationshipTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '800', lineHeight: 22 },
    scopeBlock: { gap: Spacing.one },
    scopeList: { gap: Spacing.one },
    scopeRow: {
      alignItems: 'center',
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.two,
      minHeight: 48,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    scopeRowSelected: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
    scopeText: { color: colors.textPrimary, flex: 1, fontSize: 14, lineHeight: 20 },
    sectionHeader: { gap: Spacing.one },
  });
}
