<script lang="ts">
  import WebRTCPlayer from './WebRTCPlayer.svelte';

  interface Props {
    streamUrl: string;
    iframeUrl?: string;
  }

  let { streamUrl, iframeUrl }: Props = $props();

  let isLoading = $state(true);

  $effect(() => {
    // Reset loading whenever the stream changes
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    iframeUrl || streamUrl;
    isLoading = true;
  });
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
    <WebRTCPlayer streamUrl={iframeUrl || streamUrl} useIframe={true} onloaded={() => (isLoading = false)} />

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
