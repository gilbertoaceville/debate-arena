# 🏛️ Debate Arena

An interactive debate visualization tool for mapping and analyzing logical arguments as a node-based graph. Add arguments, draw relationships between them, and use AI to analyze logical strength and detect fallacies.

## Features

- **Visual Argument Mapping** — Arguments are displayed as draggable nodes on an interactive canvas
- **Relationship Types** — Connect arguments with `supports`, `refutes`, `questions`, or `assumes` relationships
- **Argument Types** — Categorize arguments as `claim`, `evidence`, `counter`, or `question`
- **AI Analysis** — Analyze arguments for logical fallacies and strength score via HuggingFace AI (falls back to mock analysis if unavailable)
- **Voting** — Upvote or downvote individual arguments
- **Inline Editing** — Edit argument content directly on the node

## Tech Stack

- [Next.js 16](https://nextjs.org) — React framework
- [React Flow](https://reactflow.dev) — Node-based graph UI
- [Zustand](https://zustand-demo.pmnd.rs) + [Immer](https://immerjs.github.io/immer/) — State management
- [Tailwind CSS v4](https://tailwindcss.com) — Styling
- [HuggingFace Inference API](https://huggingface.co/inference-api) — AI argument analysis

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
HUGGINGFACE_API_KEY=your_key_here
HUGGINGFACE_URL=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2
```

> If `HUGGINGFACE_API_KEY` is not set, AI analysis falls back to a built-in rule-based mock analyzer.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Add an argument** — Select a type, enter your argument text, and click "Add Argument" (or `Ctrl+Enter`)
2. **Connect arguments** — Select a connection mode, then drag from a node's bottom handle to another node's top handle
3. **Edit a node** — Click the ✏️ icon or click the argument text directly; save with `Ctrl+Enter`, cancel with `Esc`
4. **Analyze** — Click "Analyze with AI" on any node to get a strength score and fallacy detection
5. **Vote** — Use 👍 / 👎 to rate arguments
6. **Delete** — Click ✕ on a node to remove it and its connections

## Project Status

Work in progress. Core graph interaction and AI analysis are functional. The following is still incomplete:

- `/debate/[id]` — Individual debate view (placeholder only)
- Data persistence — state is in-memory and resets on page refresh
- Multi-user / authoring support
- Debate management (create, save, load multiple debates)
