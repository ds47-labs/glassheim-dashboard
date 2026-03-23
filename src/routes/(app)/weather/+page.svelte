<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import WeatherCard from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { Sun, Wind, Droplets, Sunrise, Sunset } from 'lucide-svelte';

  const directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

  const uvLevels = [
    { min: 1, max: 2, label: 'Niedrig' },
    { min: 3, max: 5, label: 'Mittel' },
    { min: 6, max: 7, label: 'Hoch' },
    { min: 8, max: 10, label: 'Sehr hoch' },
    { min: 11, max: null, label: 'Extrem' }
  ] as const;

  function uvLevel(uv: number) {
    return uvLevels.find((l) => uv >= l.min && (l.max === null || uv <= l.max)) ?? null;
  }

  function fmtTime(iso: string | undefined): string {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  let pressure  = $derived(ha.getNumericState('sensor.gw2000a_absolute_pressure') ?? '--');
  let windSpeed = $derived(ha.getNumericState('sensor.wind_speed_10min_avg') ?? '--');
  let uv        = $derived(parseFloat(ha.getNumericState('sensor.gw2000a_uv_index', 0) ?? '0'));
  let currentUvLevel = $derived(uvLevel(uv));

  let sunAttrs = $derived(ha.getEntity('sun.sun')?.attributes as Record<string, string> | undefined);
  let sunrise  = $derived(fmtTime(sunAttrs?.next_rising));
  let sunset   = $derived(fmtTime(sunAttrs?.next_setting));

  let todayForecast = $derived(
    (ha.getEntity('sensor.daily_weather_data_openweathermap')?.attributes?.forecast_data as
      | Record<string, unknown>[]
      | undefined)?.[0]
  );
  let rainProb   = $derived(`${Math.round(todayForecast?.precipitation_probability as number)}`);
  let rainAmount = $derived(ha.getState('sensor.gw2000a_daily_rain_piezo') ?? '--');

  let windDir = $derived.by(() => {
    const deg = parseFloat(ha.getState('sensor.gw2000a_wind_direction_10m_avg') ?? '');
    return isNaN(deg) ? '--' : directions[Math.round(deg / 22.5) % 16];
  });
</script>

<WeatherCard showForecast />

<div class="grid shrink-0 grid-cols-3 gap-6">
  <StatCard
    icon={Droplets}
    title="Niederschlag"
    stats={[
      { label: 'Wahrscheinlichkeit', value: `${rainProb} %` },
      { label: 'Menge', value: `${rainAmount} mm` }
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
    title="Sonne & UV"
    stats={[
      { label: 'UV Index', value: currentUvLevel ? `${uv} (${currentUvLevel.label})` : `${uv}` },
      { label: Sunrise, value: sunrise, label2: Sunset, value2: sunset }
    ]}
  />
</div>
