<script lang="ts">
  import 'vidstack/player';
  import 'vidstack/player/layouts/default';
  import 'vidstack/player/ui';

  import type { MediaSrc } from 'vidstack';

  import type { ResolvedImageSource } from '@/lib/sanity/image';
  import type { FilmVideoSource } from '@/lib/sanity/types';

  type Props = {
    title: string;
    video: FilmVideoSource;
    poster: ResolvedImageSource;
  };

  type ResolvedPlayableSource =
    | {
        kind: 'player';
        playerSrc: MediaSrc;
        watchUrl: string;
      }
    | {
        kind: 'external';
        watchUrl: string;
      };

  let { title, video, poster }: Props = $props();

  let playerState = $state<'idle' | 'playing' | 'unsupported'>('idle');
  let playerStarted = $state(false);

  const playerTitle = $derived(video.title?.trim() || `${title} video player`);
  const resolvedSource = $derived(resolvePlayableSource(video));
  const backgroundImage = $derived(
    poster.lqip
      ? `background-image: linear-gradient(to bottom, rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.72)), url("${poster.lqip}");`
      : 'background-image: linear-gradient(to bottom, rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.72));',
  );

  function resolvePlayableSource(source: FilmVideoSource): ResolvedPlayableSource {
    const watchUrl = source.watchUrl || source.src || source.embedUrl || '#';

    if (source.provider === 'youtube' && source.embedUrl) {
      return {
        kind: 'player',
        playerSrc: {
          src: source.embedUrl,
          type: 'video/youtube',
        },
        watchUrl,
      };
    }

    if (source.provider === 'vimeo' && source.embedUrl) {
      return {
        kind: 'player',
        playerSrc: {
          src: source.embedUrl,
          type: 'video/vimeo',
        },
        watchUrl,
      };
    }

    const candidateUrl = source.src || source.embedUrl;
    const mimeType = source.mimeType || inferMimeType(candidateUrl);

    if (candidateUrl && mimeType) {
      return {
        kind: 'player',
        playerSrc: {
          src: candidateUrl,
          type: mimeType,
        },
        watchUrl,
      };
    }

    return {
      kind: 'external',
      watchUrl,
    };
  }

  function inferMimeType(src: string | undefined) {
    if (!src) {
      return undefined;
    }

    const pathname = getPathname(src);

    if (pathname.endsWith('.m3u8')) {
      return 'application/x-mpegURL';
    }

    if (pathname.endsWith('.mpd')) {
      return 'application/dash+xml';
    }

    if (pathname.endsWith('.mp4')) {
      return 'video/mp4';
    }

    if (pathname.endsWith('.webm')) {
      return 'video/webm';
    }

    if (pathname.endsWith('.ogv') || pathname.endsWith('.ogg')) {
      return 'video/ogg';
    }

    if (pathname.endsWith('.mov')) {
      return 'video/quicktime';
    }

    return undefined;
  }

  function getPathname(src: string) {
    try {
      return new URL(src).pathname.toLowerCase();
    } catch {
      return src.split('?')[0]?.toLowerCase() ?? '';
    }
  }

</script>

<div
  class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface"
  data-player-root
  data-provider={video.provider}
  data-state={playerState}
>
  {#if resolvedSource.kind === 'player'}
    <div class="player-shell relative aspect-video w-full bg-background">
      <media-player
        class="vidstack-player block h-full w-full"
        src={resolvedSource.playerSrc.src}
        title={playerTitle}
        poster={poster.src}
        view-type="video"
        load="play"
        poster-load="eager"
        playsinline
        onstarted={() => (playerStarted = true)}
        onplay={() => (playerState = 'playing')}
        onplaying={() => (playerState = 'playing')}
        onpause={() => (playerState = 'idle')}
        onended={() => (playerState = 'idle')}
        onerror={() => (playerState = 'unsupported')}
        onclick={(e) => {
          if (!playerStarted) {
            e.currentTarget.play();
          }
        }}
      >
        <media-provider>
          <media-poster alt={poster.alt ?? ''}></media-poster>
        </media-provider>
        <media-video-layout></media-video-layout>
      </media-player>
    </div>
  {:else}
    <div class="relative aspect-video w-full bg-background">
      <div aria-hidden="true" class="player-fallback absolute inset-0" style={backgroundImage} />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,110,0.18),transparent_42%)]"
      />
      <div class="relative flex h-full items-end p-5 md:p-6">
        <div class="max-w-md rounded-[1.5rem] border border-white/10 bg-black/60 p-5 backdrop-blur-md">
          <p class="text-xs uppercase tracking-[0.22em] text-accent">External video</p>
          <p class="mt-3 text-sm leading-6 text-primary/88">
            This source cannot be played inline here. Open it in a new tab to watch the video.
          </p>
          <a
            href={resolvedSource.watchUrl}
            target="_blank"
            rel="noreferrer"
            class="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm uppercase tracking-[0.18em] text-primary transition-colors duration-[var(--duration-base)] ease-[var(--easing-film)] hover:border-accent/50 hover:text-accent focus-ring"
          >
            Open video
          </a>
        </div>
      </div>
    </div>
  {/if}

  <noscript>
    <div class="flex min-h-16 items-center justify-between gap-4 border-t border-white/10 bg-background/70 px-5 py-4 text-sm text-secondary">
      <span>JavaScript is required for inline playback.</span>
      <a href={resolvedSource.watchUrl} target="_blank" rel="noreferrer" class="text-accent">
        Open video
      </a>
    </div>
  </noscript>
</div>

<style>
  .player-fallback {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transform: scale(1.04);
    filter: blur(0);
  }

  .vidstack-player {
    --video-border: 0;
    --video-border-radius: 0;
    --video-bg: var(--color-bg-base);
    --video-brand: var(--color-accent);
    --video-controls-color: var(--color-text-primary);
    --video-focus-ring-color: rgb(200 169 110 / 0.38);
    --video-font-family: var(--font-body);
    --media-button-border-radius: 999px;
    --media-button-hover-bg: rgb(255 255 255 / 0.12);
    --media-controls-padding: 0;
    --media-tooltip-border: 1px solid rgb(255 255 255 / 0.08);
    --media-tooltip-bg-color: rgb(10 10 10 / 0.92);
    --media-menu-border: 1px solid rgb(255 255 255 / 0.08);
    --media-menu-bg: rgb(10 10 10 / 0.92);
    --media-menu-box-shadow: 0 16px 40px rgb(0 0 0 / 0.42);
    --media-menu-item-height: 44px;
    --media-menu-item-hover-bg: rgb(255 255 255 / 0.08);
    --media-menu-item-icon-size: 1rem;
    --media-menu-item-padding: 0.75rem;
    --media-menu-text-color: var(--color-text-primary);
    --media-menu-text-secondary-color: color-mix(in srgb, var(--color-text-secondary) 90%, white 10%);
    --media-slider-track-bg: rgb(255 255 255 / 0.18);
    --media-slider-track-fill-bg: var(--color-accent);
    --media-slider-track-progress-bg: rgb(255 255 255 / 0.32);
    --media-slider-thumb-bg: var(--color-text-primary);
    --media-slider-thumb-border: 0;
    --media-time-color: var(--color-text-primary);
    --media-captions-padding: 1.25rem;
    --media-cue-bg: rgb(10 10 10 / 0.68);
    --media-cue-border-radius: 0.25rem;
    --media-focus-ring: 0 0 0 3px rgb(200 169 110 / 0.38);
    width: 100%;
    height: 100%;
    display: block;
  }

  .vidstack-player :global(.vds-video-layout .vds-controls[data-visible]) {
    backdrop-filter: blur(0);
  }

  .vidstack-player :global(.vds-video-layout[data-sm]) {
    --media-button-size: 44px;
  }

  /* 影片播放前的 Hover 效果 (只在尚未播放時生效) */
  .vidstack-player:not([data-started]) {
    cursor: pointer;
  }

  .vidstack-player:not([data-started]) :global(media-poster img) {
    transition: transform var(--duration-slow) var(--easing-film);
    will-change: transform;
  }

  .vidstack-player:not([data-started]):hover :global(media-poster img) {
    transform: scale(1.05);
  }

  .vidstack-player:not([data-started]) :global(.vds-play-button) {
    transition: 
      transform var(--duration-base) var(--easing-film), 
      background-color var(--duration-base) var(--easing-film), 
      color var(--duration-base) var(--easing-film);
  }

  .vidstack-player:not([data-started]):hover :global(.vds-play-button) {
    transform: scale(1.1);
    background-color: var(--color-accent);
    color: var(--color-bg-base);
  }
</style>
