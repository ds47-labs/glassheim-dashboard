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
    heroAccent,
    heroIcon: HeroIconComponent,
    heroIconRotation,
    stats
  }: {
    icon: typeof Icon;
    title: string;
    accentColor?: string;
    hero?: string;
    heroUnit?: string;
    heroAccent?: string;
    heroIcon?: typeof Icon;
    heroIconRotation?: number;
    stats: StatRow[];
  } = $props();
</script>

<div
  class="glass-panel animate-fade-up relative h-full overflow-hidden rounded-2xl transition-all duration-300"
>
  <div
    class="absolute top-4 bottom-4 left-2 rounded-full"
    style="width: 2px; background: {accentColor}; box-shadow: 0 0 6px 1px {accentColor};"
  ></div>

  <div class="flex h-full flex-col p-7 pl-8">
    <div class="mb-4 flex items-center gap-2.5">
      <div class="text-white/40">
        {#if IconComponent}
          <IconComponent size={20} strokeWidth={1.2} />
        {/if}
      </div>
      <span class="text-xs font-medium tracking-[0.18em] text-white uppercase">{title}</span>
    </div>

    {#if hero}
      <div class="mb-4 flex items-baseline gap-2">
        <span class="text-4xl font-extralight tracking-tight text-white tabular-nums">{hero}</span>
        {#if heroUnit}
          <span class="text-base font-light {heroAccent ?? 'text-white/35'}">{heroUnit}</span>
        {/if}
        {#if HeroIconComponent}
          <span
            class="ml-0.5 inline-flex text-white transition-transform"
            style={heroIconRotation !== undefined
              ? `transform: rotate(${heroIconRotation}deg)`
              : ''}
          >
            <HeroIconComponent size={18} strokeWidth={1.5} />
          </span>
        {/if}
      </div>
    {/if}

    <div class="mt-auto flex flex-col gap-2">
      {#each stats as stat, i (i)}
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-xs tracking-wide text-white/35">{stat.label}</span>
          <span class="text-sm font-light tabular-nums {stat.accent ?? 'text-white/80'}"
            >{stat.value}</span
          >
        </div>
      {/each}
    </div>
  </div>
</div>
