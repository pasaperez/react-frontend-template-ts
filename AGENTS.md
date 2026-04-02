# AGENTS.md

Short operational guide for AI agents working in this repository.

## Purpose

Frontend template in React with strict TypeScript, modular feature-first architecture, explicit boundaries, ports/adapters for replaceable dependencies, manual composition, and a stack aligned with the current React ecosystem.
This repository is not Angular-like by default, so architectural discipline must be enforced by structure, dependency rules, and composition.

## Stack and commands

- React
- TypeScript (strict)
- Vite
- Bun
- Docker
- Caddy
- React Router
- Radix Colors
- TanStack Query
- React Hook Form
- Zod
- Vitest
- React Testing Library
- ESLint
- dependency-cruiser
- eslint-plugin-boundaries
- dprint

Preferred commands:

- `bun install`
- `bun run dev`
- `bun run build`
- `bun run preview`
- `bun run lint`
- `bun run test`
- `bun run test:coverage`
- `bun run format`
- `bun run format:write`

Container commands when Docker support is relevant:

- `docker build --build-arg VITE_API_BASE_URL=http://127.0.0.1:3000 -t react-frontend-template-ts .`
- `docker run --rm -p 8080:80 react-frontend-template-ts`

This repository uses Bun as the primary package manager and local runtime.
Do not switch generated commands back to npm unless the lockfile and scripts change.

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

## Data flow rules

Separate server state, form state, UI state, and domain logic.

- Server state belongs to TanStack Query.
- Form state belongs to React Hook Form.
- Short-lived local UI state belongs to component state.
- Shared feature UI state may use `useReducer` plus context when justified.
- Domain rules belong to `domain` or `application`, not to JSX files.

Do not use React Context as a default replacement for proper server-state handling.
Do not push fetched backend data into ad hoc global stores without a strong reason.

## Effects and side effects

Treat `useEffect` as an escape hatch.

- Do not use `useEffect` for routine data fetching when TanStack Query should handle it.
- Do not use `useEffect` to derive simple values that can be computed during render.
- Keep effects for actual synchronization with external systems: DOM APIs, browser events, timers, imperative integrations, subscriptions, and similar cases.
- Prefer pure functions, query hooks, and explicit actions over chained effects.

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

## Query and API rules

- Use TanStack Query for asynchronous server-state access.
- Keep query keys centralized and predictable.
- Encapsulate HTTP details in infrastructure adapters.
- Validate untrusted external data at boundaries when necessary, preferably with Zod.
- Do not leak raw transport shapes deep into UI if a mapped domain or application shape is more stable.

## Forms and validation

- Use React Hook Form for forms.
- Use Zod for schema validation when useful.
- Keep form schemas and mapping logic near the feature that owns them.
- Avoid scattering validation rules across JSX, handlers, and random utility files.

## UI rules

- Prefer page + feature hook + presentational component separation.
- Keep components focused and small enough to understand without scrolling through unrelated concerns.
- Do not place business rules directly inside visual components unless the rule is purely presentational.
- Shared UI primitives belong in `src/shared/ui`.
- Feature-specific UI belongs inside the feature.
- Keep `src/app/styles/index.css` and any future shared stylesheet free of orphan selectors.
- Every CSS class or selector introduced must have a live usage in committed UI code.
- If a layout or component is removed, delete its unused styles in the same change.
- Keep palette definitions and semantic theme tokens centralized in `src/app/theme`.
- Prefer Radix Colors scales for application palettes unless the repository explicitly adopts another token source.
- Do not duplicate whole CSS sections per theme when CSS variables or tokens can express the variation cleanly.

Do not prematurely introduce a massive design system if the repository does not need it yet.
If a UI library is introduced, wrap unstable or cross-cutting components behind shared abstractions when that reduces coupling.

## UX, accessibility, and SEO

Treat UI/UX quality, accessibility, and SEO as first-class implementation requirements, not as polish to add later.

UX expectations:

- Prefer clear hierarchy, strong readability, deliberate spacing, and layouts that match real product surfaces rather than generic demo blocks.
- Design every screen for desktop and mobile from the start.
- Always account for loading, empty, error, success, and disabled states where the interaction needs them.
- Keep interaction flows predictable: visible primary actions, safe destructive actions, clear validation, and obvious recovery paths.
- Avoid decorative complexity that reduces clarity or makes data-heavy screens harder to use.

Accessibility expectations:

- Prefer semantic HTML first; use ARIA to enhance semantics, not replace missing structure.
- Preserve valid heading hierarchy, landmarks, label-control associations, and accessible names for interactive elements.
- Every interactive flow must be keyboard-usable, with visible focus states and no keyboard traps.
- Maintain color contrast appropriate for text, controls, feedback states, and focus indicators.
- Do not rely on color alone to communicate status, errors, or selection.
- Respect reduced-motion and similar user-preference signals when motion or animation is introduced.
- Use adequate hit areas and spacing for touch interactions.

SEO expectations:

- Use meaningful document titles, route-level metadata, and meta descriptions when the page has indexable value.
- Prefer real text content and semantic structure over image-only or div-only presentation for important page meaning.
- Keep page structure crawlable and understandable: one clear primary heading, coherent sectioning, and descriptive link text.
- Do not hide critical content behind purely client-only interactions when discoverability matters.
- If a page is intentionally non-indexable, make that choice explicit rather than accidental.

## State rules

Use the lightest state mechanism that matches the problem:

- `useState` for local component state
- `useReducer` for complex local transitions
- context only for scoped shared UI state or app-level cross-cutting state
- TanStack Query for remote data

Do not introduce Redux, Zustand, or another global store by default unless the repository explicitly decides to adopt one.
If that happens later, isolate that decision and update this file.

## Error handling

- Normalize expected errors close to infrastructure boundaries.
- Use feature-level error mapping where needed.
- Avoid leaking transport-layer error objects directly into UI.
- Keep user-facing error messages separate from low-level technical details when possible.

## Testing and validation

Recommended test split:

- Unit tests for `domain` and `application`
- Component tests for `ui`
- Integration tests for feature flows and adapter boundaries

Suggested locations:

- `tests/unit`
- `tests/integration`
- `tests/ui`

Or colocated tests if the repo adopts that convention consistently. Do not mix styles arbitrarily.

After code changes, run at least:

- `bun run build`
- `bun run lint`

If behavior changes, add or update tests and run:

- `bun run test`

If coverage is enforced, keep:

- `bun run test:coverage`

Coverage is enforced at 100% for statements, branches, functions, and lines on included source files.
- Keep test-only resets, fixtures, mocks, and similar helpers out of `src/**`. Put that support in `tests/**` or test setup unless it is a real runtime dependency boundary.

## Code conventions

- In `src/**`, keep explicit types where they improve clarity and preserve strict typing.
- Prefer small, readable files with obvious ownership.
- One import per line.
- Avoid unnecessary multiline imports.
- Use consistent naming and avoid vague file names such as `helpers.ts`, `misc.ts`, or `service.ts`.
- Add comments only when they provide context that the code itself does not communicate.
- Do not invent abstractions unless they remove real duplication or isolate volatility.
- Prefer stable, boring code over clever React patterns.
- Avoid memory leaks and process leaks. Clean up listeners, subscriptions, timers, observers, sockets, workers, query side effects, and similar resources, and do not introduce unbounded app-level stores or caches unless they are deliberate runtime boundaries.

Naming guidance:

- `SomethingPage.tsx`
- `SomethingView.tsx`
- `useSomething.ts`
- `useSomethingViewModel.ts`
- `SomethingRepository.ts`
- `HttpSomethingRepository.ts`
- `SomethingSchema.ts`
- `SomethingMapper.ts`
- `GetSomething.ts`

## Architectural enforcement

This repository should use linting and dependency validation to protect boundaries.

Expected enforcement:

- ESLint for code quality
- `eslint-plugin-boundaries` for layer and module restrictions
- `dependency-cruiser` for dependency graph validation and forbidden import rules
- `dprint` for formatting consistency

If architectural rules change, update the enforcement config and this file together.

## Documentation upkeep

- `README.md` is for human developers.
- `AGENTS.md` is for AI operational context.
- Whenever architecture rules, stack choices, dependency boundaries, commands, feature layout, routing decisions, state strategy, or replacement strategy change, update the affected documentation in the same change.
- Keep this file repository-specific, practical, and strict enough to guide code generation well.
