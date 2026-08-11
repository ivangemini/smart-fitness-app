import { StyleSheet, Text, View } from 'react-native';

import type { SocialStoryOverlayValueDto } from '@/api/social';
import { Radii, Spacing, Typography } from '@/constants/theme';

type SocialStoryOverlayViewProps = {
  accessibilityLabel?: string;
  overlay: SocialStoryOverlayValueDto | null;
};

const placementStyle = (
  placement: SocialStoryOverlayValueDto['placement'],
): 'flex-start' | 'center' | 'flex-end' => {
  if (placement === 'top') return 'flex-start';
  if (placement === 'bottom') return 'flex-end';
  return 'center';
};

export function SocialStoryOverlayView({
  accessibilityLabel,
  overlay,
}: SocialStoryOverlayViewProps) {
  if (!overlay) return null;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.overlay,
        { justifyContent: placementStyle(overlay.placement) },
      ]}
    >
      <Text
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
        style={styles.text}
      >
        {overlay.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  text: {
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
    borderRadius: Radii.medium,
    color: '#FFFFFF',
    fontSize: Typography.bodyEmphasized.fontSize,
    fontWeight: Typography.bodyEmphasized.fontWeight,
    lineHeight: Typography.bodyEmphasized.lineHeight,
    maxWidth: '92%',
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    textAlign: 'center',
  },
});
