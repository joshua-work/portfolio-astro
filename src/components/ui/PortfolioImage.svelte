<script lang="ts">
  import { resolveImageSource } from '@/lib/sanity/image';
  import { imagePresets, type ImagePresetName } from '@/lib/sanity/image-presets';
  import type { SanityImage } from '@/lib/sanity/types';
  import { cn } from '@/lib/utils';

  let {
    image,
    alt,
    width,
    widths,
    variant,
    class: className = '',
    sizes,
    loading = 'lazy',
    fetchpriority = 'auto',
  } = $props<{
    image: SanityImage;
    alt?: string;
    width?: number;
    widths?: number[];
    variant?: ImagePresetName;
    class?: string;
    sizes?: string;
    loading?: 'eager' | 'lazy';
    fetchpriority?: 'high' | 'low' | 'auto';
  }>();

  const preset = $derived(variant ? imagePresets[variant] : undefined);
  const resolvedAlt = $derived(alt ?? image.alt ?? '');
  const resolvedWidth = $derived(width ?? preset?.width);

  const source = $derived.by(() => {
    if (!resolvedWidth) {
      // In Svelte, we might want to handle this more gracefully or just log an error
      console.error('PortfolioImage requires either a width or a variant.');
      return null;
    }
    return resolveImageSource(image, {
      width: resolvedWidth,
      widths: widths ?? preset?.widths,
      sizes: sizes ?? preset?.sizes,
    });
  });

  const aspectRatio = $derived(source ? source.width / source.height : 1);
  const displayHeight = $derived(source ? Math.round(resolvedWidth! / aspectRatio) : 0);

  const lqipStyle = $derived(source?.lqip 
    ? `background-image: url("${source.lqip}"); background-size: cover; background-position: center;` 
    : '');
</script>

{#if source}
  <img
    src={source.src}
    srcset={source.srcSet}
    sizes={source.sizes}
    alt={resolvedAlt}
    width={resolvedWidth}
    height={displayHeight}
    loading={loading}
    {fetchpriority}
    decoding="async"
    class={cn("bg-surface/50 transition-all duration-[var(--duration-slow)] ease-[var(--easing-film)]", className)}
    style={lqipStyle}
  />
{/if}
