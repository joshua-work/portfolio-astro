This document is a comprehensive technical reference for the **Vidstack Player** library, specifically tailored for an AI Agent working within an **Astro, Svelte, and Tailwind CSS** environment.

---

# Vidstack Player: Technical Reference for AI Agents

## 1. Overview
Vidstack Player is a framework-agnostic collection of UI components for building high-performance, accessible media players. It uses a **Signals-based architecture** (via Maverick Signals) and a **Request/Response model** for state management.

### Key Advantages:
*   **Provider Agnostic:** Single API for HTML5 Video/Audio, HLS, DASH, YouTube, and Vimeo.
*   **Accessibility:** Adheres to WCAG 2.2, CVAA, and ADA guidelines (ARIA roles, keyboard shortcuts, focus management).
*   **Performance:** Lightweight (54kB gzip core), tree-shakeable, and supports lazy loading for providers and captions.

---

## 2. Environment Setup & Installation

### Package Installation
```bash
npm i vidstack@next
```

### Astro Configuration (`astro.config.mjs`)
Vidstack requires a Vite plugin to handle asset loading and auto-imports.
```javascript
import { defineConfig } from 'astro/config';
import { vite as vidstack } from 'vidstack/plugins';

export default defineConfig({
  vite: {
    plugins: [vidstack({ 
      // Optional: include filter for performance in large projects
      include: /player\// 
    })],
  },
});
```

### Svelte/TypeScript Configuration (`tsconfig.json`)
Enable types for custom elements:
```json
{
  "compilerOptions": {
    "types": ["vidstack/svelte"]
  }
}
```

### Tailwind CSS Integration (`tailwind.config.js`)
Register the Vidstack plugin to enable media variants (e.g., `media-paused:opacity-0`).
```javascript
module.exports = {
  plugins: [
    require('vidstack/tailwind.cjs')({
      selector: '.media-player', // Optimization
      prefix: 'media',
    }),
  ],
};
```

---

## 3. Component Implementation (Svelte)

### Basic Implementation
For Svelte 4, use dynamic imports to avoid hydration bugs. For Svelte 5, direct usage is supported.

**`src/components/Player.svelte`**
```html
<script>
  import 'vidstack/bundle'; // Auto-imports elements and styles
</script>

<media-player 
  title="Video Title" 
  src="youtube/_cMxraX_5RE"
  playsInline
  aspect-ratio="16/9"
>
  <media-provider></media-provider>
  <!-- Use production-ready layouts for speed -->
  <media-video-layout thumbnails="https://path/to/thumbnails.vtt"></media-video-layout>
</media-player>
```

---

## 4. Core Architecture Concepts

### Request & Response Model
1.  **Request:** UI components dispatch DOM events (e.g., `media-play-request`).
2.  **Manager:** `MediaRequestManager` routes requests to the provider.
3.  **State Manager:** `MediaStateManager` updates the **Media Store** after the provider satisfies/rejects the request.
4.  **Triggers:** Events maintain a chain. Check `event.originEvent` or `event.isOriginTrusted` to see if a human triggered the action.

### Media Store & State
Access state via `player.state` or subscribe for reactivity:
```javascript
// Reading Snapshot
const { paused, currentTime } = player.state;

// Subscribing to updates
const unsubscribe = player.subscribe(({ paused }) => {
  console.log('Is paused:', paused);
});
```

### Media Remote Control
Use `MediaRemoteControl` to trigger actions programmatically from any child component:
```javascript
import { MediaRemoteControl } from 'vidstack';
const remote = new MediaRemoteControl();

// Dispatches media-play-request
remote.play(event); 
```

---

## 5. Media Loading & Sources

### Load Strategies
Control when resources load via the `load` and `poster-load` attributes:
*   `eager`: Load immediately.
*   `idle`: Load on `requestIdleCallback`.
*   `visible`: Load when entering viewport.
*   `play`: Load only when the user hits play.
*   `custom`: Trigger via `player.startLoading()`.

### Source Selection
The player auto-selects the provider based on the `src` extension or `type`.
*   **Single:** `<media-player src="video.mp4">`
*   **Multiple (Qualities):**
    ```html
    <media-provider>
      <source src="1080p.mp4" type="video/mp4" data-width="1920" data-height="1080" />
      <source src="720p.mp4" type="video/mp4" data-width="1280" data-height="720" />
    </media-provider>
    ```

### Stream Types
Explicitly set `stream-type` for better UI handling:
*   `on-demand` (VOD)
*   `live`
*   `live:dvr` (Live with seek-back support)

---

## 6. Styling with Tailwind CSS
Vidstack exposes media state via **Data Attributes**. The Tailwind plugin maps these to variants.

### Useful Variants:
*   `media-paused`: Applied when playback is paused.
*   `media-playing`: Applied when playing.
*   `media-buffering`: Applied when waiting for data.
*   `media-fullscreen`: Applied in fullscreen mode.
*   `not-media-xxx`: Negation (e.g., `not-media-playing`).

### Example Markup:
```html
<media-player class="group">
  <!-- Hide overlay when playing -->
  <div class="media-playing:opacity-0 transition-opacity">
    Overlay Content
  </div>
  
  <!-- Custom play button using hocus (hover/focus) -->
  <media-play-button class="data-[hocus]:scale-110 transition-transform">
  </media-play-button>
</media-player>
```

---

## 7. Advanced Features

### Persistence (Storage)
Enable "resume playback" and save user settings:
*   **Local:** `<media-player storage="my-key">`
*   **Remote:** Implement the `MediaStorage` interface (get/set methods for volume, time, lang) and assign it to `player.storage`.

### Text Tracks & Captions
Supports VTT, SRT, SSA/ASS, and JSON.
```html
<track src="/subs/en.vtt" kind="subtitles" label="English" srclang="en-US" default />
```
*   **LibASS Support:** Use `LibASSTextRenderer` via `jassub` for advanced styling.

### Thumbnails
Supports WebVTT sprites or JSON storyboards.
```html
<media-thumbnail src="/thumbnails.vtt"></media-thumbnail>
```

### Clipping
Play only a segment of the media:
```html
<media-player clip-start-time="10" clip-end-time="30">
```

---

## 8. Troubleshooting & Best Practices
1.  **Layout Shift:** Always set `aspect-ratio` on `media-player` to prevent CLS (Cumulative Layout Shift).
2.  **Hydration:** In Svelte 4/Astro, use `{#await import('./Player.svelte')}` to ensure the custom elements are defined on the client.
3.  **Cleanup:** If moving the player manually in the DOM, use the `keep-alive` attribute or manually call `player.destroy()`.