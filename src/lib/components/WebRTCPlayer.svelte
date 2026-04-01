<script lang="ts">
  interface Props {
    streamUrl: string;
    muted?: boolean;
    useIframe?: boolean;
    onloaded?: () => void;
  }

  let { streamUrl, muted = false, useIframe = false, onloaded }: Props = $props();
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
    loading="eager"
    onload={onloaded}
  ></iframe>
{:else}
  <!-- Video mode: Native MP4 streaming -->
  <video
    class="h-full w-full bg-black object-contain"
    autoplay
    {muted}
    playsinline
    controls={false}
    preload="auto"
  >
    <source src={streamUrl} type="video/mp4" />
  </video>
{/if}
