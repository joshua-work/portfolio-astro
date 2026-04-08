<script lang="ts">
  type Props = {
    opacity?: number;
    size?: number;
    blendMode?: string;
  };

  let {
    opacity = 0.08,
    size = 0.65,
    blendMode = 'overlay',
  }: Props = $props();
</script>

<div
  aria-hidden="true"
  class="pointer-events-none absolute inset-0 overflow-hidden"
  style={`opacity: ${opacity}; mix-blend-mode: ${blendMode};`}
>
  <svg class="h-full w-full scale-110" preserveAspectRatio="none" viewBox="0 0 100 100">
    <filter id="film-grain-filter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={size}
        numOctaves="2"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#film-grain-filter)" />
  </svg>
</div>
