# Testing and code conventions

Read this before writing code or tests, and before running the final validation.

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

## No dead code

Nothing stays in the repository without a user. This is a hard rule for every change, not a cleanup task for later.

1. **Delete in the same change.** When a change makes something unused it deletes it there: functions, exports, types, files, component props, CSS classes and variables, theme tokens, environment variables, dependencies, scripts and documentation. Removing a feature takes its routes, navigation entry, actions, adapters, tests and docs with it.
2. **No zombies.** No commented-out code, no `TODO`/`FIXME`, no options or flags nothing sets, no parameters nothing passes, no `export` only to import it somewhere "later".
3. **Production code is not written for tests.** A function, option or export that only tests use is dead code: tests exercise what production uses (inject a collaborator or use the public entry point). Exporting an internal function for a unit test is allowed only when production code also uses it inside its own file.
4. **Examples are code too.** The sample `users` feature stays because it is wired, run and tested; a primitive, helper or style that no example uses is removed, not kept "for adopters".
5. **Enforced, not honour-system.** The TypeScript build runs with `noUnusedLocals` and `noUnusedParameters`; `bun run lint` runs `scripts/dead-code.mjs`, which fails on an export nobody imports, an export only tests use, a file nobody imports and a CSS class no component names (a class built as `` `prefix--${x}` `` counts as used). Fix the finding by deleting; never by silencing the check or adding a fake reference. Files the framework loads by convention are listed in the script's `entryFiles`.
6. Reviewers reject a change that leaves any of the above even when tests and lint pass.
