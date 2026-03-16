<script>
  import GlassTile from './GlassTile.svelte';

  import background from '$lib/assets/weather-bg.jpg';

  // $entities['weather.hamavil']
  let { weatherData = {
    temperature: "16°",
    condition: "Light Rain Showers - Wagram",
    icon: "rainy",
    forecast: [
      { day: "MON", tempHigh: "18°", tempLow: "12°", icon: "cloudy", condition: "Cloudy" },
      { day: "TUE", tempHigh: "18°", tempLow: "12°", icon: "sunny", condition: "Sunny" },
      { day: "WED", tempHigh: "16°", tempLow: "12°", icon: "cloudy", condition: "Cloudy" },
      { day: "THU", tempHigh: "18°", tempLow: "12°", icon: "rainy", condition: "Cloudy" },
      { day: "FRI", tempHigh: "16°", tempLow: "12°", icon: "sunny", condition: "Sunny" }
    ],
    details: {
      precipitation: "60% (5mm total)",
      wind: "15 km/h NW",
      pressure: "1012 hPa",
      uvIndex: "3 (Moderate)",
      sunrise: "06:15",
      sunset: "19:45"
    }
  }} = $props();
</script>

<div class="weather-page" style:background-image="url({background})">
  <div class="glass-overlay">
    
    <div class="main-panel">
      <div class="current-weather">
        <div class="current-icon icon-{weatherData.icon}"></div>
        <div class="temperature">{weatherData.temperature}C</div>
        <div class="condition">{weatherData.condition}</div>
      </div>

      <div class="forecast-row">
        {#each weatherData.forecast as day}
          <!-- <ForecastDay {...day} /> -->
        {/each}
      </div>
    </div>

    <div class="detail-grid">
      <GlassTile 
        title="Precipitation" 
        state={`Chance: ${weatherData.details.precipitation}`}
        icon="drop"
      />
      <GlassTile 
        title="Wind & Pressure" 
        state={`Wind: ${weatherData.details.wind}\nPressure: ${weatherData.details.pressure}`}
        icon="wind"
      />
      <GlassTile 
        title="Sun & UV" 
        state={`UV: ${weatherData.details.uvIndex}\nSunrise: ${weatherData.details.sunrise}\nSunset: ${weatherData.details.sunset}`}
        icon="sun"
      />
    </div>
    
  </div>
</div>

<style>
  .weather-page {
    height: 100vh;
    background-size: cover;
    background-position: center;
    font-family: 'Inter', sans-serif;
    color: white;
  }

  .glass-overlay {
    height: 100%;
    padding: 60px;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Inhalt nach unten schieben */
  }

  .main-panel {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-radius: 4px;
    padding: 40px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .current-weather {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .temperature {
    font-size: 6rem;
    font-weight: 600;
  }

  .condition {
    font-size: 1.2rem;
    opacity: 0.8;
  }

  .forecast-row {
    display: flex;
    gap: 15px;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  /* Platzhalter für Icons */
  .current-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.2); }
  .icon-rainy { /* Rain icon logic */ }
</style>