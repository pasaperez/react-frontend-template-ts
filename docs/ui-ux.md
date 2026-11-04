# UI, UX, accessibility and SEO

Read this before changing components, styles, themes or metadata.

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
