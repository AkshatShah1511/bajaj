const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Identity — REPLACE THESE with your real details ──────────────────────────
const USER_ID = 'akshatshah_15112005';
const EMAIL_ID = 'as0427@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311043010066';

const VALID_EDGE = /^[A-Z]->[A-Z]$/;

function classifyEntries(data) {
  const invalid_entries = [], duplicate_edges = [], seenEdges = new Set(), validEdges = [];
  for (const raw of data) {
    const entry = typeof raw === 'string' ? raw.trim() : String(raw).trim();
    if (!VALID_EDGE.test(entry)) { invalid_entries.push(raw); continue; }
    const [parent, child] = entry.split('->');
    if (parent === child) { invalid_entries.push(raw); continue; }
    if (seenEdges.has(entry)) { if (!duplicate_edges.includes(entry)) duplicate_edges.push(entry); continue; }
    seenEdges.add(entry);
    validEdges.push({ parent, child });
  }
  return { invalid_entries, duplicate_edges, validEdges };
}

function buildGraph(validEdges) {
  const children = {}, childParent = {}, allNodes = new Set();
  for (const { parent, child } of validEdges) {
    allNodes.add(parent); allNodes.add(child);
    if (child in childParent) continue;
    childParent[child] = parent;
    if (!children[parent]) children[parent] = [];
    children[parent].push(child);
  }
  return { children, childParent, allNodes };
}

function findGroups(allNodes, children) {
  const par = {};
  const find = (x) => { if (par[x] !== x) par[x] = find(par[x]); return par[x]; };
  const union = (a, b) => { par[find(a)] = find(b); };
  for (const n of allNodes) par[n] = n;
  for (const node of allNodes) for (const child of (children[node] || [])) union(node, child);
  const groups = {};
  for (const node of allNodes) {
    const r = find(node);
    if (!groups[r]) groups[r] = new Set();
    groups[r].add(node);
  }
  return Object.values(groups).map(s => [...s]);
}

function hasCycle(groupNodes, children) {
  const WHITE = 0, GRAY = 1, BLACK = 2, color = {};
  for (const n of groupNodes) color[n] = WHITE;
  const dfs = (node) => {
    color[node] = GRAY;
    for (const child of (children[node] || [])) {
      if (color[child] === GRAY) return true;
      if (color[child] === WHITE && dfs(child)) return true;
    }
    color[node] = BLACK; return false;
  };
  for (const n of groupNodes) if (color[n] === WHITE && dfs(n)) return true;
  return false;
}

function buildTree(root, children) {
  const obj = {};
  for (const child of (children[root] || [])) obj[child] = buildTree(child, children)[child];
  return { [root]: obj };
}

function calcDepth(root, children) {
  const kids = children[root] || [];
  if (!kids.length) return 1;
  return 1 + Math.max(...kids.map(k => calcDepth(k, children)));
}

function processData(data) {
  const { invalid_entries, duplicate_edges, validEdges } = classifyEntries(data);
  const { children, childParent, allNodes } = buildGraph(validEdges);
  const groups = findGroups(allNodes, children);
  const hierarchies = [];

  for (const group of groups) {
    const groupSet = new Set(group);
    const roots = group.filter(n => !(n in childParent) || !groupSet.has(childParent[n]));
    if (hasCycle(group, children)) {
      const cycleRoot = roots.length ? roots.sort()[0] : [...group].sort()[0];
      hierarchies.push({ root: cycleRoot, tree: {}, has_cycle: true });
    } else {
      for (const r of roots.sort()) {
        hierarchies.push({ root: r, tree: buildTree(r, children), depth: calcDepth(r, children) });
      }
    }
  }

  hierarchies.sort((a, b) => a.root.localeCompare(b.root));
  const trees = hierarchies.filter(h => !h.has_cycle);
  const cycles = hierarchies.filter(h => h.has_cycle);
  let largest_tree_root = '';
  if (trees.length) {
    const maxDepth = Math.max(...trees.map(t => t.depth));
    largest_tree_root = trees.filter(t => t.depth === maxDepth).map(t => t.root).sort()[0];
  }

  return {
    user_id: USER_ID, email_id: EMAIL_ID, college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies, invalid_entries, duplicate_edges,
    summary: { total_trees: trees.length, total_cycles: cycles.length, largest_tree_root }
  };
}

app.get('/', (req, res) => res.send('BFHL API running. POST to /bfhl'));

app.post('/bfhl', (req, res) => {
  const { data } = req.body || {};
  if (!Array.isArray(data)) return res.status(400).json({ error: '"data" must be an array' });
  try { res.json(processData(data)); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('BFHL server on port ' + PORT));
module.exports = app;
