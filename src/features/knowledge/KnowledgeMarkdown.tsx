import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'paragraph'; text: string };

const parseBlocks = (markdown: string): Block[] => {
  const blocks: Block[] = [];
  const paragraph: string[] = [];

  const flushParagraph = () => {
    const text = paragraph.join(' ').trim();
    if (text) blocks.push({ type: 'paragraph', text });
    paragraph.length = 0;
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      blocks.push({
        type: 'heading',
        level: heading[1]!.length as 1 | 2 | 3,
        text: heading[2]!.trim(),
      });
      continue;
    }
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: bullet[1]!.trim() });
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return blocks;
};

export function KnowledgeMarkdown({ markdown }: { markdown: string }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const blocks = useMemo(() => parseBlocks(markdown), [markdown]);

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <Text
              key={`${block.type}-${index}`}
              selectable
              style={[
                styles.heading,
                block.level === 1
                  ? styles.headingOne
                  : block.level === 2
                    ? styles.headingTwo
                    : styles.headingThree,
              ]}>
              {block.text}
            </Text>
          );
        }
        if (block.type === 'bullet') {
          return (
            <View key={`${block.type}-${index}`} style={styles.bulletRow}>
              <Text style={styles.bulletMark}>•</Text>
              <Text selectable style={styles.body}>
                {block.text}
              </Text>
            </View>
          );
        }
        return (
          <Text key={`${block.type}-${index}`} selectable style={styles.body}>
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    bulletMark: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    bulletRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
    },
    container: { gap: Spacing.three },
    heading: { color: colors.textPrimary, fontWeight: '800' },
    headingOne: {
      fontSize: Typography.title.fontSize,
      lineHeight: Typography.title.lineHeight,
    },
    headingTwo: {
      fontSize: Typography.sectionTitle.fontSize,
      lineHeight: Typography.sectionTitle.lineHeight,
    },
    headingThree: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
  });
