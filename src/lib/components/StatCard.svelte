<script lang="ts">
  import type { Icon } from 'lucide-svelte';

  type StatRow = {
    label: string;
    value: string;
    accent?: string;
  };

  type ForecastHour = {
    time: string;
    level: number;
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
    stats,
    forecast
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
    forecast?: ForecastHour[];
  } = $props();
</script>

<div class="glass-panel relative h-full overflow-hidden rounded-2xl">
  <!-- Fading glow accent bar -->
  <div
    class="absolute top-4 bottom-4 left-2 rounded-full"
    style="width: 2px; background: {accentColor}; box-shadow: 0 0 6px 1px {accentColor};"
  ></div>

  <div class="flex h-full flex-col p-7 pl-8">
    <div class="mb-6 flex items-center gap-2.5">
      <div class="text-white/60">
        {#if IconComponent}
          <IconComponent size={18} strokeWidth={1.2} />
        {/if}
      </div>
      <span class="text-sm font-medium tracking-[0.18em] text-white/75 uppercase">{title}</span>
    </div>

    {#if hero}
      <div class="mb-3 flex items-baseline justify-between gap-4">
        <div class="flex flex-1 items-baseline gap-2">
          <span class="text-4xl font-extralight tracking-tight text-white tabular-nums">{hero}</span
          >
          {#if heroUnit}
            <span class="text-base font-light {heroAccent ?? 'text-white/45'}">{heroUnit}</span>
          {/if}
        </div>

        {#if HeroIconComponent}
          <span
            class="flex shrink-0 text-white/65 transition-transform"
            style={heroIconRotation !== undefined
              ? `transform: rotate(${heroIconRotation}deg)`
              : ''}
          >
            <HeroIconComponent size={32} strokeWidth={1.2} />
          </span>
        {/if}

        {#if forecast && forecast.length > 0}
          {#if true}
            {@const maxLevel = Math.max(...forecast.map((h) => h.level)) || 1}
            {@const points = forecast.map((h, i) => {
              const x = (i / (forecast.length - 1)) * 160;
              const y = 18 - (h.level / maxLevel) * 14;
              return [x, y];
            })}
            {@const pathData =
              `M ${points[0][0]} ${points[0][1]} ` +
              points
                .slice(1)
                .map((p, i) => {
                  const prev = points[i];
                  const cp1x = prev[0] + (p[0] - prev[0]) / 2;
                  const cp1y = prev[1];
                  const cp2x = prev[0] + (p[0] - prev[0]) / 2;
                  const cp2y = p[1];
                  return `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p[0]} ${p[1]}`;
                })
                .join(' ')}
            <svg
              class="h-5 w-40 shrink-0"
              viewBox="0 0 160 20"
              preserveAspectRatio="none"
              style="opacity: 0.75"
            >
              <defs>
                <linearGradient id="pollenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color: {accentColor}; stop-opacity: 0.25" />
                  <stop offset="100%" style="stop-color: {accentColor}; stop-opacity: 0.02" />
                </linearGradient>
              </defs>
              <!-- Baseline (0 level) -->
              <line
                x1="0"
                y1="18"
                x2="160"
                y2="18"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="1"
                vector-effect="non-scaling-stroke"
              />
              <!-- Area under curve -->
              <path d="{pathData} L 160 18 L 0 18 Z" fill="url(#pollenGradient)" />
              <!-- Curve line -->
              <path
                d={pathData}
                stroke={accentColor}
                stroke-width="1"
                fill="none"
                vector-effect="non-scaling-stroke"
              />
            </svg>
          {/if}
        {/if}
      </div>
    {/if}

    <div class="stat-divider flex flex-col gap-3">
      {#each stats as stat, i (i)}
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-sm tracking-wide text-white/45">{stat.label}</span>
          <span class="text-base font-light tabular-nums {stat.accent ?? 'text-white/80'}"
            >{stat.value}</span
          >
        </div>
      {/each}
    </div>
  </div>
</div>
