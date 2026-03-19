<script lang="ts">
  import type { Icon } from 'lucide-svelte';

  let {
    icon: IconComponent,
    title,
    stats
  }: {
    icon: typeof Icon,
    title: string,
    stats: Array<{ label: string; value: string }>
  } = $props();
</script>

<div class="glass-panel min-h-64 rounded-3xl border border-white/15 bg-white/5 p-10 backdrop-blur-3xl shadow-xl transition-all hover:bg-white/10 flex items-center justify-center">
  <div class="flex items-start gap-6">
    <div class="text-white/70 mt-1">
      {#if IconComponent}
      <IconComponent size={48} strokeWidth={1} />
      {/if}
    </div>
    
    <div>
      <h3 class="mb-5 text-xl font-semibold tracking-wide text-white">{title}</h3>
      
      <div class="space-y-4">
        {#each stats as stat (stat.label)}
        <div class="grid grid-cols-[auto_1fr] items-baseline gap-x-4">
          <span class="font-medium text-white/40 uppercase text-s tracking-widest">{stat.label}</span>
          <span class="text-xl font-light text-white/80">{stat.value}</span>
        </div>
        {/each}
      </div>
    </div>
  </div>
</div>
