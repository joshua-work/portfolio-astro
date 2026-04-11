<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  import { fade, slide } from "svelte/transition";
  import { cn } from "@/lib/utils";

  let { tags, selectedTags = $bindable([]) } = $props<{
    tags: string[];
    selectedTags: string[];
  }>();

  let isExpanded = $state(false);
</script>

<div class="flex flex-col">
  <!-- Header Row -->
  <div class="flex items-center gap-4 min-h-8">
    <div class="flex items-center gap-3">
      <p class="text-xs uppercase tracking-[0.24em] text-accent font-medium whitespace-nowrap">Filter by Tags</p>
      
      <!-- Toggle Button -->
      <button 
        onclick={() => isExpanded = !isExpanded}
        class="group flex items-center justify-center w-6 h-6 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300 focus-ring"
        aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2.5" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class={cn("text-secondary/60 transition-transform duration-500 ease-[var(--easing-film)]", isExpanded ? "rotate-180" : "rotate-0")}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
    
    <!-- Active Tag Count & Clear Button -->
    <div class="flex items-baseline gap-3">
      {#if selectedTags.length > 0}
        <span 
          transition:fade={{ duration: 200 }}
          class="text-[10px] text-primary/40 font-mono"
        >
          ({selectedTags.length})
        </span>
        
        <button
          transition:fade={{ duration: 200 }}
          onclick={() => (selectedTags = [])}
          class="text-[10px] uppercase tracking-[0.2em] text-secondary/40 hover:text-accent transition-colors duration-200 border-b border-white/5 hover:border-accent/40 pb-0.5"
        >
          Clear all
        </button>
      {/if}
    </div>
  </div>
  
  <!-- Collapsible Content -->
  {#if isExpanded}
    <div transition:slide={{ duration: 600, axis: 'y' }}>
      <!-- Padding included inside the slide transition to prevent jump -->
      <div class="pt-6">
        <ToggleGroup.Root
          type="multiple"
          bind:value={selectedTags}
          class="flex flex-wrap gap-2"
        >
          {#each tags as tag}
            <ToggleGroup.Item
              value={tag}
              class={cn(
                "rounded-full border border-white/10 bg-surface/50 px-4 py-2 text-xs uppercase tracking-[0.18em] text-secondary transition-all duration-[var(--duration-base)] ease-[var(--easing-film)] hover:border-white/20 hover:bg-surface/80 focus-ring",
                "data-[state=on]:border-accent/40 data-[state=on]:bg-accent/10 data-[state=on]:text-primary"
              )}
            >
              {tag}
            </ToggleGroup.Item>
          {/each}
        </ToggleGroup.Root>
      </div>
    </div>
  {/if}
</div>
