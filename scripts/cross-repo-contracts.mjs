import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  getChangedFiles,
  git,
  matchesPath,
  run,
} from './agent-toolkit.mjs';

export const CONTRACT_REGISTRY_PATH = 'config/cross-repo-contracts.json';

const uniqueSorted = (values) => [...new Set(values)].sort();

export function loadContractRegistry(root = process.cwd()) {
  const target = path.resolve(root, CONTRACT_REGISTRY_PATH);
  if (!existsSync(target)) throw new Error(`Missing ${CONTRACT_REGISTRY_PATH}`);
  const registry = JSON.parse(readFileSync(target, 'utf8'));
  validateContractRegistry(registry);
  return registry;
}

export function validateContractRegistry(registry) {
  if (!registry || registry.schemaVersion !== 1) {
    throw new Error('Cross-repo contract registry must use schemaVersion 1');
  }
  if (!Array.isArray(registry.contracts) || registry.contracts.length === 0) {
    throw new Error('Cross-repo contract registry requires contracts');
  }
  const ids = new Set();
  const endpointOwners = new Map();
  for (const contract of registry.contracts) {
    if (!contract?.id || ids.has(contract.id)) {
      throw new Error(`Duplicate or missing contract id: ${contract?.id ?? '<missing>'}`);
    }
    ids.add(contract.id);
    for (const key of ['mobilePatterns', 'backendPatterns', 'requiredEndpoints']) {
      if (!Array.isArray(contract[key]) || contract[key].length === 0) {
        throw new Error(`Contract ${contract.id} requires ${key}`);
      }
    }
    for (const endpoint of contract.requiredEndpoints) {
      if (!/^(GET|POST|PUT|PATCH|DELETE) \/\S+$/u.test(endpoint)) {
        throw new Error(`Contract ${contract.id} has invalid endpoint ${endpoint}`);
      }
      const existing = endpointOwners.get(endpoint);
      if (existing && existing !== contract.id) {
        throw new Error(`Endpoint ${endpoint} is owned by both ${existing} and ${contract.id}`);
      }
      endpointOwners.set(endpoint, contract.id);
    }
  }
  return true;
}

export function parseBackendRouteInventory(markdown) {
  const start = markdown.indexOf('<!-- route-inventory:start -->');
  const end = markdown.indexOf('<!-- route-inventory:end -->');
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('Backend API reference is missing route inventory markers');
  }
  const inventory = markdown.slice(start, end);
  const routes = [];
  for (const match of inventory.matchAll(/^- `((?:GET|POST|PUT|PATCH|DELETE) \/[^`]+)`$/gmu)) {
    routes.push(match[1]);
  }
  return uniqueSorted(routes);
}

export function resolveBackendDirectory({ mobileRoot = process.cwd(), explicit = null } = {}) {
  const candidates = [
    explicit,
    process.env.SMART_FITNESS_BACKEND_DIR,
    path.resolve(mobileRoot, '..', 'smart-fitness-backend'),
  ].filter(Boolean);
  for (const candidate of candidates) {
    const absolute = path.resolve(mobileRoot, candidate);
    if (existsSync(path.join(absolute, 'package.json')) && existsSync(path.join(absolute, 'docs/api-reference.md'))) {
      return absolute;
    }
  }
  return null;
}

function resolveExternalBase(root, explicit = null) {
  const candidates = explicit ? [explicit] : ['origin/main', 'main'];
  for (const candidate of candidates) {
    const probe = git(['rev-parse', '--verify', '--quiet', candidate], { cwd: root, allowFailure: true });
    if (probe.ok) return candidate;
  }
  return null;
}

export function getExternalChangedFiles(root, explicitBase = null) {
  const baseRef = resolveExternalBase(root, explicitBase);
  const files = getChangedFiles({ root, baseRef });
  return { baseRef, files };
}

export function classifyContractImpact(registry, mobileFiles, backendFiles) {
  return registry.contracts
    .map((contract) => {
      const mobileMatches = mobileFiles.filter((file) => matchesPath(file, contract.mobilePatterns));
      const backendMatches = backendFiles.filter((file) => matchesPath(file, contract.backendPatterns));
      if (mobileMatches.length === 0 && backendMatches.length === 0) return null;
      return {
        id: contract.id,
        mobileChanged: mobileMatches.length > 0,
        backendChanged: backendMatches.length > 0,
        pairedChange: mobileMatches.length > 0 && backendMatches.length > 0,
        mobileFiles: mobileMatches,
        backendFiles: backendMatches,
        requiredEndpoints: contract.requiredEndpoints,
      };
    })
    .filter(Boolean);
}

export function verifyRequiredEndpoints(registry, backendRoutes) {
  const available = new Set(backendRoutes);
  const missing = [];
  for (const contract of registry.contracts) {
    for (const endpoint of contract.requiredEndpoints) {
      if (!available.has(endpoint)) missing.push({ contract: contract.id, endpoint });
    }
  }
  return missing;
}

export function readBackendContractEvidence(backendRoot, registry) {
  const apiReferencePath = path.join(backendRoot, registry.backendApiReference);
  const sourceCheckPath = path.join(backendRoot, registry.backendRouteSourceCheck);
  if (!existsSync(apiReferencePath)) {
    throw new Error(`Backend API reference missing: ${registry.backendApiReference}`);
  }
  if (!existsSync(sourceCheckPath)) {
    throw new Error(`Backend route source-check test missing: ${registry.backendRouteSourceCheck}`);
  }
  const markdown = readFileSync(apiReferencePath, 'utf8');
  const routes = parseBackendRouteInventory(markdown);
  return { routes, apiReferencePath, sourceCheckPath };
}

export function readOptionalBackendAgentImpact(backendRoot, baseRef) {
  const script = path.join(backendRoot, 'scripts/agent-impact.mjs');
  if (!existsSync(script)) return { available: false, impact: null };
  const args = ['scripts/agent-impact.mjs', '--json'];
  if (baseRef) args.push(`--base=${baseRef}`);
  const result = run(process.execPath, args, { cwd: backendRoot });
  if (!result.ok) {
    return {
      available: true,
      impact: null,
      error: result.stderr.trim() || result.stdout.trim() || 'backend agent impact failed',
    };
  }
  try {
    return { available: true, impact: JSON.parse(result.stdout) };
  } catch {
    return { available: true, impact: null, error: 'backend agent impact returned invalid JSON' };
  }
}
