<script lang="ts">
  import CameraView from '$lib/components/CameraView.svelte';
  import CameraThumbnail from '$lib/components/CameraThumbnail.svelte';

  interface Camera {
    id: string;
    name: string;
    location: string;
    streamUrl: string;
  }

  const cameras: Camera[] = [
    {
      id: '1',
      name: 'CAM 1',
      location: 'HÜHNER',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=garden_chicken'
    },
    {
      id: '2',
      name: 'CAM 2',
      location: 'GARTENTOR',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=garden_door'
    },
    {
      id: '3',
      name: 'CAM 3',
      location: 'GARTEN',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=garden_garden'
    },
    {
      id: '4',
      name: 'CAM 4',
      location: 'GRILLPLATZ',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=garden_sluice_dining'
    },
    {
      id: '5',
      name: 'CAM 5',
      location: 'CARPORT',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=garden_carport'
    },
    {
      id: '6',
      name: 'CAM 6',
      location: 'WOHNZIMMER',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=living_room'
    },
    {
      id: '7',
      name: 'CAM 7',
      location: 'SCHLEUSE',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=sluice'
    },
    {
      id: '8',
      name: 'CAM 8',
      location: 'GARAGE',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=garage'
    },
    {
      id: '9',
      name: 'CAM 9',
      location: 'GANG',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=corridor'
    },
    {
      id: '10',
      name: 'CAM 10',
      location: 'KÜCHE',
      streamUrl: 'https://go2rtc.ds47.dev/stream.html?src=kitchen'
    }
  ];

  let focusedCamera = $state(cameras[0]);
  let isLoading = $state(false);

  function handleCameraClick(camera: Camera) {
    if (focusedCamera.id === camera.id) return;
    isLoading = true;
    focusedCamera = camera;
    setTimeout(() => {
      isLoading = false;
    }, 300);
  }
</script>

<div class="flex h-full flex-col gap-6">
  <!-- Top: Large Focus Camera -->
  <div class="h-180 overflow-hidden rounded-2xl">
    <CameraView
      name={focusedCamera.name}
      location={focusedCamera.location}
      streamUrl={focusedCamera.streamUrl}
      {isLoading}
      showControls={true}
    />
  </div>

  <!-- Bottom: Full Width Camera Grid (2 rows) -->
  <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
    <div class="text-xs font-medium tracking-wider text-white/50 uppercase">
      {cameras.length} Kameras
    </div>
    <div class="grid grid-cols-10 gap-3 overflow-y-auto pr-2">
      {#each cameras as camera, i (camera.id)}
        <CameraThumbnail
          name={camera.name}
          location={camera.location}
          streamUrl={camera.streamUrl}
          isFocused={focusedCamera.id === camera.id}
          index={i}
          onclick={() => handleCameraClick(camera)}
        />
      {/each}
    </div>
  </div>
</div>
