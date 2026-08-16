import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = process.cwd();
const generatedRouteTypes = resolve(projectRoot, '.expo', 'types');

rmSync(generatedRouteTypes, { recursive: true, force: true });

console.log(`Removed generated Expo route types: ${generatedRouteTypes}`);
