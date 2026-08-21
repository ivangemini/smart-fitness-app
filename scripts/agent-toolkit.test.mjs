import { describe, expect, it } from 'vitest';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyChangedFiles,
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
});
