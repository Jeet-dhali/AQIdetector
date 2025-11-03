import { locationData } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {

const changeButton = document.querySelector('.change-btn');
const refreshButton = document.querySelector('.refresh-btn');
const locationSelector = document.querySelector('.location-selector');

loadData();

//HTML Renderer

renderPage();

async function renderPage() {
    const coords = await geoLocation();
    const locationData = await fetchLocation(coords);
    const name = locationData.name;
    const country = locationData.country;
    const data = await fetchRequestToBackend(coords);
    const aqi = data.aqi;
    const pm2_5 = data.pm2_5;
    const pm10 = data.pm10;

    renderAqiHTML(aqi);
    renderLocationHTML(name, country);
    renderPollutantsHTML(pm2_5, pm10);
}

function pollutantsHTML(pm2_5, pm10) {
    const html = `<div class="pollutant-card pm25">
                    PM2.5 : ${pm2_5}
                </div>
                <div class="pollutant-card pm10">
                    PM10 : ${pm10}
                </div>`;
    return html;
}

function renderPollutantsHTML(pm2_5, pm10) {
    let html = ``;
    html += pollutantsHTML(pm2_5, pm10);
    document.querySelector('.pollutants-grid').innerHTML = html;
}

function locationHTML(name, country) {
    const html = `<h1>Air Aware</h1>
                <div class="location-display">
                    ${name}, ${country}
                </div>`;
    return html;
}

function renderLocationHTML(name, country) {
    let html = ``;
    html += locationHTML(name, country);
    document.querySelector('.header').innerHTML = html;
}

function aqiHTML(aqi) {
    const html = `<div class="aqi">${aqi}</div>`;
    return html;
}

function renderAqiHTML(aqi) {
    let html = ``;
    html += aqiHTML(aqi);
    document.querySelector('.aqi-display').innerHTML = html;
}

//location state

function getLocationName() {
    return locationSelector.value;
}

async function updateLocationName() {
    if (getLocationName() != "use current location"){
        const coords = getCoordsByName(getLocationName());
        const locationData = await fetchLocation(coords);
        const name = locationData.name;
        const country = locationData.country;
        document.querySelector('.location-display').textContent = `${name}, ${country}`;
    } else {
        const coords = await geoLocation();
        const locationData = await fetchLocation(coords);
        const name = locationData.name;
        const country = locationData.country;
        document.querySelector('.location-display').textContent = `${name}, ${country}`;
    }
}

//aqi

async function updateAqi() {
    if (getLocationName() != "Use current location") {
        const coords = getCoordsByName(getLocationName());
        const data = await fetchRequestToBackend(coords);
        document.querySelector('.aqi').textContent = data.aqi;
    } else {
        const coords = await geoLocation();
        const data = await fetchRequestToBackend(coords);
        document.querySelector('.aqi').textContent = data.aqi;
    }
}

//load data on refresh

async function loadData() {
    const coords = await geoLocation();
    const data = await fetchRequestToBackend(coords);
    const locationData = await fetchLocation(coords);
    const locationName = locationData.name;
    const locationCountry = locationData.country;
    document.querySelector('.location-display').textContent = `${locationName}, ${locationCountry}`;
    document.querySelector('.aqi').textContent = data.aqi;
    document.querySelector('.pm25').textContent = data.pm2_5;
    document.querySelector('.pm10').textContent = data.pm10;
}

//update pollutants

async function updatePollutantData() {
    if (getLocationName() != "Use current location") {
        const coords = getCoordsByName(getLocationName());
        const data = await fetchRequestToBackend(coords);
        document.querySelector('.pm25').textContent = data.pm2_5;
        document.querySelector('.pm10').textContent = data.pm10;
    } else {
        const coords = await geoLocation();
        const data = await fetchRequestToBackend(coords);
        document.querySelector('.pm25').textContent = data.pm2_5;
        document.querySelector('.pm10').textContent = data.pm10;
    }
}

//helper functions

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

//fetch to backend

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
});