<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import WeatherCard, { type ForecastDay } from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import {
    Sun, Moon, CloudSun, Cloud, CloudRain, CloudLightning, CloudSnow, Wind,
    Droplets
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
    { min: 1,  max: 2,    label: 'Low'       },
    { min: 3,  max: 5,    label: 'Moderate'  },
    { min: 6,  max: 7,    label: 'High'      },
    { min: 8,  max: 10,   label: 'Very High' },
    { min: 11, max: null, label: 'Extreme'   },
  ] as const;

  function uvLevel(uv: number) {
    return uvLevels.find(l => uv >= l.min && (l.max === null || uv <= l.max)) ?? null;
  }

  const forecast: ForecastDay[] = [
  { day: 'MON', icon: Cloud,     high: 18, low: 12, description: 'Cloudy' },
  { day: 'DIE', icon: Sun,       high: 18, low: 12, description: 'Sunny' },
  { day: 'MIT', icon: Sun,       high: 16, low: 12, description: 'Cloudy' },
  { day: 'DON', icon: CloudRain, high: 18, low: 12, description: 'Cloudy' },
  { day: 'FRI', icon: Sun,       high: 16, low: 12, description: 'Sunny' }
  ];

  let temperature = $derived(ha.getNumericState('sensor.gw2000a_outdoor_temperature'));
  let feelsLike = $derived(ha.getNumericState('sensor.gw2000a_feels_like_temperature'));
  let pressure = $derived(ha.getNumericState('sensor.gw2000a_absolute_pressure'));
  let windSpeed = $derived(ha.getNumericState('sensor.wind_speed_10min_avg'));

  let uv = $derived(parseFloat(ha.getState('sensor.gw2000a_uv_index', '0')));
  let currentUvLevel = $derived(uvLevel(uv));

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
  title="Precipitation"
  stats={[
  { label: 'Chance of Rain', value: '60%' },
  { label: 'Total', value: '5mm' }
  ]}
  />

  <StatCard
  icon={Wind}
  title="Wind & Druck"
  stats={[
  { label: 'Wind', value: `${windSpeed} km/h ${windDir}` },
  { label: 'Druck', value: `${pressure} hPa` }
  ]}
  />

  <StatCard
    icon={Sun}
    title="Sun & UV"
    stats={[
      { label: 'UV Index', value: currentUvLevel ? `${uv} (${currentUvLevel.label})` : `${uv}` },
      { label: 'Sunrise', value: '06:15' },
      { label: 'Sunset', value: '19:45' }
    ]}
  />
</div>
