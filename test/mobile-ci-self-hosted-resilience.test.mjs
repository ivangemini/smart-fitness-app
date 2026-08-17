import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const workflow = readFileSync(
  resolve(process.cwd(), '.github/workflows/ci.yml'),
  'utf8',
);

describe('self-hosted Mobile CI resilience contract', () => {
  it('does not depend on downloadable GitHub Actions for checkout or Node setup', () => {
    expect(workflow).not.toContain('uses: actions/checkout');
    expect(workflow).not.toContain('uses: actions/setup-node');
    expect(workflow).not.toMatch(/^\s*uses:/m);
    expect(workflow).toContain('refs/pull/${PR_NUMBER}/merge');
    expect(workflow).toContain('test "$(git rev-parse HEAD)" = "$GITHUB_SHA"');
    expect(workflow).toContain('RUNNER_TOOL_CACHE');
    expect(workflow).toContain('export PATH="$NODE_DIR:$PATH"');
    expect(workflow).toContain("process.versions.node.split(\".\")[0]");
    expect(workflow).toContain("= '22'");
  });

  it('retains every authoritative validation gate', () => {
    expect(workflow).toContain('run: npm ci');
    expect(workflow).toContain('run: node scripts/check-repository-file-lines.mjs');
    expect(workflow).toContain('run: node scripts/check-changed-file-lines.mjs');
    expect(workflow).toContain('run: npm run typecheck');
    expect(workflow).toContain('run: npm test');
    expect(workflow).toContain('run: node scripts/run-expanded-sync-intent-model.mjs');
    expect(workflow).toContain('run: npx expo export --clear');
    expect(workflow).toContain('run: npx expo-doctor@1.20.1');
  });
});
