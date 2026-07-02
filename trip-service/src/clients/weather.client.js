const axios = require('axios');
const CircuitBreaker = require('opossum'); // Uvezen Opossum 

// 1. Osnovna funkcija koja vrši direktan HTTP poziv ka API-ju
const fetchWeather = async (city) => {
  const url = `${process.env.WEATHER_API_URL || 'https://api.openweathermap.org'}/data/2.5/weather`;
  
  const response = await axios.get(url, {
    params: {
      q: city,
      appid: process.env.WEATHER_API_KEY || 'dummy_key',
      units: 'metric'
    },
    timeout: 3000 // Prekidaj zahtev ako se API ne javi nakon 3 sekunde
  });
  
  return response.data;
};

// 2. Podešavanje parametara za Circuit Breaker
const breakerOptions = {
  timeout: 4000,                // Ako cela operacija traje duže od 4s, aktiviraj timeout
  errorThresholdPercentage: 50, // Ako više od 50% zahteva pukne, otvori krug (Open)
  resetTimeout: 15000           // Nakon 15 sekundi pređi u Half-Open i testiraj ponovo API
};

// 3. Kreiranje Circuit Breaker-a oko naše funkcije
const breaker = new CircuitBreaker(fetchWeather, breakerOptions);

// 4. Definisanje Fallback mehanizma direktno na breakeru
breaker.fallback((city, error) => {
  console.warn(`[Circuit Breaker] Aktivan! Vraćam fallback za grad: ${city}. Razlog: ${error.message}`);
  return {
    source: 'circuit-breaker-fallback',
    message: 'Weather data currently unavailable. Circuit breaker is open.',
    main: { temp: 'N/A' },
    weather: [{ description: 'service unavailable' }]
  };
};

// Eksterna funkcija
const getWeather = async (city) => {
  // .fire() bezbedno pokreće breaker. Ako je krug otvoren, automatski se okida .fallback()
  return await breaker.fire(city);
};

module.exports = { getWeather };