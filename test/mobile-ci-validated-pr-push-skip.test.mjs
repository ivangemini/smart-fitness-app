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

describe('Mobile CI merged-PR push deduplication', () => {
  it('uses the GitHub commit-to-pulls association and fails open to validation', () => {
    expect(workflow).toContain('Detect already-validated PR merge push');
    expect(workflow).toContain('/commits/${GITHUB_SHA}/pulls?per_page=10');
    expect(workflow).toContain('merge_commit_sha');
    expect(workflow).toContain("grep -Eq '\"merged_at\":\"[^\"]+\"'");
    expect(workflow).toContain("grep -Fq '\"base\":{\"ref\":\"main\"'");
    expect(workflow).toContain("echo 'skip=false' >> \"$GITHUB_OUTPUT\"");
    expect(workflow).toContain('2>/dev/null || true');
  });

  it('guards every heavyweight validation step with the association result', () => {
    for (const step of guardedHeavySteps) {
      const marker = `- name: ${step}`;
      const start = workflow.indexOf(marker);
      expect(start).toBeGreaterThan(-1);
      const snippet = workflow.slice(start, start + 240);
      expect(snippet).toContain("if: steps.validated-pr-merge.outputs.skip != 'true'");
    }
  });

  it('keeps pull-request validation enabled and grants only read access', () => {
    expect(workflow).toContain("if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.fork == false");
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('pull-requests: read');
  });
});
