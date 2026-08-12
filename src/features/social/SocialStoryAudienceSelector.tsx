import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SocialStoryAudience } from '@/api/social/story-contracts';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import type { SocialStoryExpansionCopy } from './socialStoryExpansionCopy';

type Props = {
  copy: SocialStoryExpansionCopy;
  disabled?: boolean;
  value: SocialStoryAudience;
  onChange: (value: SocialStoryAudience) => void;
};

export function SocialStoryAudienceSelector({
  copy,
  disabled = false,
  value,
  onChange,
}: Props) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: Spacing.one },
        label: {
          color: colors.textPrimary,
          fontSize: Typography.bodyEmphasized.fontSize,
          fontWeight: Typography.bodyEmphasized.fontWeight,
          lineHeight: Typography.bodyEmphasized.lineHeight,
        },
        options: { flexDirection: 'row', gap: Spacing.one },
        option: {
          alignItems: 'center',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 14,
          borderWidth: StyleSheet.hairlineWidth,
          flex: 1,
          justifyContent: 'center',
          minHeight: 44,
          paddingHorizontal: Spacing.two,
        },
        optionSelected: {
          borderColor: colors.textPrimary,
          borderWidth: 1,
        },
        optionDisabled: { opacity: 0.5 },
        text: {
          color: colors.textSecondary,
          fontSize: Typography.callout.fontSize,
          fontWeight: Typography.callout.fontWeight,
          lineHeight: Typography.callout.lineHeight,
        },
        textSelected: { color: colors.textPrimary },
      }),
    [colors, glass],
  );

  const options: Array<{ value: SocialStoryAudience; label: string }> = [
    { value: 'following', label: copy.following },
    { value: 'close_friends', label: copy.closeFriends },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{copy.audience}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled, selected }}
              disabled={disabled}
              key={option.value}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.option,
                selected ? styles.optionSelected : null,
                disabled ? styles.optionDisabled : null,
                pressed && !disabled ? { opacity: 0.72 } : null,
              ]}
              testID={`story-audience-${option.value}`}
            >
              <Text style={[styles.text, selected ? styles.textSelected : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
