<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import WeatherCard from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { Sun, Wind, Droplets, Flower2 } from 'lucide-svelte';

  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];

  const uvLevels = [
    { min: 1, max: 2, label: 'Niedrig', color: 'text-green-400' },
    { min: 3, max: 5, label: 'Mittel', color: 'text-yellow-400' },
    { min: 6, max: 7, label: 'Hoch', color: 'text-orange-400' },
    { min: 8, max: 10, label: 'Sehr hoch', color: 'text-red-400' },
    { min: 11, max: null, label: 'Extrem', color: 'text-red-500' }
  ] as const;

  function uvLevel(uv: number) {
    return uvLevels.find((l) => uv >= l.min && (l.max === null || uv <= l.max)) ?? null;
  }

  function fmtTime(iso: string | undefined): string {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  // Niederschlag
  let todayForecast = $derived(
    (
      ha.getEntity('sensor.daily_weather_data_openweathermap')?.attributes?.forecast_data as
        | Record<string, unknown>[]
        | undefined
    )?.[0]
  );
  let rainProb = $derived(Math.round(todayForecast?.precipitation_probability as number));
  let rainAmount = $derived(ha.getState('sensor.gw2000a_daily_rain_piezo') ?? '--');
  let humidity = $derived(ha.getNumericState('sensor.gw2000a_outdoor_humidity', 0) ?? '--');
  let dewPoint = $derived(ha.getNumericState('sensor.gw2000a_dew_point') ?? '--');

  // Wind & Druck
  let pressure = $derived(ha.getNumericState('sensor.gw2000a_absolute_pressure') ?? '--');
  let windSpeed = $derived(ha.getNumericState('sensor.wind_speed_10min_avg') ?? '--');
  let windGust = $derived(ha.getNumericState('sensor.gw2000a_wind_gust') ?? '--');
  let windDir = $derived.by(() => {
    const deg = parseFloat(ha.getState('sensor.gw2000a_wind_direction_10m_avg') ?? '');
    return isNaN(deg) ? '--' : directions[Math.round(deg / 22.5) % 16];
  });

  // Sonne & UV
  let uv = $derived(parseFloat(ha.getNumericState('sensor.gw2000a_uv_index', 0) ?? '0'));
  let currentUvLevel = $derived(uvLevel(uv));
  let sunAttrs = $derived(
    ha.getEntity('sun.sun')?.attributes as Record<string, string> | undefined
  );
  let sunrise = $derived(fmtTime(sunAttrs?.next_rising));
  let sunset = $derived(fmtTime(sunAttrs?.next_setting));

  // Pollen
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

  let pollen = $derived.by(() =>
    pollenSensors
      .map(({ sensor, name }) => ({
        name,
        level: (ha.getEntity(sensor)?.attributes?.numeric_state as number) ?? 0,
        levelName: ha.getState(sensor) ?? 'keine Belastung'
      }))
      .filter((e) => e.level > 0)
      .sort((a, b) => b.level - a.level)
  );

  function levelColor(level: number): string {
    if (level >= 4) return 'text-red-400';
    if (level === 3) return 'text-amber-400';
    if (level === 2) return 'text-yellow-400';
    if (level === 1) return 'text-green-400';
    return 'text-white/40';
  }

  let pollenHeroCount = $derived(pollen.filter((p) => p.level >= 3).length);
  let pollenHeroAccent = $derived(
    pollen.length === 0 ? 'rgba(74,222,128,0.5)' :
    pollen[0]?.level >= 4 ? 'rgba(248,113,113,0.7)' :
    pollen[0]?.level >= 3 ? 'rgba(251,191,36,0.7)' :
    'rgba(74,222,128,0.5)'
  );
</script>

<WeatherCard showForecast />

<div class="grid shrink-0 grid-cols-4 gap-4">
  <div style="animation-delay: 80ms" class="animate-fade-up">
    <StatCard
      icon={Droplets}
      title="Niederschlag"
      accentColor="rgba(96,165,250,0.5)"
      hero={`${rainProb}`}
      heroUnit="%"
      stats={[
        { label: 'Tagesmenge', value: `${rainAmount} mm` },
        { label: 'Luftfeuchtigkeit', value: `${humidity} %` },
        { label: 'Taupunkt', value: `${dewPoint} °C` }
      ]}
    />
  </div>

  <div style="animation-delay: 150ms" class="animate-fade-up">
    <StatCard
      icon={Wind}
      title="Wind & Druck"
      accentColor="rgba(148,163,184,0.5)"
      hero={windSpeed}
      heroUnit={`km/h ${windDir}`}
      stats={[
        { label: 'Böen', value: `${windGust} km/h` },
        { label: 'Luftdruck', value: `${pressure} hPa` }
      ]}
    />
  </div>

  <div style="animation-delay: 220ms" class="animate-fade-up">
    <StatCard
      icon={Sun}
      title="Sonne & UV"
      accentColor="rgba(250,204,21,0.5)"
      hero={`${uv}`}
      heroUnit={currentUvLevel?.label ?? ''}
      stats={[
        { label: 'Sonnenaufgang', value: sunrise },
        { label: 'Sonnenuntergang', value: sunset }
      ]}
    />
  </div>

  <div style="animation-delay: 290ms" class="animate-fade-up">
    <StatCard
      icon={Flower2}
      title="Pollenflug"
      accentColor={pollenHeroAccent}
      hero={pollen.length > 0 ? `${pollenHeroCount}` : '0'}
      heroUnit={pollenHeroCount === 1 ? 'Allergen' : 'Allergene'}
      stats={pollen.length > 0
        ? pollen.map((entry) => ({
            label: entry.name,
            value: entry.levelName,
            accent: levelColor(entry.level)
          }))
        : [{ label: 'Status', value: 'Keine Belastung' }]}
    />
  </div>
</div>
