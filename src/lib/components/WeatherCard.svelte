<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import {
    Sun,
    Moon,
    CloudSun,
    Cloud,
    CloudRain,
    CloudLightning,
    CloudSnow,
    Wind
  } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  export interface ForecastDay {
    day: string;
    icon: typeof Icon;
    high: number;
    low: number;
    description: string;
  }
  let { showForecast = false }: { showForecast?: boolean } = $props();

  const haConditionMap: Record<string, { icon: typeof Icon; label: string }> = {
    sunny: { icon: Sun, label: 'Sonnig' },
    'clear-night': { icon: Moon, label: 'Klar' },
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

  let todayForecast = $derived(
    (
      ha.getEntity('sensor.daily_weather_data_openweathermap')?.attributes?.forecast_data as
        | Record<string, unknown>[]
        | undefined
    )?.[0]
  );
  let todayHigh = $derived(
    todayForecast ? `${Math.round(todayForecast.temperature as number)}` : '--'
  );
  let todayLow = $derived(todayForecast ? `${Math.round(todayForecast.templow as number)}` : '--');

  let forecast = $derived.by<ForecastDay[]>(() => {
    if (!showForecast) return [];
    const raw = ha.getEntity('sensor.daily_weather_data_openweathermap')?.attributes
      ?.forecast_data as Record<string, unknown>[] | undefined;
    if (!raw?.length) return [];
    return raw.slice(0, 5).map((d) => {
      const condition = haConditionMap[d.condition as string] ?? haConditionMap['partlycloudy'];
      const date = new Date(d.datetime as string);
      const day = date
        .toLocaleDateString('de-DE', { weekday: 'short' })
        .toUpperCase()
        .replace('.', '');
      return {
        day,
        icon: condition.icon,
        high: Math.round(d.temperature as number),
        low: Math.round(d.templow as number),
        description: condition.label
      };
    });
  });
</script>

<div class="glass-panel-elevated animate-fade-up rounded-2xl p-12">
  <div class="flex items-center justify-between gap-4">
    <div class="flex-1">
      <div class="mb-5 flex items-center gap-5">
        <span class="text-sm tracking-[0.2em] text-white/50 uppercase">
          <span class="text-white/80 tabular-nums">{todayHigh}°</span>
          <span class="mx-1.5 text-white/20">/</span>
          <span class="tabular-nums">{todayLow}°</span>
        </span>
      </div>

      <div class="mb-6 flex items-center gap-6">
        {#if weatherCondition.icon}
          {@const ConditionIcon = weatherCondition.icon}
          <div class="text-white/80">
            <ConditionIcon strokeWidth={0.8} class="h-32 w-32" />
          </div>
        {/if}
        <div class="flex flex-col">
          <div class="text-9xl leading-none font-extralight tracking-tight text-white tabular-nums">
            {temperature}<span class="mt-1 inline-block align-top text-4xl font-light text-white/60"
              >°C</span
            >
          </div>
          <div class="mt-2 ml-1 text-sm tracking-[0.15em] text-white/50 uppercase tabular-nums">
            Gefühlt {feelsLike}°C
          </div>
        </div>
      </div>

      <div class="text-2xl font-light tracking-wide text-white/80">{weatherCondition.label}</div>
    </div>

    {#if forecast.length > 0}
      <div class="flex shrink-0 items-stretch gap-3">
        {#each forecast as data, i (data.day)}
          {@const ForecastIcon = data.icon}
          <div
            class="glass-panel flex w-36 flex-col items-center gap-3.5 rounded-xl p-4 transition-all duration-300 hover:bg-white/10"
            style="animation-delay: {i * 60}ms"
          >
            <div class="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              {data.day}
            </div>
            <div class="text-white/70">
              <ForecastIcon size={40} strokeWidth={0.8} />
            </div>
            <div class="text-base font-light text-white tabular-nums">
              {data.high}° <span class="text-white/25">/</span>
              {data.low}°
            </div>
            <div class="text-center text-xs tracking-wider text-white/35 uppercase">
              {data.description}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
