import {
  classifyChangedFiles,
  getChangedFiles,
  loadProjectGraph,
  parseCommonArgs,
  resolveBaseRef,
} from './agent-toolkit.mjs';

const args = process.argv.slice(2);
const changed = args.includes('--changed');
const dot = args.includes('--dot');
const options = parseCommonArgs(args);
const graph = loadProjectGraph(process.cwd());

const printDot = (nodes, edges) => {
  console.log('digraph AgentProject {');
  for (const node of nodes) {
    const label = `${node.label}${node.external ? `\\n${node.repository}` : ''}`.replaceAll('"', '\\"');
    console.log(`  "${node.id}" [label="${label}"];`);
  }
  for (const edge of edges) {
    console.log(`  "${edge.from}" -> "${edge.to}" [label="${edge.kind}"];`);
  }
  console.log('}');
};

if (changed || options.files) {
  const baseRef = resolveBaseRef(graph, options.base, process.cwd());
  const files = options.files ?? getChangedFiles({ baseRef });
  const impact = classifyChangedFiles(graph, files);
  const selected = new Set(impact.relatedNodes.inspect);
  const payload = {
    schemaVersion: graph.schemaVersion,
    baseRef,
    changedFiles: impact.changedFiles,
    nodes: graph.nodes.filter((node) => selected.has(node.id)),
    edges: graph.edges.filter((edge) => selected.has(edge.from) && selected.has(edge.to)),
  };
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else if (dot) {
    printDot(payload.nodes, payload.edges);
  } else {
    console.log(`Affected graph (${payload.nodes.length} nodes, ${payload.edges.length} edges)`);
    for (const node of payload.nodes) {
      const marker = impact.matchedNodes.includes(node.id) ? '*' : '-';
      const repo = node.external ? ` [${node.repository}]` : '';
      console.log(`${marker} ${node.id}${repo}: ${node.label} — ${node.authority}`);
    }
    for (const edge of payload.edges) {
      console.log(`  ${edge.from} --${edge.kind}--> ${edge.to}`);
    }
  }
} else if (options.json) {
  console.log(JSON.stringify(graph, null, 2));
} else if (dot) {
  printDot(graph.nodes, graph.edges);
} else {
  console.log(
    `Agent project graph v${graph.schemaVersion}: ${graph.nodes.length} nodes, ${graph.edges.length} edges, ${Object.keys(graph.validationProfiles).length} validation profiles.`,
  );
  for (const node of graph.nodes) {
    const repo = node.external ? ` [${node.repository}]` : '';
    console.log(`- ${node.id}${repo}: ${node.label} — ${node.authority}`);
  }
  console.log('Use --changed to show only the current working-set neighborhood.');
}
