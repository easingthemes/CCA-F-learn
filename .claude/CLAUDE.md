# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CCA-F (Claude Certified Architect – Foundations) exam preparation dashboard. React SPA with all exam content, quiz, and progress tracking.

## Exam Structure

- 5 domains: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code Config (20%), Prompt Engineering (20%), Context Management (15%)
- 6 scenarios, 4 randomly presented per exam. Pass score: 720/1000

## Commands

```bash
npm run dev              # Start dev server (Vite, hot reload)
npm run build            # Production build to dist/
npm run lint             # ESLint
npm run preview          # Preview production build locally
```

## Repository Layout

- `src/data/examData.js` — Study content: domains, scenarios, cheatsheets, study plan, resources
- `src/data/quizData.js` — 59 practice quiz questions across 4 scenarios
- `src/data/myProjects.js` — Project data with links to public GitHub repos
- `public/images/playbook/` — Architect's Playbook pages as images (p1-p10)

## Architecture

**Stack:** React 19 + React Router 7 + MUI 7 + Vite 7. Plain JSX (no TypeScript). All styling via MUI `sx` props and theme tokens — no CSS modules, no Tailwind.

### Data Flow

All exam content lives in a single file: `src/data/examData.js` (~1800 lines). It exports `studyPlan`, `domains`, `scenarios`, `questions`, `myProjects`, `cheatsheets`, plus helper functions (`getDomain`, `getScenario`, `getProject`, `getTaskStats`, `getCurrentPhase`). Pages import from this file — no API calls, no markdown parsing.

**Quiz data** lives in `src/data/quizData.js`. It exports `quizSections` (4 scenario sections with 59 independently authored practice questions) and helper functions (`getQuizSection`, `getAllQuizStats`). Quiz best scores persist to localStorage under `quiz:<sectionId>:best` keys via the same `useProgress` hook.

**Progress tracking** uses localStorage via `src/hooks/useProgress.js`. Content stays in examData.js (source of truth for text), progress state is overlaid from localStorage. Key format: `task:d1:1.1`, `scenario:s1:0`, `plan:1:0:2`, `practice:1`, `quiz:s1:best`. The hook provides `getStatus(key, fallback)`, `setStatus(key, value)`, `toggleChecked(key)`, `resetAll()`.

### Page Types

**Parameterized pages** use `useParams()` + data lookup:
- `DomainPage.jsx` — serves `/domains/d1` through `/domains/d5`
- `ScenarioPage.jsx` — serves `/scenarios/s1` through `/scenarios/s6`
- `MyProjectDetail.jsx` — serves `/my-projects/dx-plugins`, `/my-projects/aem-mcp`, `/my-projects/ki-bundestag`
- `CheatsheetPage.jsx` — serves `/cheatsheets/patterns`, `/cheatsheets/configs`, `/cheatsheets/matrix`, `/cheatsheets/tips` (renders different layouts per id)
- `QuizLanding.jsx` — serves `/practice-quiz` (section picker with best scores)
- `QuizQuestion.jsx` — serves `/practice-quiz/:sectionId` (quiz flow: intro → questions → results with accordion review)

### Component Library

16 files in `src/components/` (14 barrel-exported from `index.js`, plus `Layout.jsx` and `index.js`). Key patterns:
- **Page structure:** `PageHero` → `SectionHeading` (full-width band) → `Section` (content wrapper) — repeat for visual rhythm
- **Content:** `ContentCard` (icon + title + body + tags, supports `horizontal` mode), `HighlightBox` (alert/callout), `CommandBlock` (monospace code display)
- **Flow:** `FlowSteps` (horizontal step diagram), `PipelineBlock` (command + steps)
- **Interactive:** `QuestionCard` (quiz with answer reveal, persists to localStorage), `ProgressBar` (labeled LinearProgress)

### MUI Grid Syntax

This app uses **MUI v7 Grid** which uses the `size` prop, NOT the old `xs`/`md` props:
```jsx
// Correct (v7):
<Grid size={{ xs: 12, md: 4 }}>

// Wrong (v5/v6):
<Grid xs={12} md={4}>
```

### Theme

Defined in `src/theme/theme.js`. Key colors: `primary.main: '#2d308d'` (indigo), `secondary.main: '#36C0CF'` (cyan), `background.alt: '#f5f5fa'`. Domain colors: d1=`#e88c30`, d2=`#1E728C`, d3=`#2d308d`, d4=`#7b1fa2`, d5=`#4caf50`.

### Navigation

`Layout.jsx` has a `navItems` array defining all navigation. Desktop uses hover dropdowns (`NavDropdown`), mobile uses a drawer.

### Cross-References

Domain task statements have `quizRefs` arrays linking to quiz questions that test that concept. Quiz questions have `studyAreaLink` fields pointing back to domain task anchors (`/domains/dN#task-N.N`). DomainPage.jsx renders "Tested In Quiz" sections and has scroll-to-anchor behavior.

### Playbook Images

10 pages from the Architect's Playbook extracted as JPEGs in `public/images/playbook/p1.jpg` through `p10.jpg`. Domain pages and cheatsheets render them via `ImageLightbox` component (click to zoom). Data references use `image` field in `playbookRefs` arrays.

## Content Updates

- **Study content:** Edit `src/data/examData.js` — domains, scenarios, cheatsheets, study plan, resources
- **Quiz questions:** Edit `src/data/quizData.js` — add questions to existing sections or add new sections
- **Project details:** Edit `src/data/myProjects.js`
