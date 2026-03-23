<script lang="ts">
  import type { Icon } from 'lucide-svelte';

  type StatRow = {
    label: string;
    value: string;
    accent?: string;
  };

  let {
    icon: IconComponent,
    title,
    accentColor = 'rgba(255,255,255,0.25)',
    hero,
    heroUnit,
    stats
  }: {
    icon: typeof Icon;
    title: string;
    accentColor?: string;
    hero?: string;
    heroUnit?: string;
    stats: StatRow[];
  } = $props();
</script>

<div
  class="group glass-panel relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:bg-white/10 animate-fade-up"
>
  <!-- Accent edge -->
  <div
    class="absolute top-3 bottom-3 left-0 w-0.5 rounded-full"
    style="background: {accentColor}; box-shadow: 0 0 8px {accentColor};"
  ></div>

  <div class="flex h-full flex-col p-7 pl-8">
    <!-- Header row -->
    <div class="mb-4 flex items-center gap-2.5">
      <div class="text-white/40">
        {#if IconComponent}
          <IconComponent size={20} strokeWidth={1.2} />
        {/if}
      </div>
      <span class="text-xs font-medium tracking-[0.18em] text-white/40 uppercase">{title}</span>
    </div>

    <!-- Hero value -->
    {#if hero}
      <div class="mb-4">
        <span class="text-4xl font-extralight tracking-tight text-white tabular-nums">{hero}</span>
        {#if heroUnit}
          <span class="ml-1 text-base font-light text-white/35">{heroUnit}</span>
        {/if}
      </div>
    {/if}

    <!-- Secondary stats -->
    <div class="mt-auto flex flex-col gap-2">
      {#each stats as stat, i (i)}
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-xs text-white/35 tracking-wide">{stat.label}</span>
          <span class="text-sm font-light tabular-nums {stat.accent ?? 'text-white/80'}">{stat.value}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
