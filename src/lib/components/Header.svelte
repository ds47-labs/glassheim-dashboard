<script lang="ts">
  import { page } from '$app/state';
  import { ha } from '$lib/ha/client.svelte';
  import {
    LayoutDashboard,
    Camera,
    CloudSun,
    ChefHat,
    UtensilsCrossed,
    Sofa,
    Moon,
    User,
    Monitor,
    Zap,
    TrendingUp
  } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  const navItems: { label: string; href: string; icon: typeof Icon }[] = [
    { label: 'Übersicht', href: '/overview', icon: LayoutDashboard },
    { label: 'Kameras', href: '/security', icon: Camera },
    { label: 'Wetter', href: '/weather', icon: CloudSun },
    { label: 'Küche', href: '/kitchen', icon: ChefHat },
    { label: 'Esszimmer', href: '/dining', icon: UtensilsCrossed },
    { label: 'Wohnzimmer', href: '/living', icon: Sofa },
    { label: 'Schlafzimmer', href: '/bedroom', icon: Moon },
    { label: 'Nils', href: '/nils', icon: User },
    { label: 'Büro', href: '/office', icon: Monitor }
  ];

  let currentPath = $derived(page.url.pathname);
  let time = $derived(ha.getState('sensor.time') ?? '--');

  let pvPower = $derived(ha.getNumericState('sensor.solaredge_solar_power', 2) ?? '--');
  let pvToday = $derived.by(() => {
    const v = ha.getNumericState('sensor.solaredge_produced_energy', 0);
    return v !== null ? (parseFloat(v) / 1000).toFixed(2) : '--';
  });

  let date = $derived.by(() => {
    const dateStr = ha.getState('sensor.date');
    if (!dateStr) return '--';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
</script>

<header class="flex flex-col bg-black/20 px-12 backdrop-blur-md">
  <!-- Top row: Logo | PV | Date + Time -->
  <div class="grid grid-cols-3 items-center py-3.5">
    <div
      class="text-3xl leading-none font-extralight tracking-[0.3em] text-(--accent-warm) uppercase"
    >
      Hamavil
    </div>

    <!-- PV Widget -->
    <div class="flex items-center justify-center gap-5">
      <div class="flex items-center gap-2.5">
        <Zap size={14} strokeWidth={1.5} class="text-yellow-400/70" />
        <div class="flex items-baseline gap-1.5">
          <span class="text-xl font-extralight text-white/85 tabular-nums">{pvPower}</span>
          <span class="text-xs font-light text-white/40">kW</span>
        </div>
      </div>
      <div class="h-3 w-px bg-white/15"></div>
      <div class="flex items-center gap-2.5">
        <TrendingUp size={14} strokeWidth={1.5} class="text-white/35" />
        <div class="flex items-baseline gap-1.5">
          <span class="text-xl font-extralight text-white/65 tabular-nums">{pvToday}</span>
          <span class="text-xs font-light text-white/35">kWh heute</span>
        </div>
      </div>
    </div>

    <div class="flex items-baseline justify-end gap-5">
      <div class="text-sm font-light tracking-wide text-white/45 capitalize">{date}</div>
      <div class="text-3xl leading-none font-extralight tracking-wider text-white/85 tabular-nums">
        {time}
      </div>
    </div>
  </div>

  <!-- Thin rule between rows -->
  <div class="h-px bg-linear-to-r from-transparent via-white/8 to-transparent"></div>

  <!-- Bottom row: Navigation -->
  <nav class="flex items-stretch gap-0.5 py-2">
    {#each navItems as item, i (item.label)}
      {#if i === 3}
        <div class="mx-2 h-4 w-px self-center bg-white/12"></div>
      {/if}
      {@const NavIcon = item.icon}
      <a
        href={item.href}
        class="flex flex-1 items-center justify-center gap-2 rounded-xl border-b-2 px-2
               py-2.5 transition-colors duration-200
               {currentPath === item.href
          ? 'border-(--accent-warm)/55 bg-(--accent-warm)/10 text-white'
          : 'border-transparent text-white/55'}"
      >
        <NavIcon size={15} strokeWidth={currentPath === item.href ? 1.8 : 1.4} />
        <span class="text-sm font-medium tracking-wide">{item.label}</span>
      </a>
    {/each}
  </nav>

  <!-- Subtle bottom line -->
  <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
</header>
