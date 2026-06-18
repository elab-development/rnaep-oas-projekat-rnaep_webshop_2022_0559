import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';


export const searchAktivnostiInDb = async (query: string) => {
    const res = await axios.get(`${BASE_URL}/aktivnosti/search`, { params: { query } });
    return res.data;
};


export const importAktivnostiFromApi = async (query: string) => {
    return await axios.post(`${BASE_URL}/import-aktivnosti`, { query });
};


export const getAktivnostDetails = async (id: string | number) => {
    const res = await axios.get(`${BASE_URL}/aktivnosti/${id}`);
    return res.data;
};