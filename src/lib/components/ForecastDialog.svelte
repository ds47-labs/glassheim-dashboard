<script lang="ts">
  import { X, Droplets, Wind, Gauge, Navigation, Sun, Cloud, Thermometer } from 'lucide-svelte';
  import type { ForecastDay } from './WeatherCard.svelte';

  let { day, onclose }: { day: ForecastDay | null; onclose: () => void } = $props();

  let dialog = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (day) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialog) {
      navigator.vibrate?.(30);
      dialog?.close();
    }
  }

  function fmt(val: unknown, unit = '', decimals?: number): string {
    if (val === undefined || val === null) return '--';
    if (decimals !== undefined && typeof val === 'number') {
      return `${val.toFixed(decimals)}${unit}`;
    }
    return `${val}${unit}`;
  }

  const windDirections = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  function windDir(deg: number): string {
    return windDirections[Math.round(deg / 45) % 8];
  }
</script>

<dialog
  bind:this={dialog}
  onclick={handleBackdropClick}
  onclose={onclose}
  class="forecast-dialog m-auto rounded-2xl p-0 outline-none backdrop:bg-black/45"
>
  {#if day}
    {@const DetailIcon = day.icon}
    {@const r = day.raw}

    <div class="forecast-dialog-inner relative w-[34rem] rounded-2xl overflow-hidden">

      <!-- Close button — always anchored top-right -->
      <button
        onclick={() => { navigator.vibrate?.(30); dialog?.close(); }}
        aria-label="Schließen"
        class="absolute top-4 right-4 z-10 flex items-center justify-center w-11 h-11 rounded-xl text-white/35 active:text-white/80 active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40"
        style="touch-action: manipulation;"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      <!-- Header -->
      <div class="px-8 pt-7 pb-6 pr-16">
        <div class="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
          {day.fullDate}
        </div>
        <div class="mt-5 flex items-center gap-5">
          <div class="{day.animation} text-white/20 shrink-0">
            <DetailIcon size={88} strokeWidth={0.55} />
          </div>
          <div class="min-w-0">
            <div class="text-xl font-light text-white/90">{day.description}</div>
            <div class="mt-3 flex items-baseline gap-2 tabular-nums">
              <span class="text-6xl font-extralight text-white leading-none">{day.high}°</span>
              <span class="text-2xl font-light text-white/30">/ {day.low}°</span>
            </div>
            <div class="mt-1 text-xs font-light text-white/25 tracking-widest uppercase">Max · Min</div>
          </div>
        </div>
      </div>

      <!-- Sections -->
      <div class="px-6 pb-7 space-y-3">

        <!-- Niederschlag -->
        {#if r.precipitation_probability !== undefined || r.precipitation !== undefined}
          <div class="section">
            <div class="section-label">Niederschlag</div>
            <div class="grid grid-cols-2 gap-2">
              {#if r.precipitation_probability !== undefined}
                <div class="data-row">
                  <Droplets size={14} strokeWidth={1.5} class="text-blue-300/60 shrink-0" />
                  <span class="label">Wahrscheinlichkeit</span>
                  <span class="value">{fmt(r.precipitation_probability, ' %')}</span>
                </div>
              {/if}
              {#if r.precipitation !== undefined}
                <div class="data-row">
                  <Droplets size={14} strokeWidth={1.5} class="text-blue-300/60 shrink-0" />
                  <span class="label">Menge</span>
                  <span class="value">{fmt(r.precipitation, ' mm')}</span>
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Wind -->
        {#if r.wind_speed !== undefined || r.wind_gust_speed !== undefined}
          <div class="section">
            <div class="section-label">Wind</div>
            <div class="grid grid-cols-2 gap-2">
              {#if r.wind_speed !== undefined}
                <div class="data-row">
                  <Wind size={14} strokeWidth={1.5} class="text-white/40 shrink-0" />
                  <span class="label">
                    Geschwindigkeit
                    {#if r.wind_bearing !== undefined}
                      <span class="ml-1 text-white/30">{windDir(r.wind_bearing as number)}</span>
                    {/if}
                  </span>
                  <span class="value">{fmt(r.wind_speed, ' km/h', 1)}</span>
                </div>
              {/if}
              {#if r.wind_gust_speed !== undefined}
                <div class="data-row">
                  <Navigation size={14} strokeWidth={1.5} class="text-white/40 shrink-0" />
                  <span class="label">Böen</span>
                  <span class="value">{fmt(r.wind_gust_speed, ' km/h', 1)}</span>
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Atmosphäre -->
        <div class="section">
          <div class="section-label">Atmosphäre</div>
          <div class="grid grid-cols-2 gap-2">
            {#if r.humidity !== undefined}
              <div class="data-row">
                <Droplets size={14} strokeWidth={1.5} class="text-white/40 shrink-0" />
                <span class="label">Luftfeuchte</span>
                <span class="value">{fmt(r.humidity, ' %')}</span>
              </div>
            {/if}
            {#if r.dew_point !== undefined}
              <div class="data-row">
                <Thermometer size={14} strokeWidth={1.5} class="text-white/40 shrink-0" />
                <span class="label">Taupunkt</span>
                <span class="value">{fmt(r.dew_point, ' °C')}</span>
              </div>
            {/if}
            {#if r.pressure !== undefined}
              <div class="data-row">
                <Gauge size={14} strokeWidth={1.5} class="text-white/40 shrink-0" />
                <span class="label">Luftdruck</span>
                <span class="value">{fmt(r.pressure, ' hPa')}</span>
              </div>
            {/if}
            {#if r.cloud_coverage !== undefined}
              <div class="data-row">
                <Cloud size={14} strokeWidth={1.5} class="text-white/40 shrink-0" />
                <span class="label">Bewölkung</span>
                <span class="value">{fmt(r.cloud_coverage, ' %')}</span>
              </div>
            {/if}
            {#if r.uv_index !== undefined}
              <div class="data-row">
                <Sun size={14} strokeWidth={1.5} class="text-white/40 shrink-0" />
                <span class="label">UV-Index</span>
                <span class="value">{fmt(r.uv_index, '', 1)}</span>
              </div>
            {/if}
          </div>
        </div>

      </div>
    </div>
  {/if}
</dialog>

<style>
  .forecast-dialog {
    background: transparent;
  }

  .forecast-dialog::backdrop {
    background: oklch(0 0 0 / 0.5);
    backdrop-filter: blur(6px);
  }

  .forecast-dialog-inner {
    background: oklch(0.19 0.013 75 / 0.88);
    backdrop-filter: blur(32px) saturate(1.5);
    border: 1px solid oklch(1 0 0 / 0.09);
    box-shadow:
      0 0 0 0.5px oklch(0 0 0 / 0.5),
      0 32px 80px oklch(0 0 0 / 0.55),
      0 8px 24px oklch(0 0 0 / 0.3);
  }

  .section-label {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: oklch(1 0 0 / 0.25);
    padding: 0 0.25rem;
    margin-bottom: 0.5rem;
  }

  .data-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.75rem;
    border-radius: 0.75rem;
    background: oklch(1 0 0 / 0.045);
    border: 1px solid oklch(1 0 0 / 0.05);
  }

  .label {
    flex: 1;
    font-size: 0.8125rem;
    font-weight: 300;
    color: oklch(1 0 0 / 0.45);
    min-width: 0;
  }

  .value {
    font-size: 0.875rem;
    font-weight: 400;
    color: oklch(1 0 0 / 0.85);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
</style>
