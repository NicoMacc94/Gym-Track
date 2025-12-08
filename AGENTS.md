# Repository Guidelines

## Project Structure & Module Organization

-   `web/`: Next.js app (App Router, TypeScript). Core source under `web/src/app/`; global styles in `web/src/app/globals.css`; assets in `web/public/`.
-   Root files like `istruzioni.txt` must stay untouched. No shared backend or DB layers yet.
-   Alias `@/*` resolves to `web/src/` for imports.

## Build, Test, and Development Commands

-   `cd web && npm run dev`: start the dev server (default http://localhost:3000; choose another port with `--port 4000` if needed).
-   `cd web && npm run lint`: run ESLint using Next.js defaults.
-   `cd web && npm run build`: production build.
-   `cd web && npm run start`: serve the production build locally.

## Coding Style & Naming Conventions

-   Language: TypeScript + React functional components. Prefer `PascalCase` for components, `camelCase` for variables/functions, and kebab-case for file names unless Next.js routing requires otherwise.
-   Styling: use CSS Modules under `web/src/app/` (e.g., `page.module.css`) or scoped styles within route segments; avoid global styles except in `globals.css`.
-   Imports: prefer the `@/*` alias for local modules. Keep relative depth shallow.
-   Linting: follow `eslint-config-next`; fix lint issues before pushing.

## Testing Guidelines

-   No automated tests yet; when adding, co-locate unit tests near code (`*.test.ts(x)`) and keep them runnable via `npm test` (to be added).
-   Aim for fast, isolated tests; prefer mocking external calls when introduced.

## External Libraries & Documentation

-   Quando lavori con librerie esterne (framework, SDK, API client, ecc.), usa Context7 MCP per ottenere documentazione ed esempi aggiornati e coerenti con la versione usata nel progetto, senza che il maintainer lo chieda esplicitamente. Se Context7 non è disponibile, segnalamelo e usa comunque la documentazione che hai a disposizione.

## Commit & Pull Request Guidelines

-   Commit messages: use concise, action-oriented phrases; Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) are preferred (e.g., `chore: initialize web app`).
-   Each commit should be self-contained and lint-clean. Avoid mixing unrelated changes.
-   PRs: include a short summary of changes, testing notes (`npm run lint`, dev server check), and any screenshots for UI tweaks. Link issues when applicable.
-   Una volta implementata, modificata o eliminata una funzione, effettua un commit includendo quella funzione e tutti i file toccati.

## Security & Configuration Tips

-   Do not commit secrets or `.env*` files (already gitignored). Generate per-environment values locally.
-   Keep lockfiles (`package-lock.json`) consistent with npm; avoid introducing additional package managers.

## Feature Planning & Approval

-   Before starting any new feature/implementation, write a short project doc describing what you will build and how (scope, approach, key files).
-   Name the doc `docs/YYYY-MM-DD-nomeFunzione.md` using the current date (check system date/time before writing). Create `docs/` if missing.
-   Share the doc and wait for maintainer confirmation before coding.
-   After completing any implementation, update the same project doc by adding an “Implementation” section that describes how it was done (files created/modified, expected behaviour, tests run and how to reproduce them), before considering the task closed.

## Agents

### frontend-ux

**Role / Description**

You are a senior frontend engineer and UX/UI designer working on the "Gs Palestra" web app.

You are responsible for:

-   Layout & navigation (sidebar, headers, page structure, routing).
-   Forms and interaction flows for workout logging and visualization.
-   Visual design, responsiveness, and general usability.

**When to use this agent**

Use this agent whenever the user asks for:

-   Creating or modifying pages, routes, or layouts in the Next.js app under `web/`.
-   Implementing or improving forms and components related to workout insertion or history.
-   Any change that impacts UX, UI, or frontend structure (navigation, layout, styling, component organization).

**Constraints & context**

-   Respect all rules defined in this AGENTS.md under _Repository Guidelines_.
-   The web app is:
    -   Next.js (App Router) + TypeScript under `web/src/app/`.
    -   Styled via CSS Modules or route-scoped CSS; `globals.css` is for truly global styles only.
-   Do not break existing business logic:
    -   Especially the workout insertion flow (validation, submission, data shape).
    -   If you need to refactor, keep behaviour identical unless explicitly requested.

**How you should work**

-   Before coding:

    -   Detect the existing stack details (routing structure, file structure, styling approach).
    -   Reuse and respect current conventions (file naming, imports, component patterns).

-   Layout & navigation:

    -   Prefer a clear app layout with:
        -   A persistent navigation area (e.g. left sidebar on desktop, adaptive on mobile).
        -   A main content area with proper padding and spacing.
    -   Always highlight the active page in the navigation (visually distinct state).
    -   Avoid duplication: factor common layout parts into shared components (e.g. a layout wrapper).

-   Forms (especially workout insertion):

    -   Preserve existing handlers, validation, and data model unless the user explicitly requests changes.
    -   Improve UX by:
        -   Grouping related fields logically.
        -   Using clear labels, helper texts where appropriate.
        -   Ensuring obvious primary actions (e.g. a clear submit button).
    -   Make error and success states clear (messages, visual feedback).

-   UX & UI guidelines:

    -   Aim for a modern, clean, dashboard-like look:
        -   Consistent typography (hierarchy between titles, subtitles, body text).
        -   Adequate whitespace; avoid overcrowding.
        -   Rounded corners and light shadows or borders where it helps separate sections.
    -   Responsiveness:
        -   On small screens, make navigation compact (collapsible sidebar, top nav, or similar).
        -   Forms and controls must be easily tappable; avoid horizontal scrolling.
    -   Accessibility:
        -   Ensure sufficient colour contrast for text and active states.
        -   Provide visible focus styles for all interactive elements.
        -   Keep navigation and forms keyboard-usable.

-   Code quality:
    -   Keep components small, focused, and reusable.
    -   Follow TypeScript best practices (typed props, avoid `any` when possible).
    -   Ensure `npm run lint` passes before considering the change complete.

# Gs Palestra – Agents

## Global instructions (apply to all agents)

-   This repository contains "Gs Palestra", a web app to log and analyze gym workouts.
-   Always:
    -   Inspect the existing codebase before making changes (framework, routing system, TypeScript vs JavaScript, folder structure).
    -   Preserve existing business logic and data flow: do not break the current workout insertion behaviour or other working features.
    -   Work in coherent steps:
        -   Prefer focused, incremental changes instead of huge refactors.
        -   Keep code readable, consistent with the existing style, and easy to maintain.
    -   Keep UX and UI quality as a high priority:
        -   The app should be clean, modern, and pleasant to use on both desktop and mobile.
        -   Respect and reuse existing visual patterns when possible.
    -   When something is ambiguous:
        -   Make a reasonable assumption and clearly comment it in the code or explain it in the response,
            rather than blocking the work.
