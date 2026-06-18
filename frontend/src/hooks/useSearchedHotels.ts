import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useSearchedHotels = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  const { searchedHotels, setSearchedHotels } = context;
  return { searchedHotels, setSearchedHotels };
};