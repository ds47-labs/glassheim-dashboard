<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let { title = "Device", state = "off", icon = "", active = false } = $props();

  function toggle() {
    dispatch('toggle');
  }
</script>

<button class="tile" class:active onclick={toggle}>
  <div class="info">
    <span class="title">{title}</span>
    <span class="state-text">{state.charAt(0).toUpperCase() + state.slice(1)}</span>
  </div>
  
  <div class="icon-container">
    {#if icon}
      <i class="icon-{icon}"></i> {:else}
      <div class="placeholder-icon"></div>
    {/if}
  </div>
</button>

<style>
  .tile {
    all: unset;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 24px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px; /* Homio-Stil: sehr dezent */
    min-height: 140px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    box-sizing: border-box;
    color: white;
  }

  .tile:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .tile.active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .info {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .title {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .state-text {
    font-size: 0.85rem;
    opacity: 0.6;
    margin-top: 4px;
  }

  .icon-container {
    opacity: 0.8;
  }
</style>