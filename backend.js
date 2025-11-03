const express = require('express');
const  axios = require('axios');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/aqi', async (req, res) => {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`)
    const data = response.data;
    const item = data.list[0];
    const result = {
        aqi: item.main.aqi,
        pm2_5: item.components.pm2_5,
        pm10: item.components.pm10
    }

return res.json(result);
    
})

app.post('/api/location', async (req, res) => {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`)
    const data = response.data;
    const item = data[0];
    const result = {
        name: item.name,
        country: item.country
    }

    return res.json(result);
})

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})