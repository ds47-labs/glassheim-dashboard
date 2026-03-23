<script lang="ts">
  import {
    WashingMachine,
    Wind as Dryer,
    Home,
    Plane,
    Users,
    Coffee,
    TrendingUp,
    TrendingDown,
    CircleCheck,
    Clock,
    Trash2,
    ChevronDown,
    Car,
    LockOpen,
    DoorOpen,
    Sun,
    X
  } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  type HomeStatus = 'home' | 'away' | 'vacation' | 'guest';

  const statusConfig: Record<HomeStatus, { label: string; icon: typeof Icon }> = {
    home: { label: 'Zuhause', icon: Home },
    away: { label: 'Abwesend', icon: Coffee },
    vacation: { label: 'Urlaub', icon: Plane },
    guest: { label: 'Gast', icon: Users }
  };

  type TrashType = { label: string; text: string };
  const trashTypes: Record<string, TrashType> = {
    gelb: { label: 'Gelber Sack', text: 'text-yellow-400' },
    rest: { label: 'Restmüll', text: 'text-white/60' },
    windel: { label: 'Windel', text: 'text-sky-400' }
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
    { name: 'Dominik', initials: 'D', home: true },
    { name: 'Sandra', initials: 'S', home: true },
    { name: 'Nils', initials: 'N', home: true }
  ]);
  let carHome = $state(false); // TODO: von HA
  let doorLocked = $state(true); // TODO: von HA
  let garageOpen = $state(false); // TODO: von HA
  let weatherWarning = $state<{ label: string; severity: 'orange' | 'red' } | null>({
    label: 'Unwetterwarnung',
    severity: 'orange'
  });

  type AlertStyle = { text: string };
  type Alert =
    | {
        id: string;
        label: string;
        icon: typeof Icon;
        style: AlertStyle;
        dismissible: false;
      }
    | {
        id: string;
        label: string;
        icon: typeof Icon;
        style: AlertStyle;
        dismissible: true;
        onDismiss: () => void;
      };

  const alerts = $derived.by<Alert[]>(() => {
    const list: Alert[] = [];
    if (weatherWarning) {
      // list.push({
      //   id: 'weather',
      //   label: weatherWarning.label,
      //   icon: TriangleAlert,
      //   dismissible: false,
      //   style: { text: weatherWarning.severity === 'red' ? 'text-red-400' : 'text-orange-400' }
      // });
    }
    if (garageOpen)
      list.push({
        id: 'garage',
        label: 'Garage offen',
        icon: DoorOpen,
        dismissible: false,
        style: { text: 'text-red-400' }
      });
    if (!doorLocked)
      list.push({
        id: 'door',
        label: 'Haustür offen',
        icon: LockOpen,
        dismissible: false,
        style: { text: 'text-yellow-400' }
      });
    if (trashDue && !trashAcknowledged) {
      const t = trashTypes[trashDue];
      list.push({
        id: 'trash',
        label: t.label,
        icon: Trash2,
        dismissible: true,
        style: { text: t.text },
        onDismiss: () => {
          trashAcknowledged = true;
        }
      });
    }
    return list;
  });

  let alertsOpen = $state(false);

  let topAlert = $derived(alerts[0]);
  let hasAlerts = $derived(alerts.length > 0);
  let TopAlertIcon = $derived(topAlert?.icon ?? CircleCheck);

  const trendValue = 12; // TODO: von HA
  const trendColor = $derived.by(() => {
    const abs = Math.min(Math.abs(trendValue), 50);
    const intensity = abs / 50;
    if (trendValue > 0) return `rgba(74, 222, 128, ${0.4 + intensity * 0.6})`;
    if (trendValue < 0) return `rgba(248, 113, 113, ${0.4 + intensity * 0.6})`;
    return 'rgba(255,255,255,0.4)';
  });
</script>

<div class="bg-black/50 backdrop-blur-3xl backdrop-saturate-150">
  <div class="mx-auto flex h-12 max-w-450 items-center px-10">

    <!-- Left: Home status + Presence (fixed width to prevent shift) -->
    <div class="flex w-72 shrink-0 items-center gap-4">
      <div class="relative">
        <button
          onclick={() => (statusOpen = !statusOpen)}
          title={statusConfig[homeStatus].label}
          class="flex w-28 items-center gap-2 transition-all duration-200 active:opacity-70"
        >
          <StatusIcon strokeWidth={1.2} class="h-4 w-4 shrink-0 text-white/60" />
          <span class="text-sm text-white/70">{statusConfig[homeStatus].label}</span>
          <ChevronDown
            strokeWidth={1.5}
            class="ml-auto h-3 w-3 shrink-0 text-white/25 transition-transform duration-300 {statusOpen ? 'rotate-180' : ''}"
          />
        </button>

        {#if statusOpen}
          <div class="glass-dropdown absolute bottom-full left-0 mb-3 flex min-w-40 flex-col gap-0.5 rounded-xl p-1.5 animate-fade-up">
            {#each Object.keys(statusConfig) as status (status)}
              {@const s = status as HomeStatus}
              {@const OptionIcon = statusConfig[s].icon}
              <button
                onclick={() => {
                  homeStatus = s;
                  statusOpen = false;
                }}
                class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-200
                  {homeStatus === s
                  ? 'bg-white/12 text-white'
                  : 'text-white/45 hover:bg-white/8 hover:text-white/80'}"
              >
                <OptionIcon strokeWidth={1.2} class="h-4 w-4" />
                <span class="text-sm">{statusConfig[s].label}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="h-3.5 w-px bg-white/10"></div>

      <div class="flex items-center gap-1">
        {#each persons as person (person.name)}
          <div
            title="{person.name} — {person.home ? 'Zuhause' : 'Abwesend'}"
            class="flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] leading-none font-medium transition-all duration-300
              {person.home ? 'bg-white/12 text-white/70' : 'bg-white/4 text-white/15'}"
          >
            {person.initials}
          </div>
        {/each}
        <div
          title="Auto — {carHome ? 'Zuhause' : 'Unterwegs'}"
          class="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300
            {carHome ? 'bg-white/12 text-white/70' : 'bg-white/4 text-white/15'}"
        >
          <Car strokeWidth={1.2} class="h-3 w-3" />
        </div>
      </div>
    </div>

    <!-- Center: Solar + Appliances -->
    <div class="flex flex-1 items-center justify-center gap-6">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 text-white/50" title="Heute erzeugt">
          <Sun strokeWidth={1.2} class="h-3.5 w-3.5" />
          <span class="text-sm tabular-nums">28.4 kWh</span>
        </div>

        <span class="text-sm text-white/80 tabular-nums" title="Autarkie heute">87%</span>

        <div
          class="flex items-center gap-1"
          title="Trend vs. gestern"
          style="color: {trendColor}"
        >
          {#if trendValue >= 0}
            <TrendingUp strokeWidth={1.2} class="h-3.5 w-3.5" />
          {:else}
            <TrendingDown strokeWidth={1.2} class="h-3.5 w-3.5" />
          {/if}
          <span class="text-sm tabular-nums">{trendValue > 0 ? '+' : ''}{trendValue}%</span>
        </div>
      </div>

      <div class="h-3.5 w-px bg-white/10"></div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5" title="Waschmaschine — noch 23 min">
          <WashingMachine strokeWidth={1.2} class="h-3.5 w-3.5 text-white/45" />
          <Clock strokeWidth={1.2} class="h-3 w-3 text-white/25" />
          <span class="text-xs text-white/40 tabular-nums">23 min</span>
        </div>
        <div class="flex items-center gap-1.5" title="Trockner fertig">
          <Dryer strokeWidth={1.2} class="h-3.5 w-3.5 text-white/45" />
          <CircleCheck strokeWidth={1.2} class="h-3 w-3 text-green-400/50" />
        </div>
      </div>
    </div>

    <!-- Right: Alerts (fixed width to prevent shift) -->
    <div class="relative flex w-52 shrink-0 items-center justify-end">
      {#if hasAlerts}
        <div class="flex items-center gap-2">
          <TopAlertIcon strokeWidth={1.2} class="h-3.5 w-3.5 {topAlert.style.text}" />
          <span class="text-sm {topAlert.style.text}">{topAlert.label}</span>
          {#if topAlert.dismissible}
            <button
              onclick={() => topAlert.onDismiss()}
              class="{topAlert.style.text} opacity-40 transition-opacity hover:opacity-80"
              title="Quittieren"
            >
              <X strokeWidth={1.5} class="h-3 w-3" />
            </button>
          {/if}
          {#if alerts.length > 1}
            <button
              onclick={() => (alertsOpen = !alertsOpen)}
              class="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/8 text-[0.6rem] text-white/50 tabular-nums transition-all hover:bg-white/15"
              title="Alle Alarme anzeigen"
            >
              +{alerts.length - 1}
            </button>
          {/if}
        </div>
      {:else}
        <div class="flex items-center gap-1.5 text-green-400/40">
          <CircleCheck strokeWidth={1.2} class="h-3.5 w-3.5" />
          <span class="text-xs tracking-wider">Alles OK</span>
        </div>
      {/if}

      {#if alertsOpen && alerts.length > 1}
        <div class="glass-dropdown absolute right-0 bottom-full mb-3 flex min-w-52 flex-col gap-1 rounded-xl p-1.5 animate-fade-up">
          {#each alerts as alert (alert.id)}
            {@const AlertIcon = alert.icon}
            <div class="flex items-center gap-2 rounded-lg px-3 py-2">
              <AlertIcon strokeWidth={1.2} class="h-3.5 w-3.5 {alert.style.text}" />
              <span class="text-sm {alert.style.text} flex-1">{alert.label}</span>
              {#if alert.dismissible}
                <button
                  onclick={() => {
                    alert.onDismiss();
                    if (alerts.length <= 1) alertsOpen = false;
                  }}
                  class="{alert.style.text} opacity-40 transition-opacity hover:opacity-80"
                  title="Quittieren"
                >
                  <X strokeWidth={1.5} class="h-3 w-3" />
                </button>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>

  </div>
</div>
