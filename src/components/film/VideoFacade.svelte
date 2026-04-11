<script lang="ts">
  import playIcon from 'media-icons/dist/icons/play.js';
  import pauseIcon from 'media-icons/dist/icons/pause.js';
  import replayIcon from 'media-icons/dist/icons/replay.js';

  import { fade } from 'svelte/transition';
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

  let playerEl = $state<HTMLElement | null>(null);
  let playerState = $state<'idle' | 'playing' | 'unsupported'>('idle');
  let playerStarted = $state(false);
  let playerEnded = $state(false);
  let playIndicatorEnabled = $state(false);

  let isPlayerActive = $state(false);
  let isPlayerLoading = $state(false);
  let areScriptsLoaded = false;

  async function preloadScripts() {
    if (areScriptsLoaded || isPlayerLoading) return;
    isPlayerLoading = true;
    
    try {
      await import('vidstack/player');
      await import('vidstack/player/layouts/default');
      await import('vidstack/player/ui');
      areScriptsLoaded = true;
    } catch (error) {
      console.error("Failed to preload video player:", error);
    } finally {
      isPlayerLoading = false;
    }
  }

  function loadAndPlay() {
    if (isPlayerActive) return;
    
    // 如果尚未預載完成，則在此載入
    if (!areScriptsLoaded) {
      preloadScripts();
    }
    
    isPlayerActive = true;
  }

  $effect(() => {
    if (!playerEl) return;

    const handlePlay = () => {
      playerStarted = true;
      playerState = 'playing';
      playerEnded = false;
    };

    const handlePause = () => {
      playerState = 'idle';
      playIndicatorEnabled = true;
    };

    const handleEnded = () => {
      playerState = 'idle';
      playerStarted = false;
      playerEnded = true;
    };

    const handleError = () => {
      playerState = 'unsupported';
    };

    // Listen to both standard and vds-prefixed events for maximum compatibility
    playerEl.addEventListener('play', handlePlay);
    playerEl.addEventListener('playing', handlePlay);
    playerEl.addEventListener('vds-play', handlePlay);
    playerEl.addEventListener('vds-playing', handlePlay);
    playerEl.addEventListener('pause', handlePause);
    playerEl.addEventListener('vds-pause', handlePause);
    playerEl.addEventListener('ended', handleEnded);
    playerEl.addEventListener('vds-ended', handleEnded);
    playerEl.addEventListener('error', handleError);
    playerEl.addEventListener('vds-error', handleError);

    return () => {
      playerEl?.removeEventListener('play', handlePlay);
      playerEl?.removeEventListener('playing', handlePlay);
      playerEl?.removeEventListener('vds-play', handlePlay);
      playerEl?.removeEventListener('vds-playing', handlePlay);
      playerEl?.removeEventListener('pause', handlePause);
      playerEl?.removeEventListener('vds-pause', handlePause);
      playerEl?.removeEventListener('ended', handleEnded);
      playerEl?.removeEventListener('vds-ended', handleEnded);
      playerEl?.removeEventListener('error', handleError);
      playerEl?.removeEventListener('vds-error', handleError);
    };
  });

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
  class="relative z-10 h-full w-full overflow-hidden isolate"
  data-player-root
  data-provider={video.provider}
  data-state={playerState}
  onmouseenter={preloadScripts}
>
  {#if resolvedSource.kind === 'player'}
    <div class="player-shell relative h-full w-full bg-background">
      {#if !isPlayerActive}
        <button
          type="button"
          class="absolute inset-0 z-50 flex h-full w-full cursor-pointer items-center justify-center overflow-hidden border-0 bg-transparent p-0 group"
          onclick={loadAndPlay}
          aria-label="Play video"
        >
          <!-- 縮圖背景 -->
          <div
            class="custom-poster-overlay absolute inset-0 z-0"
            style="background-image: url({poster.src}); background-size: cover; background-position: center;"
            aria-hidden="true"
          ></div>
          
          <!-- 初始可見的播放按鈕 -->
          <div class="custom-play-button relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md">
            <div class="h-10 w-10">
              <svg viewBox="0 0 32 32" class="fill-current">{@html playIcon}</svg>
            </div>
          </div>
        </button>
      {:else}
      <media-player
        bind:this={playerEl}
        class="vidstack-player block h-full w-full"
        class:is-started={playerStarted}
        src={resolvedSource.playerSrc}
        title={playerTitle}
        viewType="video"
        load="eager"
        autoplay
        posterLoad="eager"
        playsinline
        data-allow-play-indicator={playIndicatorEnabled}
      >
        <media-provider>
          <media-gesture event="click" action={"toggle:play" as any}></media-gesture>
          <media-gesture event="dblclick" action={"toggle:fullscreen" as any}></media-gesture>
        </media-provider>

        <!-- Play/Pause Center Indicator (Desktop Only) -->
        <div class="media-indicator-container pointer-events-none absolute inset-0 z-50 hidden items-center justify-center md:flex">
          <div class="media-indicator">
            <div class="media-indicator-icon play-icon">
              <svg viewBox="0 0 32 32">{@html playIcon}</svg>
            </div>
            <div class="media-indicator-icon pause-icon">
              <svg viewBox="0 0 32 32">{@html pauseIcon}</svg>
            </div>
          </div>
        </div>

        <!-- Replay Overlay (Desktop Only) -->
        {#if playerEnded}
          <div
            transition:fade={{ duration: 400 }}
            class="replay-overlay group absolute inset-0 z-20 hidden cursor-pointer items-center justify-center bg-black/32 backdrop-blur-[2px] md:flex"
            role="button"
            tabindex="0"
            aria-label="Replay video"
            onclick={(e) => {
              const player = (e.currentTarget as HTMLElement).closest('media-player');
              if (player && typeof player.play === 'function') {
                playIndicatorEnabled = false;
                player.play();
                playerEnded = false;
                playerStarted = true;
              }
            }}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const player = (e.currentTarget as HTMLElement).closest('media-player');
                if (player && typeof player.play === 'function') {
                  playIndicatorEnabled = false;
                  player.play();
                  playerEnded = false;
                  playerStarted = true;
                }
              }
            }}
          >
            <button
              type="button"
              onclick={(e) => {
                e.stopPropagation();
                // Find the player and play it
                const player = (e.currentTarget as HTMLElement).closest('media-player');
                if (player && typeof player.play === 'function') {
                  playIndicatorEnabled = false;
                  player.play();
                  playerEnded = false;
                  playerStarted = true;
                }
              }}
              class="flex flex-col items-center gap-4 focus-ring"
              aria-label="Replay video"
            >
              <div class="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-black">
                <div class="h-10 w-10">
                  <svg viewBox="0 0 32 32">{@html replayIcon}</svg>
                </div>
              </div>
              <span class="text-sm font-medium uppercase tracking-[0.25em] text-white opacity-80 group-hover:opacity-100">
                Replay
              </span>
            </button>
          </div>
        {/if}

        <!-- 手動管理的 Poster 遮罩，確保在 YouTube 載入時不會閃黑畫面 -->
        <div
          class="custom-poster-overlay absolute inset-0 z-[1] pointer-events-none {playerStarted
            ? 'opacity-0'
            : 'opacity-100'}"
          style="background-image: url({poster.src}); background-size: cover; background-position: center;"
          aria-hidden="true"
        ></div>

        <media-video-layout></media-video-layout>
      </media-player>
      {/if}
    </div>
  {:else}
    <div class="relative h-full w-full bg-background">
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,110,0.18),transparent_42%)]"
      ></div>
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

  /* 確保 Layout (包含載入圖示) 在自訂 Poster 之上 */
  .vidstack-player :global(media-video-layout) {
    z-index: 10 !important;
  }

  .custom-poster-overlay {
    will-change: opacity, transform, scale;
    transform: scale(1);
    scale: 1;
    transition: all var(--duration-slow) var(--easing-film);
  }

  .custom-play-button {
    transform: scale(1);
    scale: 1;
    transition: all var(--duration-base) var(--easing-film);
  }

  .group:hover .custom-poster-overlay {
    scale: 1.05;
  }

  .group:hover .custom-play-button {
    scale: 1.1;
    border-color: var(--color-accent);
    background-color: var(--color-accent);
    color: var(--color-bg-base);
  }

  .vidstack-player :global(.vds-video-layout .vds-controls[data-visible]) {
    backdrop-filter: blur(0);
  }

  .vidstack-player :global(.vds-video-layout[data-sm]) {
    --media-button-size: 44px;
  }

  /* Play/Pause Center Indicator Styles */
  .media-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
    opacity: 0;
    pointer-events: none;
    will-change: transform, opacity;
  }

  :global(.media-indicator-icon) {
    width: 44px;
    height: 44px;
    position: absolute;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.media-indicator-icon svg) {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  /* Show the correct icon based on state when the animation triggers */
  :global(media-player[data-paused]) .pause-icon {
    opacity: 1;
  }

  :global(media-player:not([data-paused])) .play-icon {
    opacity: 1;
  }

  /* Separate animations to ensure they restart on state change */
  :global(media-player[data-started][data-paused]:not([data-ended])) .media-indicator {
    animation: indicator-flash-pause 0.8s var(--easing-film);
  }

  :global(media-player[data-allow-play-indicator="true"]:not([data-paused])) .media-indicator {
    animation: indicator-flash-play 0.8s var(--easing-film);
  }

  @keyframes indicator-flash-pause {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    30% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0;
      transform: scale(1.3);
    }
  }

  @keyframes indicator-flash-play {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    30% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0;
      transform: scale(1.3);
    }
  }

  /* 影片播放前的 Hover 效果 (只在尚未播放時生效) */
  .vidstack-player:not(.is-started) {
    cursor: pointer;
  }

  .vidstack-player:not(.is-started):hover .custom-poster-overlay {
    transform: scale(1.05);
  }

  .vidstack-player:not(.is-started) :global(.vds-play-button) {
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