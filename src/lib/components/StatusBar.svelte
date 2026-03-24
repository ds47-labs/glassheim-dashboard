<script lang="ts">
  import { Home, Plane, Users, Coffee, Car, ChevronDown } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  type HomeStatus = 'home' | 'away' | 'vacation' | 'guest';

  const statusConfig: Record<HomeStatus, { label: string; icon: typeof Icon }> = {
    home: { label: 'Zuhause', icon: Home },
    away: { label: 'Abwesend', icon: Coffee },
    vacation: { label: 'Urlaub', icon: Plane },
    guest: { label: 'Gast', icon: Users }
  };

  let homeStatus: HomeStatus = $state('home');
  let StatusIcon = $derived(statusConfig[homeStatus].icon);
  let statusOpen = $state(false);

  type Person = { name: string; initials: string; home: boolean };
  let persons: Person[] = $state([
    { name: 'Dominik', initials: 'D', home: true },
    { name: 'Sandra', initials: 'S', home: true },
    { name: 'Nils', initials: 'N', home: true }
  ]);

  let carHome = $state(false);
</script>

<div class="status-compact-row">
  <!-- Home status -->
  <div class="relative">
    <button
      onclick={() => (statusOpen = !statusOpen)}
      class="status-cell group flex items-center gap-2"
      title={statusConfig[homeStatus].label}
    >
      <div class="text-white/60 transition-colors group-hover:text-white">
        <StatusIcon strokeWidth={1.3} class="h-4 w-4" />
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-[0.55rem] font-light tracking-wider text-white/40 uppercase">Status</span>
        <span class="text-xs font-light text-white/75">{statusConfig[homeStatus].label}</span>
      </div>
      <ChevronDown
        strokeWidth={1.5}
        class="ml-1 h-3 w-3 text-white/30 transition-transform {statusOpen ? 'rotate-180' : ''}"
      />
    </button>

    {#if statusOpen}
      <div
        class="status-dropdown-compact animate-fade-up absolute bottom-full left-0 mb-2 w-48 rounded-xl p-1.5"
      >
        {#each Object.entries(statusConfig) as [key, config] (key)}
          <button
            onclick={() => {
              homeStatus = key as HomeStatus;
              statusOpen = false;
            }}
            class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all
              {homeStatus === key
              ? 'bg-white/15 text-white'
              : 'text-white/55 hover:bg-white/8 hover:text-white/75'}"
          >
            <config.icon strokeWidth={1.3} class="h-4 w-4" />
            <span class="text-xs font-light">{config.label}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Presence -->
  <div class="status-cell flex items-center gap-2">
    <div class="flex flex-col gap-0.5">
      <span class="text-[0.55rem] font-light tracking-wider text-white/40 uppercase">Zuhause</span>
      <div class="flex items-center gap-1">
        {#each persons as person (person.name)}
          <div
            title={person.name}
            class="flex h-5 w-5 items-center justify-center rounded-full text-[0.55rem] font-light transition-all
              {person.home ? 'bg-emerald-500/25 text-emerald-200' : 'bg-white/6 text-white/20'}"
          >
            {person.initials.charAt(0)}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Car -->
  <div class="status-cell flex items-center gap-2">
    <div
      title={carHome ? 'Zuhause' : 'Unterwegs'}
      class="flex h-5 w-5 items-center justify-center rounded-full transition-all
        {carHome ? 'bg-amber-500/20 text-amber-300' : 'bg-white/6 text-white/20'}"
    >
      <Car strokeWidth={1.5} class="h-3 w-3" />
    </div>
    <div class="flex flex-col gap-0.5">
      <span class="text-[0.55rem] font-light tracking-wider text-white/40 uppercase">Auto</span>
      <span class="text-xs font-light text-white/60">{carHome ? 'Zuhause' : 'Unterwegs'}</span>
    </div>
  </div>
</div>
