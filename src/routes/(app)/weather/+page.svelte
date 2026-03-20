<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import WeatherCard, { type ForecastDay } from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import {
    Sun, Moon, CloudSun, Cloud, CloudRain, CloudLightning, CloudSnow, Wind,
    Droplets, Sunrise, Sunset
  } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  const haConditionMap: Record<string, { icon: typeof Icon; label: string }> = {
  'sunny':            { icon: Sun,              label: 'Sonnig' },
  'clear-night':      { icon: Moon,             label: 'Klar' },
  'partlycloudy':     { icon: CloudSun,         label: 'Bewölkt' },
  'cloudy':           { icon: Cloud,            label: 'Überwiegend bewölkt' },
  'rainy':            { icon: CloudRain,        label: 'Regnerisch' },
  'pouring':          { icon: CloudRain,        label: 'Regen' },
  'lightning':        { icon: CloudLightning,   label: 'Gewitter' },
  'lightning-rainy':  { icon: CloudLightning,   label: 'Gewitter' },
  'snowy':            { icon: CloudSnow,        label: 'Schnee' },
  'snowy-rainy':      { icon: CloudSnow,        label: 'Glatteis' },
  'windy':            { icon: Wind,             label: 'Windig' },
  'windy-variant':    { icon: Wind,             label: 'Windig' },
  'fog':              { icon: Cloud,            label: 'Nebel' },
  'hail':             { icon: CloudRain,        label: 'Hagel' },
  };

  const uvLevels = [
    { min: 1,  max: 2,    label: 'Niedrig'       },
    { min: 3,  max: 5,    label: 'Mittel'  },
    { min: 6,  max: 7,    label: 'Hoch'      },
    { min: 8,  max: 10,   label: 'Sehr hoch' },
    { min: 11, max: null, label: 'Extrem'   },
  ] as const;

  function uvLevel(uv: number) {
    return uvLevels.find(l => uv >= l.min && (l.max === null || uv <= l.max)) ?? null;
  }

  let forecast = $derived.by<ForecastDay[]>(() => {
    const raw = ha.getEntity('sensor.daily_weather_data_openweathermap')?.attributes?.forecast_data as Record<string, unknown>[] | undefined;
    if (!raw?.length) 
      return [];
    
    return raw.slice(0, 5).map(d => {
      const condition = haConditionMap[d.condition as string] ?? haConditionMap['partlycloudy'];
      const date = new Date(d.datetime as string);
      const day = date.toLocaleDateString('de-DE', { weekday: 'short' }).toUpperCase().replace('.', '');
      return {
        day,
        icon: condition.icon,
        high: Math.round(d.temperature as number),
        low:  Math.round(d.templow as number),
        description: condition.label,
      };
    });
  });

  let temperature = $derived(ha.getNumericState('sensor.gw2000a_outdoor_temperature'));
  let feelsLike = $derived(ha.getNumericState('sensor.gw2000a_feels_like_temperature'));
  let pressure = $derived(ha.getNumericState('sensor.gw2000a_absolute_pressure'));
  let windSpeed = $derived(ha.getNumericState('sensor.wind_speed_10min_avg'));

  let uv = $derived(parseFloat(ha.getState('sensor.gw2000a_uv_index', '0')));
  let currentUvLevel = $derived(uvLevel(uv));

  function fmtTime(iso: string | undefined): string {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  let sunAttrs    = $derived(ha.getEntity('sun.sun')?.attributes as Record<string, string> | undefined);
  let sunrise     = $derived(fmtTime(sunAttrs?.next_rising));
  let sunset      = $derived(fmtTime(sunAttrs?.next_setting));

  let todayForecast = $derived(
    (ha.getEntity('sensor.daily_weather_data_openweathermap')?.attributes?.forecast_data as Record<string, unknown>[] | undefined)?.[0]
  );
  let rainProb   = $derived(todayForecast ? `${Math.round(todayForecast.precipitation_probability as number)}%` : '--');
  let rainAmount = $derived(todayForecast ? `${(todayForecast.precipitation as number).toFixed(1)} mm` : '--');

  let windDir = $derived.by(() => {
  const deg = parseFloat(ha.getState('sensor.gw2000a_wind_direction_10m_avg'));
  if (isNaN(deg)) return '--';
  return directions[Math.round(deg / 22.5) % 16];
  });

  let weatherCondition = $derived.by(() => {
  const state = ha.getState('sensor.openweathermap_condition');
  return haConditionMap[state] ?? { icon: CloudSun, label: state };
  });
</script>

<WeatherCard
  {temperature}
  condition={weatherCondition.label}
  conditionIcon={weatherCondition.icon}
  {feelsLike}
  {forecast}
/>

<div class="grid grid-cols-3 gap-6 shrink-0">
  <StatCard
    icon={Droplets}
    title="Niederschlag"
    stats={[
      { label: 'Wahrscheinlichkeit', value: rainProb },
      { label: 'Menge', value: rainAmount },
    ]}
  />

  <StatCard
    icon={Wind}
    title="Wind & Druck"
    stats={[
      { label: 'Wind', value: `${windSpeed} km/h ${windDir}` },
      { label: 'Druck', value: `${pressure} hPa` },
    ]}
  />

  <StatCard
    icon={Sun}
    title="Sonne & UV"
    stats={[
      { label: 'UV Index', value: currentUvLevel ? `${uv} (${currentUvLevel.label})` : `${uv}` },
      { label: Sunrise, value: sunrise, label2: Sunset, value2: sunset },
    ]}
  />
</div>
