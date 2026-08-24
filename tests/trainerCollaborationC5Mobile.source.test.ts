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
const api = readFileSync(
  resolve(projectRoot, 'src/features/trainer/trainerCollaborationApi.ts'),
  'utf8',
);
const section = readFileSync(
  resolve(projectRoot, 'src/features/trainer/TrainerProposalSection.tsx'),
  'utf8',
);
const model = readFileSync(
  resolve(projectRoot, 'src/features/trainer/trainerCollaborationC4Model.ts'),
  'utf8',
);

describe('trainer collaboration C5 mobile decision authority', () => {
  it('uses only reviewed authenticated Apply/Reject endpoints without retries', () => {
    expect(api).toContain('/apply`');
    expect(api).toContain('/reject`');
    expect(api).toContain('async applyProposal');
    expect(api).toContain('async rejectProposal');
    expect(api).toContain('authorization: `Bearer ${accessToken}`');
    expect(api).toContain('retry: false');
  });

  it('exposes decisions only to the active client with workout-template scope', () => {
    expect(section).toContain("relationship.role === 'client'");
    expect(section).toContain("relationship.status === 'active'");
    expect(section).toContain("relationship.scopes.includes('workout_templates')");
    expect(section).toContain("proposal.status !== 'pending'");
    expect(section).toContain("proposal.status === 'pending'");
  });

  it('fails closed before Apply when the target revision is no longer current', () => {
    expect(section).toContain("action === 'apply' && proposal.target.state !== 'current'");
    expect(section).toContain("proposal.target.state !== 'current'");
    expect(section).toContain('copy.staleApplyBlocked');
  });

  it('never applies proposal changes through local AppState or direct target mutations', () => {
    expect(section).toContain('api.applyProposal');
    expect(section).toContain('api.rejectProposal');
    expect(section).toContain('replaceProposal(next)');
    expect(section).not.toContain('useAppActions');
    expect(section).not.toContain('useAppContext');
    expect(section).not.toContain('scheduleStateMutation');
    expect(section).not.toContain('saveWorkout');
    expect(section).not.toContain('saveTrainingProgram');
    expect(section).not.toContain('/v1/sync');
    expect(section).not.toContain('AsyncStorage');
    expect(section).not.toContain('SecureStore');
  });

  it('parses immutable terminal outcome provenance fail closed', () => {
    expect(model).toContain("'applied' | 'rejected'");
    expect(model).toContain('resolvedAt: string | null');
    expect(model).toContain('appliedRevision: string | null');
    expect(model).toContain('appliedSyncOperationId: string | null');
    expect(model).toContain("throw new Error('Invalid trainer proposal lifecycle')");
  });
});
