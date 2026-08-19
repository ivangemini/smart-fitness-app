import { describe, expect, it } from 'vitest';

import { getProactivePresentationStorageKey } from '@/features/companion/proactivePresentationStore';

import { getLocalAccountDataStorageKeys } from './accountDataCleanup';

describe('proactive presentation account cleanup', () => {
  it('registers the account-scoped proactive presentation record for deletion', () => {
    const userId = 'user-proactive';

    expect(getLocalAccountDataStorageKeys(userId)).toContain(
      getProactivePresentationStorageKey(userId),
    );
  });
});
