const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'tripadvisor16.p.rapidapi.com';


const fetchExternalItems = async (city) => {
    try {
        console.log(`[RapidAPI TripAdvisor] Tražim lokaciju za grad: ${city}...`);

        const searchLocationOptions = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/api/v1/v1/tripadvisor/searchLocation`,
            params: { query: city },
            headers: {
                'X-RapidAPI-Key': "be309d377emsh9bf23ee50a29ea7p149e47jsnbbeca8701abf",
                'X-RapidAPI-Host': 'x-rapidapi-host: tripadvisor16.p.rapidapi.com'
            }
        };

        const locationResponse = await axios.request(searchLocationOptions);
        const locations = locationResponse.data?.data;

        if (!locations || locations.length === 0) {
            console.log(`[RapidAPI] Grad ${city} nije pronađen.`);
            return [];
        }

        const locationId = locations[0].locationId || locations[0].location_id;
        console.log(`[RapidAPI TripAdvisor] Pronađen ID grada (${city}): ${locationId}. Povlačim objekte...`);

        const conceptOptions = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/api/v1/v1/tripadvisor/getRestaurants`,
            params: { locationId: locationId, page: '1' },
            headers: {
                'X-RapidAPI-Key': "be309d377emsh9bf23ee50a29ea7p149e47jsnbbeca8701abf",
                'X-RapidAPI-Host':  'x-rapidapi-host: tripadvisor16.p.rapidapi.com' 
            }
        };

        const placesResponse = await axios.request(conceptOptions);
        const places = placesResponse.data?.data?.data || placesResponse.data?.data || [];

        if (places.length === 0) return [];

        return places.slice(0, 10).map(place => {
            return {
                name: place.name || 'Unknown Place',
                category: 'restaurant',
                city: city,
                address: place.address || place.location_string || 'Address available via TripAdvisor',
                description: place.description || 'Top rated place synced via TripAdvisor RapidAPI.',
                rating: place.rating ? parseFloat(place.rating) : 4.5,
                location: {
                    lat: place.latitude ? parseFloat(place.latitude) : 41.8902,
                    lng: place.longitude ? parseFloat(place.longitude) : 12.4922
                },
                tags: ['tripadvisor', 'rapidapi'].filter(Boolean),
                images: place.photo?.images?.large?.url ? [place.photo.images.large.url] : []
            };
        });

    } catch (error) {
        console.error(`[RapidAPI Error] Greška u komunikaciji:`, error.response?.data || error.message);
        return [];
    }
};


const geocodeCity = async (city) => {
    try {
        const response = await axios.get(`${process.env.NOMINATIM_BASE_URL}/search`, {
            params: { q: city, format: 'json', limit: 1 },
            headers: { 'User-Agent': process.env.APP_USER_AGENT }
        });
        return response.data;
    } catch (error) {
        console.error(`[Nominatim Error] Greška pri geokodiranju: ${error.message}`);
        return null;
    }
};

module.exports = {
    fetchExternalItems,
    geocodeCity
};