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

  const autoplayEnabled = $derived(video.autoplay ?? true);
  const mutedForPlayback = $derived(video.muted ?? autoplayEnabled);
  const iframeTitle = $derived(video.title?.trim() || `${title} video player`);
  const iframeSrc = $derived.by(() => {
    if (!isActivated) {
      return '';
    }

    try {
      const url = new URL(video.embedUrl);

      if (autoplayEnabled) {
        url.searchParams.set('autoplay', '1');
      }

      if (video.provider === 'youtube') {
        url.searchParams.set('playsinline', '1');
        url.searchParams.set('rel', '0');

        if (mutedForPlayback) {
          url.searchParams.set('mute', '1');
        }

        if (video.loop) {
          const videoId = url.pathname.split('/').pop();

          if (videoId) {
            url.searchParams.set('loop', '1');
            url.searchParams.set('playlist', videoId);
          }
        }
      } else if (video.provider === 'vimeo') {
        if (mutedForPlayback) {
          url.searchParams.set('muted', '1');
        }

        if (video.loop) {
          url.searchParams.set('loop', '1');
        }
      } else {
        if (mutedForPlayback) {
          url.searchParams.set('mute', '1');
        }
      }

      return url.toString();
    } catch {
      const separator = video.embedUrl.includes('?') ? '&' : '?';
      const params = [];

      if (autoplayEnabled) {
        params.push('autoplay=1');
      }

      if (mutedForPlayback) {
        params.push('mute=1');
      }

      return params.length > 0 ? `${video.embedUrl}${separator}${params.join('&')}` : video.embedUrl;
    }
  });
  const watchUrl = $derived(video.watchUrl || video.embedUrl);
  const state = $derived(isActivated ? (hasLoaded ? 'playing' : 'loading') : 'idle');

  function activatePlayer() {
    isActivated = true;
  }

  function handleLoad() {
    hasLoaded = true;
  }
</script>

<div
  class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface"
  data-player-root
  data-provider={video.provider}
  data-state={state}
>
  {#if isActivated}
    <div class="aspect-video">
      <iframe
        class="h-full w-full"
        src={iframeSrc}
        title={iframeTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        on:load={handleLoad}
      />
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
        alt=""
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--easing-film)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        loading="eager"
        decoding="async"
      />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70 transition-opacity duration-[var(--duration-base)] ease-[var(--easing-film)] group-hover:opacity-80 group-focus-visible:opacity-80"
      />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,110,0.24),transparent_42%)] opacity-0 transition-opacity duration-[var(--duration-slow)] ease-[var(--easing-film)] group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <div class="relative flex h-full w-full items-center justify-center p-5">
        <span class="flex min-h-11 min-w-11 -translate-y-0 items-center justify-center rounded-full border border-white/20 bg-black/40 px-6 py-5 text-sm uppercase tracking-[0.24em] text-primary shadow-[0_0_0_rgba(0,0,0,0)] backdrop-blur-sm transition-all duration-[var(--duration-base)] ease-[var(--easing-film)] group-hover:-translate-y-0.5 group-hover:border-[var(--color-accent)] group-hover:bg-black/55 group-hover:text-[var(--color-accent)] group-hover:shadow-[0_18px_48px_rgba(0,0,0,0.35)] group-focus-visible:-translate-y-0.5 group-focus-visible:border-[var(--color-accent)] group-focus-visible:bg-black/55 group-focus-visible:text-[var(--color-accent)] group-focus-visible:shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
          Play
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
