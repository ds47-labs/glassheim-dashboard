<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import {
    Sun,
    CloudSun,
    Cloud,
    CloudRain,
    CloudLightning,
    CloudSnow,
    Wind,
    ArrowUp,
    ArrowDown
  } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  export interface ForecastDay {
    day: string;
    icon: typeof Icon;
    animation: string;
    high: number;
    low: number;
    description: string;
    bgOpacity: number;
  }
  let { showForecast = false }: { showForecast?: boolean } = $props();

  const haConditionMap: Record<string, { icon: typeof Icon; label: string }> = {
    sunny: { icon: Sun, label: 'Sonnig' },
    'clear-night': { icon: Sun, label: 'Klar' },
    partlycloudy: { icon: CloudSun, label: 'Bewölkt' },
    cloudy: { icon: Cloud, label: 'Überwiegend bewölkt' },
    rainy: { icon: CloudRain, label: 'Regnerisch' },
    pouring: { icon: CloudRain, label: 'Regen' },
    lightning: { icon: CloudLightning, label: 'Gewitter' },
    'lightning-rainy': { icon: CloudLightning, label: 'Gewitter' },
    snowy: { icon: CloudSnow, label: 'Schnee' },
    'snowy-rainy': { icon: CloudSnow, label: 'Glatteis' },
    windy: { icon: Wind, label: 'Windig' },
    'windy-variant': { icon: Wind, label: 'Windig' },
    fog: { icon: Cloud, label: 'Nebel' },
    hail: { icon: CloudRain, label: 'Hagel' }
  };

  let temperature = $derived(ha.getNumericState('sensor.gw2000a_outdoor_temperature') ?? '--');
  let feelsLike = $derived(ha.getNumericState('sensor.gw2000a_feels_like_temperature') ?? '--');

  let weatherCondition = $derived.by(() => {
    const state = ha.getState('sensor.openweathermap_condition');
    return haConditionMap[state ?? ''] ?? { icon: CloudSun, label: state ?? '--' };
  });

let todayHigh = $derived(ha.getState('sensor.weather_temperature_max') ?? '--');
  let todayLow = $derived(ha.getState('sensor.weather_temperature_min') ?? '--');

  let forecast = $derived.by<ForecastDay[]>(() => {
    if (!showForecast) return [];
    const raw = ha.getEntity('sensor.daily_weather_data_openweathermap')?.attributes
      ?.forecast_data as Record<string, unknown>[] | undefined;
    if (!raw?.length) return [];
    return raw.slice(1, 6).map((d) => {
      const condition = haConditionMap[d.condition as string] ?? haConditionMap['partlycloudy'];
      const date = new Date(d.datetime as string);
      const day = date
        .toLocaleDateString('de-DE', { weekday: 'short' })
        .toUpperCase()
        .replace('.', '');
      const isSunny = d.condition === 'sunny' || d.condition === 'clear-night';
      const high = Math.round(d.temperature as number);
      const bgOpacity = parseFloat((0.05 + Math.max(0, Math.min(35, high)) / 35 * 0.18).toFixed(3));
      return {
        day,
        icon: condition.icon,
        animation: isSunny ? 'animate-spin-slow' : '',
        high,
        low: Math.round(d.templow as number),
        description: condition.label,
        bgOpacity
      };
    });
  });
</script>

<div class="glass-panel-elevated rounded-2xl p-10">
  <div class="flex items-center justify-between gap-10">
    <div class="flex-1">
      <div class="mb-8 flex items-end gap-6">
        {#if weatherCondition.icon}
          {@const ConditionIcon = weatherCondition.icon}
          <div class="-mb-4 text-white/60">
            <ConditionIcon strokeWidth={0.6} class="h-64 w-64" />
          </div>
        {/if}
        <div class="flex flex-col pb-4">
          <div class="text-9xl leading-none font-extralight tracking-tight text-white tabular-nums">
            {temperature}<span class="ml-2 text-5xl font-light text-white/55">°C</span>
          </div>
          <div class="mt-6 text-2xl font-light text-white/75">
            {weatherCondition.label}
          </div>
        </div>
      </div>

      <div class="ml-5 flex items-center gap-5 text-lg font-light text-white/55">
        <span>Gefühlt</span>
        <span class="text-white/70 tabular-nums">{feelsLike} °C</span>
        <span class="text-white/20">·</span>
        <span class="flex items-center gap-2 tabular-nums">
          <span class="flex items-center gap-1">
            <ArrowUp size={16} strokeWidth={2} class="text-white/50" />
            <span class="text-white/70">{todayHigh} °C</span>
          </span>
          <span class="text-white/25">/</span>
          <span class="flex items-center gap-1">
            <ArrowDown size={16} strokeWidth={2} class="text-white/50" />
            <span class="text-white/55">{todayLow} °C</span>
          </span>
        </span>
      </div>
    </div>

    {#if forecast.length > 0}
      <div class="flex shrink-0 items-stretch gap-3">
        {#each forecast as data, i (data.day)}
          {@const ForecastIcon = data.icon}
          <div
            class="forecast-card flex w-36 flex-col items-center justify-center gap-4 rounded-xl p-5"
            style="background: oklch(0.82 0.035 50 / {data.bgOpacity});"
          >
            <div class="text-sm font-medium tracking-[0.18em] text-white/80 uppercase">
              {data.day}
            </div>
            <div
              class="{data.animation} text-white/75"
              style="animation-delay: {i * 400}ms"
            >
              <ForecastIcon size={40} strokeWidth={0.85} />
            </div>
            <div class="flex flex-col items-center gap-2 text-center">
              <div class="text-base font-light text-white tabular-nums">
                <span class="font-extralight">{data.high}</span><span class="text-white/35">°</span>
                <span class="text-white/30">/</span>
                <span class="text-white/55">{data.low}°</span>
              </div>
              <div class="text-sm font-light tracking-wider text-white/50">
                {data.description}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
