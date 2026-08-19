import { describe, expect, it } from 'vitest';

import { parseKnowledgeMarkdown } from './knowledgeMarkdown';

describe('parseKnowledgeMarkdown', () => {
  it('parses headings, paragraphs, and bullets without keeping inline link targets', () => {
    const blocks = parseKnowledgeMarkdown(
      '## Evidence\n\nProtein **supplies amino acids** across tissues.\n\n- Read the [review](https://example.com).',
    );

    expect(blocks.map(({ kind, text }) => ({ kind, text }))).toEqual([
      { kind: 'heading', text: 'Evidence' },
      { kind: 'paragraph', text: 'Protein supplies amino acids across tissues.' },
      { kind: 'bullet', text: 'Read the review.' },
    ]);
  });
});
