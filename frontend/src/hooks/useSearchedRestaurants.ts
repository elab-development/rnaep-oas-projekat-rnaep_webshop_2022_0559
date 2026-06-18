import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useSearchedRestaurants = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  const { searchedRestaurants, setSearchedRestaurants } = context;
  return { searchedRestaurants, setSearchedRestaurants };
};