<script lang="ts">
  import RoomPlaceholder from '$lib/components/RoomPlaceholder.svelte';
  import { ChefHat, UtensilsCrossed, Sofa, Moon, Monitor } from 'lucide-svelte';
  import type { Icon } from 'lucide-svelte';

  const rooms: { id: string; label: string; icon: typeof Icon }[] = [
    { id: 'kitchen', label: 'Küche', icon: ChefHat },
    { id: 'dining', label: 'Esszimmer', icon: UtensilsCrossed },
    { id: 'living', label: 'Wohnzimmer', icon: Sofa },
    { id: 'bedroom', label: 'Schlafzimmer', icon: Moon },
    { id: 'office', label: 'Büro', icon: Monitor }
  ];

  let activeIndex = $state(0);

  // Drag state
  let dragStartX = $state<number | null>(null);
  let dragOffset = $state(0);
  let isDragging = $state(false);

  const DRAG_THRESHOLD = 50;

  let dragDestIndex = $derived.by(() => {
    if (!isDragging) return null;
    if (dragOffset < -20 && activeIndex < rooms.length - 1) return activeIndex + 1;
    if (dragOffset > 20 && activeIndex > 0) return activeIndex - 1;
    return null;
  });

  function onPointerDown(e: PointerEvent) {
    dragStartX = e.clientX;
    isDragging = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 5) isDragging = true;
    if (!isDragging) return;

    // Resist at edges
    const atStart = activeIndex === 0 && delta > 0;
    const atEnd = activeIndex === rooms.length - 1 && delta < 0;
    dragOffset = atStart || atEnd ? delta * 0.2 : delta;
  }

  function onPointerUp(e: PointerEvent) {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;

    if (Math.abs(delta) > DRAG_THRESHOLD) {
      if (delta < 0 && activeIndex < rooms.length - 1) activeIndex++;
      else if (delta > 0 && activeIndex > 0) activeIndex--;
    }

    dragStartX = null;
    dragOffset = 0;
    isDragging = false;
  }

  function onPointerCancel() {
    dragStartX = null;
    dragOffset = 0;
    isDragging = false;
  }
</script>

<div class="flex h-full flex-col gap-3">
  <!-- Swiper -->
  <div
    class="min-h-0 flex-1 cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
    role="region"
    aria-label="Räume"
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerCancel}
  >
    <div
      class="flex h-full"
      style="
        transform: translateX(calc({-activeIndex * 100}% + {dragOffset}px));
        transition: {isDragging ? 'none' : 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'};
        will-change: transform;
      "
    >
      {#each rooms as room (room.id)}
        <div class="h-full w-full shrink-0 select-none">
          <RoomPlaceholder name={room.label} />
        </div>
      {/each}
    </div>
  </div>

  <!-- Room indicator bar -->
  <div class="flex shrink-0 items-center justify-center gap-2 pb-1">
    {#each rooms as room, i (room.id)}
      {@const dist = Math.abs(i - activeIndex)}
      {@const isActive = i === activeIndex}
      {@const isDest = dragDestIndex === i}
      <button
        onclick={() => (activeIndex = i)}
        aria-label={room.label}
        class="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-300
               {isActive
          ? 'bg-(--accent-warm)/15 text-white'
          : isDest
            ? 'text-white/70'
            : dist === 1
              ? 'text-white/35 hover:text-white/55'
              : 'text-white/15 hover:text-white/30'}"
      >
        {#if isActive}
          <div class="h-1.5 w-1.5 rounded-full bg-(--accent-warm) shrink-0"></div>
        {/if}
        <span
          class="whitespace-nowrap font-medium tracking-[0.12em] uppercase transition-all duration-300
                 {isActive || isDest ? 'text-sm' : 'text-xs'}"
        >{room.label}</span>
      </button>
    {/each}
  </div>
</div>
