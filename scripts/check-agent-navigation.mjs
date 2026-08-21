import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const maxLines = 500;

const requiredFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'PROJECT_MAP.md',
  'PROJECT_LEARNINGS.md',
  'README.md',
  'package.json',
  'docs/project-context.md',
  'docs/current-status.md',
  'docs/handoffs/latest.md',
  'docs/implementation-plan.md',
  'docs/architecture/README.md',
  'docs/agent/README.md',
  'docs/agent/ownership-map.md',
  'docs/agent/change-impact.md',
  'docs/agent/validation-matrix.md',
  'config/agent-project-graph.json',
  'scripts/print-project-tree.mjs',
  'scripts/agent-toolkit.mjs',
  'scripts/agent-toolkit.test.mjs',
  'scripts/agent-preflight.mjs',
  'scripts/agent-impact.mjs',
  'scripts/agent-graph.mjs',
  'scripts/agent-validate.mjs',
];

const requiredReferences = [
  ['CLAUDE.md', '@AGENTS.md'],
  ['AGENTS.md', 'PROJECT_MAP.md'],
  ['AGENTS.md', 'docs/agent/README.md'],
  ['AGENTS.md', 'docs/agent/ownership-map.md'],
  ['AGENTS.md', 'docs/agent/change-impact.md'],
  ['AGENTS.md', 'docs/agent/validation-matrix.md'],
  ['README.md', 'PROJECT_MAP.md'],
  ['README.md', 'docs/agent/README.md'],
  ['docs/agent/README.md', 'PROJECT_MAP.md'],
  ['docs/agent/README.md', 'ownership-map.md'],
  ['docs/agent/README.md', 'change-impact.md'],
  ['docs/agent/README.md', 'validation-matrix.md'],
  ['docs/agent/README.md', 'agent:preflight'],
  ['docs/agent/README.md', 'agent:impact'],
  ['docs/agent/README.md', 'agent:graph'],
  ['docs/agent/README.md', 'agent:validate'],
];

const requiredPackageScripts = {
  'project:tree': 'node scripts/print-project-tree.mjs',
  'agent:check': 'node scripts/check-agent-navigation.mjs',
  'agent:preflight': 'node scripts/agent-preflight.mjs',
  'agent:impact': 'node scripts/agent-impact.mjs',
  'agent:graph': 'node scripts/agent-graph.mjs',
  'agent:validate': 'node scripts/agent-validate.mjs',
  'agent:tooling:test': 'vitest run scripts/agent-toolkit.test.mjs',
};

const boundedAgentDocs = [
  'PROJECT_MAP.md',
  'docs/agent/README.md',
  'docs/agent/ownership-map.md',
  'docs/agent/change-impact.md',
  'docs/agent/validation-matrix.md',
];

const failures = [];

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), 'utf8');
}

for (const relativePath of requiredFiles) {
  const target = absolute(relativePath);
  if (!fs.existsSync(target)) {
    failures.push(`missing required agent entry point: ${relativePath}`);
    continue;
  }

  if (!fs.statSync(target).isFile()) {
    failures.push(`agent entry point is not a file: ${relativePath}`);
  }
}

for (const [relativePath, expectedReference] of requiredReferences) {
  const target = absolute(relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    continue;
  }

  const content = read(relativePath);
  if (!content.includes(expectedReference)) {
    failures.push(`${relativePath} must reference ${expectedReference}`);
  }
}

for (const relativePath of boundedAgentDocs) {
  const target = absolute(relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    continue;
  }

  const content = read(relativePath);
  const lineCount = content.length === 0 ? 0 : content.split(/\r?\n/).length;
  if (lineCount > maxLines) {
    failures.push(`${relativePath} has ${lineCount} lines; maximum is ${maxLines}`);
  }
}

const packagePath = absolute('package.json');
if (fs.existsSync(packagePath)) {
  try {
    const packageJson = JSON.parse(read('package.json'));
    for (const [name, expected] of Object.entries(requiredPackageScripts)) {
      if (packageJson.scripts?.[name] !== expected) {
        failures.push(`package.json script ${name} must equal: ${expected}`);
      }
    }
  } catch (error) {
    failures.push(`package.json could not be parsed: ${error instanceof Error ? error.message : error}`);
  }
}

if (fs.existsSync(absolute('scripts/agent-toolkit.mjs')) && fs.existsSync(absolute('config/agent-project-graph.json'))) {
  try {
    const { loadProjectGraph, matchesPath } = await import('./agent-toolkit.mjs');
    const graph = loadProjectGraph(root);
    if (graph.repository !== 'ivangemini/smart-fitness-app') {
      failures.push(`agent project graph repository is unexpected: ${graph.repository ?? '<missing>'}`);
    }

    const featureRoot = absolute('src/features');
    if (fs.existsSync(featureRoot)) {
      const featureDirectories = fs
        .readdirSync(featureRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `src/features/${entry.name}/__agent_probe__.tsx`)
        .sort();

      for (const probe of featureDirectories) {
        const covered = graph.nodes.some((node) => !node.external && matchesPath(probe, node.paths));
        if (!covered) {
          failures.push(`agent project graph does not cover feature directory: ${path.dirname(probe)}`);
        }
      }
    }

    const requiredSourceProbes = [
      'src/app/__agent_probe__.tsx',
      'src/api/__agent_probe__.ts',
      'src/auth/__agent_probe__.ts',
      'src/cloud/__agent_probe__.ts',
      'src/context/__agent_probe__.tsx',
      'src/components/__agent_probe__.tsx',
      'src/domain/__agent_probe__.ts',
    ];
    for (const probe of requiredSourceProbes) {
      const covered = graph.nodes.some((node) => !node.external && matchesPath(probe, node.paths));
      if (!covered) failures.push(`agent project graph does not cover source area: ${path.dirname(probe)}`);
    }
  } catch (error) {
    failures.push(`agent project graph is invalid: ${error instanceof Error ? error.message : error}`);
  }
}

if (failures.length > 0) {
  console.error('Agent navigation integrity check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Agent navigation integrity check passed (${requiredFiles.length} entry points, ${requiredReferences.length} required references, ${Object.keys(requiredPackageScripts).length} commands).`,
);
