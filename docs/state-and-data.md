# State, data and effects

Read this before changing data fetching, forms, state, effects or error handling.

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
