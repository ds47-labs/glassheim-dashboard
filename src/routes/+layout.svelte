<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { ha } from '$lib/ha/client.svelte';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
  ha.connect();
  return () => ha.disconnect();
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
