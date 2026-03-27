<script lang="ts">
  interface Props {
    name: string;
    location: string;
    streamUrl: string;
    isFocused?: boolean;
    index?: number;
    onclick?: () => void;
  }

  let { name, location, streamUrl, isFocused = false, index = 0, onclick }: Props = $props();
</script>

<button
  {onclick}
  class={`group relative overflow-hidden rounded-xl transition-all duration-300 focus:outline-none ${
    isFocused ? 'ring-2 ring-white/40' : ''
  }`}
>
  <!-- Border effect -->
  <div
    class="pointer-events-none absolute -inset-0.5 rounded-xl transition-all duration-300"
    class:opacity-100={isFocused}
    class:opacity-0={!isFocused}
    class:group-hover:opacity-50={!isFocused}
    style="background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));"
  ></div>

  <div
    class="glass-panel animate-fade-up relative aspect-square overflow-hidden rounded-lg"
    style="animation-delay: {50 + index * 30}ms"
  >
    <!-- Thumbnail video -->
    <video class="h-full w-full bg-black object-contain" muted playsinline>
      <source src={streamUrl} type="application/x-mpegURL" />
    </video>

    <div
      class="absolute inset-0 flex flex-col justify-start bg-linear-to-t from-black/70 via-transparent to-transparent p-2.5"
    >
      <div class="truncate text-xs leading-tight font-light text-white/85">{name}</div>
    </div>

    <!-- Overlay -->
    <div
      class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 via-transparent to-transparent p-2.5"
    >
      <div class="truncate text-xs leading-tight tracking-wider text-white/35 uppercase">
        {location}
      </div>
    </div>

    <!-- Focus indicator border -->
    {#if isFocused}
      <div class="pointer-events-none absolute inset-0 rounded-xl border border-white/60"></div>
    {/if}
  </div>
</button>
