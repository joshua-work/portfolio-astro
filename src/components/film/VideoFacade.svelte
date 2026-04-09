<script lang="ts">
  import type { FilmVideoEmbed } from '@/lib/sanity/types';
  import type { ResolvedImageSource } from '@/lib/sanity/image';

  type Props = {
    title: string;
    video: FilmVideoEmbed;
    poster: ResolvedImageSource;
  };

  let { title, video, poster }: Props = $props();

  let isActivated = $state(false);
  let hasLoaded = $state(false);
  let iframeElement = $state<HTMLIFrameElement | null>(null);

  const iframeTitle = $derived(video.title?.trim() || `${title} video player`);
  const iframeSrc = $derived.by(() => {
    if (!isActivated) {
      return '';
    }

    try {
      const url = new URL(video.embedUrl);

      url.searchParams.set('autoplay', '1');

      if (video.provider === 'youtube') {
        url.searchParams.set('enablejsapi', '1');
        url.searchParams.set('playsinline', '1');
        url.searchParams.set('rel', '0');
      } else if (video.provider === 'vimeo') {
        url.searchParams.set('api', '1');
      }

      return url.toString();
    } catch {
      const separator = video.embedUrl.includes('?') ? '&' : '?';
      const params = ['autoplay=1'];

      return params.length > 0 ? `${video.embedUrl}${separator}${params.join('&')}` : video.embedUrl;
    }
  });
  const watchUrl = $derived(video.watchUrl || video.embedUrl);
  const state = $derived(isActivated ? (hasLoaded ? 'playing' : 'loading') : 'idle');

  function activatePlayer() {
    hasLoaded = false;
    isActivated = true;
  }

  function requestPlayback() {
    if (!iframeElement?.contentWindow) {
      return;
    }

    if (video.provider === 'youtube') {
      iframeElement.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'playVideo',
          args: [],
        }),
        '*',
      );

      return;
    }

    if (video.provider === 'vimeo') {
      iframeElement.contentWindow.postMessage(
        JSON.stringify({
          method: 'play',
        }),
        '*',
      );
    }
  }

  function handleLoad() {
    hasLoaded = true;
    requestPlayback();
  }
</script>

<div
  class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface"
  data-player-root
  data-provider={video.provider}
  data-state={state}
>
  {#if isActivated}
    <div class="relative aspect-video bg-background">
      <iframe
        bind:this={iframeElement}
        class={`h-full w-full transition-opacity duration-[var(--duration-base)] ease-[var(--easing-film)] ${
          hasLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        src={iframeSrc}
        title={iframeTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        on:load={handleLoad}
      />

      <div
        aria-hidden="true"
        class={`pointer-events-none absolute inset-0 transition-opacity duration-[var(--duration-base)] ease-[var(--easing-film)] ${
          hasLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {#if poster.lqip}
          <div
            class="absolute inset-0 scale-105 blur-2xl"
            style={`background-image: url("${poster.lqip}"); background-position: center; background-size: cover; background-repeat: no-repeat;`}
          />
        {/if}
        <img
          src={poster.src}
          srcset={poster.srcSet}
          sizes={poster.sizes}
          alt=""
          class="absolute inset-0 h-full w-full scale-[1.04] object-cover"
          loading="eager"
          decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,110,0.18),transparent_42%)]" />
        <div class="relative flex h-full w-full items-center justify-center p-5">
          <span class="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 px-6 py-5 text-sm uppercase tracking-[0.24em] text-primary backdrop-blur-sm">
            Loading
          </span>
        </div>
      </div>
    </div>
  {:else}
    <button
      type="button"
      class="group relative flex aspect-video w-full min-h-11 cursor-pointer items-center justify-center overflow-hidden bg-background text-left focus-ring"
      aria-label={`Play ${title}`}
      on:click={activatePlayer}
    >
      {#if poster.lqip}
        <div
          aria-hidden="true"
          class="absolute inset-0 scale-105 blur-2xl"
          style={`background-image: url("${poster.lqip}"); background-position: center; background-size: cover; background-repeat: no-repeat;`}
        />
      {/if}
      <img
        aria-hidden="true"
        src={poster.src}
        srcset={poster.srcSet}
        sizes={poster.sizes}
        alt=""
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--easing-film)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        loading="eager"
        decoding="async"
      />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70"
      />
      <div class="relative flex h-full w-full items-center justify-center p-5">
        <span class="video-play-button flex min-h-11 min-w-11 -translate-y-0 items-center justify-center rounded-full px-6 py-5 text-sm uppercase tracking-[0.24em] text-primary backdrop-blur-sm transition-[transform,color] duration-[var(--duration-slow)] ease-[var(--easing-film)] group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
          <svg
            aria-hidden="true"
            class="video-play-button-orbit absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              class="video-play-button-outline"
              x="0.75"
              y="0.75"
              width="98.5"
              height="98.5"
              rx="50"
              ry="50"
              vector-effect="non-scaling-stroke"
            />
            <rect
              class="video-play-button-orbit-path"
              x="0.75"
              y="0.75"
              width="98.5"
              height="98.5"
              rx="50"
              ry="50"
              pathLength="100"
              vector-effect="non-scaling-stroke"
            />
          </svg>
          <span class="relative z-10">Play</span>
        </span>
      </div>
    </button>
  {/if}

  <noscript>
    <div class="flex min-h-16 items-center justify-between gap-4 border-t border-white/10 bg-background/70 px-5 py-4 text-sm text-secondary">
      <span>JavaScript is required for inline playback.</span>
      <a href={watchUrl} target="_blank" rel="noreferrer" class="text-accent">
        Open video
      </a>
    </div>
  </noscript>
</div>

<style>
  .video-play-button {
    position: relative;
    isolation: isolate;
    background-color: rgb(0 0 0 / 0.4);
    overflow: hidden;
  }

  .video-play-button-orbit {
    inset: 0;
    pointer-events: none;
    overflow: visible;
  }

  .video-play-button-outline {
    fill: none;
    stroke: rgb(232 226 217 / 0.14);
    stroke-width: 1.25;
  }

  .video-play-button-orbit-path {
    fill: none;
    stroke: rgb(255 245 224 / 0.96);
    stroke-width: 1.25;
    stroke-linecap: round;
    stroke-dasharray: 12 88;
    stroke-dashoffset: 0;
    opacity: 0;
    filter: drop-shadow(0 0 2px rgb(255 245 224 / 0.16));
    transition: opacity 420ms var(--easing-film);
  }

  .group:hover .video-play-button,
  .group:focus-visible .video-play-button,
  .group:focus-within .video-play-button {
    color: color-mix(in srgb, var(--color-text-primary) 88%, var(--color-accent) 12%);
  }

  .group:hover .video-play-button-outline,
  .group:focus-visible .video-play-button-outline,
  .group:focus-within .video-play-button-outline {
    stroke: rgb(232 226 217 / 0.12);
  }

  .group:hover .video-play-button-orbit-path,
  .group:focus-visible .video-play-button-orbit-path,
  .group:focus-within .video-play-button-orbit-path {
    opacity: 1;
    animation: video-play-button-orbit 3000ms linear infinite;
  }

  @keyframes video-play-button-orbit {
    from {
      stroke-dashoffset: 0;
    }

    to {
      stroke-dashoffset: -100;
    }
  }
</style>
