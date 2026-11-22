<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,100:0f766e&height=180&section=header&text=Data%20Lineage%20Mini&fontColor=ffffff&fontSize=38" alt="Data Lineage Mini banner"/>
  <br/><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2600&pause=700&center=true&vCenter=true&width=650&lines=Map+where+data+comes+from;Generate+Mermaid+lineage+graphs;Catch+missing+dependencies+and+cycles" alt="Animated title"/>
  <br/><img src="https://img.shields.io/github/license/CyberLoop-dev/data-lineage-mini" alt="License"/> <img src="https://img.shields.io/github/languages/top/CyberLoop-dev/data-lineage-mini" alt="Language"/> <img src="https://img.shields.io/github/stars/CyberLoop-dev/data-lineage-mini" alt="Stars"/> <img src="https://img.shields.io/github/last-commit/CyberLoop-dev/data-lineage-mini" alt="Last commit"/>
  <br/><img src="assets/mark.svg" width="210" alt="Data lineage graph illustration"/>
</p>

## 🧭 Overview

Data Lineage Mini is a dependency-free Node.js CLI that reads a small JSON pipeline manifest and generates a Mermaid flowchart. It also checks for missing dependencies and dependency cycles.

## ✨ Features

- 🧩 Describe pipeline steps with IDs, labels, and dependencies.
- 🗺️ Generate a Mermaid flowchart showing upstream-to-downstream lineage.
- 🚧 Detect references to missing nodes.
- 🔁 Detect dependency cycles and report a cycle path.
- 📦 Use only Node.js built-in modules.

## 🎬 Demo

The included sample describes extract, clean, enrich, report, and archive steps. Run the CLI to print the Mermaid graph and diagnostics. No hosted demo is claimed.

## 🚀 Quick Start

Requires Node.js 18 or newer.

```bash
npm start -- sample/pipeline.json
```

Write the diagram to a file:

```bash
npm start -- sample/pipeline.json --output lineage.mmd
```

## 🧰 Tech Stack

- 🟢 Node.js 18+
- 📄 JSON manifest parsing
- 🧜 Mermaid flowchart output
- 📦 No third-party dependencies

## 🗂️ Folder Structure

```text
data-lineage-mini/
├── assets/mark.svg
├── index.js
├── sample/pipeline.json
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## 🛣️ Roadmap

- [ ] Add column-level lineage metadata.
- [ ] Export Graphviz DOT.
- [ ] Add a browser graph viewer.

## 🤝 Contributing

Include a small JSON fixture for every new diagnostic. Keep the manifest format explicit and the graph output deterministic.

## 📄 License

MIT licensed. See [LICENSE](LICENSE).

<p align="center"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f766e,100:111827&height=105&section=footer" alt="Wave footer"/></p>
