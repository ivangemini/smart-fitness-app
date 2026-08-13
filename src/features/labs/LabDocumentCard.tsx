import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Spacing, Typography } from '@/constants/theme';
import type { LabDocumentDto } from '@/features/labs/types';
import { useAppTheme } from '@/theme/AppThemeProvider';

type LabDocumentCardProps = {
  document: LabDocumentDto;
  dateLabel: string;
  statusLabel: string;
  onPress: () => void;
};

export function LabDocumentCard({
  dateLabel,
  document,
  onPress,
  statusLabel,
}: LabDocumentCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityLabel={`${document.fileName}, ${statusLabel}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <LiquidGlassSurface style={styles.card}>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{document.fileName}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>{dateLabel}</Text>
          <Text style={[styles.status, { color: colors.textSecondary }]}>{statusLabel}</Text>
        </View>
        <ChevronRight color={colors.textMuted} size={20} strokeWidth={2} />
      </LiquidGlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  copy: { flex: 1, gap: Spacing.one, minWidth: 0 },
  meta: {
    flexShrink: 1,
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
  },
  pressed: { opacity: 0.74 },
  status: {
    flexShrink: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    lineHeight: Typography.body.lineHeight,
  },
  title: {
    flexShrink: 1,
    fontSize: Typography.cardTitle.fontSize,
    fontWeight: Typography.cardTitle.fontWeight,
    lineHeight: Typography.cardTitle.lineHeight,
  },
});
