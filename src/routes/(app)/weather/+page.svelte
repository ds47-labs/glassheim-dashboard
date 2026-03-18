<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import WeatherCard, { type ForecastDay } from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { CloudRain, CloudSun, Sun, Moon, Cloud, CloudSnow, CloudLightning, Wind, Droplets, type Component } from 'lucide-svelte';

  const haConditionMap: Record<string, { icon: Component; label: string }> = {
  'sunny':            { icon: Sun,            label: 'Sunny' },
  'clear-night':      { icon: Moon,           label: 'Clear Night' },
  'partlycloudy':     { icon: CloudSun,       label: 'Partly Cloudy' },
  'cloudy':           { icon: Cloud,          label: 'Cloudy' },
  'rainy':            { icon: CloudRain,      label: 'Rain' },
  'pouring':          { icon: CloudRain,      label: 'Heavy Rain' },
  'lightning':        { icon: CloudLightning, label: 'Thunderstorm' },
  'lightning-rainy':  { icon: CloudLightning, label: 'Thunderstorm' },
  'snowy':            { icon: CloudSnow,      label: 'Snow' },
  'snowy-rainy':      { icon: CloudSnow,      label: 'Sleet' },
  'windy':            { icon: Wind,           label: 'Windy' },
  'windy-variant':    { icon: Wind,           label: 'Windy' },
  'fog':              { icon: Cloud,          label: 'Fog' },
  'hail':             { icon: CloudRain,      label: 'Hail' },
  };

  const forecast: ForecastDay[] = [
  { day: 'MON', icon: 'cloudy', high: 18, low: 12, description: 'Cloudy' },
  { day: 'DIE', icon: 'sunny', high: 18, low: 12, description: 'Sunny' },
  { day: 'MIT', icon: 'sunny', high: 16, low: 12, description: 'Cloudy' },
  { day: 'DON', icon: 'rainy', high: 18, low: 12, description: 'Cloudy' },
  { day: 'FRI', icon: 'sunny', high: 16, low: 12, description: 'Sunny' }
  ];

  let temperature = $derived(ha.getNumericState('sensor.gw2000a_outdoor_temperature'));
  let feelsLike = $derived(ha.getNumericState('sensor.gw2000a_feels_like_temperature'));
  let pressure = $derived(ha.getNumericState('sensor.gw2000a_absolute_pressure'));
  let windSpeed = $derived(ha.getNumericState('sensor.wind_speed_average_10min'));

  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  let windDir = $derived.by(() => {
  const deg = parseFloat(ha.getState('sensor.gw2000a_wind_direction_10m_avg'));
  if (isNaN(deg)) return '--';
  return directions[Math.round(deg / 22.5) % 16];
  });

  let weatherCondition = $derived.by(() => {
  const state = ha.getState('weather.forecast_home');
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
  title="Wind & Pressure"
  stats={[
  { label: 'Wind', value: `${windSpeed} km/h ${windDir}` },
  { label: 'Pressure', value: `${pressure} hPa` }
  ]}
  />

  <StatCard
  icon={Sun}
  title="Sun & UV"
  stats={[
  { label: 'UV Index', value: '3 (Moderate)' },
  { label: 'Sunrise', value: '06:15' },
  { label: 'Sunset', value: '19:45' }
  ]}
  />
</div>
