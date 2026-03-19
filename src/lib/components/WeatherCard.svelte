<script lang="ts">
  import type { Icon } from 'lucide-svelte';

  export interface ForecastDay {
    day: string;
    icon: typeof Icon;
    high: number;
    low: number;
    description: string;
  }

  let {
    temperature,
    condition,
    conditionIcon: ConditionIcon,
    feelsLike,
    forecast
  }: {
    temperature: string;
    condition: string;
    conditionIcon?: typeof Icon;
    feelsLike: string;
    forecast: ForecastDay[];
  } = $props();
</script>

<div class="backdrop-blur-2xl bg-white/10 rounded-3xl p-16 border border-white/20 shadow-2xl">
  <div class="flex items-center justify-between gap-10">

    <div class="flex-1">
      <div class="text-white/80 mb-6 uppercase">AIR QUALITY - POOR</div>
      <div class="flex items-center gap-8 mb-8">
        {#if ConditionIcon}
          <ConditionIcon strokeWidth={1} class="w-36 h-36 text-white" />
        {/if}
        <div class="flex flex-col">
          <div class="text-9xl font-extralight leading-none tracking-tighter text-white tabular-nums">
            {temperature}<span class="text-5xl text-white/90 align-top inline-block mt-2">°C</span>
          </div>
          <div class="text-white/80 mt-2 ml-2 uppercase text-sm tracking-widest tabular-nums">Feels like {feelsLike}°C</div>
        </div>
      </div>
      <div class="text-2xl font-light tracking-wide text-white/90">{condition}</div>
    </div>

    <div class="flex gap-4 items-center shrink-0">
      {#each forecast as data (data.day)}
        {@const ForecastIcon = data.icon}
        <div class="flex w-30 flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div class="text-sm font-bold tracking-widest text-white/50 uppercase">{data.day}</div>

          <div class="text-white/90">
            <ForecastIcon size={48} strokeWidth={1} />
          </div>

          <div class="text-md font-medium text-white tabular-nums">
            {data.high}° <span class="opacity-30">/</span> {data.low}°
          </div>

          <div class="text-xs font-medium tracking-wider text-white/40 uppercase">
            {data.description}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
