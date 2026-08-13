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
const readSource = (file: string) => readFileSync(resolve(projectRoot, file), 'utf8');
const settingsSource = readSource('src/app/settings/index.tsx');
const developerSource = readSource('src/app/settings/developer.tsx');

describe('Settings support diagnostics visibility', () => {
  it('hides the developer route in production unless support mode is explicit', () => {
    const supportExpression =
      "__DEV__ || process.env.EXPO_PUBLIC_SUPPORT_MODE?.trim().toLowerCase() === 'true'";

    expect(settingsSource).toContain(supportExpression);
    expect(settingsSource).toContain('{supportDiagnosticsEnabled ? (');
    expect(developerSource).toContain(supportExpression);
    expect(developerSource).toContain('if (!supportDiagnosticsEnabled)');
    expect(developerSource).toContain('<Redirect href="/settings" />');
    expect(settingsSource).not.toContain(
      "process.env.EXPO_PUBLIC_SUPPORT_MODE !== 'false'",
    );
  });

  it('keeps support-only controls inside the guarded developer route', () => {
    const guard = developerSource.indexOf('if (!supportDiagnosticsEnabled)');
    const resetControl = developerSource.indexOf('<ProfileActionsCard', guard);
    const runtimeControl = developerSource.indexOf('<ProfileRuntimeInfoCard', guard);

    expect(guard).toBeGreaterThan(-1);
    expect(resetControl).toBeGreaterThan(guard);
    expect(runtimeControl).toBeGreaterThan(guard);
    expect(settingsSource).toContain("router.push('/settings/developer')");
  });
});
