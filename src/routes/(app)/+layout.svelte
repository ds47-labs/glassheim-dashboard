<script lang="ts">
  import background from '$lib/assets/weather-bg.jpg';
  import Header from '$lib/components/Header.svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';

  let { children } = $props();
</script>

<div style:background-image="url({background})" class="relative h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden">
  <!-- Dark overlay with warm tint -->
  <div class="absolute inset-0 bg-linear-to-b from-black/40 via-black/25 to-black/50"></div>
  <!-- Noise texture -->
  <div class="noise-overlay absolute inset-0"></div>

  <div class="relative z-10 h-full w-full flex flex-col">
    <Header />
    <main class="flex-1 px-12 pt-6 pb-20 flex flex-col gap-5 justify-center overflow-hidden">
      {@render children()}
    </main>
    <div class="px-8 pb-0.5">
      <span class="font-mono text-xs text-white/10">{__BUILD_VERSION__}</span>
    </div>
    <StatusBar />
  </div>
</div>
