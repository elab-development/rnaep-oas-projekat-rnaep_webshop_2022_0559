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

    const coordinates = result.geometry?.coordinates;
    const properties = result.properties || {};

    if (!coordinates || coordinates.length < 2) {
        return null;
    }

    const [lng, lat] = coordinates;

    return {
        city,
        lat,
        lng,
        displayName: properties.formatted || city
    };
}

const breakerOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
};

const breaker = new CircuitBreaker(fetchCoordinatesFromAPI, breakerOptions);

breaker.fallback((city) => {
    console.warn(`Eksterni API je nedostupan. Vraćam fallback za grad: ${city}`);

    return {
        city,
        lat: 44.7866,
        lng: 20.4489,
        displayName: `${city} (fallback lokacija)`
    };
});

breaker.on('open', () => console.log('OPEN - blokiram pozive ka eksternom API-ju.'));
breaker.on('halfOpen', () => console.log('HALF_OPEN - proveravam da li je API dostupan.'));
breaker.on('close', () => console.log('CLOSED - eksterni API radi normalno.'));

const getCityCoordinates = async (city) => {
    return await breaker.fire(city);
};

module.exports = {
    getCityCoordinates
};