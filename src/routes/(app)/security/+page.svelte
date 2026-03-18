<script lang="ts">
  import WeatherCard from '$lib/components/WeatherCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { Droplets, Wind, Sun } from 'lucide-svelte';
</script>

<WeatherCard />

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
  { label: 'Wind', value: '15 km/h NW' },
  { label: 'Pressure', value: '1012 hPa' }
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
