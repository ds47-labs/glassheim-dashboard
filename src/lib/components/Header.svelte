<script lang="ts">
  import { page } from '$app/stores';

  const navItems: { label: string; href: string }[] = [
  { label: 'Overview', href: '/overview' },
  { label: 'Security', href: '/security' },
  { label: 'Weather', href: '/weather' },
  { label: 'Kitchen', href: '/kitchen' },
  { label: 'Dining', href: '/dining' },
  { label: 'Living', href: '/living' },
  { label: 'Bedroom', href: '/bedroom' },
  { label: 'Nils', href: '/nils' },
  { label: 'Office', href: '/office' },
  ];

  let currentPath = $derived($page.url.pathname);
</script>

<header class="flex items-center justify-between px-16 py-10">
  <div class="text-white text-4xl font-light tracking-wider shrink-0">
  HAMAVIL.
  </div>

  <nav class="flex items-center gap-6">
  {#each navItems as item, i (item.label)}
  {#if i === 3}
  <span class="text-white/30 font-extralight">|</span>
  {/if}
  <a
  href={item.href}
  class="text-white text-lg tracking-wide transition-colors relative pb-1
  {currentPath === item.href
  ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
  : ''}"
  >
  {item.label}
  </a>
  {/each}
  </nav>

  <div class="text-white text-4xl font-light tabular-nums shrink-0">
  {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
  </div>
</header>
