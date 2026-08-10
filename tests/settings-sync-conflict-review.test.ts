import { describe, expect, it } from 'vitest';

import { getSyncConflictResolutionUiCopy } from '@/localization/syncConflictResolutionMessages';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync: (path: string, encoding: string) => string;
};
const { resolve } = require('path') as { resolve: (...parts: string[]) => string };
const projectRoot = resolve(__dirname, '..');
const readSource = (path: string) => readFileSync(resolve(projectRoot, path), 'utf8');

describe('Settings sync conflict review', () => {
  it('shows only safe candidate metadata and version kinds', () => {
    const screen = readSource('src/app/sync-backup.tsx');
    const presentation = readSource('src/features/settings/SyncConflictReviewCard.tsx');
    const controller = readSource('src/features/settings/useSyncConflictReview.ts');

    expect(screen).toContain('<SyncConflictReviewHeader review={review} />');
    expect(screen).toContain('<SyncConflictReviewRow');
    expect(screen).toContain('<SyncConflictReviewFooter review={review} />');
    expect(controller).toContain('useSyncConflictResolution');
    expect(controller).toContain('listReviewItems');
    expect(presentation).toContain('getSyncConflictEntityLabel');
    expect(presentation).toContain('formatDate(candidate.detectedAt');
    expect(presentation).toContain('candidate.localKind');
    expect(presentation).toContain('candidate.remoteKind');
    expect(presentation).not.toContain('candidate.entityId');
    expect(presentation).not.toContain('candidate.expectedConflictRevision');
    expect(presentation).not.toContain('candidate.expectedRemoteRevision');
    expect(presentation).not.toContain('getSyncConflictDiagnosticItems');
    expect(presentation).not.toContain('conflict.details');
  });

  it('requires an explicit choice and confirmation before submission', () => {
    const presentation = readSource('src/features/settings/SyncConflictReviewCard.tsx');
    const controller = readSource('src/features/settings/useSyncConflictReview.ts');

    expect(presentation).toContain("review.confirmResolution(item, 'keep_local')");
    expect(presentation).toContain("review.confirmResolution(item, 'keep_remote')");
    expect(controller).toContain('Alert.alert(');
    expect(controller).toContain('resolutionCopy.confirm');
    expect(controller).toContain('resolve(item.candidate!, choice)');
    expect(presentation).toContain('disabled={review.isBusy}');
    expect(controller).not.toContain('automatic');
  });

  it('locks a persisted choice and resumes it through the durable workflow', () => {
    const presentation = readSource('src/features/settings/SyncConflictReviewCard.tsx');
    const controller = readSource('src/features/settings/useSyncConflictReview.ts');
    const hook = readSource('src/context/useSyncConflictResolution.ts');

    expect(presentation).toContain('intentChoice !== null && intentState !== null');
    expect(presentation).toContain('review.resumeResolution(item)');
    expect(presentation).toContain('isSyncConflictIntentSubmitting');
    expect(controller).toContain('continueResolution(item)');
    expect(hook).toContain('controller.resume(userId, item.conflictId)');
    expect(presentation).not.toContain('idempotencyKey');
  });

  it('keeps English and Russian choice copy equivalent and bounded', () => {
    const en = getSyncConflictResolutionUiCopy('en');
    const ru = getSyncConflictResolutionUiCopy('ru');

    expect(Object.keys(ru)).toEqual(Object.keys(en));
    expect(en.useDeviceVersion).toContain('device');
    expect(en.useAccountVersion).toContain('account');
    expect(ru.useDeviceVersion).toContain('устройства');
    expect(ru.useAccountVersion).toContain('аккаунта');
    expect(`${en.confirmDeviceBody} ${en.confirmAccountBody}`).not.toMatch(
      /payload|revision|idempotency|entity id/i,
    );
    expect(`${ru.confirmDeviceBody} ${ru.confirmAccountBody}`).not.toMatch(
      /payload|revision|idempotency|entity id/i,
    );
  });
});
