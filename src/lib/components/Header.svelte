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
	let time = $derived(ha.getState('sensor.time', '--'));
</script>

<header class="flex items-center justify-between px-16 py-10">
	<div class="shrink-0 text-4xl font-light tracking-wider text-white">HAMAVIL.</div>

	<nav class="flex items-center gap-6">
		{#each navItems as item, i (item.label)}
			{#if i === 3}
				<span class="font-extralight text-white">|</span>
			{/if}
			<a
				href={item.href}
				class="relative pb-1 text-lg tracking-wide text-white transition-colors
          {currentPath === item.href
					? 'after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-white'
					: ''}"
			>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="shrink-0 text-4xl font-light text-white tabular-nums">
		{time}
	</div>
</header>
