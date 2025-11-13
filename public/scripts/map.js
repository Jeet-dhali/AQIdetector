import { computeAQI, getAqiColor } from "../scripts/aqiConversion.js";
import { locationData } from "./data.js";

//set map

initMap();

async function initMap() {
    const map = await setMap();
    setAqiMarker(map);
    setMarkersFromData(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
}

async function setMap() {
    const coords = await geoLocation();
    const lat = coords.lat;
    const lon = coords.lon;
    const zoom = 12;
    const map = L.map('map').setView([lat, lon], zoom);
    return map;
}

async function geoLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                resolve({lat, lon}); 
            },
            (error) => {
                console.error("Error:", error.message);
                reject(error); 
            }
        );
    });
}

async function setAqiMarker(map) {
    const coords = await geoLocation();
    const { lat, lon } = coords;

    const aqiData = await fetchRequestToBackend(coords);
    const name = await fetchLocation(coords);
    const pm2_5 = aqiData.pm2_5;
    const pm10  = aqiData.pm10;

    const newAqi = computeAQI(pm2_5, pm10);
    const aqiColor = getAqiColor(newAqi);

    const markerHtml = `
        <div style="
            background:${aqiColor};
            width:25px;
            height:25px;
            border-radius:50%;
            border:3px solid white;
            box-shadow:0px 0px 10px rgba(0,0,0,0.4);
        "></div>
    `;

    const aqiIcon = L.divIcon({
        html: markerHtml,
        className: "",
        iconSize: [25, 25]
    });

    L.marker([lat, lon], { icon: aqiIcon })
      .addTo(map)
      .bindPopup(`
        <div style="
        padding:12px;
        background:white;
        border-radius:12px;
        font-family:sans-serif;
        box-shadow:0 3px 12px rgba(0,0,0,0.25);
    ">
        <div style="text-align:center;">
            <h2 style="margin:0; font-size:20px;">Air Quality</h2>
            <h3 style="margin:0; font-size:20px;">${name.name}</h3>
            <span style="font-size:32px; font-weight:700; color:${aqiColor};">
                ${newAqi}
            </span>
        </div>
    </div>
        `)
      .openPopup();
}

function setMarkersFromData(map) {
    locationData.forEach(async (data) => {
        const coords = {lat: data.lat, lon: data.lon}
        const aqiData = await fetchRequestToBackend(coords);
        const pm2_5 = aqiData.pm2_5;
        const pm10  = aqiData.pm10;

        const newAqi = computeAQI(pm2_5, pm10);
        const aqiColor = getAqiColor(newAqi);

        const markerHtml = `
        <div style="
            background:${aqiColor};
            width:25px;
            height:25px;
            border-radius:50%;
            border:3px solid white;
            box-shadow:0px 0px 10px rgba(0,0,0,0.4);
        "></div>
    `;

    const aqiIcon = L.divIcon({
        html: markerHtml,
        className: "",
        iconSize: [25, 25]
    });

    L.marker([data.lat, data.lon], { icon: aqiIcon })
      .addTo(map)
      .bindPopup(`
        <div style="
        padding:12px;
        background:white;
        border-radius:12px;
        font-family:sans-serif;
        box-shadow:0 3px 12px rgba(0,0,0,0.25);
    ">
        <div style="text-align:center;">
            <h2 style="margin:0; font-size:20px;">Air Quality</h2>
            <h3 style="margin:0; font-size:20px;">${data.name}</h3>
            <span style="font-size:32px; font-weight:700; color:${aqiColor};">
                ${newAqi}
            </span>
        </div>
    </div>
        `)
      .openPopup();
    })
}

async function fetchRequestToBackend(coords) {
    const response = await fetch('/api/aqi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(coords),
    });
    return await response.json(); 
}

async function fetchLocation(coords) {
    const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(coords),
    });
    return await response.json(); 
}
