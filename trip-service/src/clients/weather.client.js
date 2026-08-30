const axios = require('axios');
const CircuitBreaker = require('opossum');

// 1. Osnovna funkcija koja vrši direktan HTTP poziv ka API-ju
const fetchWeather = async (city) => {
  const url = `${process.env.WEATHER_API_URL || 'https://api.openweathermap.org'}/data/2.5/weather`;

  const response = await axios.get(url, {
    params: {
      q: city,
      appid: process.env.WEATHER_API_KEY || 'dummy_key',
      units: 'metric',
    },
    timeout: 3000,
  });

  return response.data;
};

// 2. Podešavanje parametara za Circuit Breaker
const breakerOptions = {
  timeout: 4000,
  errorThresholdPercentage: 50,
  resetTimeout: 15000,
};

// 3. Kreiranje Circuit Breaker-a oko funkcije
const breaker = new CircuitBreaker(fetchWeather, breakerOptions);

// 4. Fallback mehanizam
breaker.fallback((city, error) => {
  console.warn(
      `[Circuit Breaker] Aktivan! Vraćam fallback za grad: ${city}. Razlog: ${error?.message || 'unknown error'}`
  );

  return {
    source: 'circuit-breaker-fallback',
    message: 'Weather data currently unavailable. Circuit breaker is open.',
    main: { temp: 'N/A' },
    weather: [{ description: 'service unavailable' }],
  };
});

// Eksterna funkcija
const getWeather = async (city) => {
  return await breaker.fire(city);
};

module.exports = { getWeather };