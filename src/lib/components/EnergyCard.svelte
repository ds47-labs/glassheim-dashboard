<script lang="ts">
  import { ha } from '$lib/ha/client.svelte';
  import { Zap } from 'lucide-svelte';

  type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
  const PERIODS: { key: Period; label: string }[] = [
    { key: 'daily', label: 'Heute' },
    { key: 'weekly', label: 'Woche' },
    { key: 'monthly', label: 'Monat' },
    { key: 'yearly', label: 'Jahr' }
  ];

  let period = $state<Period>('daily');

  // Live power (W)
  let solarW = $derived(parseFloat(ha.getState('sensor.power_solar_generation') ?? '0') || 0);
  let consumpW = $derived(parseFloat(ha.getState('sensor.power_consumption') ?? '0') || 0);
  let gridLoadW = $derived(parseFloat(ha.getState('sensor.power_grid_load') ?? '0') || 0);
  let pvGridW = $derived(parseFloat(ha.getState('sensor.power_pv_grid') ?? '0') || 0);
  let pvLoadW = $derived(parseFloat(ha.getState('sensor.power_pv_load') ?? '0') || 0);

  // Period energy totals (kWh)
  let solarKwh = $derived(
    parseFloat(ha.getState(`sensor.energy_solar_production_${period}`) ?? '0') || 0
  );
  let consumpKwh = $derived(
    parseFloat(ha.getState(`sensor.energy_consumption_${period}`) ?? '0') || 0
  );
  let importKwh = $derived(
    parseFloat(ha.getState(`sensor.energy_grid_imported_${period}`) ?? '0') || 0
  );
  let exportKwh = $derived(
    parseFloat(ha.getState(`sensor.energy_grid_exported_${period}`) ?? '0') || 0
  );
  let selfSuff = $derived(
    parseFloat(ha.getState(`sensor.energy_self_sufficiency_${period}`) ?? '0') || 0
  );

  function fmtW(w: number): string {
    const a = Math.abs(w);
    return a >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`;
  }

  function flowDur(w: number): string {
    return w > 1 ? `${Math.max(0.35, 3.8 - w / 450).toFixed(2)}s` : '999s';
  }

  let pvLoadDur = $derived(flowDur(pvLoadW));
  let pvGridDur = $derived(flowDur(pvGridW));
  let gridLoadDur = $derived(flowDur(gridLoadW));

  let suffColor = $derived(
    selfSuff >= 80
      ? 'oklch(0.72 0.20 142)'
      : selfSuff >= 50
        ? 'oklch(0.82 0.22 85)'
        : 'oklch(0.65 0.22 25)'
  );

  let solarGlow = $derived(Math.min(solarW / 2000, 1));
  let gridGlow = $derived(Math.min(gridLoadW / 2000, 1));

  // Off-screen animation pause
  let svgEl = $state<SVGSVGElement | null>(null);
  let animRunning = $state(true);

  $effect(() => {
    if (!svgEl) return;
    const obs = new IntersectionObserver(
      ([entry]) => { animRunning = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    obs.observe(svgEl);
    return () => obs.disconnect();
  });

  let playState = $derived(animRunning ? 'running' : 'paused');
</script>

<div class="glass-panel-elevated overflow-hidden rounded-2xl">
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-white/5 px-8 pb-5 pt-7">
    <div class="flex items-center gap-3">
      <Zap size={18} strokeWidth={1.2} class="text-amber-300/80" />
      <span class="text-sm font-medium tracking-[0.18em] text-white/75 uppercase">Energiefluss</span>
    </div>
    <div class="flex gap-1 rounded-xl bg-white/5 p-1">
      {#each PERIODS as p (p.key)}
        <button
          onclick={() => (period = p.key)}
          class="rounded-lg px-4 py-1.5 text-sm font-light transition-colors duration-200
            {period === p.key ? 'bg-white/12 text-white' : 'text-white/40 hover:text-white/65'}"
          style="touch-action: manipulation"
        >
          {p.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- SVG Flow Diagram -->
  <div class="px-6 pt-6 pb-2">
    <!--
      viewBox 500×175
      Nodes at cy=75, r=40 → bottom edge y=115
      Labels below: y=128, values: y=143
      Track lines at y=75
    -->
    <svg
      bind:this={svgEl}
      viewBox="0 0 500 175"
      class="w-full"
      role="img"
      aria-label="Energiefluss zwischen Solar, Haus und Netz"
    >
      <defs>
        <!-- Radial glow halos -->
        <radialGradient id="enc-solar-halo">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="enc-house-halo">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.16" />
          <stop offset="100%" stop-color="#60a5fa" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="enc-grid-halo">
          <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#94a3b8" stop-opacity="0" />
        </radialGradient>
        <!-- Node ring gradients — no purple -->
        <linearGradient id="enc-solar-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde68a" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.30" />
        </linearGradient>
        <linearGradient id="enc-house-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.65" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.20" />
        </linearGradient>
        <linearGradient id="enc-grid-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#cbd5e1" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#64748b" stop-opacity="0.15" />
        </linearGradient>
        <!-- Flow line gradients — no purple -->
        <linearGradient id="enc-pvload-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#34d399" />
        </linearGradient>
        <linearGradient id="enc-export-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#34d399" />
          <stop offset="100%" stop-color="#94a3b8" />
        </linearGradient>
        <linearGradient id="enc-import-grad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#60a5fa" />
        </linearGradient>
      </defs>

      <!-- Glow halos -->
      <circle cx="80"  cy="75" r="65" fill="url(#enc-solar-halo)" opacity={solarGlow} />
      <circle cx="250" cy="75" r="58" fill="url(#enc-house-halo)" />
      <circle cx="420" cy="75" r="65" fill="url(#enc-grid-halo)"  opacity={gridGlow + 0.18} />

      <!-- Track lines (inactive) -->
      <line x1="122" y1="75" x2="208" y2="75"
        stroke="oklch(1 0 0 / 0.07)" stroke-width="8" stroke-linecap="round" />
      <line x1="292" y1="75" x2="378" y2="75"
        stroke="oklch(1 0 0 / 0.07)" stroke-width="8" stroke-linecap="round" />

      <!-- Active flow: Solar → Haus -->
      {#if pvLoadW > 1}
        <line x1="122" y1="75" x2="208" y2="75"
          stroke="url(#enc-pvload-grad)" stroke-width="3.5" stroke-linecap="round"
          stroke-dasharray="9 13"
          style="animation: enc-fwd {pvLoadDur} linear infinite; animation-play-state: {playState}" />
      {/if}

      <!-- Active flow: Haus → Netz (export) -->
      {#if pvGridW > 1}
        <line x1="292" y1="75" x2="378" y2="75"
          stroke="url(#enc-export-grad)" stroke-width="3.5" stroke-linecap="round"
          stroke-dasharray="9 13"
          style="animation: enc-fwd {pvGridDur} linear infinite; animation-play-state: {playState}" />
      {/if}

      <!-- Active flow: Netz → Haus (import, right→left) -->
      {#if gridLoadW > 1}
        <line x1="378" y1="75" x2="292" y2="75"
          stroke="url(#enc-import-grad)" stroke-width="3.5" stroke-linecap="round"
          stroke-dasharray="9 13"
          style="animation: enc-fwd {gridLoadDur} linear infinite; animation-play-state: {playState}" />
      {/if}

      <!-- ══ SOLAR NODE cx=80, cy=75 ══ -->
      <circle cx="80" cy="75" r="40"
        fill="oklch(0.82 0.22 85 / 0.10)"
        stroke="url(#enc-solar-ring)" stroke-width="1.5" />
      <!-- Sun disc + rays (icon center at 75,66) -->
      <circle cx="80" cy="66" r="10" fill="oklch(0.88 0.22 85 / 0.88)" />
      {#each [0, 45, 90, 135, 180, 225, 270, 315] as deg (deg)}
        {@const rad = (deg * Math.PI) / 180}
        <line
          x1={80 + Math.cos(rad) * 14}
          y1={66 + Math.sin(rad) * 14}
          x2={80 + Math.cos(rad) * 19}
          y2={66 + Math.sin(rad) * 19}
          stroke="oklch(0.85 0.22 85 / 0.62)" stroke-width="1.8" stroke-linecap="round" />
      {/each}
      <!-- Labels below circle (bottom edge: 75+40=115) -->
      <text x="80" y="128" text-anchor="middle" class="enc-sublabel" fill="oklch(0.85 0.22 85 / 0.65)">Solar</text>
      <text x="80" y="143" text-anchor="middle" class="enc-value" fill="white">{fmtW(solarW)}</text>

      <!-- ══ HAUS NODE cx=250, cy=75 ══ -->
      <circle cx="250" cy="75" r="40"
        fill="oklch(0.70 0.08 230 / 0.10)"
        stroke="url(#enc-house-ring)" stroke-width="1.5" />
      <!-- House icon (shifted up, within r=40) -->
      <polygon points="250,50 274,67 226,67"
        fill="oklch(0.70 0.10 230 / 0.45)"
        stroke="oklch(0.75 0.10 230 / 0.72)" stroke-width="1.4" stroke-linejoin="round" />
      <rect x="235" y="67" width="30" height="20" rx="1"
        fill="oklch(0.70 0.10 230 / 0.28)"
        stroke="oklch(0.75 0.10 230 / 0.55)" stroke-width="1.4" />
      <rect x="244" y="77" width="12" height="10" rx="1"
        fill="oklch(0.70 0.10 230 / 0.50)" />
      <text x="250" y="128" text-anchor="middle" class="enc-sublabel" fill="oklch(0.72 0.10 230 / 0.65)">Haus</text>
      <text x="250" y="143" text-anchor="middle" class="enc-value" fill="white">{fmtW(consumpW)}</text>

      <!-- ══ NETZ NODE cx=420, cy=75 ══ -->
      <circle cx="420" cy="75" r="40"
        fill="oklch(0.62 0.04 240 / 0.08)"
        stroke="url(#enc-grid-ring)" stroke-width="1.5"
        opacity={gridLoadW > 1 ? 1 : 0.55} />
      <!-- Lightning bolt (icon center area) -->
      <path d="M 424,53 L 413,73 L 422,73 L 417,97 L 430,71 L 421,71 Z"
        fill="oklch(0.72 0.06 240 / 0.72)"
        stroke="oklch(0.80 0.06 240 / 0.30)" stroke-width="0.8" stroke-linejoin="round" />
      <text x="420" y="128" text-anchor="middle" class="enc-sublabel" fill="oklch(0.70 0.06 240 / 0.60)">Netz</text>
      <text x="420" y="143" text-anchor="middle" class="enc-value" fill="white">
        {gridLoadW > 1 ? `+${fmtW(gridLoadW)}` : pvGridW > 1 ? `−${fmtW(pvGridW)}` : '0 W'}
      </text>
    </svg>
  </div>

  <!-- Self-sufficiency -->
  <div class="px-8 pb-5">
    <div class="mb-2.5 flex items-center justify-between">
      <span class="text-sm text-white/55">Autarkiegrad</span>
      <span class="text-base font-light tabular-nums" style="color: {suffColor}">{selfSuff} %</span>
    </div>
    <div class="h-2 overflow-hidden rounded-full bg-white/8">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        style="width: {Math.min(selfSuff, 100)}%;
               background: linear-gradient(to right, oklch(0.85 0.22 85 / 0.9), oklch(0.72 0.20 142))"
      ></div>
    </div>
  </div>

  <!-- Energy stat boxes -->
  <div class="grid grid-cols-4 gap-3 border-t border-white/5 px-6 pb-6 pt-4">
    {#each [
      { label: 'Solar',     value: solarKwh,   accent: 'oklch(0.85 0.22 85)' },
      { label: 'Verbrauch', value: consumpKwh,  accent: 'oklch(0.72 0.10 230)' },
      { label: 'Export',    value: exportKwh,   accent: 'oklch(0.72 0.20 142)' },
      { label: 'Import',    value: importKwh,   accent: 'oklch(0.65 0.20 25)' }
    ] as stat (stat.label)}
      <div class="rounded-xl border border-white/5 bg-white/4 p-4">
        <div class="mb-1 text-xs font-medium tracking-[0.14em] uppercase"
          style="color: {stat.accent}; opacity: 0.85">{stat.label}</div>
        <div class="text-base font-light tabular-nums text-white/85">{stat.value.toFixed(1)} kWh</div>
      </div>
    {/each}
  </div>
</div>

<style>
  @keyframes enc-fwd {
    from { stroke-dashoffset: 22; }
    to   { stroke-dashoffset: 0; }
  }

  .enc-sublabel {
    font-family: inherit;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .enc-value {
    font-family: inherit;
    font-size: 13px;
    font-weight: 200;
    font-variant-numeric: tabular-nums;
  }

  @media (prefers-reduced-motion: reduce) {
    @keyframes enc-fwd {
      from, to { stroke-dashoffset: 0; }
    }
  }
</style>
