import path from 'node:path';
import {
  getChangedFiles,
  git,
  loadProjectGraph,
  resolveBaseRef,
  run,
} from './agent-toolkit.mjs';
import {
  classifyContractImpact,
  getExternalChangedFiles,
  loadContractRegistry,
  readBackendContractEvidence,
  readOptionalBackendAgentImpact,
  resolveBackendDirectory,
  verifyRequiredEndpoints,
} from './cross-repo-contracts.mjs';

const argv = process.argv.slice(2);
const json = argv.includes('--json');
const fetchMain = argv.includes('--fetch');
const valueAfter = (name) => {
  const direct = argv.find((arg) => arg.startsWith(`${name}=`));
  if (direct) return direct.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] ?? null : null;
};

const mobileRoot = process.cwd();
const explicitBackend = valueAfter('--backend');
const explicitMobileBase = valueAfter('--base');
const explicitBackendBase = valueAfter('--backend-base');
const registry = loadContractRegistry(mobileRoot);
const backendRoot = resolveBackendDirectory({ mobileRoot, explicit: explicitBackend });

if (!backendRoot) {
  console.error(
    'Backend checkout not found. Set SMART_FITNESS_BACKEND_DIR or pass --backend=/path/to/smart-fitness-backend.',
  );
  process.exit(2);
}

if (fetchMain) {
  for (const root of [mobileRoot, backendRoot]) {
    const result = run(
      'git',
      ['fetch', '--prune', '--no-tags', 'origin', 'main:refs/remotes/origin/main'],
      { cwd: root },
    );
    if (!result.ok) {
      console.error(`Failed to update origin/main in ${root}: ${result.stderr.trim() || 'git fetch failed'}`);
      process.exit(2);
    }
  }
}

const mobileGraph = loadProjectGraph(mobileRoot);
const mobileBase = resolveBaseRef(mobileGraph, explicitMobileBase, mobileRoot);
const mobileFiles = getChangedFiles({ root: mobileRoot, baseRef: mobileBase });
const backendState = getExternalChangedFiles(backendRoot, explicitBackendBase);
const backendFiles = backendState.files;
const backendEvidence = readBackendContractEvidence(backendRoot, registry);
const missingEndpoints = verifyRequiredEndpoints(registry, backendEvidence.routes);
const impactedContracts = classifyContractImpact(registry, mobileFiles, backendFiles);
const backendTooling = readOptionalBackendAgentImpact(backendRoot, backendState.baseRef);
const mobileHead = git(['rev-parse', 'HEAD'], { cwd: mobileRoot, allowFailure: true }).stdout.trim();
const backendHead = git(['rev-parse', 'HEAD'], { cwd: backendRoot, allowFailure: true }).stdout.trim();

const result = {
  schemaVersion: 1,
  ok: missingEndpoints.length === 0,
  mobile: {
    root: mobileRoot,
    head: mobileHead || null,
    baseRef: mobileBase,
    changedFiles: mobileFiles,
  },
  backend: {
    root: path.resolve(backendRoot),
    head: backendHead || null,
    baseRef: backendState.baseRef,
    changedFiles: backendFiles,
    routeInventoryCount: backendEvidence.routes.length,
    routeSourceCheck: registry.backendRouteSourceCheck,
    agentTooling: backendTooling,
  },
  contracts: {
    total: registry.contracts.length,
    requiredEndpoints: registry.contracts.reduce(
      (sum, contract) => sum + contract.requiredEndpoints.length,
      0,
    ),
    impacted: impactedContracts,
    missingEndpoints,
  },
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log('Mobile ↔ backend contract crosscheck');
  console.log(`- Mobile HEAD: ${result.mobile.head}`);
  console.log(`- Backend HEAD: ${result.backend.head}`);
  console.log(`- Backend route inventory: ${result.backend.routeInventoryCount} routes`);
  console.log(
    `- Required mobile contract endpoints: ${result.contracts.requiredEndpoints} across ${result.contracts.total} contract groups`,
  );
  console.log(`- Impacted contract groups: ${impactedContracts.length}`);
  for (const contract of impactedContracts) {
    console.log(
      `  - ${contract.id}: mobile=${contract.mobileChanged ? 'changed' : 'stable'}, backend=${contract.backendChanged ? 'changed' : 'stable'}, paired=${contract.pairedChange ? 'yes' : 'no'}`,
    );
  }
  if (backendTooling.available) {
    console.log(`- Backend agent tooling: ${backendTooling.error ? `error: ${backendTooling.error}` : 'available'}`);
  } else {
    console.log('- Backend agent tooling: not installed on this checkout (route contract check still active)');
  }
  if (missingEndpoints.length > 0) {
    console.log('Missing backend endpoints required by mobile:');
    for (const missing of missingEndpoints) {
      console.log(`  - ${missing.contract}: ${missing.endpoint}`);
    }
  }
  console.log(result.ok ? 'Cross-repo contract check passed.' : 'Cross-repo contract check FAILED.');
}

if (!result.ok) process.exitCode = 1;
