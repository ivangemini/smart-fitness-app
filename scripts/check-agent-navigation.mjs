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
  'docs/project-context.md',
  'docs/current-status.md',
  'docs/handoffs/latest.md',
  'docs/implementation-plan.md',
  'docs/architecture/README.md',
  'docs/agent/README.md',
  'docs/agent/ownership-map.md',
  'docs/agent/change-impact.md',
  'docs/agent/validation-matrix.md',
  'scripts/print-project-tree.mjs',
];

const requiredReferences = [
  ['CLAUDE.md', '@AGENTS.md'],
  ['README.md', 'PROJECT_MAP.md'],
  ['README.md', 'docs/agent/README.md'],
  ['AGENTS.md', 'PROJECT_MAP.md'],
  ['AGENTS.md', 'docs/agent/README.md'],
  ['PROJECT_MAP.md', 'docs/agent/README.md'],
  ['docs/agent/README.md', 'ownership-map.md'],
  ['docs/agent/README.md', 'change-impact.md'],
  ['docs/agent/README.md', 'validation-matrix.md'],
];

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

if (failures.length > 0) {
  console.error('Agent navigation integrity check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Agent navigation integrity check passed (${requiredFiles.length} entry points, ${requiredReferences.length} required references).`,
);
