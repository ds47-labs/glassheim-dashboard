<script lang="ts">
  let { name }: { name: string } = $props();
</script>

<div class="flex flex-1 flex-col gap-4">
  <div class="glass-panel rounded-2xl p-8">
    <div class="flex items-end justify-between">
      <div>
        <p class="mb-1.5 text-xs tracking-[0.2em] text-white/25 uppercase">Raum</p>
        <h2 class="text-3xl font-extralight tracking-wide text-white/80">{name}</h2>
      </div>
      <p class="text-xs tracking-[0.15em] text-white/18 uppercase">In Vorbereitung</p>
    </div>
  </div>

  <div class="grid flex-1 grid-cols-3 gap-4">
    {#each Array(6) as _, i}
      <div
        class="glass-panel-subtle rounded-xl"
        style="min-height: 5rem;"
      ></div>
    {/each}
  </div>
</div>
