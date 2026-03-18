<script lang="ts">
	import { CloudRain, CloudSun, Sun, Cloud } from 'lucide-svelte';

	interface ForecastDay {
		day: string;
		icon: 'cloudy' | 'sunny' | 'rainy';
		high: number;
		low: number;
		description: string;
	}

	const forecast: ForecastDay[] = [
		{ day: 'MON', icon: 'cloudy', high: 18, low: 12, description: 'Cloudy' },
		{ day: 'TUE', icon: 'sunny', high: 18, low: 12, description: 'Sunny' },
		{ day: 'WED', icon: 'sunny', high: 16, low: 12, description: 'Cloudy' },
		{ day: 'SAT', icon: 'rainy', high: 18, low: 12, description: 'Cloudy' },
		{ day: 'SUN', icon: 'sunny', high: 16, low: 12, description: 'Sunny' }
	];

	// Map für die Icons (Viel performanter in Svelte als ein switch-case im Markup)
	const iconMap = {
		sunny: Sun,
		rainy: CloudRain,
		cloudy: Cloud
	};
</script>

<div class="backdrop-blur-2xl bg-white/10 rounded-3xl p-16 border border-white/20 shadow-2xl max-w-[1600px] mx-auto">
	<div class="flex items-start justify-between gap-12">
		
		<div class="flex-1">
			<div class="text-white/80 mb-6 uppercase">21.1° - VERY NOISY</div>
			<div class="flex items-center gap-8 mb-8">
				<CloudRain size={96} strokeWidth={1.5} class="w-32 h-32 text-white" />
				<div class="text-9xl font-extralight leading-none tracking-tighter text-white">
					16<span class="text-6xl align-top inline-block mt-6">°C</span>
				</div>
			</div>
			<div class="text-2xl font-light tracking-wide text-white/90">Light Rain Showers</div>
		</div>

		<div class="flex gap-4 self-center">
			{#each forecast as data (data.day)}
				{@const Icon = iconMap[data.icon] || CloudSun}
				<div class="flex w-28 flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<div class="text-xs font-bold tracking-widest text-white/50 uppercase">{data.day}</div>
					
					<div class="text-white/90">
						<Icon size={32} strokeWidth={1.5} />
					</div>
					
					<div class="text-sm font-medium text-white">
						{data.high}° <span class="opacity-30">/</span> {data.low}°
					</div>
					
					<div class="text-[10px] font-medium tracking-tighter text-white/40 uppercase">
						{data.description}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>