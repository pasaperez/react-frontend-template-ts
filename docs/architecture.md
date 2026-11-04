# Architecture

Read this before changing layers, boundaries, composition, routing or the feature structure.

## Architecture rules

Use a feature-first modular frontend architecture with internal layers:

- `app`
- `shared`
- `features/<feature>/domain`
- `features/<feature>/application`
- `features/<feature>/infrastructure`
- `features/<feature>/ui`

General intent of each area:

- `app`: global composition, providers, router, configuration, dependency wiring.
- `shared`: framework-agnostic shared UI primitives, generic utilities, cross-feature helpers, and low-level reusable code with no business ownership.
- `domain`: business types, invariants, policies, and ports. No React, no browser APIs, no HTTP clients.
- `application`: use cases and orchestration. May depend on `domain` ports and types, but not on concrete infrastructure.
- `infrastructure`: concrete adapters such as HTTP clients, storage access, repository implementations, mappers, and external integrations.
- `ui`: pages, presentational components, feature hooks, form bindings, and view-facing state.

Hard dependency rules:

- `domain` must not depend on React, TanStack Query, React Hook Form, browser storage, routing, or HTTP libraries.
- `application` must not depend on React components or concrete adapters.
- `infrastructure` may depend on external libraries and implements ports defined by `domain` or `application`.
- `ui` may depend on `application`, `domain`, `shared`, and UI-safe infrastructure entry points when explicitly intended.
- `shared` must stay generic. Do not move feature business logic into `shared`.

Do not organize the app primarily by technical type at the root level such as global `components/`, `hooks/`, `services/`, `api/`, or `pages/` folders for all business areas mixed together.
Prefer feature ownership and local cohesion.

## Composition and replaceability

This template must support replacing dependencies with minimal impact.

Use these rules:

- All external integrations should enter through adapters.
- Define ports as TypeScript interfaces or explicit contracts close to the business need.
- Bind implementations in a composition root, not inside components.
- Components should consume use cases, feature hooks, or already-composed services, not instantiate infrastructure directly.
- Avoid hidden singletons unless they are truly app-level and intentional.

Important composition points:

- Global providers: `src/app/providers`
- Global app layout: `src/app/layout`
- Router setup: `src/app/router`
- App-wide configuration: `src/app/config`
- App-wide theming: `src/app/theme`
- Dependency composition root: `src/app/composition`
- Feature entry modules: `src/features/<feature>/index.ts`

Typical replacement examples that must stay isolated:

- `fetch` ↔ `axios`
- `localStorage` ↔ `sessionStorage` ↔ IndexedDB
- REST adapter ↔ GraphQL adapter
- UI component library swap behind shared wrappers
- notification library swap behind a shared interface
- analytics provider swap behind an adapter

Backend integration rule:

- Keep the example frontend feature wired to the documented `/api/v1/users` REST contract for this repository unless the contract intentionally changes.
- Default integration target is `/api/v1/users`.
- Do not place transport details directly in pages or presentational components.
- In development, prefer the Vite proxy over direct cross-origin browser requests when the backend does not expose CORS headers.
- In Docker or other static production builds, remember that `VITE_API_BASE_URL` is baked at build time unless the project adopts a separate runtime-config strategy.

## Feature structure

A feature should usually look like this:

- `src/features/<feature>/domain`
- `src/features/<feature>/application`
- `src/features/<feature>/infrastructure`
- `src/features/<feature>/ui`

Suggested internal structure:

- `domain/entities`
- `domain/value-objects`
- `domain/ports`
- `domain/errors`
- `application/use-cases`
- `application/dto`
- `application/mappers`
- `infrastructure/http`
- `infrastructure/storage`
- `infrastructure/repositories`
- `infrastructure/mappers`
- `ui/pages`
- `ui/components`
- `ui/hooks`
- `ui/forms`

Not every feature needs every folder. Keep the shape compact, but preserve the boundary model.

## Routing rules

- App-level routing belongs in `src/app/router`.
- Feature route definitions may live inside the feature and be assembled by the app router.
- Route components should be thin page-level entry points.
- Avoid embedding business logic directly into route declarations.
- Keep a base `404` route and a route error boundary at app level unless the repository explicitly adopts another global error strategy.
- Route or feature lazy loading is an optional architectural decision. Adopt it intentionally when route count or bundle size justifies it, not as mandatory ceremony for very small foundations.

## Architectural enforcement

This repository should use linting and dependency validation to protect boundaries.

Expected enforcement:

- ESLint for code quality
- `eslint-plugin-boundaries` for layer and module restrictions
- `dependency-cruiser` for dependency graph validation and forbidden import rules
- `dprint` for formatting consistency

If architectural rules change, update the enforcement config and this file together.
