import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { LabInterpretationCard } from '@/features/labs/LabInterpretationCard';
import {
  LabReviewResultCard,
  type LabCorrectionInput,
} from '@/features/labs/LabReviewResultCard';
import { getLabsCopy } from '@/features/labs/labsCopy';
import { useLabs } from '@/features/labs/LabsContext';
import type { LabResultDraftDto } from '@/features/labs/types';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const toDateInput = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const toCollectionTimestamp = (value: string): string | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date.toISOString();
};

export default function LabDocumentReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ documentId?: string }>();
  const documentId = typeof params.documentId === 'string' ? params.documentId : '';
  const { colors } = useAppTheme();
  const { locale, t } = useLocalization();
  const insets = useSafeAreaInsets();
  const {
    capabilities,
    confirmDocument,
    getDocument,
    getReview,
    interpretDocument,
    interpretationDocumentId,
    interpretationState,
    refresh,
    retryDocument,
    reviewDraft,
  } = useLabs();
  const copy = useMemo(() => getLabsCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const document = getDocument(documentId);
  const [results, setResults] = useState<LabResultDraftDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [busyDraftId, setBusyDraftId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [collectionDate, setCollectionDate] = useState(() =>
    document ? toDateInput(document.collectedAt ?? document.createdAt) : '',
  );

  useEffect(() => {
    if (!documentId || document?.status !== 'review_required') return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    void getReview(documentId)
      .then((review) => {
        if (cancelled) return;
        setResults(review.results);
        setCollectionDate((current) =>
          current || toDateInput(review.document.collectedAt ?? review.document.createdAt),
        );
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [document?.status, documentId, getReview]);

  const updateResult = (updated: LabResultDraftDto) => {
    setResults((current) =>
      current.map((result) => (result.id === updated.id ? updated : result)),
    );
  };

  const performReview = async (
    resultId: string,
    action: 'accept' | 'exclude' | { correction: LabCorrectionInput },
  ) => {
    if (!documentId || busyDraftId) return;
    setBusyDraftId(resultId);
    setError(false);
    try {
      const updated = await reviewDraft(
        documentId,
        resultId,
        action === 'accept'
          ? { action: 'accept' }
          : action === 'exclude'
            ? { action: 'exclude' }
            : { action: 'correct', ...action.correction },
      );
      updateResult(updated);
    } catch {
      setError(true);
    } finally {
      setBusyDraftId(null);
    }
  };

  const includedResults = results.filter((result) => result.reviewState !== 'excluded');
  const canConfirm =
    results.length > 0 &&
    includedResults.length > 0 &&
    results.every((result) => result.reviewState !== 'unreviewed') &&
    includedResults.every((result) => result.normalized !== null) &&
    toCollectionTimestamp(collectionDate) !== null;

  const handleConfirm = async () => {
    const collectedAt = toCollectionTimestamp(collectionDate);
    if (!documentId || !canConfirm || !collectedAt || confirming) return;
    setConfirming(true);
    setError(false);
    try {
      await confirmDocument(documentId, collectedAt);
      await refresh();
      router.back();
    } catch {
      setError(true);
    } finally {
      setConfirming(false);
    }
  };

  const handleRetry = async () => {
    if (
      !documentId ||
      document?.status !== 'failed' ||
      !capabilities.processingAvailable ||
      retrying
    ) {
      return;
    }
    setRetrying(true);
    setError(false);
    try {
      await retryDocument(documentId);
      await refresh();
    } catch {
      setError(true);
    } finally {
      setRetrying(false);
    }
  };

  const reviewResults = document?.status === 'review_required' && !loading ? results : [];
  const listHeader = (
    <View style={[styles.container, styles.listHeader]}>
      <View style={styles.header}>
        <LiquidGlassIconButton
          accessibilityLabel={t('common.back')}
          Icon={ChevronLeft}
          onPress={() => router.back()}
        />
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{copy.reviewTitle}</Text>
          <Text style={styles.body}>{copy.reviewSubtitle}</Text>
        </View>
      </View>

      {!document ? (
        <AppCard>
          <Text accessibilityRole="alert" style={styles.body}>
            {copy.reviewFailed}
          </Text>
          <AppButton label={copy.retry} onPress={() => void refresh()} variant="secondary" />
        </AppCard>
      ) : document.status === 'confirmed' ? (
        <>
          <AppCard>
            <Text style={styles.cardTitle}>{document.fileName}</Text>
            <Text style={styles.body}>{copy.status.confirmed}</Text>
          </AppCard>
          <LabInterpretationCard
            documentId={document.id}
            interpretationDocumentId={interpretationDocumentId}
            locale={locale}
            onInterpret={interpretDocument}
            state={interpretationState}
          />
        </>
      ) : document.status !== 'review_required' ? (
        <AppCard>
          <Text style={styles.cardTitle}>{document.fileName}</Text>
          <Text style={styles.body}>{copy.status[document.status]}</Text>
          <Text style={styles.body}>{copy.documentNotReady}</Text>
          {document.status === 'failed' && capabilities.processingAvailable ? (
            <AppButton
              disabled={retrying}
              label={retrying ? copy.loading : copy.retry}
              onPress={() => void handleRetry()}
              variant="secondary"
            />
          ) : null}
          {error ? (
            <Text accessibilityRole="alert" style={styles.warning}>
              {copy.reviewFailed}
            </Text>
          ) : null}
        </AppCard>
      ) : loading ? (
        <AppCard style={styles.centerCard}>
          <ActivityIndicator color={colors.textPrimary} />
          <Text style={styles.body}>{copy.reviewLoading}</Text>
        </AppCard>
      ) : error ? (
        <AppCard>
          <Text accessibilityRole="alert" style={styles.warning}>
            {copy.reviewFailed}
          </Text>
        </AppCard>
      ) : null}
    </View>
  );

  const listFooter =
    document?.status === 'review_required' && !loading ? (
      <View style={[styles.container, styles.listFooter]}>
        <AppCard>
          <Text style={styles.cardTitle}>{copy.collectionDate}</Text>
          <TextInput
            accessibilityLabel={copy.collectionDate}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setCollectionDate}
            placeholder={copy.collectionDateHint}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={collectionDate}
          />
          {!canConfirm ? <Text style={styles.body}>{copy.confirmBlocked}</Text> : null}
          <AppButton
            disabled={!canConfirm || confirming}
            label={copy.confirm}
            onPress={() => void handleConfirm()}
          />
        </AppCard>
      </View>
    ) : null;

  return (
    <FlatList
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.eight, paddingTop: insets.top + Spacing.four },
      ]}
      data={reviewResults}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(result) => result.id}
      ListFooterComponent={listFooter}
      ListHeaderComponent={listHeader}
      renderItem={({ item: result }) => (
        <View style={styles.listItem}>
          <LabReviewResultCard
            busy={busyDraftId === result.id}
            copy={copy}
            onAccept={() => performReview(result.id, 'accept')}
            onCorrect={(correction) => performReview(result.id, { correction })}
            onExclude={() => performReview(result.id, 'exclude')}
            result={result}
          />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    />
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
    centerCard: { alignItems: 'center' },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, paddingHorizontal: Spacing.three },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    input: {
      backgroundColor: colors.surfaceSecondary,
      borderCurve: 'continuous',
      borderRadius: 12,
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      minHeight: 44,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    itemSeparator: { height: Spacing.two },
    listFooter: { marginTop: Spacing.three },
    listHeader: { marginBottom: Spacing.two },
    listItem: { maxWidth: MaxContentWidth, width: '100%' },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
    warning: {
      color: colors.error,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
  });
