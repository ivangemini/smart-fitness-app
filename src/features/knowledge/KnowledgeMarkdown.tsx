import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { parseKnowledgeMarkdown } from './knowledgeMarkdown';

export function KnowledgeMarkdown({ markdown }: { markdown: string }) {
  const { colors } = useAppTheme();
  const blocks = useMemo(() => parseKnowledgeMarkdown(markdown), [markdown]);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {blocks.map((block) => {
        if (block.kind === 'heading') {
          return (
            <Text
              key={block.id}
              selectable
              style={block.level === 1 ? styles.headingOne : styles.heading}
            >
              {block.text}
            </Text>
          );
        }
        if (block.kind === 'bullet') {
          return (
            <View key={block.id} style={styles.bulletRow}>
              <Text style={styles.bulletMark}>•</Text>
              <Text selectable style={styles.body}>
                {block.text}
              </Text>
            </View>
          );
        }
        return (
          <Text key={block.id} selectable style={styles.body}>
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    container: {
      gap: Spacing.three,
    },
    headingOne: {
      ...Typography.screenTitle,
      color: colors.textPrimary,
      marginTop: Spacing.two,
    },
    heading: {
      ...Typography.cardTitle,
      color: colors.textPrimary,
      marginTop: Spacing.two,
    },
    body: {
      ...Typography.body,
      color: colors.textSecondary,
      flexShrink: 1,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.two,
    },
    bulletMark: {
      ...Typography.body,
      color: colors.accent,
    },
  });
