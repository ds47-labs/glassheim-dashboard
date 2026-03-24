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
    accentColor = 'var(--accent-default)',
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
  class="glass-panel relative h-full overflow-hidden rounded-2xl"
>
  <!-- Fading glow accent bar -->
  <div
    class="accent-bar absolute top-0 bottom-0 left-0 w-1"
    style="background: {accentColor};
            box-shadow: 0 0 20px {accentColor}, 0 0 40px {accentColor};
            mask-image: linear-gradient(180deg, white 0%, white 40%, rgba(255,255,255,0.6) 70%, transparent 100%);
            -webkit-mask-image: linear-gradient(180deg, white 0%, white 40%, rgba(255,255,255,0.6) 70%, transparent 100%);"
  ></div>

  <div class="flex h-full flex-col p-7 pl-8">
    <div class="mb-6 flex items-center gap-2.5">
      <div class="text-white/60">
        {#if IconComponent}
          <IconComponent size={18} strokeWidth={1.2} />
        {/if}
      </div>
      <span class="text-xs font-medium tracking-[0.18em] text-white/75 uppercase">{title}</span>
    </div>

    {#if hero}
      <div class="mb-7 flex items-baseline gap-2">
        <span class="text-4xl font-extralight tracking-tight text-white tabular-nums">{hero}</span>
        {#if heroUnit}
          <span class="text-base font-light {heroAccent ?? 'text-white/45'}">{heroUnit}</span>
        {/if}
        {#if HeroIconComponent}
          <span
            class="ml-1 inline-flex text-white/65 transition-transform"
            style={heroIconRotation !== undefined
              ? `transform: rotate(${heroIconRotation}deg)`
              : ''}
          >
            <HeroIconComponent size={16} strokeWidth={1.4} />
          </span>
        {/if}
      </div>
    {/if}

    <div class="stat-divider flex flex-col gap-3">
      {#each stats as stat, i (i)}
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-xs tracking-wide text-white/38">{stat.label}</span>
          <span class="text-sm font-light tabular-nums {stat.accent ?? 'text-white/75'}"
            >{stat.value}</span
          >
        </div>
      {/each}
    </div>
  </div>
</div>
