import { existsSync, rmSync } from 'node:fs';
import {
  classifyChangedFiles,
  commandLabel,
  getChangedFiles,
  git,
  loadProjectGraph,
  parseCommonArgs,
  resolveBaseRef,
  run,
  runValidationProfile,
} from './agent-toolkit.mjs';

const argv = process.argv.slice(2);
const common = parseCommonArgs(argv);
const planOnly = argv.includes('--plan') || common.json;
const full = argv.includes('--full');
const root = process.cwd();
const graph = loadProjectGraph(root);
const baseRef = resolveBaseRef(graph, common.base, root);
const files = common.files ?? getChangedFiles({ root, baseRef });
const impact = classifyChangedFiles(graph, files);
const profileOrder = [
  'agent-integrity',
  'agent-tooling-tests',
  'typecheck',
  'tests',
  'sync-smoke',
  'release-config',
  'expo-export',
  'expo-doctor',
];

const selected = new Set(impact.validationProfiles);
selected.add('agent-integrity');
if (full) {
  for (const id of profileOrder) selected.add(id);
}

const profiles = profileOrder
  .filter((id) => selected.has(id))
  .map((id) => ({ id, ...graph.validationProfiles[id] }))
  .filter((profile) => profile.command);

const failClosedReason =
  impact.unmatchedFiles.length > 0 && !full
    ? `unmatched changed paths require graph coverage or --full: ${impact.unmatchedFiles.join(', ')}`
    : null;

const plan = {
  schemaVersion: 1,
  baseRef,
  changedFiles: files,
  impact,
  full,
  failClosedReason,
  prechecks: [
    { label: 'Repository file line audit', command: 'node scripts/check-repository-file-lines.mjs' },
    ...(baseRef
      ? [{ label: 'Changed file line limit', command: `node scripts/check-changed-file-lines.mjs ${baseRef}` }]
      : []),
  ],
  profiles: profiles.map((profile) => ({
    id: profile.id,
    label: profile.label,
    command: commandLabel(profile),
  })),
};

if (common.json || planOnly) {
  if (common.json) {
    console.log(JSON.stringify(plan, null, 2));
  } else {
    console.log(`Validation plan (${files.length} changed files, base ${baseRef ?? 'unresolved'})`);
    if (failClosedReason) console.log(`- FAIL CLOSED: ${failClosedReason}`);
    for (const precheck of plan.prechecks) console.log(`- ${precheck.label}: ${precheck.command}`);
    for (const profile of plan.profiles) console.log(`- ${profile.label}: ${profile.command}`);
  }
  if (planOnly) process.exit(0);
}

if (failClosedReason) {
  console.error(`Agent validation refused targeted execution: ${failClosedReason}`);
  process.exit(2);
}

if (files.length === 0) {
  console.log('No changed files detected. Running agent integrity only.');
}

const runRequired = (label, command, args, extraEnv = {}) => {
  console.log(`\n== ${label} ==`);
  const result = run(command, args, { cwd: root, env: extraEnv, inherit: true });
  if (!result.ok) {
    console.error(`${label} failed.`);
    process.exit(result.status ?? 1);
  }
};

runRequired('Repository file line audit', 'node', ['scripts/check-repository-file-lines.mjs']);
if (baseRef) {
  runRequired('Changed file line limit', 'node', ['scripts/check-changed-file-lines.mjs', baseRef]);
}

const head = git(['rev-parse', 'HEAD'], { cwd: root, allowFailure: true }).stdout.trim();
for (const profile of profiles) {
  console.log(`\n== ${profile.label} ==`);
  const result = runValidationProfile(profile, {
    root,
    extraEnv: profile.id === 'sync-smoke' ? { EXPECTED_MOBILE_SHA: head } : {},
  });
  if (profile.id === 'sync-smoke' && existsSync('.agent-expanded-model-evidence.json')) {
    rmSync('.agent-expanded-model-evidence.json', { force: true });
  }
  if (!result.ok) {
    console.error(`${profile.label} failed.`);
    process.exit(result.status ?? 1);
  }
}

console.log('\nAgent validation passed.');
