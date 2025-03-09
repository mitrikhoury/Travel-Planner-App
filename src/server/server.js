const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Utility function to fetch Geonames API data
const fetchGeonamesData = async (city) => {
  const geonamesURL = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`;
  const response = await axios.get(geonamesURL);

  if (!response.data.geonames || response.data.geonames.length === 0) {
    throw new Error('City not found in Geonames API');
  }

  const { lat, lng, countryName } = response.data.geonames[0];
  return { lat, lng, country: countryName };
};

// Utility function to fetch Weatherbit API data
const fetchWeatherData = async (lat, lng) => {
  const weatherbitURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`;
  const response = await axios.get(weatherbitURL);

  return response.data.data[0];
};

// Utility function to fetch Pixabay API data
const fetchImageData = async (city) => {
  const pixabayURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${city}&image_type=photo`;
  const response = await axios.get(pixabayURL);

  if (!response.data.hits || response.data.hits.length === 0) {
    throw new Error('No image found in Pixabay API');
  }

  return response.data.hits[0].webformatURL;
};

// Calculate days away from today
const calculateDaysAway = (date) => {
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
};

// POST route to fetch travel data
app.post('/getData', async (req, res) => {
  const { city, date } = req.body;

  try {
    // Fetch data from APIs
    const { lat, lng, country } = await fetchGeonamesData(city);
    const weather = await fetchWeatherData(lat, lng);
    const image = await fetchImageData(city);

    // Respond with compiled data
    res.json({
      weather,
      image,
      country,
      daysAway: calculateDaysAway(date),
    });
  } catch (error) {
    console.error('Error in /getData:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Export app for testing
module.exports = app;

// Start server only when not in test mode
if (require.main === module) {
  const PORT = 8081;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
