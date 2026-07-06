import { api } from './api';

export const searchAktivnostiInDb = async (query: string) => {
    const res = await api.get('/api/catalog', {
        params: {
            city: query,
            category: 'attraction'
        }
    });

    return res.data;
};

export const importAktivnostiFromApi = async (query: string) => {
    const res = await api.get('/api/catalog', {
        params: {
            city: query,
            category: 'attraction'
        }
    });

    return res.data;
};

export const getAktivnostDetails = async (id: string | number) => {
    const res = await api.get(`/api/catalog/${id}`);
    return res.data;
};