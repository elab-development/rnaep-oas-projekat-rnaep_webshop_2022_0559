// const axios = require('axios');

// const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
// const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'tripadvisor16.p.rapidapi.com';


// const fetchExternalItems = async (city) => {
//     try {
//         console.log(`[RapidAPI TripAdvisor] Tražim lokaciju za grad: ${city}...`);

//         const searchLocationOptions = {
//             method: 'GET',
//             url: `https://${RAPIDAPI_HOST}/api/v1/v1/tripadvisor/searchLocation`,
//             params: { query: city },
//             headers: {
//                 'X-RapidAPI-Key': RAPIDAPI_KEY,
//                 'X-RapidAPI-Host': RAPIDAPI_HOST
//             }
//         };

//         const locationResponse = await axios.request(searchLocationOptions);
//         const locations = locationResponse.data?.data;

//         if (!locations || locations.length === 0) {
//             console.log(`[RapidAPI] Grad ${city} nije pronađen.`);
//             return [];
//         }

//         const locationId = locations[0].locationId || locations[0].location_id;
//         console.log(`[RapidAPI TripAdvisor] Pronađen ID grada (${city}): ${locationId}. Povlačim objekte...`);

//         const conceptOptions = {
//             method: 'GET',
//             url: `https://${RAPIDAPI_HOST}/api/v1/v1/tripadvisor/getRestaurants`,
//             params: { locationId: locationId, page: '1' },
//             headers: {
//                 'X-RapidAPI-Key': RAPIDAPI_KEY,
//                 'X-RapidAPI-Host': RAPIDAPI_HOST
//             }
//         };

//         const placesResponse = await axios.request(conceptOptions);
//         const places = placesResponse.data?.data?.data || placesResponse.data?.data || [];

//         if (places.length === 0) return [];

//         return places.slice(0, 10).map(place => {
//             return {
//                 name: place.name || 'Unknown Place',
//                 category: 'restaurant',
//                 city: city,
//                 address: place.address || place.location_string || 'Address available via TripAdvisor',
//                 description: place.description || 'Top rated place synced via TripAdvisor RapidAPI.',
//                 rating: place.rating ? parseFloat(place.rating) : 4.5,
//                 location: {
//                     lat: place.latitude ? parseFloat(place.latitude) : 41.8902,
//                     lng: place.longitude ? parseFloat(place.longitude) : 12.4922
//                 },
//                 tags: ['tripadvisor', 'rapidapi'].filter(Boolean),
//                 images: place.photo?.images?.large?.url ? [place.photo.images.large.url] : []
//             };
//         });

//     } catch (error) {
//         console.error(`[RapidAPI Error] Greška u komunikaciji:`, error.response?.data || error.message);
//         return [];
//     }
// };


//  const geocodeCity = async (city) => {
//      try {
//          const response = await axios.get(`${process.env.NOMINATIM_BASE_URL}/search`, {
//              params: { q: city, format: 'json', limit: 1 },
//              headers: { 'User-Agent': process.env.APP_USER_AGENT }
//         });
//         return response.data;
//     } catch (error) {
//         console.error(`[Nominatim Error] Greška pri geokodiranju: ${error.message}`);        
//         throw error;
//     }
// };


// module.exports = {
//     fetchExternalItems,
//     geocodeCity
// };

const axios = require('axios');

const GEOAPIFY_BASE_URL = 'https://api.geoapify.com';

const fetchExternalItems = async (city) => {
    try {
        if (!process.env.GEOAPIFY_API_KEY) {
            console.warn('[Geoapify] GEOAPIFY_API_KEY nije podešen.');
            return [];
        }

        const geo = await axios.get(`${GEOAPIFY_BASE_URL}/v1/geocode/search`, {
            params: {
                text: city,
                limit: 1,
                apiKey: process.env.GEOAPIFY_API_KEY
            }
        });

        if (!geo.data.features || geo.data.features.length === 0) {
            return [];
        }

        const [lng, lat] = geo.data.features[0].geometry.coordinates;

        const places = await axios.get(`${GEOAPIFY_BASE_URL}/v2/places`, {
            params: {
                categories: 'catering.restaurant,accommodation.hotel,tourism.attraction',
                filter: `circle:${lng},${lat},30000`,
                bias: `proximity:${lng},${lat}`,
                limit: 100,
                apiKey: process.env.GEOAPIFY_API_KEY
            }
        });

        return places.data.features.map((place) => {
            const categories = place.properties.categories || [];

            let category = 'attraction';

            if (categories.some(c => c.startsWith('catering.restaurant'))) {
                category = 'restaurant';
            } else if (categories.some(c => c.startsWith('accommodation.hotel'))) {
                category = 'hotel';
            } else if (categories.some(c => c.startsWith('tourism'))) {
                category = 'attraction';
            }

            return {
                name: place.properties.name || 'Unknown',
                category,
                city,
                address: place.properties.formatted || 'Address not available',
                description: 'Imported from Geoapify',
                rating: 4.5,
                location: {
                    lat: place.properties.lat || lat,
                    lng: place.properties.lon || lng
                },
                tags: categories,
                images: []
            };
        });
    } catch (err) {
        console.error('[Geoapify Error]', err.response?.data || err.message);
        return [];
    }
};

const geocodeCity = async (city) => {
    if (!process.env.GEOAPIFY_API_KEY) {
        throw new Error('GEOAPIFY_API_KEY nije podešen.');
    }

    const response = await axios.get(`${GEOAPIFY_BASE_URL}/v1/geocode/search`, {
        params: {
            text: city,
            limit: 1,
            apiKey: process.env.GEOAPIFY_API_KEY
        }
    });

    return response.data.features;
};

module.exports = {
    geocodeCity,
    fetchExternalItems
};