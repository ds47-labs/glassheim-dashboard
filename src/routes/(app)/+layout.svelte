<script lang="ts">
  import background from '$lib/assets/weather-bg.jpg';
  import Header from '$lib/components/Header.svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';

  let { children } = $props();
</script>

<div style:background-image="url({background})" class="h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden">
  <div class="h-full w-full bg-black/30 flex flex-col">
  <Header />
  <main class="flex-1 px-16 pt-8 pb-24 flex flex-col gap-6 justify-center overflow-hidden">
  {@render children()}
  </main>
  <div class="px-8 pb-1">
    <span class="font-mono text-xs text-white/15">{__BUILD_VERSION__}</span>
  </div>
  <StatusBar />
  </div>
</div>
