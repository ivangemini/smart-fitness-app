import { describe, expect, it, vi } from 'vitest';

import type { RemoteLabsRepository } from '@/repositories/RemoteLabsRepository';

import {
  loadLabInterpretationCapability,
  runLabInterpretation,
} from './labInterpretationState';

const repository = (overrides: Partial<RemoteLabsRepository>) =>
  overrides as RemoteLabsRepository;

describe('labInterpretationState', () => {
  it('fails closed when interpretation capability is unavailable', async () => {
    const state = await loadLabInterpretationCapability(
      repository({
        getInterpretationCapability: vi.fn(async () => ({ available: false })),
      }),
    );

    expect(state).toEqual({
      status: 'unavailable',
      available: false,
      interpretation: null,
    });
  });

  it('returns typed interpretation output for a document', async () => {
    const interpretation = {
      runId: 'run-1',
      contextVersion: 1,
      output: {
        version: 1 as const,
        provider: 'test',
        model: 'test-model',
        findings: [],
      },
    };
    const interpretDocument = vi.fn(async () => interpretation);

    const state = await runLabInterpretation(
      repository({ interpretDocument }),
      'doc-1',
    );

    expect(state).toEqual({ status: 'ready', available: true, interpretation });
    expect(interpretDocument).toHaveBeenCalledWith('doc-1');
  });
});
