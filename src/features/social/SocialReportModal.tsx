import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SOCIAL_REPORT_REASON_CODES,
  type SocialApi,
  type SocialReportReasonCode,
} from '@/api/social';
import { InlineError } from '@/components/ui/InlineError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';
import type { SupportedLocale } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

import { getSocialRateLimitMessage } from './socialRateLimitCopy';
import { getSocialReportCopy } from './socialReportCopy';
import {
  getSocialReportSubmitError,
  submitSocialReport,
  type SocialReportTarget,
} from './socialReportModel';

type ReportStatus = 'editing' | 'submitting' | 'success';

type SocialReportModalProps = {
  locale: SupportedLocale;
  onClose: () => void;
  socialApi: SocialApi;
  target: SocialReportTarget | null;
};

export function SocialReportModal({
  locale,
  onClose,
  socialApi,
  target,
}: SocialReportModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, resolvedAppearance } = useAppTheme();
  const copy = getSocialReportCopy(locale);
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const [status, setStatus] = useState<ReportStatus>('editing');
  const [reason, setReason] = useState<SocialReportReasonCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus('editing');
    setReason(null);
    setError(null);
  }, [target]);

  const close = () => {
    if (status === 'submitting') return;
    onClose();
  };

  const submit = async () => {
    if (!target || !reason || status === 'submitting') return;
    setStatus('submitting');
    setError(null);
    try {
      await submitSocialReport(socialApi, target, reason);
      setStatus('success');
    } catch (submitError) {
      const rateLimitMessage = getSocialRateLimitMessage(submitError, locale);
      if (rateLimitMessage) {
        setError(rateLimitMessage);
      } else {
        const state = getSocialReportSubmitError(submitError);
        setError(
          state === 'offline'
            ? copy.errorOffline
            : state === 'session_expired'
              ? copy.errorSession
              : state === 'unavailable'
                ? copy.errorUnavailable
                : copy.errorGeneric,
        );
      }
      setStatus('editing');
    }
  };

  const title =
    target?.type === 'profile'
      ? copy.profileTitle
      : target?.type === 'workout_post'
        ? copy.postTitle
        : copy.commentTitle;

  return (
    <Modal
      animationType="slide"
      onRequestClose={close}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={target !== null}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel={copy.cancel}
          disabled={status === 'submitting'}
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, Spacing.four) },
          ]}>
          {status === 'success' ? (
            <View style={styles.section}>
              <Text style={styles.title}>{copy.successTitle}</Text>
              <Text style={styles.body}>{copy.successBody}</Text>
              <PrimaryButton label={copy.done} onPress={close} />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{copy.body}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.reasonTitle}>{copy.reasonTitle}</Text>
                <View style={styles.reasonList}>
                  {SOCIAL_REPORT_REASON_CODES.map((item) => {
                    const selected = reason === item;
                    return (
                      <Pressable
                        key={item}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        disabled={status === 'submitting'}
                        onPress={() => {
                          setReason(item);
                          setError(null);
                        }}
                        style={({ pressed }) => [
                          styles.reasonRow,
                          selected && styles.reasonRowSelected,
                          pressed &&
                            (selected ? styles.reasonRowSelectedPressed : styles.reasonRowPressed),
                        ]}>
                        <View
                          style={[
                            styles.radio,
                            selected && styles.radioSelected,
                          ]}>
                          {selected ? <View style={styles.radioDot} /> : null}
                        </View>
                        <Text
                          style={[
                            styles.reasonLabel,
                            selected && styles.reasonLabelSelected,
                          ]}>
                          {copy.reasons[item]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <InlineError message={error} />
              <PrimaryButton
                disabled={!reason || status === 'submitting'}
                label={copy.submit}
                loading={status === 'submitting'}
                onPress={submit}
              />
              <SecondaryButton
                disabled={status === 'submitting'}
                label={copy.cancel}
                onPress={close}
              />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    content: { gap: Spacing.four, padding: Spacing.four },
    overlay: {
      backgroundColor: colors.overlay,
      flex: 1,
      justifyContent: 'flex-end',
    },
    radio: {
      alignItems: 'center',
      borderColor: glass.controlBorder,
      borderRadius: Radii.pill,
      borderWidth: 2,
      height: 22,
      justifyContent: 'center',
      width: 22,
    },
    radioDot: {
      backgroundColor: glass.accentText,
      borderRadius: Radii.pill,
      height: 8,
      width: 8,
    },
    radioSelected: {
      backgroundColor: glass.accentFill,
      borderColor: glass.accentBorder,
    },
    reasonLabel: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    reasonLabelSelected: {
      color: glass.accentText,
    },
    reasonList: { gap: Spacing.two },
    reasonRow: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.three,
      minHeight: 52,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    reasonRowPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    reasonRowSelected: {
      backgroundColor: glass.accentFill,
      borderColor: glass.accentBorder,
    },
    reasonRowSelectedPressed: {
      backgroundColor: glass.accentPressedFill,
    },
    reasonTitle: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    section: { gap: Spacing.two },
    sheet: {
      alignSelf: 'center',
      backgroundColor: glass.elevatedFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderTopLeftRadius: Radii.xlarge,
      borderTopRightRadius: Radii.xlarge,
      borderTopWidth: StyleSheet.hairlineWidth,
      maxHeight: '88%',
      maxWidth: MaxContentWidth,
      overflow: 'hidden',
      width: '100%',
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
