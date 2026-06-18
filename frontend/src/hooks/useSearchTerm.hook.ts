import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useSearchTerm = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  const { searchTerm, setSearchTerm } = context;
  return { searchTerm, setSearchTerm };
};