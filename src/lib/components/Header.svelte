<script lang="ts">
  let { activeTab }: { activeTab: string } = $props();

  const navItems = [
    'Overview',
    'Security',
    'Weather',
    '|',
    'Kitchen',
    'Dining',
    'Living',
    'Bedroom',
    'Nils',
    'Office',
  ];
</script>

<header class="flex items-center justify-between px-16 py-6">
  <div class="text-white text-xl font-light tracking-wider">
    HAMAVIL.
  </div>
  
  <nav class="flex items-center gap-8">
    {#each navItems as item}
      {#if item === '|'}
        <span class="text-white/50">|</span>
      {:else}
        <button
          onclick={() => activeTab = item}
          class="text-white/90 hover:text-white transition-colors relative pb-1 
            {item === activeTab ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white' : ''}"
        >
          {item}
        </button>
      {/if}
    {/each}
  </nav>
  
  <div class="text-white text-lg">
    {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
  </div>
</header>