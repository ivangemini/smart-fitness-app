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
const detail = readFileSync(
  resolve(projectRoot, 'src/features/trainer/TrainerCollaborationDetailScreen.tsx'),
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

describe('trainer collaboration C4 mobile authority boundary', () => {
  it('keeps reviewed authenticated proposal list/create/withdraw endpoints intact', () => {
    expect(api).toContain('/proposals`');
    expect(api).toContain('/withdraw`');
    expect(api).toContain('authorization: `Bearer ${accessToken}`');
    expect(api).toContain('retry: false');
  });

  it('keeps proposal authoring trainer-only and gated by workout-template scope', () => {
    expect(section).toContain("relationship.role !== 'trainer'");
    expect(section).toContain("relationship.scopes.includes('workout_templates')");
    expect(section).toContain("relationship.role === 'trainer'");
    expect(section).toContain("proposal.status === 'pending'");
    expect(section).toContain('api.createProposal');
    expect(section).toContain('api.withdrawProposal');
  });

  it('does not auto-load private template evidence before explicit trainer action', () => {
    expect(section).toContain('void loadProposals();');
    expect(section).toContain('const loadTemplates = async () =>');
    expect(section).toContain('onPress={() => void loadTemplates()}');
    expect(section).not.toContain('void loadTemplates();\n  }, [loadProposals]');
  });

  it('keeps trainer proposal authoring outside AppState, Social, Coach, and local persistence', () => {
    for (const source of [api, detail, section, model]) {
      expect(source).not.toContain('/social/');
      expect(source).not.toContain('/coach/');
      expect(source).not.toContain('/v1/sync');
      expect(source).not.toContain('AsyncStorage');
      expect(source).not.toContain('SecureStore');
    }
    expect(section).not.toContain('useAppActions');
    expect(section).not.toContain('useAppContext');
    expect(section).not.toContain('scheduleStateMutation');
    expect(section).not.toContain('saveWorkout');
    expect(section).not.toContain('saveTrainingProgram');
    expect(section).toContain('copy.noApply');
  });

  it('shows server-authoritative provenance and target state', () => {
    expect(section).toContain('proposal.author.displayName');
    expect(section).toContain('proposal.target.expectedRevision');
    expect(section).toContain('proposal.target.currentRevision');
    expect(model).toContain("throw new Error('Invalid trainer proposal provenance')");
    expect(model).toContain("throw new Error('Invalid trainer proposal target revision state')");
    expect(model).toContain("throw new Error('Invalid trainer proposal patch field')");
  });

  it('mounts the isolated proposal section only from the authenticated relationship detail', () => {
    expect(detail).toContain("import { TrainerProposalSection } from './TrainerProposalSection';");
    expect(detail).toContain('<TrainerProposalSection');
    expect(detail).toContain('accessToken={accessToken}');
    expect(detail).toContain('relationship={relationship}');
  });
});
