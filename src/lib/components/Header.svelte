<script lang="ts">
  import { page } from '$app/state';
  import { ha } from '$lib/ha/client.svelte';
  import {
    LayoutDashboard,
    Camera,
    CloudSun,
    LayoutGrid,
    Sun,
    Plug,
    Gauge,
    Thermometer
  } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  const navItems: { label: string; href: string; icon: typeof Icon }[] = [
    { label: 'Übersicht', href: '/overview', icon: LayoutDashboard },
    { label: 'Kameras', href: '/security', icon: Camera },
    { label: 'Wetter', href: '/weather', icon: CloudSun },
    { label: 'Räume', href: '/rooms', icon: LayoutGrid }
  ];

  let currentPath = $derived(page.url.pathname);
  let time = $derived(ha.getState('sensor.time') ?? '--');

  let pvPower = $derived(ha.getNumericState('sensor.solaredge_solar_power', 2) ?? '--');
  let pvToday = $derived.by(() => {
    const v = ha.getNumericState('sensor.solaredge_produced_energy', 0);
    return v !== null ? (parseFloat(v) / 1000).toFixed(2) : '--';
  });

  // Grid: positiv = Bezug vom Netz, negativ = Einspeisung
  let gridPower = $derived(ha.getNumericState('sensor.solaredge_grid_power', 2) ?? '--');
  let gridImporting = $derived(
    parseFloat(ha.getEntity('sensor.solaredge_grid_power')?.state ?? '1') > 0.05
  );
  let gridToday = $derived.by(() => {
    const v = ha.getNumericState('sensor.solaredge_imported_energy', 0);
    return v !== null ? (parseFloat(v) / 1000).toFixed(2) : '--';
  });

  let autarkie = $derived(
    parseFloat(ha.getNumericState('sensor.ground_garage_power_self_sufficiency', 0) ?? '0')
  );

  // Warmwasser
  let warmwasser = $derived(
    ha.getNumericState('sensor.bridge0_dhw_temperature_r5t_dhw_tank', 1) ?? '--'
  );

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

<header class="flex flex-col bg-black/20 px-12 backdrop-blur-sm">
  <!-- Top row: Logo | PV | Date + Time -->
  <div class="grid grid-cols-3 items-center py-3.5">
    <div
      class="text-3xl leading-none font-extralight tracking-[0.3em] text-(--accent-warm) uppercase"
    >
      Hamavil
    </div>

    <!-- Energy Widget -->
    <div class="flex items-center justify-center gap-4">
      <!-- PV -->
      <div class="flex items-center gap-2.5">
        <Sun
          size={16}
          strokeWidth={1.3}
          class="shrink-0 {!gridImporting ? 'text-yellow-400/90' : 'text-yellow-400/75'}"
        />
        <div class="flex flex-col gap-0.5">
          <div class="flex items-baseline gap-1">
            <span
              class="text-xl font-extralight tabular-nums {!gridImporting
                ? 'text-yellow-300/90'
                : 'text-white/90'}">{pvToday}</span
            >
            <span class="text-[10px] text-white/40">kWh</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xs font-light text-white/45 tabular-nums">{pvPower}</span>
            <span class="text-[10px] text-white/25">kW</span>
          </div>
        </div>
      </div>

      <div class="h-5 w-px bg-white/12"></div>

      <!-- Netz -->
      <div class="flex items-center gap-2.5">
        <Plug
          size={16}
          strokeWidth={1.3}
          class="shrink-0 {gridImporting ? 'text-blue-400/70' : 'text-white/25'}"
        />
        <div class="flex flex-col gap-0.5">
          <div class="flex items-baseline gap-1">
            <span
              class="text-xl font-extralight tabular-nums {gridImporting
                ? 'text-blue-300/90'
                : 'text-white/90'}">{gridToday}</span
            >
            <span class="text-[10px] text-white/40">kWh</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xs font-light text-white/45 tabular-nums">{gridPower}</span>
            <span class="text-[10px] text-white/25">kW</span>
          </div>
        </div>
      </div>

      <div class="h-5 w-px bg-white/12"></div>

      <!-- Autarkie -->
      <div class="flex items-center gap-2.5">
        <Gauge
          size={16}
          strokeWidth={1.3}
          class="shrink-0 {autarkie >= 80
            ? 'text-green-400/75'
            : autarkie >= 50
              ? 'text-yellow-400/75'
              : 'text-orange-400/75'}"
        />
        <div class="flex flex-col gap-0.5">
          <div class="flex items-baseline gap-0.5">
            <span
              class="text-xl font-extralight tabular-nums {autarkie >= 80
                ? 'text-green-300/90'
                : autarkie >= 50
                  ? 'text-yellow-300/90'
                  : 'text-orange-300/90'}">{autarkie}</span
            >
            <span class="text-[10px] text-white/40">%</span>
          </div>
          <span class="text-[10px] tracking-wide text-white/30">Autarkie</span>
        </div>
      </div>

      <div class="h-5 w-px bg-white/12"></div>

      <!-- Warmwasser -->
      <div class="flex items-center gap-2.5">
        <Thermometer size={16} strokeWidth={1.3} class="shrink-0 text-orange-300/65" />
        <div class="flex flex-col gap-0.5">
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-extralight text-white/90 tabular-nums">{warmwasser}</span>
            <span class="text-[10px] text-white/40">°C</span>
          </div>
          <span class="text-[10px] tracking-wide text-white/30">Warmwasser</span>
        </div>
      </div>
    </div>

    <div class="flex items-baseline justify-end gap-5">
      <div class="text-sm font-light tracking-wide text-white/45 capitalize">{date}</div>
      <div class="flex flex-col items-end gap-1">
        <div
          class="text-3xl leading-none font-extralight tracking-wider text-(--accent-warm) tabular-nums"
        >
          {time}
        </div>
        <span class="font-mono text-[10px] leading-none text-white/15">{__BUILD_VERSION__}</span>
      </div>
    </div>
  </div>

  <!-- Thin rule between rows -->
  <div class="h-px bg-linear-to-r from-transparent via-white/8 to-transparent"></div>

  <!-- Bottom row: Navigation -->
  <nav class="mx-auto inline-grid grid-cols-4 gap-1 py-2">
    {#each navItems as item (item.label)}
      {@const NavIcon = item.icon}
      {@const isActive = currentPath.startsWith(item.href)}
      <a
        href={item.href}
        style="touch-action: manipulation;"
        onclick={() => navigator.vibrate?.(30)}
        class="flex items-center gap-2.5 rounded-xl border-b-2 px-7 py-3 transition-colors duration-150
               {isActive
          ? 'border-(--accent-warm)/55 bg-(--accent-warm)/10 text-white'
          : 'border-transparent text-white/50 active:bg-white/8 active:text-white/75'}"
      >
        <NavIcon size={16} strokeWidth={isActive ? 1.8 : 1.4} />
        <span class="text-sm font-medium tracking-[0.12em]">{item.label}</span>
      </a>
    {/each}
  </nav>

  <!-- Subtle bottom line -->
  <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
</header>
