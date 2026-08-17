import { Sparkles } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import type { CompanionProgress } from '@/features/companion/companionProgression';
import { companionCopy } from '@/features/companion/companionCopy';
import type { SupportedLocale } from '@/localization/messages';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

type Props = {
  colors: typeof Colors.light;
  locale: SupportedLocale;
  progress: CompanionProgress;
};

export function CompanionProgressCard({ colors, locale, progress }: Props) {
  const { resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const copy = companionCopy[locale];
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const percent = Math.round((progress.xpIntoLevel / 500) * 100);

  return (
    <AppCard>
      <View style={styles.heroRow}>
        <View accessibilityLabel={`${copy.title}. ${copy.level} ${progress.level}`} style={styles.avatar}>
          <Sparkles color={colors.accent} size={40} strokeWidth={1.8} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.level}>{copy.level} {progress.level}</Text>
          <Text style={styles.body}>{copy[progress.mood]}</Text>
        </View>
      </View>
      <View
        accessibilityLabel={`${progress.xpIntoLevel} ${copy.xp}, ${progress.xpToNextLevel} ${copy.next}`}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 500, now: progress.xpIntoLevel }}
        style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.totalXp}</Text>
          <Text style={styles.statLabel}>{copy.xp}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.activeDaysLast7}/7</Text>
          <Text style={styles.statLabel}>{copy.rhythm}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.totalActiveDays}</Text>
          <Text style={styles.statLabel}>{copy.activeDays}</Text>
        </View>
      </View>
    </AppCard>
  );
}

const createStyles = (
  colors: typeof Colors.light,
  glass: ReturnType<typeof resolveLiquidGlassPalette>,
) =>
  StyleSheet.create({
    avatar: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: 36,
      borderWidth: StyleSheet.hairlineWidth,
      height: 72,
      justifyContent: 'center',
      width: 72,
    },
    body: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    heroCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    heroRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.three },
    level: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
    },
    progressFill: { backgroundColor: colors.accent, borderRadius: 999, height: '100%' },
    progressTrack: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      height: 8,
      marginTop: Spacing.three,
      overflow: 'hidden',
      width: '100%',
    },
    stat: { flex: 1, minWidth: 0 },
    statLabel: { color: colors.textSecondary, flexShrink: 1, fontSize: Typography.caption.fontSize },
    statValue: { color: colors.textPrimary, fontSize: Typography.body.fontSize, fontWeight: '700' },
    statsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three },
  });
