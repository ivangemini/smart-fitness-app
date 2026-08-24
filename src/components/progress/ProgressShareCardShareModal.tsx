import { makeImageFromView } from '@shopify/react-native-skia';
import { useMemo, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressShareCardRenderer } from '@/components/progress/ProgressShareCardRenderer';
import { AppButton } from '@/components/ui/AppButton';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import type { ProgressShareCardViewModel } from '@/features/progress/progressShareCardModel';
import { buildProgressShareCardPresentation } from '@/features/progress/progressShareCardPresentation';
import { useLocalization } from '@/localization/LocalizationProvider';
import { getProgressShareCardCopy } from '@/localization/progressShareCardCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences } from '@/units';

type ProgressShareCardShareModalProps = {
  card: ProgressShareCardViewModel;
  onClose: () => void;
  visible: boolean;
};

const buildShareMessage = (presentation: ReturnType<typeof buildProgressShareCardPresentation>) =>
  [
    presentation.title,
    presentation.subjectLabel,
    `${presentation.heroLabel}: ${presentation.heroValue}`,
    ...presentation.rows.map((row) => `${row.label}: ${row.value}`),
    presentation.dateLabel,
    presentation.footer,
  ]
    .filter((value): value is string => Boolean(value))
    .join('\n');

export function ProgressShareCardShareModal({
  card,
  onClose,
  visible,
}: ProgressShareCardShareModalProps) {
  const { colors } = useAppTheme();
  const { formatDate, formatNumber, locale } = useLocalization();
  const { weight } = useUnitPreferences();
  const copy = useMemo(() => getProgressShareCardCopy(locale), [locale]);
  const cardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState(false);

  const presentation = useMemo(
    () =>
      buildProgressShareCardPresentation(card, {
        locale,
        weightUnit: weight,
        formatDate,
        formatNumber,
      }),
    [card, formatDate, formatNumber, locale, weight],
  );
  const shareMessage = useMemo(() => buildShareMessage(presentation), [presentation]);

  const shareCard = async () => {
    if (sharing) return;
    setSharing(true);
    setShareError(false);

    try {
      if (Platform.OS === 'ios') {
        const image = await makeImageFromView(cardRef);
        if (!image) {
          throw new Error('Progress share-card capture was unavailable');
        }
        const dataUrl = `data:image/png;base64,${image.encodeToBase64()}`;

        await new Promise<void>((resolve, reject) => {
          ActionSheetIOS.showShareActionSheetWithOptions(
            {
              message: shareMessage,
              subject: presentation.title,
              url: dataUrl,
            },
            reject,
            () => resolve(),
          );
        });
      } else {
        await Share.share(
          {
            message: shareMessage,
            title: presentation.title,
          },
          { dialogTitle: presentation.title },
        );
      }
    } catch {
      setShareError(true);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={sharing ? undefined : onClose}
      presentationStyle="pageSheet"
      visible={visible}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.heading}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {copy.sharePreviewTitle}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {copy.sharePreviewSubtitle}
              </Text>
            </View>

            <View ref={cardRef} collapsable={false}>
              <ProgressShareCardRenderer card={card} testID="progress-share-card-preview" />
            </View>

            <Text style={[styles.privacy, { color: colors.textMuted }]}>
              {copy.sharePrivacy}
            </Text>

            {shareError ? (
              <Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>
                {copy.shareFailed}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <AppButton
                disabled={sharing}
                label={Platform.OS === 'ios' ? copy.shareImage : copy.shareSummary}
                loading={sharing}
                onPress={() => void shareCard()}
              />
              <AppButton
                disabled={sharing}
                label={copy.close}
                onPress={onClose}
                variant="secondary"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  container: {
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    padding: Spacing.three,
  },
  error: {
    fontSize: 13,
    lineHeight: 19,
  },
  heading: {
    gap: Spacing.one,
  },
  privacy: {
    fontSize: 12,
    lineHeight: 18,
  },
  safeArea: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
});
