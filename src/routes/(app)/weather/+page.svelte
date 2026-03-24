<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import WeatherCard from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { Sun, Wind, Droplets, Flower2, Navigation } from 'lucide-svelte';

  const uvLevels = [
    { min: 0, max: 0, label: 'Keine', color: 'text-white/35', accentVar: '--accent-uv-none' },
    {
      min: 1,
      max: 2,
      label: 'Niedrig',
      color: 'text-green-400',
      accentVar: '--accent-uv-low'
    },
    {
      min: 3,
      max: 5,
      label: 'Mittel',
      color: 'text-yellow-400',
      accentVar: '--accent-uv-mid'
    },
    { min: 6, max: 7, label: 'Hoch', color: 'text-orange-400', accentVar: '--accent-uv-high' },
    {
      min: 8,
      max: 10,
      label: 'Sehr hoch',
      color: 'text-red-400',
      accentVar: '--accent-uv-very-high'
    },
    {
      min: 11,
      max: null,
      label: 'Extrem',
      color: 'text-red-500',
      accentVar: '--accent-uv-extreme'
    }
  ] as const;

  function uvLevel(uv: number) {
    return uvLevels.find((l) => uv >= l.min && (l.max === null || uv <= l.max)) ?? null;
  }

  const pollenLevels = [
    { level: 0, textColor: 'text-white/40', accentVar: '--accent-pollen-low' },
    { level: 1, textColor: 'text-green-400', accentVar: '--accent-pollen-low' },
    { level: 2, textColor: 'text-yellow-400', accentVar: '--accent-pollen-mid1' },
    { level: 3, textColor: 'text-amber-400', accentVar: '--accent-pollen-mid2' },
    { level: 4, textColor: 'text-red-400', accentVar: '--accent-pollen-high' }
  ] as const;

  function getPollenLevelStyle(level: number) {
    return pollenLevels.find((p) => p.level === level) ?? pollenLevels[pollenLevels.length - 1];
  }

  function fmtTime(iso: string | undefined): string {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  let actualRainRate = $derived(ha.getState('sensor.gw2000a_rain_rate_piezo') ?? '--');
  let isRaining = $derived(ha.getState('binary_sensor.gw2000a_rain_state_piezo'));
  let dailyRainRate = $derived(ha.getState('sensor.gw2000a_daily_rain_piezo') ?? '--');
  let humidity = $derived(ha.getNumericState('sensor.gw2000a_humidity', 0) ?? '--');
  let dewPoint = $derived(ha.getNumericState('sensor.gw2000a_dewpoint') ?? '--');

  let pressure = $derived(ha.getNumericState('sensor.gw2000a_absolute_pressure') ?? '--');
  let windSpeed = $derived(ha.getNumericState('sensor.wind_speed_10min_avg') ?? '--');
  let windGust = $derived(ha.getNumericState('sensor.gw2000a_wind_gust') ?? '--');
  let windDeg = $derived.by(() => {
    const deg = parseFloat(ha.getState('sensor.gw2000a_wind_direction_10m_avg') ?? '');
    return isNaN(deg) ? null : deg;
  });

  let uv = $derived(parseFloat(ha.getNumericState('sensor.gw2000a_uv_index', 0) ?? '0'));
  let currentUvLevel = $derived(uvLevel(uv));
  let sunAttrs = $derived(
    ha.getEntity('sun.sun')?.attributes as Record<string, string> | undefined
  );
  let sunrise = $derived(fmtTime(sunAttrs?.next_rising));
  let sunset = $derived(fmtTime(sunAttrs?.next_setting));

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

  let pollenActive = $derived(pollen.length);
  let pollenTopName = $derived(pollen[0]?.name ?? '');
  let pollenHeroUnit = $derived.by(() => {
    if (pollenActive === 0) return 'Allergene';
    if (pollenActive === 1) return pollenTopName;
    return `aktiv · ${pollenTopName}`;
  });
  let pollenHeroLevel = $derived(pollen[0]?.level ?? 0);
  let pollenLevelStyle = $derived(getPollenLevelStyle(pollenHeroLevel));
  let pollenHeroAccentColor = $derived(`var(${pollenLevelStyle.accentVar})`);
  let pollenHeroTextColor = $derived(pollenLevelStyle.textColor);
</script>

<WeatherCard showForecast />

<div class="grid shrink-0 grid-cols-4 gap-3.5">
  <div style="animation-delay: 80ms">
    <StatCard
      icon={Droplets}
      title="Niederschlag"
      accentColor="var(--accent-rain)"
      hero={`${actualRainRate}`}
      heroUnit={isRaining === 'on' ? 'mm' : 'Keiner'}
      stats={[
        { label: 'Tagesmenge', value: `${dailyRainRate} mm` },
        { label: 'Luftfeuchtigkeit', value: `${humidity} %` },
        { label: 'Taupunkt', value: `${dewPoint} °C` }
      ]}
    />
  </div>

  <div style="animation-delay: 150ms">
    <StatCard
      icon={Wind}
      title="Wind & Druck"
      accentColor="var(--accent-wind)"
      hero={windSpeed}
      heroUnit="km/h"
      heroIcon={Navigation}
      heroIconRotation={windDeg !== null ? windDeg + 180 : undefined}
      stats={[
        { label: 'Böen', value: `${windGust} km/h` },
        { label: 'Luftdruck', value: `${pressure} hPa` }
      ]}
    />
  </div>

  <div style="animation-delay: 220ms">
    <StatCard
      icon={Sun}
      title="Sonne & UV"
      accentColor={currentUvLevel?.accentVar
        ? `var(${currentUvLevel.accentVar})`
        : 'var(--accent-uv-mid)'}
      hero={`${uv}`}
      heroUnit={currentUvLevel?.label ?? ''}
      heroAccent={currentUvLevel?.color}
      stats={[
        { label: 'Sonnenaufgang', value: sunrise },
        { label: 'Sonnenuntergang', value: sunset }
      ]}
    />
  </div>

  <div style="animation-delay: 290ms">
    <StatCard
      icon={Flower2}
      title="Pollenflug"
      accentColor={pollenHeroAccentColor}
      hero={`${pollenActive}`}
      heroUnit={pollenHeroUnit}
      heroAccent={pollenHeroTextColor}
      stats={pollen.slice(0, 3).map((entry) => ({
        label: entry.name,
        value: entry.levelName,
        accent: getPollenLevelStyle(entry.level).textColor
      }))}
    />
  </div>
</div>
