<script lang="ts">
  import { Volume2, Mic, Settings } from 'lucide-svelte';

  interface Props {
    name: string;
    location: string;
    streamUrl: string;
    isLoading?: boolean;
    showControls?: boolean;
  }

  let { name, location, streamUrl, isLoading = false, showControls = true }: Props = $props();
</script>

<div class="group relative h-full overflow-hidden rounded-2xl">
  <!-- Glow effect -->
  <div
    class="absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    style="background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); pointer-events: none;"
  ></div>

  <div class="glass-panel-elevated relative h-full overflow-hidden rounded-2xl">
    <!-- Loading state -->
    {#if isLoading}
      <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
        <div class="relative h-12 w-12">
          <div class="animate-spin-slow absolute inset-0 rounded-full border border-white/20"></div>
          <div
            class="absolute inset-2 rounded-full border border-white/10"
            style="animation: spin 3s linear infinite reverse;"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="h-1.5 w-1.5 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Video stream -->
    <video
      class="h-full w-full bg-black object-contain"
      controls={false}
      autoplay
      muted
      playsinline
    >
      <source src={streamUrl} type="application/x-mpegURL" />
      Your browser does not support the video tag.
    </video>

    <!-- FOCUS indicator -->
    <div class="pointer-events-none absolute top-6 left-6 z-30">
      <div class="relative h-12 w-12">
        <div
          class="absolute inset-0 rounded-full border border-white/30"
          style="animation: pulse 2s ease-in-out infinite;"
        ></div>
        <div
          class="absolute inset-0 flex items-center justify-center text-xs font-medium tracking-wider text-white/40"
        >
          FOCUS
        </div>
      </div>
    </div>

    {#if showControls}
      <!-- Controls overlay -->
      <div
        class="absolute right-0 bottom-0 left-0 z-20 bg-linear-to-t from-black/85 via-black/50 to-transparent p-5"
      >
        <div class="flex items-end justify-between gap-4">
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-base font-light text-white">{name}</h3>
            <p class="mt-1 text-xs tracking-wider text-white/40 uppercase">{location}</p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button
              class="rounded-md bg-white/8 p-1.5 text-white/60 backdrop-blur transition-colors hover:bg-white/15 hover:text-white/80"
              title="Microphone"
            >
              <Mic class="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <button
              class="rounded-md bg-white/8 p-1.5 text-white/60 backdrop-blur transition-colors hover:bg-white/15 hover:text-white/80"
              title="Volume"
            >
              <Volume2 class="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <button
              class="rounded-md bg-white/8 p-1.5 text-white/60 backdrop-blur transition-colors hover:bg-white/15 hover:text-white/80"
              title="Settings"
            >
              <Settings class="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
