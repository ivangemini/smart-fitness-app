import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const GRAPH_PATH = 'config/agent-project-graph.json';
const OTA_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const DOC_EXTENSIONS = new Set(['.md']);

const uniqueSorted = (values) => [...new Set(values)].sort();

export function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, ...(options.env ?? {}) },
    stdio: options.inherit ? 'inherit' : 'pipe',
  });
  return {
    command,
    args,
    status: result.status,
    signal: result.signal,
    error: result.error ?? null,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    ok: !result.error && result.status === 0,
  };
}

export function git(args, options = {}) {
  const result = run('git', args, options);
  if (!result.ok && options.allowFailure !== true) {
    const detail = result.error?.message || result.stderr.trim() || `exit ${result.status}`;
    throw new Error(`git ${args.join(' ')} failed: ${detail}`);
  }
  return result;
}

export function loadProjectGraph(root = process.cwd()) {
  const graphPath = path.resolve(root, GRAPH_PATH);
  if (!existsSync(graphPath)) {
    throw new Error(`Missing ${GRAPH_PATH}`);
  }
  const graph = JSON.parse(readFileSync(graphPath, 'utf8'));
  validateProjectGraph(graph);
  return graph;
}

export function validateProjectGraph(graph) {
  if (!graph || graph.schemaVersion !== 1) {
    throw new Error('Agent project graph must use schemaVersion 1');
  }
  if (!Array.isArray(graph.nodes) || graph.nodes.length === 0) {
    throw new Error('Agent project graph requires nodes');
  }
  if (!Array.isArray(graph.edges)) {
    throw new Error('Agent project graph requires edges');
  }
  if (!graph.validationProfiles || typeof graph.validationProfiles !== 'object') {
    throw new Error('Agent project graph requires validationProfiles');
  }

  const ids = new Set();
  for (const node of graph.nodes) {
    if (!node?.id || ids.has(node.id)) {
      throw new Error(`Duplicate or missing graph node id: ${node?.id ?? '<missing>'}`);
    }
    ids.add(node.id);
    if (!Array.isArray(node.paths) || node.paths.length === 0) {
      throw new Error(`Graph node ${node.id} requires path patterns`);
    }
    for (const profile of node.validation ?? []) {
      if (!graph.validationProfiles[profile]) {
        throw new Error(`Graph node ${node.id} references unknown validation profile ${profile}`);
      }
    }
  }
  for (const edge of graph.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) {
      throw new Error(`Graph edge references unknown node: ${edge.from} -> ${edge.to}`);
    }
  }
  return true;
}

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

export function globToRegExp(pattern) {
  let expression = '';
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === '*') {
      if (pattern[index + 1] === '*') {
        expression += '.*';
        index += 1;
      } else {
        expression += '[^/]*';
      }
      continue;
    }
    expression += escapeRegex(char);
  }
  return new RegExp(`^${expression}$`);
}

export function matchesPath(file, patterns) {
  return patterns.some((pattern) => globToRegExp(pattern).test(file));
}

export function resolveBaseRef(graph, explicitBase, root = process.cwd()) {
  const candidates = explicitBase ? [explicitBase] : graph.defaultBaseCandidates ?? ['origin/main', 'main'];
  for (const candidate of candidates) {
    const probe = git(['rev-parse', '--verify', '--quiet', candidate], { cwd: root, allowFailure: true });
    if (probe.ok) return candidate;
  }
  return null;
}

const splitLines = (value) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export function getChangedFiles({ root = process.cwd(), baseRef = null, includeWorkingTree = true } = {}) {
  const files = [];
  if (baseRef) {
    const committed = git(['diff', '--name-only', '--diff-filter=ACMR', `${baseRef}...HEAD`], {
      cwd: root,
      allowFailure: true,
    });
    if (committed.ok) files.push(...splitLines(committed.stdout));
  }

  if (includeWorkingTree) {
    for (const args of [
      ['diff', '--name-only', '--diff-filter=ACMR'],
      ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
      ['ls-files', '--others', '--exclude-standard'],
    ]) {
      const result = git(args, { cwd: root, allowFailure: true });
      if (result.ok) files.push(...splitLines(result.stdout));
    }
  }
  return uniqueSorted(files);
}

export function getGitState({ root = process.cwd(), graph, explicitBase = null } = {}) {
  const inside = git(['rev-parse', '--is-inside-work-tree'], { cwd: root, allowFailure: true });
  if (!inside.ok || inside.stdout.trim() !== 'true') {
    return { insideWorkTree: false };
  }

  const branchResult = git(['branch', '--show-current'], { cwd: root, allowFailure: true });
  const headResult = git(['rev-parse', 'HEAD'], { cwd: root, allowFailure: true });
  const statusResult = git(['status', '--porcelain=v1'], { cwd: root, allowFailure: true });
  const baseRef = resolveBaseRef(graph, explicitBase, root);
  let ahead = null;
  let behind = null;
  let baseIsAncestor = null;

  if (baseRef) {
    const counts = git(['rev-list', '--left-right', '--count', `${baseRef}...HEAD`], {
      cwd: root,
      allowFailure: true,
    });
    if (counts.ok) {
      const [left, right] = counts.stdout.trim().split(/\s+/).map(Number);
      behind = Number.isFinite(left) ? left : null;
      ahead = Number.isFinite(right) ? right : null;
    }
    const ancestor = git(['merge-base', '--is-ancestor', baseRef, 'HEAD'], {
      cwd: root,
      allowFailure: true,
    });
    baseIsAncestor = ancestor.status === 0;
  }

  return {
    insideWorkTree: true,
    branch: branchResult.stdout.trim() || '(detached)',
    head: headResult.stdout.trim() || null,
    dirty: statusResult.stdout.trim().length > 0,
    status: splitLines(statusResult.stdout),
    baseRef,
    ahead,
    behind,
    baseIsAncestor,
    changedFiles: getChangedFiles({ root, baseRef }),
  };
}

function collectRelatedNodes(graph, changedNodeIds) {
  const changed = new Set(changedNodeIds);
  const dependencies = new Set();
  const dependents = new Set();

  for (const edge of graph.edges) {
    if (changed.has(edge.from)) dependencies.add(edge.to);
    if (changed.has(edge.to)) dependents.add(edge.from);
  }

  return {
    dependencies: uniqueSorted(dependencies),
    dependents: uniqueSorted(dependents),
    inspect: uniqueSorted([...changed, ...dependencies, ...dependents]),
  };
}

function isDocumentationFile(file) {
  return file.startsWith('docs/') || DOC_EXTENSIONS.has(path.extname(file)) || file === 'README.md';
}

function otaSafeCandidate(files) {
  if (files.length === 0) return { value: false, reason: 'no changed files' };
  if (files.every(isDocumentationFile)) return { value: false, reason: 'documentation-only change' };
  for (const file of files) {
    if (file.startsWith('assets/')) continue;
    if (file.startsWith('src/') && OTA_EXTENSIONS.has(path.extname(file))) continue;
    return { value: false, reason: `non-OTA-safe path: ${file}` };
  }
  return { value: true, reason: 'only JS/TS/TSX source or bundled assets changed' };
}

export function classifyChangedFiles(graph, files) {
  const normalizedFiles = uniqueSorted(files.map((file) => file.replaceAll('\\', '/')));
  const matchedNodes = [];
  const unmatchedFiles = [];

  for (const file of normalizedFiles) {
    const matching = graph.nodes.filter((node) => matchesPath(file, node.paths));
    if (matching.length === 0) unmatchedFiles.push(file);
    for (const node of matching) matchedNodes.push(node.id);
  }

  const nodeIds = uniqueSorted(matchedNodes);
  const nodes = nodeIds.map((id) => graph.nodes.find((node) => node.id === id));
  const changeClasses = uniqueSorted(nodes.flatMap((node) => node.changeClasses ?? []));
  const validationProfiles = uniqueSorted(nodes.flatMap((node) => node.validation ?? []));
  const crossRepo = uniqueSorted(nodes.map((node) => node.crossRepo).filter(Boolean));
  const related = collectRelatedNodes(graph, nodeIds);
  const docsOnly = normalizedFiles.length > 0 && normalizedFiles.every(isDocumentationFile);
  const ota = otaSafeCandidate(normalizedFiles);

  return {
    schemaVersion: 1,
    changedFiles: normalizedFiles,
    matchedNodes: nodeIds,
    relatedNodes: related,
    changeClasses,
    validationProfiles,
    crossRepo,
    unmatchedFiles,
    flags: {
      docsOnly,
      highFanOut: changeClasses.includes('high-fan-out'),
      privacySensitive: changeClasses.includes('privacy-sensitive'),
      nativeSensitive: changeClasses.includes('native-sensitive'),
      releaseSensitive: changeClasses.includes('release-sensitive'),
      serverAuthoritative: changeClasses.includes('server-authoritative'),
      otaSafeCandidate: ota.value,
    },
    otaReason: ota.reason,
  };
}

export function formatImpact(graph, impact) {
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  const lines = [];
  lines.push(`Changed files: ${impact.changedFiles.length}`);
  if (impact.changedFiles.length > 0) {
    for (const file of impact.changedFiles) lines.push(`  - ${file}`);
  }
  lines.push(`Matched domains: ${impact.matchedNodes.length || 0}`);
  for (const id of impact.matchedNodes) {
    const node = nodeMap.get(id);
    lines.push(`  - ${id}: ${node?.label ?? id} — ${node?.authority ?? 'unknown authority'}`);
  }
  if (impact.relatedNodes.dependencies.length > 0) {
    lines.push(`Inspect dependencies: ${impact.relatedNodes.dependencies.join(', ')}`);
  }
  if (impact.relatedNodes.dependents.length > 0) {
    lines.push(`Inspect dependents: ${impact.relatedNodes.dependents.join(', ')}`);
  }
  lines.push(`Classes: ${impact.changeClasses.join(', ') || 'none'}`);
  lines.push(`Cross-repo review: ${impact.crossRepo.join(', ') || 'none'}`);
  lines.push(`Validation profiles: ${impact.validationProfiles.join(', ') || 'none'}`);
  lines.push(`OTA-safe candidate: ${impact.flags.otaSafeCandidate ? 'yes' : 'no'} (${impact.otaReason})`);
  if (impact.unmatchedFiles.length > 0) {
    lines.push(`Unmatched paths: ${impact.unmatchedFiles.join(', ')}`);
  }
  return lines.join('\n');
}

export function commandLabel(profile) {
  return [profile.command, ...(profile.args ?? [])].join(' ');
}

export function runValidationProfile(profile, { root = process.cwd(), extraEnv = {} } = {}) {
  return run(profile.command, profile.args ?? [], {
    cwd: root,
    env: { ...(profile.env ?? {}), ...extraEnv },
    inherit: true,
  });
}

export function readUpdatedMarker(relativePath, root = process.cwd()) {
  const absolute = path.resolve(root, relativePath);
  if (!existsSync(absolute)) return null;
  const line = readFileSync(absolute, 'utf8')
    .split(/\r?\n/)
    .find((candidate) => /^Updated:/u.test(candidate));
  return line?.trim() ?? null;
}

export function tryListOpenPullRequests(root = process.cwd()) {
  const availability = run('gh', ['--version'], { cwd: root });
  if (!availability.ok) return { available: false, pullRequests: [] };
  const result = run(
    'gh',
    ['pr', 'list', '--state', 'open', '--limit', '50', '--json', 'number,title,headRefName,baseRefName,isDraft,url'],
    { cwd: root },
  );
  if (!result.ok) {
    return { available: true, error: result.stderr.trim() || 'gh pr list failed', pullRequests: [] };
  }
  try {
    return { available: true, pullRequests: JSON.parse(result.stdout) };
  } catch {
    return { available: true, error: 'gh returned invalid JSON', pullRequests: [] };
  }
}

export function parseCommonArgs(argv) {
  const options = { json: false, base: null, files: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--base') options.base = argv[++index] ?? null;
    else if (arg.startsWith('--base=')) options.base = arg.slice('--base='.length);
    else if (arg === '--files') options.files = (argv[++index] ?? '').split(',').filter(Boolean);
    else if (arg.startsWith('--files=')) options.files = arg.slice('--files='.length).split(',').filter(Boolean);
  }
  return options;
}
