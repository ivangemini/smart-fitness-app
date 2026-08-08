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

const backButtonBlock = (source: string) => {
  const match = source.match(/backButton:\s*\{([\s\S]*?)\n\s*\},/);
  return match?.[1] ?? '';
};

describe('Coach inline back touch targets', () => {
  it('keeps Safety Recovery Preflight back navigation at 44 by 44', () => {
    const source = readSource(
      'src/features/coach/screens/SafetyRecoveryPreflightScreen.tsx',
    );
    expect(backButtonBlock(source)).toContain('height: 44');
    expect(backButtonBlock(source)).toContain('width: 44');
  });

  it('keeps Combined Proposal back navigation at 44 by 44', () => {
    const source = readSource(
      'src/features/coach/screens/CombinedCoachProposalScreen.tsx',
    );
    expect(backButtonBlock(source)).toContain('height: 44');
    expect(backButtonBlock(source)).toContain('width: 44');
  });
});
