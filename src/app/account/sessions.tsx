import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getSafeSessionManagementError,
  listAuthSessions,
  revokeAuthSession,
  revokeOtherAuthSessions,
} from '@/auth/sessionManagement';
import type { AuthSessionSummary } from '@/auth/types';
import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { localizeSessionManagementMessage } from '@/localization/authCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function SessionsScreen() {
  const router = useRouter();
  const { formatDate, t } = useLocalization();
  const { colors } = useAppTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { session } = useAuthSession();
  const accessToken = session?.tokens.accessToken ?? null;
  const [sessions, setSessions] = useState<AuthSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      if (!accessToken) {
        setLoading(false);
        setSessions([]);
        setError(null);
        return;
      }

      if (mode === 'refresh') setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        setSessions(await listAuthSessions(accessToken));
      } catch (nextError) {
        setError(getSafeSessionManagementError(nextError));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const confirmRevoke = (target: AuthSessionSummary) => {
    Alert.alert(
      t('sessions.confirmOneTitle'),
      t('sessions.confirmOneBody', { device: target.deviceName }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('sessions.signOut'),
          style: 'destructive',
          onPress: () => {
            if (!accessToken) return;
            setBusyId(target.id);
            void revokeAuthSession(accessToken, target.id)
              .then(() =>
                setSessions((current) => current.filter((item) => item.id !== target.id)),
              )
              .catch((nextError) => setError(getSafeSessionManagementError(nextError)))
              .finally(() => setBusyId(null));
          },
        },
      ],
    );
  };

  const confirmRevokeOthers = () => {
    const otherCount = sessions.filter((item) => !item.isCurrent).length;
    if (otherCount === 0) return;
    Alert.alert(
      t('sessions.confirmOthersTitle'),
      otherCount === 1
        ? t('sessions.confirmOthersBodyOne')
        : t('sessions.confirmOthersBodyMany', { count: otherCount }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('sessions.signOutOthers'),
          style: 'destructive',
          onPress: () => {
            if (!accessToken) return;
            setBusyId('others');
            void revokeOtherAuthSessions(accessToken)
              .then(() => setSessions((current) => current.filter((item) => item.isCurrent)))
              .catch((nextError) => setError(getSafeSessionManagementError(nextError)))
              .finally(() => setBusyId(null));
          },
        },
      ],
    );
  };

  const otherCount = sessions.filter((item) => !item.isCurrent).length;
  const formatSessionDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? t('sessions.unknownDate')
      : formatDate(date, { dateStyle: 'medium', timeStyle: 'short' });
  };
  const formatPlatform = (platform: string) => {
    const normalized = platform.trim().toLowerCase();
    if (normalized === 'ios') return t('sessions.platform.ios');
    if (normalized === 'android') return t('sessions.platform.android');
    if (normalized === 'web') return t('sessions.platform.web');
    return t('sessions.unknownPlatform');
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: safeAreaInsets.bottom + Spacing.four,
          paddingTop: safeAreaInsets.top + Spacing.two,
        },
      ]}
      contentInsetAdjustmentBehavior="never"
      refreshControl={
        <RefreshControl
          colors={[colors.accent]}
          refreshing={refreshing}
          onRefresh={() => void load('refresh')}
          tintColor={colors.accent}
        />
      }
      style={styles.screen}>
      <View style={styles.headerRow}>
        <LiquidGlassIconButton
          accessibilityLabel={t('common.back')}
          Icon={ChevronLeft}
          onPress={() => router.back()}
        />
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{t('sessions.eyebrow')}</Text>
          <Text style={styles.title}>{t('sessions.title')}</Text>
          <Text style={styles.subtitle}>{t('sessions.subtitle')}</Text>
        </View>
      </View>

      {!accessToken && !loading ? <InlineError message={t('sessions.signInRequired')} /> : null}
      {loading ? <LoadingState label={t('sessions.loading')} /> : null}
      {error ? (
        <InlineError message={localizeSessionManagementMessage(error, t)} />
      ) : null}

      {accessToken && !loading && sessions.length === 0 ? (
        <AppCard>
          <Text style={styles.emptyTitle}>{t('sessions.emptyTitle')}</Text>
          <Text style={styles.subtitle}>{t('sessions.emptyBody')}</Text>
        </AppCard>
      ) : null}

      {sessions.map((item) => (
        <AppCard key={item.id}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionTitleGroup}>
              <Text style={styles.sessionTitle}>{item.deviceName}</Text>
              <Text style={styles.sessionMeta}>
                {formatPlatform(item.platform)} · {t('sessions.appVersion', { version: item.appVersion })}
              </Text>
            </View>
            {item.isCurrent ? (
              <Text style={styles.currentBadge}>{t('sessions.currentBadge')}</Text>
            ) : null}
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('sessions.lastActive')}</Text>
            <Text style={styles.detailValue}>{formatSessionDate(item.lastSeenAt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('sessions.signedIn')}</Text>
            <Text style={styles.detailValue}>{formatSessionDate(item.createdAt)}</Text>
          </View>
          {!item.isCurrent ? (
            <SecondaryButton
              disabled={busyId !== null}
              label={
                busyId === item.id ? t('sessions.signingOut') : t('sessions.signOutDevice')
              }
              loading={busyId === item.id}
              onPress={() => confirmRevoke(item)}
            />
          ) : (
            <Text style={styles.currentNote}>{t('sessions.currentNote')}</Text>
          )}
        </AppCard>
      ))}

      {otherCount > 0 ? (
        <SecondaryButton
          disabled={busyId !== null}
          label={
            busyId === 'others'
              ? t('sessions.signingOutOthers')
              : t('sessions.signOutAllOthers')
          }
          loading={busyId === 'others'}
          onPress={confirmRevokeOthers}
        />
      ) : null}
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    content: {
      flexGrow: 1,
      gap: Spacing.three,
      paddingHorizontal: Spacing.four,
    },
    currentBadge: {
      color: colors.accent,
      flexShrink: 0,
      fontSize: Typography.metricSmall.fontSize,
      fontWeight: '800',
      letterSpacing: 0.7,
    },
    currentNote: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    detailLabel: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
    },
    detailRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    detailValue: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      textAlign: 'right',
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: Typography.bodyStrong.fontSize,
      fontWeight: Typography.bodyStrong.fontWeight,
    },
    eyebrow: {
      color: colors.textMuted,
      fontSize: Typography.metricSmall.fontSize,
      fontWeight: Typography.metricSmall.fontWeight,
      letterSpacing: 0.8,
    },
    headerCopy: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 0,
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    sessionHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    sessionMeta: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
    },
    sessionTitle: {
      color: colors.textPrimary,
      fontSize: Typography.bodyStrong.fontSize,
      fontWeight: Typography.bodyStrong.fontWeight,
    },
    sessionTitleGroup: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 0,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '800',
      lineHeight: 34,
    },
  });
