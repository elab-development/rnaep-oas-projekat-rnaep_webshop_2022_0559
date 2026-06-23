const axios = require('axios');

const getWeather = async (city) => {
  const url = `${process.env.WEATHER_API_URL || 'https://api.openweathermap.org'}/data/2.5/weather`;
  try {
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY || 'dummy_key',
        units: 'metric'
      },
      timeout: 3000
    });
    return response.data;
  } catch (error) {
    console.error('Weather API unavailable, skipping gracefully.');
    return { message: 'Weather data currently unavailable.' };
  }
};

module.exports = { getWeather };