# Repository Guidelines

This repository is currently a clean slate; use the conventions below so new code stays organized, testable, and easy to review.

## Project Structure & Module Organization
- Keep core library code in `src/` with feature-focused subpackages (e.g., `src/core`, `src/envs`, `src/utils`).
- Place runnable helpers or maintenance scripts in `scripts/` (add a short `--help` flag).
- Mirror the code layout in `tests/` (`tests/unit/` vs. `tests/integration/`) and co-locate fixtures near the code they exercise.
- Store docs/notes in `docs/`, sample usage in `examples/`, and static assets in `assets/`.

## Build, Test, and Development Commands
- Standardize entry points via a `Makefile` (add these targets if missing):
  - `make setup` — create the virtualenv/node_modules and install all dev deps.
  - `make lint` — run formatters and linters (e.g., `ruff`/`eslint` + `black`/`prettier`).
  - `make test` — execute the full suite (unit + integration).
  - `make fmt` — apply formatting in-place.
  - `make run` — launch the primary entry point (document args in `README.md`).
- Commands should be idempotent, runnable from the repo root, and safe to re-run.

## Coding Style & Naming Conventions
- Use 4-space indentation and UTF-8 text files.
- Naming: snake_case for files/functions, PascalCase for classes, UPPER_SNAKE_CASE for constants.
- Keep modules small and cohesive; move shared helpers to `src/utils`.
- Prefer explicit imports, type hints, and short docstrings for public APIs.
- Enforce lint/format before committing (pre-commit hook recommended).

## Testing Guidelines
- Favor fast, isolated unit tests; mark slower integration/system cases separately.
- Name tests `test_<feature>.py` (or `test_<feature>.ts`), mirroring the source path.
- Keep fixtures in `tests/conftest.py` or a local fixture module; avoid network or time-dependent assertions.
- Typical commands: `make test` for the suite, or `pytest tests/unit/test_env.py -k scenario` to focus on a case.

## Commit & Pull Request Guidelines
- Commit format: `<type>: <scope> <summary>` (e.g., `fix: env reset bug`, `feat: add cartpole env`).
- One logical change per commit; include matching tests/docs when behavior changes.
- PR checklist: clear summary, linked issues, testing evidence (`make test` output), and screenshots/logs for user-facing changes.
- Highlight breaking changes or data migrations explicitly and provide rollback notes when relevant.

## Security & Configuration Tips
- Do not commit secrets; use environment variables and keep `.env.example` current.
- Pin dependency versions; run `pip-audit`/`npm audit` (or equivalent) before releases.
- Review new datasets or third-party integrations for licensing and PII before merging.
