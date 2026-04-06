# Claude Certified Architect – Foundations (CCA-F) Exam Prep

> **Disclaimer:** This is an independent, unofficial study aid. It is not affiliated with, endorsed by, or sponsored by Anthropic, PBC. "Claude", "Anthropic", and "CCA-F" are trademarks of Anthropic, PBC. Practice quiz questions are independently authored and do not reproduce official exam content.

Interactive study dashboard for the CCA-F certification exam.

## Exam Overview

- **Format:** Multiple choice (1 correct + 3 distractors), no penalty for guessing
- **Scoring:** 100–1000 scaled score, **720 to pass**
- **Scenarios:** 6 total, 4 randomly presented per exam
- **Questions:** 15 per scenario, 60 total
- **Time:** 90 minutes
- **Target:** Solution architects with 6+ months hands-on Claude experience

## Domain Weights

| # | Domain | Weight |
|---|--------|--------|
| 1 | Agentic Architecture & Orchestration | 27% |
| 2 | Tool Design & MCP Integration | 18% |
| 3 | Claude Code Configuration & Workflows | 20% |
| 4 | Prompt Engineering & Structured Output | 20% |
| 5 | Context Management & Reliability | 15% |

## Getting Started

```bash
npm install && npm run dev
```

Open `http://localhost:5173` in your browser.

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start dev server                   |
| `npm run build`     | Production build to `dist/`        |
| `npm run preview`   | Preview production build locally   |
| `npm run lint`      | Run ESLint                         |

## What's Inside

- **Dashboard** — Study plan progress, domain readiness cards, resource links
- **5 Domain pages** — Task statements with knowledge points, skills, anti-patterns, project implementation examples, and embedded Architect's Playbook diagrams
- **6 Scenario pages** — Real-world scenario analysis with key concepts and study checklists
- **Practice Quiz** — 59 independently authored practice questions across 4 scenarios with immediate feedback, score tracking, and detailed explanations
- **Practice Questions** — 8 hand-crafted conceptual questions with domain tags
- **Cheatsheets** — Patterns vs anti-patterns, key configs & flags, reference matrix, community tips
- **My Projects** — 3 real-world projects mapped to exam domains with implementation examples

## Key Features

- **Bidirectional cross-references** — Quiz questions link to domain task statements; domain pages link back to relevant quiz questions
- **Progress tracking** — localStorage-based progress for study plan, domain reviews, quiz best scores
- **Playbook diagrams** — All 10 pages from the Architect's Playbook embedded as clickable images with lightbox zoom
- **Source links** — Each project section links directly to implementation files on GitHub

## Tech Stack

React 19 + React Router 7 + MUI 7 + Vite 7. Plain JSX (no TypeScript). All styling via MUI `sx` props.

## Study Resources

- [Anthropic Academy (Skilljar)](https://anthropic.skilljar.com/)
- [Claude Cookbooks (GitHub)](https://github.com/anthropics/claude-cookbooks)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Agent SDK Documentation](https://docs.anthropic.com/en/docs/agents)
- [MCP Specification](https://modelcontextprotocol.io/)
