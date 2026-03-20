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
    TriangleAlert,
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

  type TrashType = { label: string; color: string; border: string; text: string };
  const trashTypes: Record<string, TrashType> = {
    gelb: {
      label: 'Gelber Sack',
      color: 'bg-yellow-500/20',
      border: 'border-yellow-400/50',
      text: 'text-yellow-400'
    },
    rest: {
      label: 'Restmüll',
      color: 'bg-white/10',
      border: 'border-white/30',
      text: 'text-white/70'
    },
    windel: {
      label: 'Windel',
      color: 'bg-sky-500/20',
      border: 'border-sky-400/50',
      text: 'text-sky-400'
    }
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

  type AlertStyle = { section: string; divider: string; text: string };
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
      // const c =
      //   weatherWarning.severity === 'red'
      //     ? { section: 'bg-red-500/20', divider: 'border-red-400/50', text: 'text-red-300' }
      //     : {
      //         section: 'bg-orange-500/20',
      //         divider: 'border-orange-400/50',
      //         text: 'text-orange-300'
      //       };
      // list.push({
      //   id: 'weather',
      //   label: weatherWarning.label,
      //   icon: TriangleAlert,
      //   dismissible: false,
      //   style: c
      // });
    }
    if (garageOpen)
      list.push({
        id: 'garage',
        label: 'Garage offen',
        icon: DoorOpen,
        dismissible: false,
        style: { section: 'bg-red-500/20', divider: 'border-red-400/50', text: 'text-red-300' }
      });
    if (!doorLocked)
      list.push({
        id: 'door',
        label: 'Haustür offen',
        icon: LockOpen,
        dismissible: false,
        style: {
          section: 'bg-yellow-500/20',
          divider: 'border-yellow-400/50',
          text: 'text-yellow-300'
        }
      });
    if (trashDue && !trashAcknowledged) {
      const t = trashTypes[trashDue];
      list.push({
        id: 'trash',
        label: t.label,
        icon: Trash2,
        dismissible: true,
        style: { section: t.color, divider: t.border, text: t.text },
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

<div class="border-t border-white/20 bg-black/30 backdrop-blur-xl">
  <div class="mx-auto max-w-450">
    <div class="relative flex items-stretch">
      <!-- Links: Hausstatus -->
      <div class="flex items-center justify-start py-3 pl-8">
        <div class="relative">
          <div class="flex items-center gap-3">
            <button
              onclick={() => (statusOpen = !statusOpen)}
              title={statusConfig[homeStatus].label}
              class="flex items-center gap-2.5 rounded-lg bg-white/8 px-3 py-1.5 transition-all active:bg-white/15"
            >
              <StatusIcon strokeWidth={1.5} class="h-5 w-5 text-white" />
              <span class="text-sm font-light text-white">{statusConfig[homeStatus].label}</span>
              <ChevronDown
                strokeWidth={1.5}
                class="h-3.5 w-3.5 text-white/40 {statusOpen
                  ? 'rotate-180'
                  : ''} transition-transform"
              />
            </button>

            <div class="flex items-center gap-1.5">
              {#each persons as person (person.name)}
                <div
                  title="{person.name} — {person.home ? 'Zuhause' : 'Abwesend'}"
                  class="flex h-7 w-7 items-center justify-center rounded-full text-xs leading-none font-medium transition-all
                    {person.home ? 'bg-white/20 text-white' : 'bg-white/5 text-white/25'}"
                >
                  <span>{person.initials}</span>
                </div>
              {/each}
              <div
                title="Auto — {carHome ? 'Zuhause' : 'Unterwegs'}"
                class="flex h-7 w-7 items-center justify-center rounded-full transition-all
                  {carHome ? 'bg-white/20 text-white' : 'bg-white/5 text-white/25'}"
              >
                <Car strokeWidth={1.5} class="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {#if statusOpen}
            <div
              class="absolute bottom-full left-0 mb-2 flex min-w-36 flex-col gap-0.5 rounded-xl border border-white/15 bg-black/70 p-1.5 backdrop-blur-xl"
            >
              {#each Object.keys(statusConfig) as status (status)}
                {@const s = status as HomeStatus}
                {@const OptionIcon = statusConfig[s].icon}
                <button
                  onclick={() => {
                    homeStatus = s;
                    statusOpen = false;
                  }}
                  class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all
                    {homeStatus === s
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:bg-white/10 hover:text-white/80'}"
                >
                  <OptionIcon strokeWidth={1.5} class="h-4 w-4" />
                  <span class="text-sm font-light">{statusConfig[s].label}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Mitte: Strom + Geräte (absolut zentriert) -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="pointer-events-auto flex items-center gap-5 py-3">
          <div class="flex items-center gap-2 text-white/60" title="Heute erzeugt">
            <span class="text-lg leading-none">☀</span>
            <span class="text-sm">28.4 kWh</span>
          </div>
          <div class="flex items-center gap-2" title="Autarkie heute">
            <span class="font-light text-white">87%</span>
            <span class="text-xs text-white/30">autark</span>
          </div>
          <div
            class="flex items-center gap-1.5"
            title="Trend vs. gestern"
            style="color: {trendColor}"
          >
            {#if trendValue >= 0}
              <TrendingUp strokeWidth={1.5} class="h-5 w-5" />
            {:else}
              <TrendingDown strokeWidth={1.5} class="h-5 w-5" />
            {/if}
            <span class="text-sm">{trendValue > 0 ? '+' : ''}{trendValue}%</span>
          </div>

          <div class="h-5 w-px bg-white/20"></div>

          <div
            class="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5"
            title="Waschmaschine — noch 23 min"
          >
            <WashingMachine strokeWidth={1.5} class="h-5 w-5 text-white/60" />
            <Clock strokeWidth={1.5} class="h-3.5 w-3.5 text-white/40" />
            <span class="text-sm text-white/50">23</span>
          </div>
          <div
            class="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5"
            title="Trockner fertig"
          >
            <Dryer strokeWidth={1.5} class="h-5 w-5 text-white/60" />
            <CircleCheck strokeWidth={1.5} class="h-4 w-4 text-white/40" />
          </div>
        </div>
      </div>

      {#if hasAlerts}
        <div
          class="relative ml-auto flex items-center justify-end gap-2.5 border-l pr-8 pl-5 transition-colors
          {hasAlerts ? `${topAlert.style.section} ${topAlert.style.divider}` : 'border-white/10'}"
        >
          <!-- Kein-Alarm-Haken (nur sichtbar wenn keine Alerts) -->
          <CircleCheck
            strokeWidth={1.5}
            class="h-4 w-4 text-green-400 opacity-40 transition-opacity {hasAlerts
              ? 'invisible'
              : ''}"
          />

          <!-- Alert-Inhalt (invisible wenn keine Alerts, aber Platz bleibt reserviert) -->
          <TopAlertIcon
            strokeWidth={1.5}
            class="h-4 w-4 transition-opacity {hasAlerts ? topAlert.style.text : 'invisible'}"
          />
          <span
            class="text-sm font-light transition-colors {hasAlerts
              ? topAlert.style.text
              : 'invisible'}">{topAlert?.label ?? ''}</span
          >
          <button
            onclick={() => topAlert?.dismissible && topAlert.onDismiss()}
            class="opacity-40 transition-opacity hover:opacity-80
            {!hasAlerts || !topAlert.dismissible
              ? 'pointer-events-none invisible'
              : (topAlert?.style.text ?? '')}"
            title="Quittieren"
          >
            <X strokeWidth={2} class="h-3.5 w-3.5" />
          </button>
          <button
            onclick={() => (alertsOpen = !alertsOpen)}
            class="w-7 rounded-full bg-white/15 px-1.5 py-0.5 text-center text-xs font-medium text-white/70 tabular-nums transition-colors hover:bg-white/25
            {alerts.length > 1 ? '' : 'pointer-events-none invisible'}"
            title="Alle Alarme anzeigen"
          >
            +{alerts.length - 1}
          </button>

          {#if alertsOpen && alerts.length > 1}
            <div
              class="absolute right-4 bottom-full mb-2 flex min-w-48 flex-col gap-1 rounded-xl border border-white/15 bg-black/70 p-1.5 backdrop-blur-xl"
            >
              {#each alerts as alert (alert.id)}
                {@const AlertIcon = alert.icon}
                <div class="flex items-center gap-2 rounded-lg px-3 py-2 {alert.style.section}">
                  <AlertIcon strokeWidth={1.5} class="h-4 w-4 {alert.style.text}" />
                  <span class="text-sm font-light {alert.style.text} flex-1">{alert.label}</span>
                  {#if alert.dismissible}
                    <button
                      onclick={() => {
                        alert.onDismiss();
                        if (alerts.length <= 1) alertsOpen = false;
                      }}
                      class="{alert.style.text} opacity-40 transition-opacity hover:opacity-80"
                      title="Quittieren"
                    >
                      <X strokeWidth={2} class="h-3.5 w-3.5" />
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
