<script lang="ts">
  import { Home, Plane, Users, Coffee, Car, Sun, TriangleAlert, Trash2 } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  type HomeStatus = 'home' | 'away' | 'vacation' | 'guest';

  const statusConfig: Record<HomeStatus, { label: string; icon: typeof Icon; color: string }> = {
    home: { label: 'Zuhause', icon: Home, color: 'text-emerald-400' },
    away: { label: 'Abwesend', icon: Coffee, color: 'text-amber-400' },
    vacation: { label: 'Urlaub', icon: Plane, color: 'text-sky-400' },
    guest: { label: 'Gast', icon: Users, color: 'text-purple-400' }
  };

  let homeStatus: HomeStatus = $state('home');
  let StatusIcon = $derived(statusConfig[homeStatus].icon);
  let statusConfig$ = $derived(statusConfig[homeStatus]);
  let statusOpen = $state(false);

  type Person = { name: string; home: boolean };
  let persons: Person[] = $state([
    { name: 'Dominik', home: true },
    { name: 'Sandra', home: true },
    { name: 'Nils', home: true }
  ]);

  let carHome = $state(false);

  // PV & Energy
  let pvProduction = $state(28.4);
  let pvConsumption = $state(18.2);
  let gridImport = $state(10.2);
  let autonomy = $state(87);

  // Alerts
  let weatherWarning = $state<'none' | 'orange' | 'red'>('orange');

  // Trash
  let nextTrash = $state<{ name: string; days: number } | null>({ name: 'Gelber Sack', days: 1 });

  // Derived
  let atHome = $derived(persons.filter(p => p.home).length);
  let showWarning = $derived(weatherWarning !== 'none');
  let showTrash = $derived(nextTrash !== null);
</script>

<div class="status-dashboard">
  <!-- Home Status & Presence -->
  <div class="status-widget">
    <div class="relative">
      <button
        onclick={() => (statusOpen = !statusOpen)}
        class="status-header"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="icon-badge {statusConfig$.color}">
            <StatusIcon strokeWidth={1.3} class="h-5 w-5" />
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="label">Status</span>
            <span class="value">{statusConfig$.label}</span>
          </div>
        </div>
        <div class="text-white/40 text-sm">{atHome}/3</div>
      </button>

      {#if statusOpen}
        <div class="status-menu animate-fade-up">
          {#each Object.entries(statusConfig) as [key, config] (key)}
            <button
              onclick={() => {
                homeStatus = key as HomeStatus;
                statusOpen = false;
              }}
              class="menu-item {homeStatus === key ? 'active' : ''}"
            >
              <config.icon strokeWidth={1.2} class="h-4 w-4" />
              <span>{config.label}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Presence Indicators -->
    <div class="presence-grid">
      {#each persons as person (person.name)}
        <div class="presence-item" title={person.name}>
          <div class="presence-indicator {person.home ? 'active' : 'inactive'}"></div>
          <span class="presence-name">{person.name.charAt(0)}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Solar & Energy -->
  <div class="status-widget energy-widget">
    <div class="status-header no-btn">
      <div class="flex items-center gap-3">
        <div class="icon-badge text-amber-400">
          <Sun strokeWidth={1.3} class="h-5 w-5" />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="label">Solar</span>
          <span class="value">{pvProduction} kWh</span>
        </div>
      </div>
    </div>

    <div class="energy-metrics">
      <div class="metric">
        <span class="metric-label">Eigenverbrauch</span>
        <span class="metric-value">{pvConsumption} kWh</span>
      </div>
      <div class="metric">
        <span class="metric-label">Netz</span>
        <span class="metric-value text-amber-300">{gridImport} kWh</span>
      </div>
      <div class="metric">
        <span class="metric-label">Autarkie</span>
        <span class="metric-value text-emerald-300">{autonomy}%</span>
      </div>
    </div>
  </div>

  <!-- Warnings & Status -->
  <div class="status-widget alerts-widget">
    {#if showWarning}
      <div class="alert-item {weatherWarning === 'red' ? 'severity-red' : 'severity-orange'}">
        <TriangleAlert strokeWidth={1.3} class="h-4 w-4" />
        <div class="alert-text">
          <span class="alert-label">Warnung</span>
          <span class="alert-value">{weatherWarning === 'red' ? 'Sturm' : 'Regen erwartet'}</span>
        </div>
      </div>
    {:else}
      <div class="status-ok">
        <div class="ok-indicator"></div>
        <span class="ok-text">Alles klar</span>
      </div>
    {/if}
  </div>

  <!-- Trash Info -->
  {#if showTrash && nextTrash}
    <div class="status-widget trash-widget">
      <div class="trash-item {nextTrash.days === 0 ? 'urgent' : ''}">
        <Trash2 strokeWidth={1.3} class="h-4 w-4" />
        <div class="trash-content">
          <span class="trash-name">{nextTrash.name}</span>
          <span class="trash-day">
            {nextTrash.days === 0 ? 'Heute' : `in ${nextTrash.days} Tag${nextTrash.days > 1 ? 'en' : ''}`}
          </span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Car Status -->
  <div class="status-widget car-widget">
    <div class="car-status {carHome ? 'home' : 'away'}">
      <Car strokeWidth={1.3} class="h-4 w-4" />
      <div class="car-info">
        <span class="label">Auto</span>
        <span class="value">{carHome ? 'Zuhause' : 'Unterwegs'}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .status-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    width: 100%;
  }

  .status-widget {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.03) 100%);
    border: 1px solid rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(20px) saturate(1.4);
    border-radius: 0.875rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .status-header:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .status-header.no-btn {
    cursor: default;
    padding: 0;
  }

  .icon-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .label {
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.45);
  }

  .value {
    font-size: 0.95rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
  }

  .status-menu {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 0;
    width: 100%;
    background: linear-gradient(135deg, rgba(15, 15, 20, 0.95) 0%, rgba(10, 10, 15, 0.92) 100%);
    border: 1px solid rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(20px) saturate(1.5);
    border-radius: 0.75rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    z-index: 10;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.15s ease;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.85);
  }

  .menu-item.active {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 1);
  }

  .presence-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .presence-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.04);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .presence-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .presence-indicator.active {
    background: #10b981;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
  }

  .presence-indicator.inactive {
    background: rgba(255, 255, 255, 0.2);
  }

  .presence-name {
    font-weight: 500;
  }

  .energy-widget {
    grid-column: span 2;
  }

  .energy-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .metric {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.04);
  }

  .metric-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.4);
  }

  .metric-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    font-variant-numeric: tabular-nums;
  }

  .alerts-widget {
    grid-column: span 1;
  }

  .alert-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border-left: 2px solid;
  }

  .alert-item.severity-orange {
    background: rgba(251, 146, 60, 0.1);
    border-color: #fb923c;
    color: #fb923c;
  }

  .alert-item.severity-red {
    background: rgba(248, 113, 113, 0.1);
    border-color: #f87171;
    color: #f87171;
  }

  .alert-text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
  }

  .alert-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.7;
  }

  .alert-value {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .status-ok {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: rgba(16, 185, 129, 0.08);
    color: #10b981;
  }

  .ok-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
  }

  .ok-text {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .trash-widget {
    grid-column: span 1;
  }

  .trash-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: rgba(251, 191, 36, 0.08);
    color: rgba(251, 191, 36, 0.9);
    border-left: 2px solid rgba(251, 191, 36, 0.5);
    transition: all 0.2s ease;
  }

  .trash-item.urgent {
    background: rgba(251, 146, 60, 0.12);
    color: #fb923c;
    border-color: #fb923c;
  }

  .trash-content {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
  }

  .trash-name {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .trash-day {
    font-size: 0.65rem;
    opacity: 0.8;
  }

  .car-widget {
    grid-column: span 1;
  }

  .car-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .car-status.home {
    background: rgba(251, 191, 36, 0.08);
    color: rgba(251, 191, 36, 0.9);
  }

  .car-status.away {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.6);
  }

  .car-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
</style>
