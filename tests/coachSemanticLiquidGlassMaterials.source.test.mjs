import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const sources = {
  preflight: read('src/features/coach/screens/SafetyRecoveryPreflightScreen.tsx'),
  limitations: read('src/features/coach/screens/UserLimitationFormFields.tsx'),
  combined: read('src/features/coach/screens/CombinedCoachScreen.tsx'),
  proposal: read('src/features/coach/components/CombinedCoachProposalResult.tsx'),
};

describe('Coach semantic Liquid Glass materials', () => {
  it('uses active glass semantic and control materials for status and choice owners', () => {
    expect(sources.preflight).toContain('glass.semanticWarningFill');
    expect(sources.preflight).toContain('glass.semanticPositiveFill');
    expect(sources.limitations).toContain('glass.semanticAccentFill');
    expect(sources.limitations).toContain('glass.controlFill');
    expect(sources.combined).toContain('glass.semanticPositiveFill');
    expect(sources.combined).toContain('glass.semanticWarningFill');
    expect(sources.proposal).toContain('glass.semanticPositiveBorder');
    expect(sources.proposal).toContain('glass.cardBorder');
  });

  it('does not fall back to inventoried legacy Coach material tokens', () => {
    const combined = Object.values(sources).join('\n');
    expect(combined).not.toMatch(
      /colors\.(successSoft|warningSoft|accentSoft|surfaceElevated|borderSubtle)\b/,
    );
  });
});
