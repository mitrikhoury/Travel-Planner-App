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

// POST route to handle data fetching
app.post('/getData', async (req, res) => {
  const { city, date } = req.body;

  try {
    // Fetch data from Geonames API
    const geonamesURL = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`;
    const geoResponse = await axios.get(geonamesURL);
    console.log('Geonames Response:', geoResponse.data);

    if (!geoResponse.data.geonames || geoResponse.data.geonames.length === 0) {
      throw new Error('City not found in Geonames API');
    }

    const { lat, lng, countryName } = geoResponse.data.geonames[0];

    // Fetch data from Weatherbit API
    const weatherbitURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`;
    const weatherResponse = await axios.get(weatherbitURL);
    console.log('Weatherbit Response:', weatherResponse.data);

    // Fetch data from Pixabay API
    const pixabayURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${city}&image_type=photo`;
    const pixabayResponse = await axios.get(pixabayURL);
    console.log('Pixabay Response:', pixabayResponse.data);

    if (!pixabayResponse.data.hits || pixabayResponse.data.hits.length === 0) {
      throw new Error('No image found in Pixabay API');
    }

    // Respond with the combined data
    res.json({
      weather: weatherResponse.data.data[0],
      image: pixabayResponse.data.hits[0].webformatURL,
      country: countryName,
      daysAway: Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)),
    });
  } catch (error) {
    console.error('Error in /getData:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
});

// Export the app for testing
module.exports = app;

// Start the server only when not in test mode
if (require.main === module) {
  app.listen(8081, () => {
    console.log('Server running on port 8081');
  });
}
