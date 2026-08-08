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

const auditedFiles = [
  'src/components/profile/ProfileActionsCard.tsx',
  'src/components/profile/ProfileRuntimeInfoCard.tsx',
  'src/features/settings/LocalPerformanceDiagnosticsCard.tsx',
];

describe('Settings support theme consistency', () => {
  it.each(auditedFiles)('%s uses the current app theme', (relativePath) => {
    const source = readSource(relativePath);

    expect(source).toContain('useAppTheme');
    expect(source).not.toContain('Colors.dark');
  });

  it('preserves support and OTA actions while changing presentation only', () => {
    const actions = readSource('src/components/profile/ProfileActionsCard.tsx');
    const runtime = readSource('src/components/profile/ProfileRuntimeInfoCard.tsx');
    const diagnostics = readSource('src/features/settings/LocalPerformanceDiagnosticsCard.tsx');

    expect(actions).toContain("router.push('/workouts/coach')");
    expect(actions).toContain('onPress={onResetOnboarding}');
    expect(runtime).toContain('onPress={onCheckForOtaUpdate}');
    expect(diagnostics).toContain('createLocalApiDiagnosticsRecorder');
    expect(diagnostics).toContain('createLocalStateDiagnosticsRecorder');
  });
});
