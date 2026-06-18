import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useFavorites = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  const { favorites, setFavorites } = context;
  return { favorites, setFavorites };
};