<script lang="ts">
	import { page } from '$app/state';
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

	let currentPath = $derived(page.url.pathname);
	let time = $derived(ha.getState('sensor.time') ?? '--');
</script>

<header class="flex items-center justify-between px-12 py-5 border-b border-white/[0.055]">
	<div class="shrink-0 text-3xl leading-none font-extralight tracking-[0.25em] text-[var(--accent-warm)] uppercase">
		Hamavil
	</div>

	<nav class="flex items-center gap-0.5">
		{#each navItems as item, i (item.label)}
			{#if i === 3}
				<div class="mx-3 h-3.5 w-px bg-white/12"></div>
			{/if}
			<a
				href={item.href}
				class="relative flex items-center rounded-lg px-3 py-1.5 text-base leading-none tracking-wide transition-all duration-200
				{currentPath === item.href
					? 'text-white bg-white/[0.13]'
					: 'text-white/38 hover:text-white/75 hover:bg-white/[0.06]'}"
			>
				{item.label}
				{#if currentPath === item.href}
					<span class="absolute right-2 bottom-1 left-2 h-px rounded-full bg-[var(--accent-warm)]/40"></span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="shrink-0 text-4xl leading-none font-extralight tracking-wider text-white/85 tabular-nums">
		{time}
	</div>
</header>
