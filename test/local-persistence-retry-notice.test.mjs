import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/context/appContext/AppMutationFailureNotice.tsx'),
  'utf8',
);

describe('local persistence recovery notice contract', () => {
  it('keeps retry available for local persistence failures', () => {
    expect(source).toContain('disabled={pendingCount > 0}');
    expect(source).toContain('onPress={onRetry}');
    expect(source).toContain('isOutboxFailure ? styles.syncAction : styles.retryAction');
  });

  it('does not allow dismissing a local persistence failure', () => {
    expect(source).toContain('{isOutboxFailure ? (');
    expect(source).toContain('onPress={onDismiss}');
    expect(source).toContain("failure.stage === 'outbox'");
  });
});
