<script lang="ts">
	import background from '$lib/assets/weather-bg.jpg';

	import Header from '$lib/components/Header.svelte';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';

	import { Droplets, Wind, Sun } from 'lucide-svelte';

	let activeTab = $state('Weather');
</script>

<div style:background-image="url({background})" class="h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden">
	<div class="h-full w-full bg-black/30 flex flex-col">
		<Header activeTab={activeTab} />

		<main class="flex-1 px-16 py-8 flex flex-col gap-6 justify-center">
			<WeatherCard />

			<!-- Bottom Stats -->
			<div class="flex gap-6 shrink-0">
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
		</main>
	</div>
</div>