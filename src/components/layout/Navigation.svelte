<script lang="ts">
  import { Dialog, NavigationMenu } from 'bits-ui';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import type { NavItem, SiteSettings } from '@/lib/sanity/types';

  interface Props {
    settings: Pick<SiteSettings, 'logo' | 'primaryNav' | 'siteTitle'>;
    currentPath?: string;
  }

  let { settings, currentPath = '/' }: Props = $props();
  let isMenuOpen = $state(false);
  let currentScrollY = $state(0);
  let isHidden = $state(false);
  let lastScrollY = 0;
  let scrollDownDistance = 0;
  let scrollUpDistance = 0;

  const links: NavItem[] = settings.primaryNav;

  // Normalize paths to handle trailing slashes consistently
  const normalizePath = (p: string) => p.replace(/\/$/, '') || '/';
  const isActive = (href: string) => normalizePath(currentPath) === normalizePath(href);

  $effect(() => {
    if (typeof window !== 'undefined') {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  });

  $effect(() => {
    // Scroll handling for smart sticky header
    const delta = currentScrollY - lastScrollY;
    
    if (delta > 0) {
      // Scrolling down
      scrollDownDistance += delta;
      scrollUpDistance = 0; // Reset up distance
      
      // Hide if scrolled down continuously for > 100px and we are past the top 100px
      if (scrollDownDistance > 500 && currentScrollY > 100) {
        isHidden = true;
      }
    } else if (delta < 0) {
      // Scrolling up
      scrollUpDistance += Math.abs(delta);
      scrollDownDistance = 0; // Reset down distance
      
      // Show if scrolled up continuously for > 10px (deadzone to prevent jitter)
      if (scrollUpDistance > 300) {
        isHidden = false;
      }
    }
    
    // Always show if near top
    if (currentScrollY <= 100) {
      isHidden = false;
    }
    
    // Always show if menu is open
    if (isMenuOpen) {
      isHidden = false;
    }
    
    lastScrollY = currentScrollY;
  });
</script>

<svelte:window bind:scrollY={currentScrollY} />

<!-- Spacer div to prevent content layout shift since header is now fixed -->
<div class="h-16 w-full">
  <header 
    class="fixed top-0 z-20 w-full border-b border-white/10 bg-background/90 backdrop-blur-md transition-transform duration-300 ease-[var(--easing-film)] {isHidden ? '-translate-y-full' : 'translate-y-0'}"
    style="view-transition-name: header"
  >
    <div class="content-shell flex min-h-16 items-center">
    <div class="flex items-center justify-between w-full">
      <!-- Logo -->
  <a
    href="/"
    class="focus-ring inline-flex min-h-11 items-center font-display text-2xl tracking-[0.08em] text-primary z-50"
  >
    {settings.siteTitle}
  </a>

  <!-- Desktop Navigation -->
  <NavigationMenu.Root aria-label="Primary navigation" class="hidden md:block">
    <NavigationMenu.List class="flex items-center gap-2 md:gap-4">
      {#each links as link}
        <NavigationMenu.Item>
          <NavigationMenu.Link
            href={link.href}
            active={isActive(link.href)}
            aria-current={isActive(link.href) ? 'page' : undefined}
            class="focus-ring inline-flex min-h-11 items-center rounded-full px-4 text-sm uppercase tracking-[0.22em] transition-colors duration-300 ease-[var(--easing-film)] {isActive(link.href) ? 'bg-white/6 text-accent' : 'text-secondary hover:text-accent'}"
          >
            {link.label}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/each}
    </NavigationMenu.List>
  </NavigationMenu.Root>

  <!-- Mobile Navigation Trigger -->
  <Dialog.Root bind:open={isMenuOpen} preventScroll={true}>
    <Dialog.Trigger
      class="focus-ring flex md:hidden min-h-11 min-w-11 items-center justify-center text-primary z-50"
      aria-label="Open menu"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="square"
      >
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="16" x2="20" y2="16" />
      </svg>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div
              {...props}
              transition:fade={{ duration: 300, easing: cubicOut }}
              class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            ></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div
              {...props}
              transition:fly={{ x: 400, duration: 400, opacity: 1, easing: cubicOut }}
              class="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col items-center justify-center bg-background shadow-2xl border-l border-white/10 outline-none"
            >
              <Dialog.Close
                class="focus-ring absolute top-6 right-6 flex min-h-11 min-w-11 items-center justify-center text-primary"
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="square"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Dialog.Close>

              <nav aria-label="Mobile navigation" class="w-full px-8">
                <ul class="flex flex-col items-center gap-8">
                  {#each links as link}
                    <li>
                      <a
                        href={link.href}
                        onclick={() => (isMenuOpen = false)}
                        class="group flex flex-col items-center gap-2 font-display text-4xl tracking-widest transition-all duration-300 {isActive(link.href) ? 'text-accent' : 'text-primary hover:text-accent'}"
                      >
                        {link.label}
                        <span class="h-px w-0 bg-accent transition-all duration-300 group-hover:w-full {isActive(link.href) ? 'w-full' : ''}"></span>
                      </a>
                    </li>
                  {/each}
                </ul>
              </nav>

              <!-- Footer Note in Mobile Menu -->
              <div class="absolute bottom-12 text-secondary/40 text-xs uppercase tracking-[0.3em]">
                {settings.siteTitle} &copy; {new Date().getFullYear()}
              </div>
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
      </Dialog.Root>
    </div>
  </div>
</header>
</div>

<style>
  /* Custom easing for cinematic feel */
  :global(.ease-film) {
    transition-timing-function: var(--easing-film);
  }
</style>
