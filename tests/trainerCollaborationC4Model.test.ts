import { describe, expect, it } from 'vitest';

import {
  parseTrainerProposal,
  parseTrainerProposalEnvelope,
  parseTrainerProposalsEnvelope,
} from '../src/features/trainer/trainerCollaborationC4Model';

const RELATIONSHIP_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_RELATIONSHIP_ID = '22222222-2222-4222-8222-222222222222';
const PROPOSAL_ID = '33333333-3333-4333-8333-333333333333';
const TARGET_ID = '44444444-4444-4444-8444-444444444444';

const proposal = {
  schemaVersion: 1,
  id: PROPOSAL_ID,
  relationshipId: RELATIONSHIP_ID,
  author: { role: 'trainer', displayName: 'Human trainer' },
  status: 'pending',
  proposalType: 'workout_template_metadata_patch',
  target: {
    type: 'workout_template',
    id: TARGET_ID,
    expectedRevision: '2',
    currentRevision: '2',
    state: 'current',
  },
  before: {
    name: 'Strength A',
    goal: 'strength',
    difficulty: 'intermediate',
    durationWeeks: 8,
    cadencePerWeek: 3,
  },
  patch: { cadencePerWeek: 4, goal: 'hypertrophy' },
  changes: [
    { field: 'goal', before: 'strength', after: 'hypertrophy' },
    { field: 'cadencePerWeek', before: 3, after: 4 },
  ],
  message: 'Shift the next block toward hypertrophy.',
  createdAt: '2026-08-24T08:00:00.000Z',
  withdrawnAt: null,
} as const;

describe('trainer collaboration C4 mobile contract', () => {
  it('parses an exact preview-only workout-template metadata proposal', () => {
    const parsed = parseTrainerProposalEnvelope({ proposal }, RELATIONSHIP_ID);

    expect(parsed.id).toBe(PROPOSAL_ID);
    expect(parsed.relationshipId).toBe(RELATIONSHIP_ID);
    expect(parsed.author).toEqual({ role: 'trainer', displayName: 'Human trainer' });
    expect(parsed.target).toEqual(proposal.target);
    expect(parsed.patch).toEqual({ goal: 'hypertrophy', cadencePerWeek: 4 });
    expect(parsed.changes).toEqual(proposal.changes);
    expect(parseTrainerProposalsEnvelope({ proposals: [proposal] }, RELATIONSHIP_ID)).toHaveLength(1);
  });

  it('fails closed on schema, type, relationship, and provenance mismatches', () => {
    expect(() =>
      parseTrainerProposal({ ...proposal, schemaVersion: 2 }, RELATIONSHIP_ID),
    ).toThrow();
    expect(() =>
      parseTrainerProposal(
        { ...proposal, proposalType: 'training_program_patch' },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() => parseTrainerProposal(proposal, OTHER_RELATIONSHIP_ID)).toThrow();
    expect(() =>
      parseTrainerProposal(
        { ...proposal, author: { role: 'coach', displayName: 'AI' } },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
  });

  it('requires revision state to agree with current, stale, or unavailable target state', () => {
    expect(() =>
      parseTrainerProposal(
        {
          ...proposal,
          target: { ...proposal.target, currentRevision: '3', state: 'current' },
        },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerProposal(
        {
          ...proposal,
          target: { ...proposal.target, state: 'stale' },
        },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerProposal(
        {
          ...proposal,
          target: { ...proposal.target, state: 'unavailable' },
        },
        RELATIONSHIP_ID,
      ),
    ).toThrow();

    const stale = parseTrainerProposal(
      {
        ...proposal,
        target: { ...proposal.target, currentRevision: '3', state: 'stale' },
      },
      RELATIONSHIP_ID,
    );
    expect(stale.target.state).toBe('stale');

    const unavailable = parseTrainerProposal(
      {
        ...proposal,
        target: { ...proposal.target, currentRevision: null, state: 'unavailable' },
      },
      RELATIONSHIP_ID,
    );
    expect(unavailable.target.currentRevision).toBeNull();
  });

  it('rejects unknown fields, no-op patches, and forged change projections', () => {
    expect(() =>
      parseTrainerProposal(
        { ...proposal, patch: { ...proposal.patch, templateData: { private: true } } },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerProposal(
        { ...proposal, before: { ...proposal.before, notes: 'private' } },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerProposal(
        {
          ...proposal,
          patch: { goal: proposal.before.goal },
          changes: [],
        },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerProposal(
        {
          ...proposal,
          changes: [{ field: 'goal', before: 'strength', after: 'power' }],
        },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
  });

  it('keeps pending and withdrawn lifecycle timestamps consistent', () => {
    expect(() =>
      parseTrainerProposal(
        { ...proposal, withdrawnAt: '2026-08-24T09:00:00.000Z' },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerProposal(
        { ...proposal, status: 'withdrawn', withdrawnAt: null },
        RELATIONSHIP_ID,
      ),
    ).toThrow();

    const withdrawn = parseTrainerProposal(
      {
        ...proposal,
        status: 'withdrawn',
        withdrawnAt: '2026-08-24T09:00:00.000Z',
      },
      RELATIONSHIP_ID,
    );
    expect(withdrawn.status).toBe('withdrawn');
  });
});
