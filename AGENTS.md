# Repository Guidelines

## Project Structure & Module Organization
- `web/`: Next.js app (App Router, TypeScript). Core source under `web/src/app/`; global styles in `web/src/app/globals.css`; assets in `web/public/`.
- Root files like `istruzioni.txt` must stay untouched. No shared backend or DB layers yet.
- Alias `@/*` resolves to `web/src/` for imports.

## Build, Test, and Development Commands
- `cd web && npm run dev`: start the dev server (default http://localhost:3000; choose another port with `--port 4000` if needed).
- `cd web && npm run lint`: run ESLint using Next.js defaults.
- `cd web && npm run build`: production build.
- `cd web && npm run start`: serve the production build locally.

## Coding Style & Naming Conventions
- Language: TypeScript + React functional components. Prefer `PascalCase` for components, `camelCase` for variables/functions, and kebab-case for file names unless Next.js routing requires otherwise.
- Styling: use CSS Modules under `web/src/app/` (e.g., `page.module.css`) or scoped styles within route segments; avoid global styles except in `globals.css`.
- Imports: prefer the `@/*` alias for local modules. Keep relative depth shallow.
- Linting: follow `eslint-config-next`; fix lint issues before pushing.

## Testing Guidelines
- No automated tests yet; when adding, co-locate unit tests near code (`*.test.ts(x)`) and keep them runnable via `npm test` (to be added).
- Aim for fast, isolated tests; prefer mocking external calls when introduced.

## Commit & Pull Request Guidelines
- Commit messages: use concise, action-oriented phrases; Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) are preferred (e.g., `chore: initialize web app`).
- Each commit should be self-contained and lint-clean. Avoid mixing unrelated changes.
- PRs: include a short summary of changes, testing notes (`npm run lint`, dev server check), and any screenshots for UI tweaks. Link issues when applicable.

## Security & Configuration Tips
- Do not commit secrets or `.env*` files (already gitignored). Generate per-environment values locally.
- Keep lockfiles (`package-lock.json`) consistent with npm; avoid introducing additional package managers.

## Feature Planning & Approval
- Before starting any new feature/implementation, write a short project doc describing what you will build and how (scope, approach, key files).
- Name the doc `docs/YYYY-MM-DD-nomeFunzione.md` using the current date (check system date/time before writing). Create `docs/` if missing.
- Share the doc and wait for maintainer confirmation before coding.
