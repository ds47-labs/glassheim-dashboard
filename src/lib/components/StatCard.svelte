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
    value?: number; // 0–1, normalized – falls back to level / 4
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
    heroIconAmplitude,
    stats,
    forecast,
    forecastColors
  }: {
    icon: typeof Icon;
    title: string;
    accentColor?: string;
    hero?: string;
    heroUnit?: string;
    heroAccent?: string;
    heroIcon?: typeof Icon;
    heroIconRotation?: number;
    heroIconAmplitude?: number;
    stats: StatRow[];
    forecast?: ForecastHour[];
    forecastColors?: string[];
  } = $props();

  const defaultForecastColors = [
    'var(--forecast-default-0)',
    'var(--forecast-default-1)',
    'var(--forecast-default-2)',
    'var(--forecast-default-3)',
    'var(--forecast-default-4)'
  ];

  let activeForecastColors = $derived(forecastColors ?? defaultForecastColors);
</script>

<div class="glass-panel relative h-full overflow-hidden rounded-2xl">
  <!-- Fading glow accent bar -->
  <div
    class="absolute top-4 bottom-4 left-2 w-0.5 rounded-full"
    style="background: {accentColor}; box-shadow: 0 0 0.375rem 0.0625rem {accentColor};"
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
          <span class="text-4xl font-extralight tracking-tight text-white tabular-nums">{hero}</span>
          {#if heroUnit}
            <span class="text-base font-light whitespace-nowrap {heroAccent ?? 'text-white/45'}">{heroUnit}</span>
          {/if}
        </div>

        {#if HeroIconComponent}
          <span
            class="flex shrink-0 text-white/65"
            style={heroIconRotation !== undefined ? `transform: rotate(${heroIconRotation}deg)` : ''}
          >
            <span class="flex animate-wind-wobble" style={heroIconAmplitude !== undefined ? `--wind-amp: ${heroIconAmplitude}` : ''}>
              <HeroIconComponent size={32} strokeWidth={1.2} />
            </span>
          </span>
        {/if}
      </div>
    {/if}

    {#if forecast && forecast.length > 0}
      <div class="mb-4">
        <div class="mb-1 flex h-8 items-end gap-0.5" aria-hidden="true">
          {#each forecast as hour, i (i)}
            {@const v = hour.value ?? hour.level / 4}
            <div
              class="flex-1 rounded-sm transition-all"
              style="height: {Math.max(v * 100, 8)}%; background: {activeForecastColors[Math.min(hour.level, 4)]}"
            ></div>
          {/each}
        </div>
        <div class="flex justify-between">
          <span class="text-xs text-white/45 tabular-nums">{new Date(forecast[0].time).getHours().toString().padStart(2, '0')}:00</span>
          <span class="text-xs text-white/45 tabular-nums">{new Date(forecast[Math.floor((forecast.length - 1) / 2)].time).getHours().toString().padStart(2, '0')}:00</span>
          <span class="text-xs text-white/45 tabular-nums">{new Date(forecast[forecast.length - 1].time).getHours().toString().padStart(2, '0')}:00</span>
        </div>
      </div>
    {/if}

    <div class="stat-divider flex flex-col gap-3">
      {#each stats as stat, i (i)}
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-sm tracking-wide text-white/55">{stat.label}</span>
          <span class="text-base font-light tabular-nums {stat.accent ?? 'text-white/80'}"
            >{stat.value}</span
          >
        </div>
      {/each}
    </div>
  </div>
</div>
