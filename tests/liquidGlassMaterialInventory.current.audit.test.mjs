import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = resolve(process.cwd());
const srcRoot = resolve(projectRoot, 'src');
const legacyMaterialPattern = /colors\.(surfacePrimary|surfaceSecondary|surfaceElevated|backgroundElement|backgroundSelected|borderSubtle|successSoft|warningSoft|errorSoft|accentSoft|accentMuted|border)\b/g;

const collectTsxFiles = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const absolute = join(directory, entry);
    return statSync(absolute).isDirectory()
      ? collectTsxFiles(absolute)
      : extname(entry) === '.tsx'
        ? [absolute]
        : [];
  });

const inventory = collectTsxFiles(srcRoot).flatMap((absolutePath) => {
  const source = readFileSync(absolutePath, 'utf8');
  const lines = source.split('\n');
  return lines.flatMap((line, index) => {
    legacyMaterialPattern.lastIndex = 0;
    const tokens = [...line.matchAll(legacyMaterialPattern)].map((match) => match[0]);
    return tokens.length > 0
      ? [`${relative(projectRoot, absolutePath)}:${index + 1} ${[...new Set(tokens)].join(', ')}`]
      : [];
  });
});

describe('Liquid Glass legacy material inventory — current main', () => {
  it('prints every remaining direct legacy material token in user-facing TSX', () => {
    expect(inventory, `\nLEGACY MATERIAL INVENTORY\n${inventory.join('\n')}\n`).toEqual([]);
  });
});
