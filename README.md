# air-aware-2

# AirAware — Real-Time Air Quality & Pollution Monitoring

AirAware is a real-time air quality monitoring web app that provides live AQI (Air Quality Index) and pollutant data for your location using the API like OpenWeather.  
It’s designed to help users stay informed about the air they breathe — anywhere, anytime.

 ## Features

- **Real-Time Data** — Fetches current AQI and pollutants (PM2.5, PM10, CO, NO₂, O₃, etc.)  
- **Auto Location Detection** — Uses browser **Geolocation API**

## Tech Stack

  **Frontend** HTML, CSS, Vanilla Javascript
  **Backend** Node.js, Express 
  **APIs Used** [OpenWeather Air Pollution API](https://openweathermap.org/api/air-pollution)

## How It Works

1. **Detect Location**
   - Uses the browser’s `navigator.geolocation` API (HTTPS required)  
   - If unavailable, falls back to **IP-based geolocation** using `ip-api.com`

2. **Fetch AQI Data**
   - Sends coordinates to the **OpenWeather Air Pollution API**
   - Receives AQI and pollutant values in JSON format

3. **Display Results**
   - Shows live AQI value, color-coded air quality levels, and pollutant breakdown

   ## 🧠 Understanding AQI Levels (OpenWeather Standard)

## Future Plans

    Interactive AQI Map

    Historical Graphs & Trends

    Push Notifications for unhealthy air levels

    Suggestions based on AQI level