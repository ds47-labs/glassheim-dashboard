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

  export interface PollenEntry {
    name: string;
    level: number;
    levelName: string;
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

  const pollenSensors: { sensor: string; name: string }[] = [
    { sensor: 'sensor.polleninformation_hamavil_alder', name: 'Erle' },
    { sensor: 'sensor.polleninformation_hamavil_birch', name: 'Birke' },
    { sensor: 'sensor.polleninformation_hamavil_cypress_family', name: 'Zypresse' },
    { sensor: 'sensor.polleninformation_hamavil_esche', name: 'Esche' },
    { sensor: 'sensor.polleninformation_hamavil_fungal_spores', name: 'Pilzsporen' },
    { sensor: 'sensor.polleninformation_hamavil_grasses', name: 'Gräser' },
    { sensor: 'sensor.polleninformation_hamavil_hazel', name: 'Hasel' },
    { sensor: 'sensor.polleninformation_hamavil_mugwort', name: 'Beifuß' },
    { sensor: 'sensor.polleninformation_hamavil_nettle_family', name: 'Nessel' },
    { sensor: 'sensor.polleninformation_hamavil_olive', name: 'Ölbaum' },
    { sensor: 'sensor.polleninformation_hamavil_plane_tree', name: 'Platane' },
    { sensor: 'sensor.polleninformation_hamavil_ragweed', name: 'Ragweed' },
    { sensor: 'sensor.polleninformation_hamavil_rye', name: 'Roggen' }
  ];

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

  let pollen = $derived.by<PollenEntry[]>(() =>
    pollenSensors
      .map(({ sensor, name }) => ({
        name,
        level: (ha.getEntity(sensor)?.attributes?.numeric_state as number) ?? 0,
        levelName: ha.getState(sensor) ?? 'keine Belastung'
      }))
      .filter((e) => e.level > 0)
      .sort((a, b) => b.level - a.level)
  );

  let pollenOpen = $state(false);

  let highAllergens = $derived(pollen.filter((p) => p.level >= 3));
  let topMaessig = $derived(pollen.find((p) => p.level === 2) ?? null);
  let buttonAllergens = $derived(
    highAllergens.length > 0 ? highAllergens : topMaessig ? [topMaessig] : []
  );

  function levelColor(level: number): string {
    if (level >= 4) return 'text-red-400';
    if (level === 3) return 'text-orange-400';
    if (level === 2) return 'text-yellow-400';
    if (level === 1) return 'text-green-400';
    return 'text-white/40';
  }
  function levelDot(level: number): string {
    if (level >= 4) return 'bg-red-400';
    if (level === 3) return 'bg-orange-400';
    if (level === 2) return 'bg-yellow-400';
    if (level === 1) return 'bg-green-400';
    return 'bg-white/30';
  }
</script>

<div class="rounded-3xl border border-white/20 bg-white/10 p-16 shadow-2xl backdrop-blur-2xl">
  <div class="flex items-center justify-between gap-4">
    <div class="flex-1">
      <div class="mb-6 flex items-center gap-6">
        <span class="text-sm tracking-widest text-white/60 uppercase">
          <span class="text-white/90 tabular-nums">{todayHigh}°</span>
          <span class="mx-1 text-white/30">/</span>
          <span class="tabular-nums">{todayLow}°</span>
        </span>

        {#if buttonAllergens.length > 0}
          <div class="relative">
            <button
              onclick={() => (pollenOpen = !pollenOpen)}
              class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm backdrop-blur-xl transition-colors hover:bg-white/10"
            >
              <span class="h-2 w-2 rounded-full {levelDot(buttonAllergens[0].level)}"></span>
              {#each buttonAllergens as a, i (a.name)}
                {#if i > 0}<span class="text-white/30">,</span>{/if}
                <span class="text-white/80">{a.name}</span>
              {/each}
              <span class={levelColor(buttonAllergens[0].level)}
                >{buttonAllergens[0].levelName}</span
              >
            </button>

            {#if pollenOpen}
              <div
                class="absolute top-full left-0 z-10 mt-2 min-w-52 rounded-2xl border border-white/15 bg-black/70 p-3 backdrop-blur-xl"
              >
                <div class="mb-2 text-xs font-semibold tracking-widest text-white/40 uppercase">
                  Pollenflug heute
                </div>
                <div class="flex flex-col gap-1.5">
                  {#each pollen as entry (entry.name)}
                    <div class="flex items-center justify-between gap-6">
                      <span class="text-sm text-white/70">{entry.name}</span>
                      <div class="flex items-center gap-1.5">
                        <span class="h-1.5 w-1.5 rounded-full {levelDot(entry.level)}"></span>
                        <span class="w-24 text-right text-xs {levelColor(entry.level)}"
                          >{entry.levelName}</span
                        >
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="mb-8 flex items-center gap-8">
        {#if weatherCondition.icon}
          {@const ConditionIcon = weatherCondition.icon}
          <ConditionIcon strokeWidth={1} class="h-36 w-36 text-white" />
        {/if}
        <div class="flex flex-col">
          <div
            class="text-9xl leading-none font-extralight tracking-tighter text-white tabular-nums"
          >
            {temperature}<span class="mt-2 inline-block align-top text-5xl text-white/90">°C</span>
          </div>
          <div class="mt-2 ml-2 text-sm tracking-widest text-white/80 uppercase tabular-nums">
            Gefühlt {feelsLike}°C
          </div>
        </div>
      </div>

      <div class="text-2xl font-light tracking-wide text-white/90">{weatherCondition.label}</div>
    </div>

    {#if forecast.length > 0}
      <div class="flex shrink-0 items-stretch gap-4">
        {#each forecast as data (data.day)}
          {@const ForecastIcon = data.icon}
          <div
            class="flex w-40 flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div class="text-sm font-bold tracking-widest text-white/50 uppercase">{data.day}</div>
            <div class="text-white/90">
              <ForecastIcon size={48} strokeWidth={1} />
            </div>
            <div class="text-md font-medium text-white tabular-nums">
              {data.high}° <span class="opacity-30">/</span>
              {data.low}°
            </div>
            <div class="text-center text-xs font-medium tracking-wider text-white/40 uppercase">
              {data.description}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
