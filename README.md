# BFHL Node Hierarchy API

## Overview

This project builds a REST API that takes a list of node relationships (like `A->B`) and processes them into structured hierarchies.

It also includes a simple frontend to send input and view results.

---

## What it does

* Parses node relationships from input
* Validates format (`X->Y`, uppercase letters only)
* Removes duplicate edges
* Builds tree structures from valid edges
* Detects cycles in graphs
* Calculates depth of each tree
* Returns a summary of:

  * total trees
  * total cycles
  * largest tree root

---

## API

### Endpoint

```
POST /bfhl
```

### Request

```json
{
  "data": ["A->B", "B->C"]
}
```

### Response

```json
{
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": number,
    "total_cycles": number,
    "largest_tree_root": string
  }
}
```

---

## How it works

* Valid edges are used to build parent-child relationships
* Nodes that never appear as children are treated as roots
* Cycles are detected and returned separately
* Depth is calculated as the longest path from root to leaf

---

## Running locally

### Backend

```
npm install
node index.js
```

### Frontend

Open `index.html` in a browser

---

## Notes

* Handles invalid inputs and edge cases
* API returns structured JSON
* Designed to work with up to 50 nodes efficiently
