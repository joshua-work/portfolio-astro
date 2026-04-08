# Joshua Portfolio Astro

Personal documentary and film portfolio website built with Astro, Svelte, Tailwind CSS, and Sanity.

## Tech Stack

- Astro
- Svelte 5
- Tailwind CSS v4
- Sanity
- TypeScript

## Project Structure

```text
src/
  components/     Reusable UI, layout, and film-specific components
  lib/            Sanity helpers, content utilities, and stores
  pages/          Astro routes
  styles/         Global design tokens and theme styles

sanity-studio/    Sanity Studio project
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file and add the required Sanity variables:

```env
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=your_dataset
PUBLIC_SANITY_API_VERSION=2025-01-01
```

3. Start the Astro development server:

```bash
npm run dev
```

4. Run the Sanity Studio locally when needed:

```bash
cd sanity-studio
npm install
npm run dev
```

## Available Scripts

- `npm run dev` starts the Astro dev server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run check` runs Astro's project checks

## Notes

- This repo keeps the website and the Sanity Studio in the same project folder.
- `legacy-portfolio/` is intentionally excluded from Git tracking.
- `.env` is ignored and should not be committed.
