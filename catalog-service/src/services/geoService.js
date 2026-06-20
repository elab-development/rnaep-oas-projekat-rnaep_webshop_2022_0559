const externalDataClient = require('./externalDataClient');

const getCityCoordinates = async (city) => {
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
};

module.exports = {
    getCityCoordinates
};