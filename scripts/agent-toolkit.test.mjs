import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  classifyChangedFiles,
  getChangedFiles,
  globToRegExp,
  loadProjectGraph,
  matchesPath,
  validateProjectGraph,
} from './agent-toolkit.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const graph = loadProjectGraph(projectRoot);

describe('agent project graph', () => {
  it('is structurally valid', () => {
    expect(validateProjectGraph(graph)).toBe(true);
    expect(graph.nodes.length).toBeGreaterThan(10);
    expect(graph.edges.length).toBeGreaterThan(10);
  });

  it('matches exact and recursive path patterns', () => {
    expect(globToRegExp('src/api/**').test('src/api/client.ts')).toBe(true);
    expect(matchesPath('app.config.ts', ['app.config.ts'])).toBe(true);
    expect(matchesPath('src/features/labs/screen.tsx', ['src/features/labs/**'])).toBe(true);
    expect(matchesPath('src/features/social/feed.tsx', ['src/features/labs/**'])).toBe(false);
  });

  it('classifies UI-only source as an OTA-safe candidate', () => {
    const impact = classifyChangedFiles(graph, ['src/features/workouts/WorkoutCard.tsx']);
    expect(impact.matchedNodes).toContain('workouts');
    expect(impact.flags.otaSafeCandidate).toBe(true);
    expect(impact.validationProfiles).toContain('typecheck');
    expect(impact.crossRepo).toEqual([]);
  });

  it('marks API changes for cross-repository review', () => {
    const impact = classifyChangedFiles(graph, ['src/api/labs.ts']);
    expect(impact.matchedNodes).toContain('api');
    expect(impact.flags.serverAuthoritative).toBe(true);
    expect(impact.flags.highFanOut).toBe(true);
    expect(impact.crossRepo).toContain('backend-contract-review');
    expect(impact.flags.otaSafeCandidate).toBe(true);
    expect(impact.relatedNodes.dependencies).toContain('backend-api');
  });

  it('marks sync changes for the expanded sync smoke', () => {
    const impact = classifyChangedFiles(graph, ['src/cloud/outbox.ts']);
    expect(impact.matchedNodes).toContain('sync');
    expect(impact.validationProfiles).toContain('sync-smoke');
    expect(impact.crossRepo).toContain('backend-sync-review');
    expect(impact.relatedNodes.dependencies).toContain('backend-sync');
  });

  it('treats package changes conservatively as native/release sensitive', () => {
    const impact = classifyChangedFiles(graph, ['package.json']);
    expect(impact.matchedNodes).toContain('native-release');
    expect(impact.flags.nativeSensitive).toBe(true);
    expect(impact.flags.releaseSensitive).toBe(true);
    expect(impact.flags.otaSafeCandidate).toBe(false);
    expect(impact.validationProfiles).toContain('expo-doctor');
  });

  it('does not infer OTA safety from an asset path alone', () => {
    const impact = classifyChangedFiles(graph, ['assets/images/icon.png']);
    expect(impact.matchedNodes).toContain('assets');
    expect(impact.flags.otaSafeCandidate).toBe(false);
    expect(impact.otaReason).toContain('usage inspection');
  });

  it('recognizes documentation-only changes', () => {
    const impact = classifyChangedFiles(graph, ['docs/agent/README.md']);
    expect(impact.flags.docsOnly).toBe(true);
    expect(impact.flags.otaSafeCandidate).toBe(false);
    expect(impact.matchedNodes).toContain('agent-tooling');
    expect(impact.validationProfiles).toContain('agent-tooling-tests');
  });

  it('reports unmatched paths rather than silently dropping them', () => {
    const impact = classifyChangedFiles(graph, ['unexpected/new-surface.xyz']);
    expect(impact.unmatchedFiles).toEqual(['unexpected/new-surface.xyz']);
  });

  it('makes targeted validation fail closed for unmatched paths', () => {
    const output = execFileSync(
      process.execPath,
      ['scripts/agent-validate.mjs', '--json', '--files=unexpected/new-surface.xyz'],
      { cwd: projectRoot, encoding: 'utf8' },
    );
    const plan = JSON.parse(output);
    expect(plan.failClosedReason).toContain('unmatched changed paths');
    expect(plan.impact.unmatchedFiles).toEqual(['unexpected/new-surface.xyz']);
  });

  it('keeps deleted paths in the changed-file impact set', () => {
    const root = mkdtempSync(join(tmpdir(), 'agent-toolkit-delete-'));
    try {
      execFileSync('git', ['init', '-q'], { cwd: root });
      execFileSync('git', ['config', 'user.email', 'agent@example.test'], { cwd: root });
      execFileSync('git', ['config', 'user.name', 'Agent Test'], { cwd: root });
      writeFileSync(join(root, 'deleted.ts'), 'export const value = 1;\n');
      execFileSync('git', ['add', 'deleted.ts'], { cwd: root });
      execFileSync('git', ['commit', '-qm', 'base'], { cwd: root });
      execFileSync('git', ['branch', 'main'], { cwd: root });
      rmSync(join(root, 'deleted.ts'));

      expect(getChangedFiles({ root, baseRef: 'main' })).toContain('deleted.ts');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
