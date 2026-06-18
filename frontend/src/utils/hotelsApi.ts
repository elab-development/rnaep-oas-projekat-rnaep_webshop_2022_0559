import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const searchPlacesInDb = async (query: string) => {
    const res = await axios.get(`${BASE_URL}/search`, { params: { query } });
    return res.data;
};

export const importFromApi = async (query: string) => {
    return await axios.post(`${BASE_URL}/import/destinations`, { query });
};

export const getHotelDetails = async (id: number) => {
    return await axios.get(`${BASE_URL}/places/${id}`);
};