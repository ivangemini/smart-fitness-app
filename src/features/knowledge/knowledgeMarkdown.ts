export type KnowledgeMarkdownBlock =
  | { id: string; kind: 'heading'; level: 1 | 2 | 3; text: string }
  | { id: string; kind: 'paragraph'; text: string }
  | { id: string; kind: 'bullet'; text: string };

const cleanInlineMarkdown = (value: string): string =>
  value
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();

export const parseKnowledgeMarkdown = (markdown: string): KnowledgeMarkdownBlock[] => {
  const blocks: KnowledgeMarkdownBlock[] = [];
  const paragraph: string[] = [];
  let sequence = 0;

  const push = (block: Omit<KnowledgeMarkdownBlock, 'id'>) => {
    const text = cleanInlineMarkdown(block.text);
    if (!text) return;
    sequence += 1;
    blocks.push({ ...block, text, id: `knowledge-block-${sequence}` } as KnowledgeMarkdownBlock);
  };

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    push({ kind: 'paragraph', text: paragraph.join(' ') });
    paragraph.length = 0;
  };

  for (const rawLine of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      push({
        kind: 'heading',
        level: heading[1]!.length as 1 | 2 | 3,
        text: heading[2]!,
      });
      continue;
    }

    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      flushParagraph();
      push({ kind: 'bullet', text: bullet[1]! });
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
};
