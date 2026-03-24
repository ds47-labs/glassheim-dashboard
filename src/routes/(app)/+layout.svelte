<script lang="ts">
  import background from '$lib/assets/weather-bg.jpg';
  import Header from '$lib/components/Header.svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';

  let { children } = $props();
</script>

<div
  style:background-image="url({background})"
  class="relative h-screen w-full bg-cover bg-center bg-no-repeat"
>
  <!-- Dark overlay with warm tint -->
  <div class="absolute inset-0 bg-linear-to-b from-black/40 via-black/25 to-black/50"></div>
  <!-- Noise texture -->
  <div class="noise-overlay absolute inset-0"></div>

  <div class="relative z-10 flex h-full w-full flex-col">
    <Header />
    <main class="flex min-h-0 flex-1 flex-col justify-center gap-4 px-12 pt-5 pb-4">
      {@render children()}
    </main>
    <div class="flex flex-col gap-2 px-12 pb-6">
      <div class="px-2">
        <span class="font-mono text-xs text-white/10">{__BUILD_VERSION__}</span>
      </div>
      <StatusBar />
    </div>
  </div>
</div>
