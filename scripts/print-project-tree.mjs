#!/usr/bin/env node

import { readdir } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_DEPTH = 3;

const IGNORED_NAMES = new Set([
  '.git',
  '.expo',
  '.next',
  '.turbo',
  '.vercel',
  'node_modules',
  'coverage',
  'dist',
  'build',
  'Pods',
  '.gradle',
  'DerivedData',
]);

const IGNORED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.heic',
  '.ico',
  '.pdf',
  '.zip',
  '.gz',
  '.tar',
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',
]);

function parseDepth(argv) {
  const explicit = argv.find((argument) => argument.startsWith('--depth='));
  if (!explicit) {
    return DEFAULT_DEPTH;
  }

  const value = Number.parseInt(explicit.slice('--depth='.length), 10);
  if (!Number.isInteger(value) || value < 1 || value > 8) {
    throw new Error('--depth must be an integer between 1 and 8');
  }

  return value;
}

function shouldIgnore(entry) {
  if (IGNORED_NAMES.has(entry.name)) {
    return true;
  }

  if (entry.isFile() && IGNORED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
    return true;
  }

  return false;
}

async function readEntries(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => !shouldIgnore(entry))
    .sort((left, right) => {
      if (left.isDirectory() !== right.isDirectory()) {
        return left.isDirectory() ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });
}

async function printDirectory(directory, prefix, level, maxDepth) {
  if (level > maxDepth) {
    return;
  }

  const entries = await readEntries(directory);

  for (const [index, entry] of entries.entries()) {
    const isLast = index === entries.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    const suffix = entry.isDirectory() ? '/' : '';

    console.log(`${prefix}${branch}${entry.name}${suffix}`);

    if (entry.isDirectory() && level < maxDepth) {
      const nextPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
      await printDirectory(path.join(directory, entry.name), nextPrefix, level + 1, maxDepth);
    }
  }
}

async function main() {
  const maxDepth = parseDepth(process.argv.slice(2));
  const root = process.cwd();

  console.log(`${path.basename(root)}/`);
  await printDirectory(root, '', 1, maxDepth);
}

main().catch((error) => {
  console.error(`project-tree: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
