import { api } from './api';

export const searchPlacesInDb = async (query: string) => {
    const res = await api.get('/api/catalog', {
        params: {
            city: query,
            category: 'hotel'
        }
    });

    return res.data;
};

export const importFromApi = async (query: string) => {
    const res = await api.get('/api/catalog', {
        params: {
            city: query,
            category: 'hotel'
        }
    });

    return res.data;
};

export const getHotelDetails = async (id: number) => {
    const res = await api.get(`/api/catalog/${id}`);
    return res.data;
};