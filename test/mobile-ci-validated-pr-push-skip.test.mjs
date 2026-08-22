import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/ci.yml'), 'utf8');

const guardedHeavySteps = [
  'Checkout',
  'Set up Node.js',
  'Install dependencies',
  'Repository file line audit',
  'Changed file line limit',
  'TypeScript',
  'Full regression suite',
  'Smoke expanded model runner',
  'Expo export',
  'Expo Doctor',
];

const fullValidationSteps = [
  'Install dependencies',
  'TypeScript',
  'Full regression suite',
  'Smoke expanded model runner',
  'Expo export',
  'Expo Doctor',
];

describe('Mobile CI merged-PR push deduplication', () => {
  it('resolves a squash-merged PR from the commit title and fails open to validation', () => {
    expect(workflow).toContain('Detect already-validated PR merge push');
    expect(workflow).toContain('COMMIT_MESSAGE: ${{ github.event.head_commit.message }}');
    expect(workflow).toContain("sed -nE '1s/.*\\(#([0-9]+)\\)$/\\1/p'");
    expect(workflow).toContain('/pulls/${pr_number}');
    expect(workflow).toContain('command -v python3');
    expect(workflow).toContain("echo 'skip=false' >> \"$GITHUB_OUTPUT\"");
    expect(workflow).not.toContain('/commits/${GITHUB_SHA}/pulls?per_page=10');
    expect(workflow).not.toContain('grep -Eq');
  });

  it('parses API evidence structurally and requires exact merge-sha, merged-at and main-base', () => {
    expect(workflow).toContain('pull = json.load(handle)');
    expect(workflow).toContain("pull.get('merge_commit_sha') == expected_sha");
    expect(workflow).toContain("bool(pull.get('merged_at'))");
    expect(workflow).toContain("isinstance(pull.get('base'), dict)");
    expect(workflow).toContain("pull['base'].get('ref') == 'main'");
    expect(workflow).toContain('raise SystemExit(0 if valid else 1)');
  });

  it('guards every heavyweight validation step with the detector result', () => {
    for (const step of guardedHeavySteps) {
      const marker = `- name: ${step}`;
      const start = workflow.indexOf(marker);
      expect(start).toBeGreaterThan(-1);
      const snippet = workflow.slice(start, start + 280);
      expect(snippet).toContain("if: steps.validated-pr-merge.outputs.skip != 'true'");
    }
  });

  it('always emits a pull-request check and runs heavyweight validation only for non-doc changes', () => {
    expect(workflow).toContain('  pull_request:\n\npermissions:');
    expect(workflow).not.toContain('  pull_request:\n    paths-ignore:');
    expect(workflow).toContain('- name: Determine validation scope');
    expect(workflow).toContain('git diff --name-only HEAD^1 HEAD^2');
    expect(workflow).toContain("grep -Ev '^(docs/|.*\\.md$)'");
    expect(workflow).toContain('echo "full=$full" >> "$GITHUB_OUTPUT"');

    for (const step of fullValidationSteps) {
      const marker = `- name: ${step}`;
      const start = workflow.indexOf(marker);
      expect(start).toBeGreaterThan(-1);
      const snippet = workflow.slice(start, start + 320);
      expect(snippet).toContain("steps.scope.outputs.full == 'true'");
    }

    for (const step of [
      'Repository file line audit',
      'Changed file line limit',
      'Agent navigation integrity',
    ]) {
      const marker = `- name: ${step}`;
      const start = workflow.indexOf(marker);
      expect(start).toBeGreaterThan(-1);
      const snippet = workflow.slice(start, start + 260);
      expect(snippet).not.toContain("steps.scope.outputs.full == 'true'");
    }
  });

  it('keeps pull-request validation enabled and grants only read access', () => {
    expect(workflow).toContain("if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.fork == false");
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('pull-requests: read');
  });
});
