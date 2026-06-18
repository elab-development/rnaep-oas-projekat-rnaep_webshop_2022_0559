import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useSearchedAktivnosti = () => {
  const context = useContext(GlobalContext);
  
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }

  // Izvlačimo stanje za aktivnosti iz tvog GlobalContext-a
  const { searchedAktivnosti, setSearchedAktivnosti } = context;

  return { searchedAktivnosti, setSearchedAktivnosti };
};