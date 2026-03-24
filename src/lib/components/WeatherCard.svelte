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

<div class="glass-panel-elevated rounded-2xl p-10">
  <div class="flex items-center justify-between gap-10">
    <div class="flex-1">
      <div class="mb-8 flex items-end gap-8">
        {#if weatherCondition.icon}
          {@const ConditionIcon = weatherCondition.icon}
          <div class="text-white/75">
            <ConditionIcon strokeWidth={0.75} class="h-28 w-28" />
          </div>
        {/if}
        <div class="flex flex-col pb-2">
          <div class="text-9xl leading-none font-extralight tracking-tight text-white tabular-nums">
            {temperature}<span class="text-4xl font-light text-white/55 ml-2">°C</span>
          </div>
          <div class="mt-4 text-2xl font-light text-white/75">
            {weatherCondition.label}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-5 text-sm font-light text-white/55">
        <span>Gefühlt <span class="text-white/70 tabular-nums">{feelsLike}°C</span></span>
        <span class="text-white/20">·</span>
        <span class="tabular-nums"
          ><span class="text-white/70">{todayHigh}°</span>
          <span class="text-white/25 mx-2">/</span><span class="text-white/55">{todayLow}°</span></span
        >
      </div>
    </div>

    {#if forecast.length > 0}
      <div class="flex shrink-0 items-stretch gap-3">
        {#each forecast as data, i (data.day)}
          {@const ForecastIcon = data.icon}
          <div
            class="forecast-card flex w-36 flex-col items-center justify-center gap-4 rounded-xl p-5"
          >
            <div class="text-xs font-medium tracking-[0.18em] text-white/80 uppercase">
              {data.day}
            </div>
            <div class="text-white/75">
              <ForecastIcon size={40} strokeWidth={0.85} />
            </div>
            <div class="flex flex-col items-center gap-2 text-center">
              <div class="text-base font-light text-white tabular-nums">
                <span class="font-extralight">{data.high}</span><span class="text-white/35">°</span>
                <span class="text-white/30">/</span>
                <span class="text-white/55">{data.low}°</span>
              </div>
              <div class="text-xs tracking-wider text-white/50 font-light">
                {data.description}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
