<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';
  import type { FilmSummary } from '@/lib/sanity/types';
  import PortfolioImage from '@/components/ui/PortfolioImage.svelte';
  import TagFilter from './TagFilter.svelte';

  let { films, tags, initialVisibleCount = 6, loadMoreCount = 6 } = $props<{
    films: FilmSummary[];
    tags: string[];
    initialVisibleCount?: number;
    loadMoreCount?: number;
  }>();

  let selectedTags = $state<string[]>([]);
  let visibleCount = $state(initialVisibleCount);
  let sentinel = $state<HTMLElement | null>(null);

  const filteredFilms = $derived.by(() => {
    if (selectedTags.length === 0) return films;
    return films.filter((film) => 
      selectedTags.some((tag) => film.tags.includes(tag))
    );
  });

  const displayFilms = $derived(filteredFilms.slice(0, visibleCount));
  const hasMore = $derived(visibleCount < filteredFilms.length);

  function loadMore() {
    if (hasMore) {
      visibleCount += loadMoreCount;
    }
  }

  // Reset visible count when filters change
  $effect(() => {
    if (selectedTags) {
      visibleCount = initialVisibleCount;
    }
  });

  // Infinite Scroll Observer
  $effect(() => {
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '0px 0px 400px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  });
</script>

<section class="content-shell section-spacing flex flex-col gap-12">
  <TagFilter {tags} bind:selectedTags />

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each displayFilms as film, i (film.slug)}
      <article
        animate:flip={{ duration: 600 }}
        in:fly={{ y: 20, duration: 600, delay: i * 50 }}
        out:fade={{ duration: 300 }}
        class="group overflow-hidden rounded-[2rem] border border-white/10 bg-surface/80"
      >
        <a href={`/films/${film.slug}/`} class="block focus-ring">
          <div class="overflow-hidden">
            <PortfolioImage
              image={film.coverImage}
              variant="card"
              class="aspect-[4/3] w-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--easing-film)] group-hover:scale-[1.03]"
              alt={film.title}
              loading={i < 2 ? 'eager' : 'lazy'}
              fetchpriority={i < 2 ? 'high' : 'auto'}
            />
          </div>
          <div class="flex flex-col gap-4 p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.24em] text-accent">{film.type}</p>
                <h2 class="mt-3 font-display text-3xl leading-tight text-primary">
                  {film.title}
                </h2>
              </div>
              <p class="text-sm uppercase tracking-[0.2em] text-secondary">{film.year}</p>
            </div>
            <p class="text-sm leading-7 text-secondary line-clamp-2">{film.logline}</p>
            <p class="text-xs uppercase tracking-[0.18em] text-secondary/80">
              {film.tags.join(' / ')}
            </p>
          </div>
        </a>
      </article>
    {/each}

    {#if displayFilms.length === 0}
      <div 
        in:fade
        class="col-span-full rounded-3xl border border-dashed border-white/15 bg-surface/70 p-12 text-center"
      >
        <p class="text-secondary uppercase tracking-widest text-sm">No projects match the selected filters.</p>
        <button 
          onclick={() => selectedTags = []}
          class="mt-4 text-accent uppercase tracking-[0.2em] text-xs hover:underline"
        >
          Clear all filters
        </button>
      </div>
    {/if}
  </div>

  <div class="flex flex-col items-center gap-6">
    <p class="text-sm uppercase tracking-[0.2em] text-secondary" aria-live="polite">
      Showing {Math.min(visibleCount, filteredFilms.length)} of {filteredFilms.length} works
    </p>
    
    {#if hasMore}
      <div
        bind:this={sentinel}
        class="flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-surface/70 px-8 py-3 text-xs uppercase tracking-[0.22em] text-secondary"
      >
        Scroll to load more
      </div>
    {/if}
  </div>
</section>
