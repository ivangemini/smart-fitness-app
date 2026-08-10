import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { buildProfileAuthViewModel } from '@/auth/auth-ui';
import { AppCard } from '@/components/ui/AppCard';
import { DestructiveButton } from '@/components/ui/DestructiveButton';
import { InlineError } from '@/components/ui/InlineError';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { ChangePasswordModal } from './ChangePasswordModal';
import { DeleteAccountModal } from './DeleteAccountModal';

export function AuthGateCard() {
  const router = useRouter();
  const { t } = useLocalization();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    changePassword,
    deleteAccount,
    error,
    fetchProfile,
    logout,
    profile,
    ready,
    refresh,
    session,
  } = useAuthSession();
  const viewModel = buildProfileAuthViewModel({ ready, session, profile, error });
  const [busyAction, setBusyAction] = useState<'refresh' | 'logout' | null>(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const goToSignIn = () => router.push('/auth/sign-in');
  const goToRegister = () => router.push('/auth/register');

  const handleRefreshProfile = async () => {
    if (busyAction) return;

    setBusyAction('refresh');
    try {
      await refresh();
      await fetchProfile();
    } finally {
      setBusyAction(null);
    }
  };

  const handleLogout = async () => {
    if (busyAction) return;

    setBusyAction('logout');
    try {
      await logout();
    } finally {
      setBusyAction(null);
    }
  };

  const description =
    viewModel.status === 'restoring'
      ? t('account.description.restoring')
      : viewModel.status === 'signed_in'
        ? t('account.description.signedIn')
        : viewModel.status === 'auth_error'
          ? t('account.description.authError')
          : t('account.description.signedOut');
  const emailLabel =
    viewModel.emailLabel === 'Not available' ? t('common.notAvailable') : viewModel.emailLabel;
  const displayNameLabel =
    viewModel.displayNameLabel === 'Not set' ? t('common.notSet') : viewModel.displayNameLabel;

  return (
    <AppCard>
      <Text style={styles.title}>{t('account.title')}</Text>
      <Text style={styles.helpText}>{description}</Text>

      {viewModel.status === 'restoring' ? <LoadingState label={t('account.loading')} /> : null}
      {viewModel.status === 'auth_error' ? (
        <InlineError message={t('account.restoreError')} />
      ) : null}

      {viewModel.status === 'signed_in' ? (
        <View style={styles.metaStack}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{t('account.emailLabel')}</Text>
            <Text selectable style={styles.metaValue}>
              {emailLabel}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{t('account.displayNameLabel')}</Text>
            <Text selectable style={styles.metaValue}>
              {displayNameLabel}
            </Text>
          </View>
          <Text style={styles.note}>{t('account.note')}</Text>
        </View>
      ) : null}

      {viewModel.status === 'signed_in' ? (
        <>
          <PrimaryButton
            disabled={busyAction === 'refresh'}
            label={
              busyAction === 'refresh' ? t('account.refreshing') : t('account.refreshProfile')
            }
            loading={busyAction === 'refresh'}
            onPress={handleRefreshProfile}
          />
          <SecondaryButton
            label={t('account.devices')}
            onPress={() => router.push('/account/sessions')}
          />
          <SecondaryButton
            label={t('account.changePassword')}
            onPress={() => setChangePasswordModalOpen(true)}
          />
          <SecondaryButton
            disabled={busyAction === 'logout'}
            label={busyAction === 'logout' ? t('account.loggingOut') : t('account.logout')}
            loading={busyAction === 'logout'}
            onPress={handleLogout}
          />
          <DestructiveButton
            accessibilityHint={t('account.deleteHint')}
            label={t('account.delete')}
            onPress={() => setDeleteModalOpen(true)}
          />
        </>
      ) : null}

      {viewModel.status !== 'signed_in' ? (
        <>
          <PrimaryButton label={t('common.signIn')} onPress={goToSignIn} />
          <SecondaryButton label={t('common.createAccount')} onPress={goToRegister} />
        </>
      ) : null}

      <ChangePasswordModal
        onChangePassword={changePassword}
        onChanged={() => {
          setChangePasswordModalOpen(false);
          Alert.alert(t('account.passwordChangedTitle'), t('account.passwordChangedBody'), [
            {
              text: t('common.signIn'),
              onPress: () => router.replace('/auth/sign-in'),
            },
          ]);
        }}
        onClose={() => setChangePasswordModalOpen(false)}
        visible={changePasswordModalOpen}
      />

      <DeleteAccountModal
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteAccount}
        onDeleted={(result) => {
          setDeleteModalOpen(false);
          Alert.alert(
            t('account.deletedTitle'),
            result.localCleanupComplete
              ? t('account.deletedComplete')
              : t('account.deletedPending'),
            [
              {
                text: t('common.continue'),
                onPress: () => router.replace('/auth/sign-in'),
              },
            ],
          );
        }}
        visible={deleteModalOpen}
      />
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    helpText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    metaLabel: {
      color: colors.textSecondary,
      fontSize: Typography.metricSmall.fontSize,
      fontWeight: Typography.metricSmall.fontWeight,
      lineHeight: Typography.metricSmall.lineHeight,
      textTransform: Typography.metricSmall.textTransform,
    },
    metaRow: {
      borderColor: colors.border,
      borderTopWidth: 1,
      gap: Spacing.one,
      paddingTop: Spacing.two,
    },
    metaStack: {
      gap: Spacing.one,
    },
    metaValue: {
      color: colors.text,
      fontSize: Typography.bodyStrong.fontSize,
      fontWeight: Typography.bodyStrong.fontWeight,
      lineHeight: Typography.bodyStrong.lineHeight,
    },
    note: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    title: {
      color: colors.text,
      fontSize: Typography.sectionTitle.fontSize,
      fontWeight: Typography.sectionTitle.fontWeight,
      letterSpacing: Typography.sectionTitle.letterSpacing,
      lineHeight: Typography.sectionTitle.lineHeight,
      textTransform: Typography.sectionTitle.textTransform,
    },
  });
