#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

function parseArgs(argv) {
  const out = { file: "sample/pipeline.json", output: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--output") {
      if (!argv[i + 1]) throw new Error("--output needs a file path");
      out.output = argv[++i];
    } else if (argv[i] === "--help") out.help = true;
    else if (argv[i].startsWith("--")) throw new Error("Unknown option: " + argv[i]);
    else out.file = argv[i];
  }
  return out;
}
function load(file) {
  let data;
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { throw new Error("Cannot read " + file + ": " + error.message); }
  const nodes = Array.isArray(data) ? data : data.nodes;
  if (!Array.isArray(nodes) || !nodes.length) throw new Error("Manifest must contain a non-empty nodes array.");
  const map = new Map();
  for (const node of nodes) {
    if (!node || typeof node.id !== "string" || !node.id.trim()) throw new Error("Every node needs a non-empty string id.");
    if (map.has(node.id)) throw new Error("Duplicate node id: " + node.id);
    if (node.depends_on != null && (!Array.isArray(node.depends_on) || node.depends_on.some(x => typeof x !== "string"))) {
      throw new Error("Node " + node.id + ": depends_on must be an array of ids.");
    }
    map.set(node.id, { id: node.id, label: String(node.label || node.id), depends_on: node.depends_on || [] });
  }
  return map;
}
function analyze(map) {
  const missing = [], cycles = [], edges = [];
  for (const node of map.values()) {
    for (const dep of node.depends_on) {
      if (!map.has(dep)) missing.push({ node: node.id, dependency: dep });
      else edges.push([dep, node.id]);
    }
  }
  const state = new Map(), stack = [];
  function visit(id) {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) {
      const start = stack.indexOf(id);
      cycles.push([...stack.slice(start), id]);
      return;
    }
    state.set(id, 1); stack.push(id);
    for (const dep of map.get(id).depends_on) if (map.has(dep)) visit(dep);
    stack.pop(); state.set(id, 2);
  }
  for (const id of map.keys()) visit(id);
  return { missing, cycles, edges };
}
function safeId(id) {
  return "n_" + id.replace(/[^A-Za-z0-9_]/g, "_");
}
function buildMermaid(map, analysis) {
  const lines = ["flowchart LR"];
  for (const node of map.values()) {
    const label = node.label.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/\[/g, "(").replace(/\]/g, ")");
    lines.push("  " + safeId(node.id) + '["' + label + '"]');
  }
  for (const [from, to] of analysis.edges) lines.push("  " + safeId(from) + " --> " + safeId(to));
  return lines.join("\n") + "\n";
}
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { console.log("Usage: node index.js [manifest.json] [--output graph.mmd]"); return; }
  const map = load(path.resolve(args.file)), analysis = analyze(map), diagram = buildMermaid(map, analysis);
  if (args.output) fs.writeFileSync(args.output, diagram, "utf8");
  else process.stdout.write(diagram);
  console.error("Nodes: " + map.size + " | Edges: " + analysis.edges.length + " | Missing: " + analysis.missing.length + " | Cycles: " + analysis.cycles.length);
  if (analysis.missing.length) console.error("Missing dependencies: " + JSON.stringify(analysis.missing));
  if (analysis.cycles.length) console.error("Cycles: " + JSON.stringify(analysis.cycles));
  if (analysis.missing.length || analysis.cycles.length) process.exitCode = 1;
}
try { main(); } catch (error) { console.error(error.message); process.exitCode = 2; }
