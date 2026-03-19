<script lang="ts">
  import {
    WashingMachine, Wind as Dryer, Home, Plane, Users, Coffee,
    TrendingUp, TrendingDown, CheckCircle2, Clock, Trash2, ChevronDown, Car, Lock, LockOpen
  } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  type HomeStatus = 'home' | 'away' | 'vacation' | 'guest';

  const statusConfig: Record<HomeStatus, { label: string; icon: typeof Icon }> = {
    home:     { label: 'Zuhause',  icon: Home   },
    away:     { label: 'Abwesend', icon: Coffee  },
    vacation: { label: 'Urlaub',   icon: Plane   },
    guest:    { label: 'Gast',     icon: Users   },
  };

  type TrashType = { label: string; color: string; border: string; text: string };
  const trashTypes: Record<string, TrashType> = {
    gelb:   { label: 'Gelber Sack', color: 'bg-yellow-500/20', border: 'border-yellow-400/50', text: 'text-yellow-400' },
    rest:   { label: 'Restmüll',    color: 'bg-white/10',      border: 'border-white/30',      text: 'text-white/70'  },
    windel: { label: 'Windel',      color: 'bg-sky-500/20',    border: 'border-sky-400/50',    text: 'text-sky-400'   },
  };

  let homeStatus: HomeStatus = $state('home');
  let StatusIcon = $derived(statusConfig[homeStatus].icon);
  let statusOpen = $state(false);

  // TODO: derive from HA sensor / calendar
  const trashDue: keyof typeof trashTypes | null = 'gelb';
  let trashAcknowledged = $state(false);

  type Person = { name: string; initials: string; home: boolean };
  // TODO: von HA device_tracker
  let persons: Person[] = $state([
    { name: 'Dominik', initials: 'D', home: true  },
    { name: 'Sandra',  initials: 'S', home: true  },
    { name: 'Nils',    initials: 'N', home: false },
  ]);
  let carHome = $state(false); // TODO: von HA
  let doorLocked = $state(true); // TODO: von HA

  const trendValue = 12; // TODO: von HA
  const trendColor = $derived.by(() => {
    const abs = Math.min(Math.abs(trendValue), 50);
    const intensity = abs / 50;
    if (trendValue > 0) return `rgba(74, 222, 128, ${0.4 + intensity * 0.6})`;
    if (trendValue < 0) return `rgba(248, 113, 113, ${0.4 + intensity * 0.6})`;
    return 'rgba(255,255,255,0.4)';
  });
</script>

<div class="bg-black/30 border-t border-white/20 backdrop-blur-xl">
  <div class="max-w-450 mx-auto px-8 py-3">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center">

      <!-- Links: Hausstatus -->
      <div class="flex justify-start">
        <div class="relative">
          <div class="flex items-center gap-3">
            <button
              onclick={() => statusOpen = !statusOpen}
              title={statusConfig[homeStatus].label}
              class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/8 active:bg-white/15 transition-all"
            >
              <StatusIcon strokeWidth={1.5} class="w-5 h-5 text-white" />
              <span class="text-white text-sm font-light">{statusConfig[homeStatus].label}</span>
              <ChevronDown strokeWidth={1.5} class="w-3.5 h-3.5 text-white/40 {statusOpen ? 'rotate-180' : ''} transition-transform" />
            </button>

            <div class="flex items-center gap-1.5">
              {#each persons as person (person.name)}
                <div
                  title="{person.name} — {person.home ? 'Zuhause' : 'Abwesend'}"
                  class="flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all
                    {person.home ? 'bg-white/20 text-white' : 'bg-white/5 text-white/25'}"
                >
                  {person.initials}
                </div>
              {/each}
              <div
                title="Auto — {carHome ? 'Zuhause' : 'Unterwegs'}"
                class="flex items-center justify-center w-7 h-7 rounded-full transition-all
                  {carHome ? 'bg-white/20 text-white' : 'bg-white/5 text-white/25'}"
              >
                <Car strokeWidth={1.5} class="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {#if statusOpen}
            <div class="absolute bottom-full mb-2 left-0 bg-black/70 backdrop-blur-xl border border-white/15 rounded-xl p-1.5 flex flex-col gap-0.5 min-w-36">
              {#each Object.keys(statusConfig) as status (status)}
                {@const s = status as HomeStatus}
                {@const OptionIcon = statusConfig[s].icon}
                <button
                  onclick={() => { homeStatus = s; statusOpen = false; }}
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all
                    {homeStatus === s ? 'bg-white/15 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white/80'}"
                >
                  <OptionIcon strokeWidth={1.5} class="w-4 h-4" />
                  <span class="text-sm font-light">{statusConfig[s].label}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Mitte: Strom + Geräte -->
      <div class="flex items-center justify-center gap-5 px-8">
        <div class="flex items-center gap-2 text-white/60" title="Heute erzeugt">
          <span class="text-lg leading-none">☀</span>
          <span class="text-sm">28.4 kWh</span>
        </div>
        <div class="flex items-center gap-2" title="Autarkie heute">
          <span class="text-white font-light">87%</span>
          <span class="text-white/30 text-xs">autark</span>
        </div>
        <div class="flex items-center gap-1.5" title="Trend vs. gestern" style="color: {trendColor}">
          {#if trendValue >= 0}
            <TrendingUp strokeWidth={1.5} class="w-5 h-5" />
          {:else}
            <TrendingDown strokeWidth={1.5} class="w-5 h-5" />
          {/if}
          <span class="text-sm">{trendValue > 0 ? '+' : ''}{trendValue}%</span>
        </div>

        <div class="h-5 w-px bg-white/20"></div>

        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5" title="Waschmaschine — noch 23 min">
          <WashingMachine strokeWidth={1.5} class="w-5 h-5 text-white/60" />
          <Clock strokeWidth={1.5} class="w-3.5 h-3.5 text-white/40" />
          <span class="text-sm text-white/50">23</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5" title="Trockner fertig">
          <Dryer strokeWidth={1.5} class="w-5 h-5 text-white/60" />
          <CheckCircle2 strokeWidth={1.5} class="w-4 h-4 text-white/40" />
        </div>
      </div>

      <!-- Rechts: Schloss + Mülltonne -->
      <div class="flex justify-end items-center gap-3">
        <div class="flex items-center gap-2 transition-all {doorLocked ? 'opacity-25 text-white' : 'text-red-400'}">
          {#if doorLocked}
            <Lock strokeWidth={1.5} class="w-5 h-5" />
            <span class="text-sm font-light">Gesperrt</span>
          {:else}
            <LockOpen strokeWidth={1.5} class="w-5 h-5" />
            <span class="text-sm font-light">Offen</span>
          {/if}
        </div>

        {#if trashDue}
          {@const t = trashTypes[trashDue]}
          <button
            onclick={() => trashAcknowledged = true}
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/8 active:bg-white/15 transition-all {trashAcknowledged ? 'opacity-30' : ''}"
            title="{t.label} morgen{trashAcknowledged ? ' (quittiert)' : ' — klicken zum Quittieren'}"
          >
            <Trash2 strokeWidth={1.5} class="w-5 h-5 {trashAcknowledged ? 'text-white' : t.text}" />
            <span class="text-sm font-light {trashAcknowledged ? 'text-white' : t.text}">{t.label}</span>
          </button>
        {:else}
          <div class="flex items-center gap-2.5 opacity-25">
            <Trash2 strokeWidth={1.5} class="w-5 h-5 text-white" />
            <span class="text-sm font-light text-white">Keine</span>
          </div>
        {/if}
      </div>

    </div>
  </div>
</div>
