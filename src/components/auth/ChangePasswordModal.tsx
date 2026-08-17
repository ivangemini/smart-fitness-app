import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getSafeChangePasswordErrorMessage,
  validateChangePasswordForm,
} from '@/auth/changePasswordModel';
import type { ChangePasswordInput } from '@/auth/types';
import { InlineError } from '@/components/ui/InlineError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { localizeChangePasswordMessage } from '@/localization/authCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

type ChangePasswordModalProps = {
  visible: boolean;
  onClose(): void;
  onChangePassword(input: ChangePasswordInput): Promise<void>;
  onChanged(): void;
};

type ChangePasswordStyles = ReturnType<typeof createStyles>;

export function ChangePasswordModal({
  visible,
  onClose,
  onChangePassword,
  onChanged,
}: ChangePasswordModalProps) {
  const { t } = useLocalization();
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setFormError(null);
      setBusy(false);
    }
  }, [visible]);

  const close = () => {
    if (!busy) onClose();
  };

  const submit = async () => {
    if (busy) return;
    const validation = validateChangePasswordForm({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setBusy(true);
    setErrors({});
    setFormError(null);
    try {
      await onChangePassword(validation.value);
      onChanged();
    } catch (error) {
      setFormError(getSafeChangePasswordErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const updateField = (
    field: 'currentPassword' | 'newPassword' | 'confirmPassword',
    value: string,
  ) => {
    if (field === 'currentPassword') setCurrentPassword(value);
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
    if (formError) setFormError(null);
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={close}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}>
        <Pressable
          accessibilityLabel={t('changePassword.close')}
          disabled={busy}
          onPress={close}
          style={styles.scrim}
        />
        <View accessibilityViewIsModal style={styles.sheet}>
          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + Spacing.four },
            ]}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text selectable style={styles.eyebrow}>
              {t('changePassword.eyebrow')}
            </Text>
            <Text selectable style={styles.title}>
              {t('changePassword.title')}
            </Text>
            <Text selectable style={styles.body}>
              {t('changePassword.body')}
            </Text>

            <PasswordField
              disabled={busy}
              error={localizeChangePasswordMessage(errors.currentPassword, t)}
              label={t('changePassword.current')}
              onChangeText={(value) => updateField('currentPassword', value)}
              placeholderTextColor={colors.textMuted}
              styles={styles}
              value={currentPassword}
            />
            <PasswordField
              disabled={busy}
              error={localizeChangePasswordMessage(errors.newPassword, t)}
              label={t('changePassword.new')}
              onChangeText={(value) => updateField('newPassword', value)}
              placeholderTextColor={colors.textMuted}
              styles={styles}
              value={newPassword}
            />
            <PasswordField
              disabled={busy}
              error={localizeChangePasswordMessage(errors.confirmPassword, t)}
              label={t('changePassword.confirm')}
              onChangeText={(value) => updateField('confirmPassword', value)}
              onSubmitEditing={() => void submit()}
              placeholderTextColor={colors.textMuted}
              styles={styles}
              value={confirmPassword}
            />

            {formError ? (
              <InlineError message={localizeChangePasswordMessage(formError, t)} />
            ) : null}

            <PrimaryButton
              disabled={busy}
              label={busy ? t('changePassword.busy') : t('changePassword.action')}
              loading={busy}
              onPress={() => void submit()}
            />
            <SecondaryButton disabled={busy} label={t('common.cancel')} onPress={close} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type PasswordFieldProps = {
  label: string;
  value: string;
  disabled?: boolean;
  error?: string;
  onChangeText(value: string): void;
  onSubmitEditing?(): void;
  placeholderTextColor: string;
  styles: ChangePasswordStyles;
};

function PasswordField({
  label,
  value,
  disabled = false,
  error,
  onChangeText,
  onSubmitEditing,
  placeholderTextColor,
  styles,
}: PasswordFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        autoCapitalize="none"
        autoComplete="current-password"
        autoCorrect={false}
        editable={!disabled}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={label}
        placeholderTextColor={placeholderTextColor}
        returnKeyType={onSubmitEditing ? 'done' : 'next'}
        secureTextEntry
        style={[
          styles.input,
          disabled && styles.inputDisabled,
          error ? styles.inputError : null,
        ]}
        value={value}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    content: {
      flexGrow: 1,
      gap: Spacing.three,
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
    },
    eyebrow: {
      color: colors.textMuted,
      fontSize: Typography.metricSmall.fontSize,
      fontWeight: Typography.metricSmall.fontWeight,
      letterSpacing: 0.8,
    },
    fieldError: {
      color: colors.error,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    fieldGroup: {
      gap: Spacing.one,
    },
    input: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      minHeight: 50,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    inputDisabled: {
      backgroundColor: glass.disabledFill,
      borderColor: glass.disabledBorder,
      color: colors.textMuted,
    },
    inputError: {
      borderColor: colors.error,
    },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '700',
    },
    screen: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    scrim: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0, 0, 0, 0.72)',
    },
    sheet: {
      backgroundColor: glass.elevatedFill,
      borderColor: glass.cardBorder,
      borderTopColor: glass.cardHighlight,
      borderTopLeftRadius: Radii.xlarge,
      borderTopRightRadius: Radii.xlarge,
      borderWidth: StyleSheet.hairlineWidth,
      maxHeight: '92%',
      shadowColor: glass.shadowColor,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: glass.shadowOpacity,
      shadowRadius: 24,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 25,
      fontWeight: '800',
      lineHeight: 31,
    },
  });
