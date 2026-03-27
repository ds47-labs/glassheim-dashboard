<script lang="ts">
  interface Props {
    streamUrl: string;
    muted?: boolean;
    useIframe?: boolean;
  }

  let { streamUrl, muted = false, useIframe = false }: Props = $props();
</script>

{#if useIframe}
  <!-- Iframe mode: Full go2rtc UI with WebRTC auto-select -->
  <iframe
    src={streamUrl}
    title="Camera stream"
    class="h-full w-full border-none bg-black"
    style="display: block; min-height: 0; min-width: 0;"
    allow="autoplay"
    sandbox="allow-same-origin allow-scripts allow-presentation"
    loading="lazy"
  ></iframe>
{:else}
  <!-- Video mode: Native MP4 streaming -->
  <video
    class="h-full w-full bg-black object-contain"
    autoplay
    {muted}
    playsinline
    controls={false}
  >
    <source src={streamUrl} type="video/mp4" />
  </video>
{/if}
