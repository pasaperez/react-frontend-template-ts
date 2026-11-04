# AGENTS.md

Entry point for AI agents working in this repository. It is deliberately short: load only the document that matches the work you are about to do (table below) instead of reading everything.

## Purpose

Frontend template in React with strict TypeScript, modular feature-first architecture, explicit boundaries, ports/adapters for replaceable dependencies, manual composition, and a stack aligned with the current React ecosystem.
This repository is not Angular-like by default, so architectural discipline must be enforced by structure, dependency rules, and composition.

## Stack and commands

React · TypeScript (strict) · Vite · Bun · Docker · Caddy · React Router · Radix Colors · TanStack Query · React Hook Form · Zod · Vitest · React Testing Library · ESLint · dependency-cruiser · eslint-plugin-boundaries · dprint.

- `bun install` · `bun run dev` · `bun run build` · `bun run preview`
- `bun run lint` (ESLint + dependency-cruiser + `scripts/dead-code.mjs`) · `bun run test` · `bun run test:coverage`
- `bun run format` · `bun run format:write`
- Container: `docker build --build-arg VITE_API_BASE_URL=http://127.0.0.1:3000 -t react-frontend-template-ts .` and `docker run --rm -p 8080:80 react-frontend-template-ts`.
- Bun is the primary package manager and runtime; do not switch generated commands back to npm unless the lockfile and scripts change.

After code changes run `bun run build` and `bun run lint`; when behaviour changes also `bun run test` (coverage is enforced at 100%).

## Rules that always apply

- **No dead code.** Delete what stops being used in the same change: functions, exports, files, props, CSS, tokens, env vars, dependencies, docs. No commented-out code, no TODOs, nothing kept "just in case" or only for tests. `bun run lint` fails on it. Details: [docs/conventions.md](docs/conventions.md#no-dead-code).
- Feature-first layers: `app`, `shared`, `features/<feature>/{domain,application,infrastructure,ui}`. `domain` has no React or HTTP, `application` never imports concrete adapters, `shared` stays generic. Bind implementations in the composition root, never inside components.
- Server state belongs to TanStack Query, form state to React Hook Form, short-lived UI state to components; `useEffect` only for real external synchronisation.
- Formatting is `dprint` (same config across this template family and the rest of the projects): single quotes, no trailing commas, 140 columns, one import per line, LF line endings. Never Prettier.
- Test-only helpers, resets and fixtures stay out of `src/**`.

## Load context on demand

| If you are touching…                                                                   | Read                                             |
| -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Layers, boundaries, composition root, replaceable adapters, feature structure, routing | [docs/architecture.md](docs/architecture.md)     |
| Server state, forms, local state, effects, errors, backend contract                    | [docs/state-and-data.md](docs/state-and-data.md) |
| Components, styles, themes, UX, accessibility, SEO                                     | [docs/ui-ux.md](docs/ui-ux.md)                   |
| Tests, code conventions, naming, formatting, the dead-code rule                        | [docs/conventions.md](docs/conventions.md)       |
| What the template is for and how a human uses it                                       | [README.md](README.md)                           |

## Documentation upkeep

- `README.md` is for human developers; `AGENTS.md` is the short agent entry point; `docs/*.md` hold the detail loaded on demand.
- When architecture rules, stack, dependency boundaries, commands, feature layout, routing, state strategy or replacement strategy change, update this file, `README.md` and the matching `docs/` file in the same change.
- Keep this file short: detail belongs in `docs/`, and a document nobody links from here is deleted.
