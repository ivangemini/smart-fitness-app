import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

type EmptyStateProps = {
  actionLabel?: string;
  compact?: boolean;
  description?: string;
  message?: string;
  onActionPress?: () => void;
  title?: string;
};

type EmptyStateStyles = ReturnType<typeof createStyles>;

function EmptyStateContent({
  actionLabel,
  description,
  message,
  onActionPress,
  styles,
  title,
}: EmptyStateProps & { styles: EmptyStateStyles }) {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onActionPress ? (
        <PrimaryButton label={actionLabel} onPress={onActionPress} />
      ) : null}
    </View>
  );
}

export function EmptyState(props: EmptyStateProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);

  if (props.compact) {
    return <EmptyStateContent {...props} styles={styles} />;
  }

  return (
    <View style={styles.card}>
      <EmptyStateContent {...props} styles={styles} />
    </View>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    card: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      padding: Spacing.four,
    },
    container: {
      gap: Spacing.two,
    },
    description: {
      color: colors.textSecondary,
      fontSize: Typography.callout.fontSize,
      lineHeight: Typography.callout.lineHeight,
    },
    message: {
      color: colors.textPrimary,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.bodyEmphasized.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.sectionTitle.fontSize,
      fontWeight: Typography.sectionTitle.fontWeight,
      letterSpacing: Typography.sectionTitle.letterSpacing,
      lineHeight: Typography.sectionTitle.lineHeight,
      textTransform: Typography.sectionTitle.textTransform,
    },
  });
