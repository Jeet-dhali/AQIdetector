import { locationData } from "./data.js";

const changeButton = document.querySelector('.change-btn');
const refreshButton = document.querySelector('.refresh-btn');
const locationDisplay = document.querySelector('.location-display');
const aqiDisplay = document.querySelector('.aqi');
const locationSelector = document.querySelector('.location-selector');
const pm2_5 = document.querySelector('.pm25');
const pm10 = document.querySelector('.pm10');

loadData();

function getLocationName() {
    return locationSelector.value;
}

function updateLocationName() {
    if (getLocationName != "use current location"){
    locationDisplay.textContent = getLocationName();
    } else {
        const coords = geoLocation();
        const locationData = fetchLocation(coords);
        const name = locationData.name;
        const country = locationData.country;
        locationDisplay.textContent = `${name}, ${country}`;
    }
}

async function updateAqi() {
    if (getLocationName() != "Use current location") {
        const coords = getCoordsByName(getLocationName());
        const data = await fetchRequestToBackend(coords);
        aqiDisplay.textContent = data.aqi;
    } else {
        const coords = await geoLocation();
        const data = await fetchRequestToBackend(coords);
        aqiDisplay.textContent = data.aqi;
    }
}

async function loadData() {
    const coords = await geoLocation();
    const data = await fetchRequestToBackend(coords);
    aqiDisplay.textContent = data.aqi;
    pm2_5.textContent = data.pm2_5;
    pm10.textContent = data.pm10;
}


async function updatePollutantData() {
    if (getLocationName() != "Use current location") {
        const coords = getCoordsByName(getLocationName());
        const data = await fetchRequestToBackend(coords);
        pm2_5.textContent = data.pm2_5;
        pm10.textContent = data.pm10;
    } else {
        const coords = await geoLocation();
        const data = await fetchRequestToBackend(coords);
        pm2_5.textContent = data.pm2_5;
        pm10.textContent = data.pm10;
    }
}

function getCoordsByName(locationName) {
    const location = locationData.find((data) => data.name === locationName);
    return {lat: location.lat, lon: location.lon};
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
                console.error("Error getting location:", error.message);
                reject(error); 
            }
        );
    });
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

changeButton.addEventListener('click', () => {
    updateAqi();
    updateLocationName();
    updatePollutantData();
});

refreshButton.addEventListener('click', () => {
    loadData();
})