import type { RemoteLabsRepository } from '@/repositories/RemoteLabsRepository';

import type { LabInterpretationDto } from './types';

export type LabInterpretationState =
  | { status: 'idle'; available: null; interpretation: null }
  | { status: 'unavailable'; available: false; interpretation: null }
  | { status: 'ready'; available: true; interpretation: LabInterpretationDto | null }
  | { status: 'running'; available: true; interpretation: LabInterpretationDto | null }
  | { status: 'error'; available: true; interpretation: LabInterpretationDto | null };

export async function loadLabInterpretationCapability(
  repository: Pick<RemoteLabsRepository, 'getInterpretationCapability'>,
): Promise<LabInterpretationState> {
  try {
    const capability = await repository.getInterpretationCapability();
    return capability.available
      ? { status: 'ready', available: true, interpretation: null }
      : { status: 'unavailable', available: false, interpretation: null };
  } catch {
    return { status: 'unavailable', available: false, interpretation: null };
  }
}

export async function runLabInterpretation(
  repository: Pick<RemoteLabsRepository, 'interpretDocument'>,
  documentId: string,
  previous: LabInterpretationDto | null = null,
): Promise<LabInterpretationState> {
  if (!documentId) {
    return { status: 'error', available: true, interpretation: previous };
  }

  try {
    const interpretation = await repository.interpretDocument(documentId);
    return { status: 'ready', available: true, interpretation };
  } catch {
    return { status: 'error', available: true, interpretation: previous };
  }
}
