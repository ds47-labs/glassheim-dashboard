<script lang="ts">
  import type { Icon } from 'lucide-svelte';

  let {
    icon: IconComponent,
    title,
    stats
  }: {
    icon: typeof Icon,
    title: string,
    stats: Array<{ label: string | typeof Icon; value: string; label2?: string | typeof Icon; value2?: string }>
  } = $props();
</script>

<div class="glass-panel min-h-56 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 flex items-center justify-center animate-fade-up">
  <div class="flex items-start gap-5">
    <div class="text-white/60 mt-0.5">
      {#if IconComponent}
      <IconComponent size={40} strokeWidth={0.8} />
      {/if}
    </div>

    <div>
      <h3 class="mb-4 text-lg font-medium tracking-wide text-white">{title}</h3>

      <div class="space-y-3.5">
        {#each stats as stat, i (i)}
        <div class="grid grid-cols-[auto_1fr] items-center gap-x-4">
          {#if typeof stat.label === 'string'}
            <span class="font-medium text-white/50 uppercase text-xs tracking-[0.15em]">{stat.label}</span>
          {:else}
            {@const LabelIcon = stat.label}
            <LabelIcon size={32} strokeWidth={1} class="text-white/50" />
          {/if}
          {#if stat.label2 !== undefined}
            <div class="flex items-center gap-3">
              <span class="text-lg font-light text-white/90 tabular-nums">{stat.value}</span>
              {#if typeof stat.label2 === 'string'}
                <span class="font-medium text-white/50 uppercase text-xs tracking-[0.15em]">{stat.label2}</span>
              {:else}
                {@const Label2Icon = stat.label2}
                <Label2Icon size={32} strokeWidth={1} class="text-white/50" />
              {/if}
              <span class="text-lg font-light text-white/90 tabular-nums">{stat.value2}</span>
            </div>
          {:else}
            <span class="text-lg font-light text-white/90 tabular-nums">{stat.value}</span>
          {/if}
        </div>
        {/each}
      </div>
    </div>
  </div>
</div>
