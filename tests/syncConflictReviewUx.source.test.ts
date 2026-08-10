import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

const syncBackup = readSource('src/app/sync-backup.tsx');
const reviewPresentation = readSource('src/features/settings/SyncConflictReviewCard.tsx');
const reviewController = readSource('src/features/settings/useSyncConflictReview.ts');

describe('Sync Conflict Review UX', () => {
  it('uses the screen-level virtualized boundary for the unbounded review collection', () => {
    expect(syncBackup).toContain('<FlatList');
    expect(syncBackup).toContain('data={review.items}');
    expect(syncBackup).toContain('keyExtractor={(item) => item.conflictId}');
    expect(syncBackup).not.toContain('<ScrollView');
    expect(reviewPresentation).not.toContain('items.map(');
  });

  it('keeps conflict review as one visually grouped material section', () => {
    expect(syncBackup).toContain('<SyncConflictReviewHeader review={review} />');
    expect(syncBackup).toContain('<SyncConflictReviewRow');
    expect(syncBackup).toContain('<SyncConflictReviewFooter review={review} />');
    expect(reviewPresentation).toContain('styles.groupHeader');
    expect(reviewPresentation).toContain('styles.groupRow');
    expect(reviewPresentation).toContain('styles.groupFooter');
  });

  it('preserves conflict resolution and retry behavior in the extracted controller', () => {
    expect(reviewController).toContain('listReviewItems()');
    expect(reviewController).toContain('resolve(item.candidate!, choice)');
    expect(reviewController).toContain('continueResolution(item)');
    expect(reviewController).toContain('await syncNow()');
    expect(reviewController).toContain('Alert.alert(');
  });
});
