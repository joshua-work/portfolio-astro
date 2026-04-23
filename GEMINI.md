# Joshua Filmmaker Portfolio - Project Intelligence

## 1. Project Vision & Status
- **Goal:** A high-end, cinematic portfolio for a filmmaker, optimized for visual impact and performance.
- **Status:** Core migration completed. Currently in Feature Expansion and Maintenance phase.
- **Aesthetic:** Dark-themed, minimalist, film-noir palette, serif display typography, cinematic motion.

## 2. Core Tech Stack
- **Framework:** Astro 5.x (SSG mode - Optimized for fast LCP and cinematic performance via pre-rendered HTML)
- **UI Components:** Svelte 5 (Runes mode) & Astro Components
- **Styling:** Tailwind CSS v4 (CSS variable-first approach)
- **CMS:** Sanity v3 (Cloud-hosted)
- **Interactivity:** Bits UI (Headless components)
- **Video:** Vidstack 1.12+ (Facade pattern)
- **Deployment:** Cloudflare Pages (GitHub-triggered)

## 3. Architectural Mandates

### 3.1 Image Strategy (Pure Sanity CDN)
- **Zero Build-time Processing:** Remote Sanity images must **never** be processed by Astro's `astro:assets` or `<Image />`. This avoids unnecessary download/optimization cycles during build and leverages Sanity's global CDN.
- **Implementation:** Use `src/components/ui/PortfolioImage.astro`.
- **Performance & UX:** 
    - Serve via `cdn.sanity.io` with parameters (`auto=format`, `q=80`).
    - Use `srcset` for responsive delivery.
    - **LQIP (Low-Quality Image Placeholder):** Always include a Base64-encoded `lqip` as a `background-image` (blur effect) to provide immediate visual feedback before the high-res image loads.
- **Decoding:** Force `decoding="async"` on all portfolio images.

### 3.2 Video Strategy (Facade Pattern)
- **Lazy Loading:** Real video players (Vidstack) are only initialized after user interaction.
- **Facade Implementation:** Use `src/components/film/VideoFacade.svelte`.
- **Attributes:** 
    - Always set `view-type="video"` on the player.
    - Set `poster-load="eager"` to show the thumbnail immediately.

### 3.3 Routing & Transitions (Astro 5.x)
- **ClientRouter:** Use `<ClientRouter />` (replacing deprecated `ViewTransitions`) in `BaseLayout.astro`.
- **Motion:** Shared-element transitions (e.g., `transition:name`) are used for seamless movement between the grid and detail pages.

### 3.4 Design System & Styling (Tailwind 4 & CSS Variables)
- **CSS Variable-First:** All visual values MUST be defined as CSS variables in `src/styles/global.css`. Do not hardcode hex values, spacing, or fonts in component files.
- **Tailwind Integration:** Variables are mapped through Tailwind v4 `@theme`. Prefer classes like `bg-background` or `text-primary` over custom CSS.
- **Visual Aesthetic:** 
    - Deep dark, cinematic, film-noir palette.
    - No pure white; use `--color-text-primary`.
    - Animations are slow and deliberate, not snappy.
    - Serif display font for film titles, sans-serif for body text.
- **Core Token Families:** Include color layers (`--color-bg-base`, `raised`, `overlay`), typography (`--color-text-primary`, `secondary`, `muted`), accents (`--color-accent`), and motion (`--duration-fast`, `base`, `slow`, `--easing-film`). Promote recurring values to tokens.

### 3.5 Mobile First & Responsive Design
- **Breakpoints:** Default (mobile) `< 768px`, `md` `>= 768px`, `lg` `>= 1024px`, `xl` `>= 1280px`.
- **Strategy:** Write base styles for mobile first, then override with `md:` and `lg:` prefixes. Never write desktop-only styles without a mobile fallback.
- **Accessibility:** Touch targets must be at least 44px in height on mobile. Hover-dependent interactions must have a non-hover fallback for touch devices.
- **Key Layout Rules:**
    - Film grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
    - Navigation: compact pattern below `lg`, expanded links at `lg` and above
    - Lightbox: full screen on mobile, centered modal on desktop

### 3.6 Animation & Motion Guidelines
- **Astro Cross-Page:** Keep transition naming predictable, e.g., `transition:name="film-cover-{slug}"`.
- **Svelte In-Page:** 
    - Use `fade` for overlays/modals, `fly` from below for entrances, and `scale` with `fade` for dialog content.
    - Use `--duration-base` for standard UI, `--duration-slow` for cinematic entrances.
- **Spring & Tweened:** Use `spring` for hover follow/weighted motion (keep stiffness low for a cinematic feel) and `tweened` for smooth numeric changes.
- **Film Grain Effect:** `src/components/film/FilmGrain.svelte` is the reusable baseline. Keep `pointer-events: none` at all times and mount it as a deferred island (`client:visible` or similar).

### 3.7 Accessibility & Bits UI Usage
- **Purpose:** Use Bits UI for unstyled, accessible component primitives (e.g., dialogs/lightboxes, tooltips, comboboxes) to handle focus management and ARIA correctly.
- **Anti-patterns:** Do NOT use Bits UI for layout, static content, or simple decorative hover behavior.
- **Key Patterns:**
    - Always spread `{...props}` when using child snippets.
    - Use `forceMount` when Svelte transitions need enter/exit behavior.
    - Use `data-state` attributes for stateful styling hooks.

## 4. Development Workflow

### Svelte 5 Runes & Islands
- **Runes Syntax:** All components MUST use Runes syntax: `$state`, `$props`, `$derived`, `$effect`. Avoid legacy `$:` or `export let` patterns.
- **Static First:** Astro outputs static HTML by default. Do not add client-side JavaScript unless absolutely necessary for interactivity.
- **Islands Strategy:** Svelte should add interaction/motion, not static structure. Prefer `client:visible` for below-fold enhancements. Static content must remain pure HTML where possible.
- **Cleanup:** Always clean up in `onDestroy` or `$effect` for browser APIs.

### Sanity & GROQ
- **Centralized Queries:** All GROQ queries live in `src/lib/sanity/queries.ts`. Never write inline GROQ outside this file.
- **Projections:** Always include `lqip` and `metadata` in image projections to support the blur-placeholder strategy.
- **Types:** Keep `src/lib/sanity/types.ts` in sync with schema changes. Never use `any` for content-driven props.
- **Image URL Pattern:** Use `buildImageUrl` from `src/lib/sanity/image.ts`. Pass width, format, and quality options. Do not use raw `asset.url` directly in UI code.

### File Structure & TS
- `src/components/ui/`: Generic reusable UI elements (e.g., `PortfolioImage.astro`).
- `src/components/film/`: Film-specific features (e.g., `VideoFacade.svelte`, `FilmGrid.astro`).
- `src/lib/sanity/`: All CMS-related logic, types, and queries.
- **TypeScript:** Reference defined types in `src/lib/sanity/types.ts`. Update types first if the schema evolves.

## 5. Deployment & Webhooks
- **Platform:** Cloudflare Pages (GitHub-triggered).
- **Automation:** 
    - Pushes to `main` trigger a code deploy.
    - Sanity content publishes trigger a site rebuild via Webhook (configured in Cloudflare Settings).
- **Environment:** Keep secrets (Sanity project IDs, datasets, etc.) in Cloudflare project settings or `.env`, never hardcoded in source control.

---

## 6. AI Collaboration Notes

- The site owner is a filmmaker, not an engineer. Prefer readable, well-commented code over terse cleverness.
- When generating components, include short comments only where the reasoning is non-obvious.
- Before modifying a component, state what is being changed and why.
- If a request is ambiguous and materially affects implementation, ask one clarifying question before proceeding.
- Always check `src/lib/sanity/types.ts` before accessing content fields.
- When writing new queries, follow the existing `queries.ts` projection pattern.
- Default to the simplest solution that satisfies the requirement.
- Preserve the existing scaffold unless the user explicitly asks for a restructuring.