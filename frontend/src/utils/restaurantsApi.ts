import { api } from './api';

export const getRestaurantsDetails = async (id: string) => {
  const response = await api.get(`/api/catalog/${id}`);
  return response.data;
};