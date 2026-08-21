import { existsSync } from 'node:fs';
import {
  getGitState,
  loadProjectGraph,
  readUpdatedMarker,
  run,
  tryListOpenPullRequests,
} from './agent-toolkit.mjs';

const args = new Set(process.argv.slice(2));
const json = args.has('--json');
const strict = args.has('--strict');
const fetchMain = args.has('--fetch');
const root = process.cwd();
const warnings = [];
const errors = [];

let graph;
try {
  graph = loadProjectGraph(root);
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor !== 22) {
  warnings.push(`Node.js 22 is expected; current runtime is ${process.versions.node}`);
}

if (!existsSync('package-lock.json')) {
  errors.push('package-lock.json is missing; deterministic npm ci cannot be guaranteed');
}

if (fetchMain) {
  const fetched = run(
    'git',
    ['fetch', '--prune', '--no-tags', 'origin', '+refs/heads/main:refs/remotes/origin/main'],
    { cwd: root },
  );
  if (!fetched.ok) {
    warnings.push(
      `git fetch origin/main failed: ${fetched.stderr.trim() || fetched.error?.message || 'unknown failure'}`,
    );
  }
}

let gitState = { insideWorkTree: false };
if (graph) {
  gitState = getGitState({ root, graph });
  if (!gitState.insideWorkTree) {
    errors.push('current directory is not a Git working tree');
  } else {
    if (gitState.branch === 'main') {
      warnings.push('currently on main; create a task branch before editing');
    }
    if (!gitState.baseRef) {
      warnings.push('could not resolve origin/main or main as a comparison base');
    }
    if (typeof gitState.behind === 'number' && gitState.behind > 0) {
      warnings.push(`${gitState.baseRef} is ${gitState.behind} commit(s) ahead of this HEAD`);
    }
    if (gitState.baseIsAncestor === false) {
      warnings.push(`${gitState.baseRef} is not an ancestor of HEAD; rebase/rebuild before merge validation`);
    }
    if (gitState.dirty) {
      warnings.push('working tree has uncommitted changes');
    }
  }
}

const agentCheck = run('node', ['scripts/check-agent-navigation.mjs'], { cwd: root });
if (!agentCheck.ok) {
  errors.push(
    `agent navigation integrity failed: ${agentCheck.stderr.trim() || agentCheck.stdout.trim() || 'unknown failure'}`,
  );
}

const pullRequestState = tryListOpenPullRequests(root);
const overlaps = [];
if (pullRequestState.available && !pullRequestState.error && gitState.insideWorkTree) {
  const ownFiles = new Set(gitState.changedFiles ?? []);
  for (const pull of pullRequestState.pullRequests.slice(0, 20)) {
    if (pull.headRefName === gitState.branch) continue;
    const diff = run('gh', ['pr', 'diff', String(pull.number), '--name-only'], { cwd: root });
    if (!diff.ok) continue;
    const shared = diff.stdout
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter((file) => ownFiles.has(file));
    if (shared.length > 0) {
      overlaps.push({
        number: pull.number,
        title: pull.title,
        headRefName: pull.headRefName,
        files: shared.sort(),
        url: pull.url,
      });
    }
  }
  if (overlaps.length > 0) {
    warnings.push(`${overlaps.length} open PR(s) overlap this working set`);
  }
} else if (pullRequestState.error) {
  warnings.push(`GitHub CLI is available but open-PR inspection failed: ${pullRequestState.error}`);
}

const result = {
  schemaVersion: 1,
  ok: errors.length === 0 && (!strict || warnings.length === 0),
  strict,
  fetchMain,
  runtime: {
    node: process.versions.node,
    expectedNodeMajor: 22,
  },
  git: gitState,
  documentation: {
    projectContext: readUpdatedMarker('docs/project-context.md', root),
    currentStatus: readUpdatedMarker('docs/current-status.md', root),
    latestHandoff: readUpdatedMarker('docs/handoffs/latest.md', root),
  },
  agentIntegrity: {
    ok: agentCheck.ok,
    output: agentCheck.stdout.trim(),
  },
  githubCli: {
    available: pullRequestState.available,
    error: pullRequestState.error ?? null,
    openPullRequests: pullRequestState.pullRequests?.length ?? 0,
    overlaps,
  },
  warnings,
  errors,
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log('Agent preflight');
  console.log(`- Node: ${process.versions.node}${nodeMajor === 22 ? ' ✓' : ' !'}`);
  if (gitState.insideWorkTree) {
    console.log(`- Branch: ${gitState.branch}`);
    console.log(`- HEAD: ${gitState.head}`);
    console.log(`- Base: ${gitState.baseRef ?? 'unresolved'}`);
    console.log(`- Ahead/behind: ${gitState.ahead ?? '?'} / ${gitState.behind ?? '?'}`);
    console.log(`- Changed files: ${gitState.changedFiles?.length ?? 0}`);
  }
  console.log(`- Agent integrity: ${agentCheck.ok ? 'pass' : 'FAIL'}`);
  console.log(
    `- GitHub PR visibility: ${
      pullRequestState.available ? `${pullRequestState.pullRequests?.length ?? 0} open` : 'gh unavailable (non-blocking)'
    }`,
  );
  if (overlaps.length > 0) {
    console.log('Overlapping PRs:');
    for (const overlap of overlaps) {
      console.log(`  - #${overlap.number} ${overlap.headRefName}: ${overlap.files.join(', ')}`);
    }
  }
  if (warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of warnings) console.log(`  - ${warning}`);
  }
  if (errors.length > 0) {
    console.log('Errors:');
    for (const error of errors) console.log(`  - ${error}`);
  }
  console.log(result.ok ? 'Preflight passed.' : 'Preflight failed.');
}

if (!result.ok) process.exitCode = 1;
