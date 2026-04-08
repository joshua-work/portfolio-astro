# Project Intelligence: Personal Film Portfolio Website

## Project Overview

This is a personal documentary / film portfolio website built with a static-first, performance-focused architecture. The owner is a filmmaker, not a developer. All development is AI-assisted. Prioritize clarity, maintainability, and long-term sustainability over cleverness.

This repository has already been initialized with a minimal Astro scaffold. The current goal is to extend that scaffold carefully, not to re-bootstrap the project from scratch.

---

## Core Tech Stack

| Layer | Tool | Role |
|---|---|---|
| Site framework | Astro | Static site generation, routing, build orchestration |
| Interactivity | Svelte 5 | Islands of interactivity, animations, state management |
| Headless UI | Bits UI | Accessible component primitives (unstyled) |
| Styling | Tailwind CSS v4 + CSS Variables | Utility classes + design token system |
| CMS | Sanity | Content management, image CDN, Portable Text |
| Deployment | Vercel (Hobby) | Static hosting, CDN, webhook-triggered rebuilds |

---

## Current Scaffold Status

The following foundation already exists and should be preserved unless there is a clear reason to change it:

- `package.json` includes Astro, Svelte, Tailwind v4, Sanity client packages, TypeScript, and `@astrojs/check`
- `astro.config.mjs` is configured with the Svelte integration and Tailwind Vite plugin
- `tsconfig.json` includes the `@/*` path alias mapped to `src/*`
- `src/styles/global.css` contains the initial design-token layer and Tailwind `@theme` mapping
- `src/components/layout/BaseLayout.astro` imports global styles and wraps all pages
- `src/components/layout/NavBar.astro` and `src/components/layout/Footer.astro` provide a simple layout shell
- `src/lib/sanity/client.ts`, `queries.ts`, `image.ts`, and `types.ts` are the initial Sanity integration points
- `src/pages/index.astro`, `src/pages/about.astro`, and `src/pages/films/[slug].astro` exist as placeholder routes
- `src/components/film/FilmGrain.svelte` exists as the baseline grain-effect component

If modifying any of these files, preserve the architecture intent and expand them incrementally.

---

## Architecture Principles

### Static First, Islands Only
- Astro outputs static HTML by default. Do not add client-side JavaScript unless it is absolutely necessary for interactivity.
- Svelte components are Islands (`client:visible`, `client:load`, `client:idle`). Use the most deferred directive possible.
- Prefer `client:visible` for components below the fold, such as a photo lightbox or film grain effect.
- Static content such as film titles, descriptions, and captions must remain pure HTML. Do not wrap static structure in Svelte without a real interaction need.

### Mobile First, Always
- Write base styles for mobile. Override with `md:` and `lg:` prefixes for larger screens.
- Never write desktop-only styles without a mobile fallback.
- Touch targets must be at least 44px in height on mobile.
- Hover-dependent interactions must have a non-hover fallback for touch devices.

### Performance is Non-Negotiable
- This site is media-heavy. Every design and implementation decision must account for load performance.
- Use Astro `<Image />` for local or supported static image rendering. Do not use raw `<img>` tags in page or component markup.
- Remote Sanity images should be served through Sanity CDN URL parameters for resizing and format conversion. Do not download and bundle them at build time.
- YouTube and Vimeo embeds must use a facade pattern: thumbnail plus play button first, real iframe only after user intent.
- Never load third-party scripts in `<head>` without `defer` or `async`.

---

## Design System

### CSS Variables (Design Tokens)
All visual values must be defined as CSS variables in `src/styles/global.css`. Do not hardcode color hex values, spacing values, or font names in component files.

Current token families include:

```css
/* Color layers */
--color-bg-base
--color-bg-raised
--color-bg-overlay

/* Typography */
--color-text-primary
--color-text-secondary
--color-text-muted

/* Accent */
--color-accent
--color-accent-dim

/* Spacing */
--space-section
--space-section-mobile
--space-container

/* Typography */
--font-display
--font-body

/* Motion */
--duration-fast
--duration-base
--duration-slow
--easing-film
```

When new recurring values appear, promote them into tokens instead of repeating literals across components.

### Tailwind Integration
CSS variables are mapped through Tailwind v4 `@theme` in `src/styles/global.css`, so classes like `bg-background`, `bg-surface`, `text-primary`, `text-secondary`, and `text-accent` are valid and should be preferred.

### Visual Aesthetic
- Deep dark, cinematic, film-noir palette
- No pure white; use `--color-text-primary`
- Animations are slow and deliberate, not snappy
- Serif display font for film titles, sans-serif for body text

---

## Project File Structure

```text
src/
  components/
    ui/              # Generic reusable UI
    film/            # Film-specific components
    layout/          # Layout components
  lib/
    sanity/
      client.ts      # Sanity client instance
      queries.ts     # Centralized GROQ queries only
      image.ts       # Sanity image URL builder utility
      types.ts       # TypeScript types matching Sanity schema
    stores/          # Svelte stores for shared state
  pages/
    index.astro      # Homepage scaffold
    about.astro      # About scaffold
    films/
      [slug].astro   # Individual film route scaffold
  styles/
    global.css       # Tokens + Tailwind theme mapping
```

Do not scatter Sanity query logic, shared types, or shared stores outside these directories without a strong reason.

---

## TypeScript Types

All content data types must be defined in `src/lib/sanity/types.ts`. Always reference these types when writing components. Never use `any` or untyped props for Sanity-backed data.

Current baseline types:

- `SanityImage`
- `FilmSummary`
- `Film`

If the schema evolves, update the TypeScript types first, then update the GROQ query projections to match.

---

## Sanity & GROQ

### Query Rules
- All GROQ queries live in `src/lib/sanity/queries.ts`. Never write inline GROQ queries in page files.
- Always request image `metadata` and `lqip` for blur-placeholder support.
- Use the summary projection for listing pages and a full projection for detail pages.
- Query shape and TypeScript shape must stay in sync.

### Image URL Pattern
Use `buildImageUrl` from `src/lib/sanity/image.ts`. Pass width, format, and quality options. Do not use raw `asset.url` directly in UI code.

### Environment Variables
Sanity configuration uses:

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PUBLIC_SANITY_API_VERSION`

Use `.env.example` as the reference template when adding setup instructions or onboarding notes.

---

## Astro Rules

- Keep pages primarily `.astro` unless there is a real need for client interactivity
- Prefer static route generation wherever possible
- Import shared layout concerns through `BaseLayout.astro`
- Reuse the `@/*` import alias instead of deep relative import chains when importing from `src`

### Build and Validation
Primary scripts:

- `npm run dev`
- `npm run build`
- `npm run check`

In restricted environments, Astro telemetry may need to be disabled for checks and builds:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
```

If an automated environment throws permission errors around Astro telemetry config creation, disable telemetry for that command rather than changing app code to work around it.

### View Transitions Note
`BaseLayout.astro` currently uses Astro view transitions because cross-page cinematic transitions are part of the intended direction. In Astro 5.x, the old `ViewTransitions` export from `astro:transitions` is deprecated and has been renamed to `ClientRouter`. If you touch this area, import and render `ClientRouter` instead of `ViewTransitions`, and preserve the transition system rather than removing it to silence warnings.

---

## Bits UI Usage

Bits UI provides unstyled, accessible component primitives. Use it only when accessibility or focus management would otherwise be easy to get wrong.

### Use Bits UI For
- Dialogs such as photo lightboxes or modal overlays
- Tooltips for metadata hints
- Select or Combobox controls for filtering

### Do Not Use Bits UI For
- Layout
- Static content
- Simple decorative hover behavior

### Key Patterns
- Always spread `{...props}` when using child snippets
- Use `forceMount` when Svelte transitions need enter and exit behavior
- Use `data-state` attributes for stateful styling hooks

---

## Svelte Component Rules

- Use Svelte 5 Runes syntax such as `$state`, `$derived`, `$effect`, and `$props`
- Do not use legacy `$:` reactive statements
- Use `onMount` only for browser-only behavior
- Always clean up in `onDestroy`
- Shared state between sibling components belongs in `src/lib/stores/`
- Prefer `client:visible` over `client:load` for below-fold enhancements

For this project, Svelte should add interaction, motion, or progressive enhancement, not static structure.

---

## Animation Guidelines

### Astro Cross-Page Motion
- Shared-element transitions are encouraged for film thumbnails and hero imagery
- Keep transition naming predictable, for example `transition:name="film-cover-{slug}"`

### Svelte In-Page Motion
- Use `fade` for overlays and modals
- Use `fly` from below for content entrances
- Use `scale` with `fade` for dialog content
- Use `--duration-base` for standard UI
- Use `--duration-slow` for cinematic entrances

### Spring and Tweened Motion
- Use `spring` for hover follow, cursor drift, and weighted motion
- Use `tweened` for progress bars or smooth numeric changes
- Keep stiffness low for a cinematic feel

### Film Grain Effect
- `src/components/film/FilmGrain.svelte` is the reusable baseline implementation
- Keep `pointer-events: none` at all times
- Mount it as a deferred island when used in actual pages

---

## RWD Breakpoints

```text
Default (mobile)  < 768px
md                >= 768px
lg                >= 1024px
xl                >= 1280px
```

Always write mobile styles first.

### Key RWD Rules
- Film grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Film detail layout: `flex-col lg:flex-row`
- Cover image: `h-64 lg:h-screen`
- Section spacing: mobile first, then scale to `--space-section`
- Navigation: compact pattern below `lg`, expanded links at `lg` and above
- Lightbox: full screen on mobile, centered modal on desktop

---

## What to Avoid

- Never hardcode recurring colors, spacing, or fonts
- Never use raw `<img>` in page or component markup
- Never write inline GROQ outside `src/lib/sanity/queries.ts`
- Never use `any` for content-driven props or fetch results
- Never load YouTube or Vimeo iframes on initial page load
- Never add `client:load` to below-fold enhancements by default
- Never write desktop-first CSS
- Never use legacy Svelte reactive syntax
- Never forget cleanup for browser APIs initialized in `onMount`
- Never use Bits UI for decorative or static-only UI

---

## Development Phase Order

When building new features, follow this sequence:

1. Define the data in Sanity schema and `src/lib/sanity/types.ts`
2. Add or update the GROQ query in `src/lib/sanity/queries.ts`
3. Build the static Astro structure first
4. Apply styling using existing design tokens
5. Add interactivity only if needed
6. Layer in animation last
7. Verify responsive behavior on mobile, tablet, and desktop
8. Run `npm run check` and `npm run build`
9. Commit one focused change at a time

---

## AI Collaboration Notes

- The site owner is a filmmaker, not an engineer. Prefer readable, well-commented code over terse cleverness.
- When generating components, include short comments only where the reasoning is non-obvious.
- Before modifying a component, state what is being changed and why.
- If a request is ambiguous and materially affects implementation, ask one clarifying question before proceeding.
- Always check `src/lib/sanity/types.ts` before accessing content fields.
- When writing new queries, follow the existing `queries.ts` projection pattern.
- Default to the simplest solution that satisfies the requirement.
- Preserve the existing scaffold unless the user explicitly asks for a restructuring.
