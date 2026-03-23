<script lang="ts">
	import { page } from '$app/stores';
	import { ha } from '$lib/ha/client.svelte';

	const navItems: { label: string; href: string }[] = [
		{ label: 'Overview', href: '/overview' },
		{ label: 'Security', href: '/security' },
		{ label: 'Weather', href: '/weather' },
		{ label: 'Kitchen', href: '/kitchen' },
		{ label: 'Dining', href: '/dining' },
		{ label: 'Living', href: '/living' },
		{ label: 'Bedroom', href: '/bedroom' },
		{ label: 'Nils', href: '/nils' },
		{ label: 'Office', href: '/office' }
	];

	let currentPath = $derived($page.url.pathname);
	let time = $derived(ha.getState('sensor.time') ?? '--');
</script>

<header class="flex items-center justify-between px-12 py-8">
	<div class="shrink-0 text-3xl leading-none font-extralight tracking-[0.25em] text-white/90 uppercase">
		Hamavil
	</div>

	<nav class="flex items-center gap-1">
		{#each navItems as item, i (item.label)}
			{#if i === 3}
				<div class="mx-3 h-4 w-px bg-white/15"></div>
			{/if}
			<a
				href={item.href}
				class="flex items-center rounded-lg px-3 py-1.5 text-base leading-none tracking-wide transition-all duration-300
				{currentPath === item.href
					? 'text-white bg-white/10'
					: 'text-white/45 hover:text-white/80 hover:bg-white/5'}"
			>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="shrink-0 text-4xl leading-none font-extralight tracking-wider text-white/90 tabular-nums">
		{time}
	</div>
</header>
