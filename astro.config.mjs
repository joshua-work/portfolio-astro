import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { vite as vidstack } from 'vidstack/plugins';

export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss(), vidstack()],
  },
});
