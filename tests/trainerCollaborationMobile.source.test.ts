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
const screen = readFileSync(
  resolve(projectRoot, 'src/features/trainer/TrainerCollaborationScreen.tsx'),
  'utf8',
);
const model = readFileSync(
  resolve(projectRoot, 'src/features/trainer/trainerCollaborationModel.ts'),
  'utf8',
);

describe('trainer collaboration C2 authority boundary', () => {
  it('uses only the reviewed authenticated relationship endpoints', () => {
    expect(api).toContain("'/v1/trainer/relationships'");
    expect(api).toContain("'/v1/trainer/invitations'");
    expect(api).toContain('/accept`');
    expect(api).toContain('/revoke`');
    expect(api).toContain('authorization: `Bearer ${accessToken}`');
    expect(api).toContain('retry: false');
  });

  it('does not derive human trainer authority from Social, Coach, or AppState', () => {
    expect(api).not.toContain('/social/');
    expect(api).not.toContain('/coach/');
    expect(screen).not.toContain('/social/');
    expect(screen).not.toContain('/coach/');
    expect(screen).not.toContain('useAppActions');
    expect(screen).not.toContain('useAppContext');
    expect(screen).not.toContain('scheduleStateMutation');
    expect(screen).not.toContain('AsyncStorage');
  });

  it('keeps C2 limited to relationship state without private fitness reads or mutations', () => {
    expect(api).not.toContain('/v1/sync');
    expect(api).not.toContain('/v1/workout');
    expect(api).not.toContain('/v1/progress');
    expect(api).not.toContain('/v1/recovery');
    expect(screen).not.toContain('saveWorkout');
    expect(screen).not.toContain('saveTrainingProgram');
    expect(screen).not.toContain('updateWeight');
  });

  it('fails closed on relationship ownership and unknown server contract values', () => {
    expect(screen).toContain("if (!view) throw new Error('Trainer relationship does not belong to the current account')");
    expect(model).toContain("throw new Error('Unsupported trainer relationship schema')");
    expect(model).toContain("throw new Error('Invalid trainer relationship scope')");
  });
});
