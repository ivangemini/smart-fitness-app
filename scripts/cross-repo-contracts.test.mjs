import { describe, expect, it } from 'vitest';
import {
  classifyContractImpact,
  loadContractRegistry,
  parseBackendRouteInventory,
  validateContractRegistry,
  verifyRequiredEndpoints,
} from './cross-repo-contracts.mjs';

const registry = loadContractRegistry(process.cwd());

describe('cross-repo mobile/backend contract registry', () => {
  it('is structurally valid and covers core server-authoritative domains', () => {
    expect(validateContractRegistry(registry)).toBe(true);
    const ids = registry.contracts.map((contract) => contract.id);
    for (const id of ['auth', 'sync', 'coach', 'labs', 'knowledge', 'social', 'foods', 'privacy-account']) {
      expect(ids).toContain(id);
    }
  });

  it('parses only the marked backend route inventory', () => {
    const markdown = `
- \`GET /outside\`
<!-- route-inventory:start -->
- \`GET /v1/example\`
- \`POST /v1/example/:id\`
<!-- route-inventory:end -->
- \`DELETE /outside\`
`;
    expect(parseBackendRouteInventory(markdown)).toEqual([
      'GET /v1/example',
      'POST /v1/example/:id',
    ]);
  });

  it('fails closed when a mobile-required backend endpoint is absent', () => {
    const routes = registry.contracts.flatMap((contract) => contract.requiredEndpoints);
    const removed = routes[0];
    const missing = verifyRequiredEndpoints(registry, routes.filter((route) => route !== removed));
    expect(missing).toContainEqual({
      contract: registry.contracts.find((contract) => contract.requiredEndpoints.includes(removed)).id,
      endpoint: removed,
    });
  });

  it('classifies unilateral and paired cross-repository changes', () => {
    const mobileOnly = classifyContractImpact(registry, ['src/features/labs/LabsScreen.tsx'], []);
    const labsMobile = mobileOnly.find((contract) => contract.id === 'labs');
    expect(labsMobile.mobileChanged).toBe(true);
    expect(labsMobile.backendChanged).toBe(false);
    expect(labsMobile.pairedChange).toBe(false);

    const paired = classifyContractImpact(
      registry,
      ['src/features/labs/LabsScreen.tsx'],
      ['src/routes/labs/index.ts'],
    );
    const labsPaired = paired.find((contract) => contract.id === 'labs');
    expect(labsPaired.pairedChange).toBe(true);
  });
});
