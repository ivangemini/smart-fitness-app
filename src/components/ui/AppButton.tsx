import type { StyleProp, ViewStyle } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

type AppButtonProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary';
};

export function AppButton({
  accessibilityHint,
  accessibilityLabel,
  disabled = false,
  label,
  loading = false,
  onPress,
  selected,
  style,
  variant = 'primary',
}: AppButtonProps) {
  const shared = {
    accessibilityHint,
    accessibilityLabel,
    disabled,
    label,
    loading,
    onPress,
    selected,
    style,
  };
  return variant === 'primary' ? (
    <PrimaryButton {...shared} />
  ) : (
    <SecondaryButton {...shared} />
  );
}
