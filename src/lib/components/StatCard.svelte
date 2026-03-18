<script lang="ts">
	import type { Component } from 'svelte';

	let { 
		icon: Icon,
		title, 
		stats 
	}: { 
		icon: Component<any>, 
		title: string, 
		stats: Array<{ label: string; value: string }> 
	} = $props();
</script>

<div class="glass-panel flex-1 rounded-[24px] border border-white/15 bg-white/5 p-8 backdrop-blur-3xl shadow-xl transition-all hover:bg-white/10">
	<div class="flex items-start gap-6">
		
		<div class="text-white/70 mt-1">
			{#if Icon}
				<Icon size={32} strokeWidth={1} />
			{/if}
		</div>

		<div class="flex-1">
			<h3 class="mb-4 text-lg font-semibold tracking-wide text-white">{title}</h3>
			
			<div class="space-y-3">
				{#each stats as stat}
					<div class="text-sm tracking-tight text-white/80">
						<span class="font-medium text-white/40 uppercase text-[10px] tracking-widest">{stat.label}: </span>
						<span class="font-light">{stat.value}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>