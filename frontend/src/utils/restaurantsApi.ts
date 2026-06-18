import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const getRestaurantsDetails = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/places/${id}`);
  return response.data; 
};