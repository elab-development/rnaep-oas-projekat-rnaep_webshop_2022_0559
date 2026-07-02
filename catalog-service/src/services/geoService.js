const CircuitBreaker = require('opossum');
const externalDataClient = require('./externalDataClient');

async function fetchCoordinatesFromAPI(city) {
    if (!city) {
        throw new Error('City query parameter is required');
    }

    const data = await externalDataClient.geocodeCity(city);

    if (!data || data.length === 0) {
        return null;
    }

    const result = data[0];

    return {
        city: city,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name
    };
}

const breakerOptions = {
    timeout: 3000,               
    errorThresholdPercentage: 50, 
    resetTimeout: 10000           
};

const breaker = new CircuitBreaker(fetchCoordinatesFromAPI, breakerOptions);

breaker.fallback((city) => {
    console.warn(`[Circuit Breaker] Eksterni API je nedostupan! Aktivan fallback za grad: ${city}`);
    return {
        city: city,
        lat: 44.7866, 
        lng: 20.4489,
        displayName: `${city} (Fallback lokacija - Eksterni servis u kvaru)`
    };
});

breaker.on('open', () => console.log('Stanje: OPEN! Blokiram direktne pozive ka API-ju.'));
breaker.on('halfOpen', () => console.log('Stanje: HALF_OPEN. Testiram da li je API proradio...'));
breaker.on('close', () => console.log('Stanje: CLOSED. Sve radi normalno.'));

const getCityCoordinates = async (city) => {
    return await breaker.fire(city);
};

module.exports = {
    getCityCoordinates
};