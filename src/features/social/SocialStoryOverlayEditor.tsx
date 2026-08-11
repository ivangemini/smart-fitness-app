import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  SOCIAL_STORY_OVERLAY_MAX_LENGTH,
  SOCIAL_STORY_OVERLAY_PLACEMENTS,
  type SocialStoryOverlayPlacement,
} from '@/api/social';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

type SocialStoryOverlayEditorCopy = {
  label: string;
  placeholder: string;
  placementLabel: string;
  placements: Record<SocialStoryOverlayPlacement, string>;
};

type SocialStoryOverlayEditorProps = {
  copy: SocialStoryOverlayEditorCopy;
  disabled?: boolean;
  onPlacementChange: (placement: SocialStoryOverlayPlacement) => void;
  onTextChange: (value: string) => void;
  placement: SocialStoryOverlayPlacement;
  value: string;
};

export function SocialStoryOverlayEditor({
  copy,
  disabled = false,
  onPlacementChange,
  onTextChange,
  placement,
  value,
}: SocialStoryOverlayEditorProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.label}>{copy.label}</Text>
        <Text style={styles.count}>
          {value.length}/{SOCIAL_STORY_OVERLAY_MAX_LENGTH}
        </Text>
      </View>
      <TextInput
        accessibilityLabel={copy.label}
        editable={!disabled}
        maxLength={SOCIAL_STORY_OVERLAY_MAX_LENGTH}
        multiline
        onChangeText={onTextChange}
        placeholder={copy.placeholder}
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        value={value}
      />
      <View style={styles.placementSection}>
        <Text style={styles.placementLabel}>{copy.placementLabel}</Text>
        <View accessibilityRole="radiogroup" style={styles.placementRow}>
          {SOCIAL_STORY_OVERLAY_PLACEMENTS.map((item) => {
            const selected = item === placement;
            return (
              <Pressable
                key={item}
                accessibilityLabel={`${copy.placementLabel}: ${copy.placements[item]}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected, disabled }}
                disabled={disabled}
                onPress={() => onPlacementChange(item)}
                style={({ pressed }) => [
                  styles.placementButton,
                  selected && styles.placementButtonSelected,
                  pressed && styles.placementButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.placementText,
                    selected && styles.placementTextSelected,
                  ]}
                >
                  {copy.placements[item]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    count: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.caption.fontWeight,
      lineHeight: Typography.caption.lineHeight,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    input: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: Typography.body.fontWeight,
      lineHeight: Typography.body.lineHeight,
      minHeight: 88,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      textAlignVertical: 'top',
    },
    label: {
      color: colors.textPrimary,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.bodyEmphasized.lineHeight,
    },
    placementButton: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: Radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.two,
    },
    placementButtonPressed: { opacity: 0.72 },
    placementButtonSelected: {
      backgroundColor: glass.accentFill,
      borderColor: glass.accentBorder,
    },
    placementLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.caption.fontWeight,
      lineHeight: Typography.caption.lineHeight,
    },
    placementRow: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    placementSection: { gap: Spacing.one },
    placementText: {
      color: colors.textPrimary,
      fontSize: Typography.callout.fontSize,
      fontWeight: Typography.callout.fontWeight,
      lineHeight: Typography.callout.lineHeight,
    },
    placementTextSelected: { color: glass.accentText },
    section: { gap: Spacing.two },
  });
