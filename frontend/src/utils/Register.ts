
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';


export const registerUser = async (userData: any) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (credentials: any) => {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    return response.data;
};