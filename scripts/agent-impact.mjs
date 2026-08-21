import {
  classifyChangedFiles,
  formatImpact,
  getChangedFiles,
  loadProjectGraph,
  parseCommonArgs,
  resolveBaseRef,
} from './agent-toolkit.mjs';

const root = process.cwd();
const options = parseCommonArgs(process.argv.slice(2));
const graph = loadProjectGraph(root);
const baseRef = resolveBaseRef(graph, options.base, root);
const files = options.files ?? getChangedFiles({ root, baseRef });
const impact = classifyChangedFiles(graph, files);
const result = { ...impact, baseRef };

if (options.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Base: ${baseRef ?? 'unresolved'}`);
  console.log(formatImpact(graph, impact));
}
