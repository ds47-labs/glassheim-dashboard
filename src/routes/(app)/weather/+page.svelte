<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import WeatherCard, { type ForecastDay } from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';

  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  const haConditionMap: Record<string, { icon: string; label: string }> = {
  'sunny':            { icon: 'lucide:sun',              label: 'Sonnig' },
  'clear-night':      { icon: 'lucide:moon',             label: 'Klar' },
  'partlycloudy':     { icon: 'lucide:cloud-sun',        label: 'Bewölkt' },
  'cloudy':           { icon: 'lucide:cloud',            label: 'Überwiegend bewölkt' },
  'rainy':            { icon: 'lucide:cloud-rain',       label: 'Regnerisch' },
  'pouring':          { icon: 'lucide:cloud-rain',       label: 'Regen' },
  'lightning':        { icon: 'lucide:cloud-lightning',  label: 'Gewitter' },
  'lightning-rainy':  { icon: 'lucide:cloud-lightning',  label: 'Gewitter' },
  'snowy':            { icon: 'lucide:cloud-snow',       label: 'Schnee' },
  'snowy-rainy':      { icon: 'lucide:cloud-snow',       label: 'Glatteis' },
  'windy':            { icon: 'lucide:wind',             label: 'Windig' },
  'windy-variant':    { icon: 'lucide:wind',             label: 'Windig' },
  'fog':              { icon: 'lucide:cloud',            label: 'Nebel' },
  'hail':             { icon: 'lucide:cloud-rain',       label: 'Hagel' },
  };

  const forecast: ForecastDay[] = [
  { day: 'MON', icon: 'lucide:cloud',     high: 18, low: 12, description: 'Cloudy' },
  { day: 'DIE', icon: 'lucide:sun',       high: 18, low: 12, description: 'Sunny' },
  { day: 'MIT', icon: 'lucide:sun',       high: 16, low: 12, description: 'Cloudy' },
  { day: 'DON', icon: 'lucide:cloud-rain',high: 18, low: 12, description: 'Cloudy' },
  { day: 'FRI', icon: 'lucide:sun',       high: 16, low: 12, description: 'Sunny' }
  ];

  let temperature = $derived(ha.getNumericState('sensor.gw2000a_outdoor_temperature'));
  let feelsLike = $derived(ha.getNumericState('sensor.gw2000a_feels_like_temperature'));
  let pressure = $derived(ha.getNumericState('sensor.gw2000a_absolute_pressure'));
  let windSpeed = $derived(ha.getNumericState('sensor.wind_speed_10min_avg'));

  let windDir = $derived.by(() => {
  const deg = parseFloat(ha.getState('sensor.gw2000a_wind_direction_10m_avg'));
  if (isNaN(deg)) return '--';
  return directions[Math.round(deg / 22.5) % 16];
  });

  let weatherCondition = $derived.by(() => {
  const state = ha.getState('sensor.openweathermap_condition');
  return haConditionMap[state] ?? { icon: 'lucide:cloud-sun', label: state };
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
  icon="lucide:droplets"
  title="Precipitation"
  stats={[
  { label: 'Chance of Rain', value: '60%' },
  { label: 'Total', value: '5mm' }
  ]}
  />

  <StatCard
  icon="lucide:wind"
  title="Wind & Druck"
  stats={[
  { label: 'Wind', value: `${windSpeed} km/h ${windDir}` },
  { label: 'Druck', value: `${pressure} hPa` }
  ]}
  />

  <StatCard
  icon="lucide:sun"
  title="Sun & UV"
  stats={[
  { label: 'UV Index', value: '3 (Moderate)' },
  { label: 'Sunrise', value: '06:15' },
  { label: 'Sunset', value: '19:45' }
  ]}
  />
</div>
