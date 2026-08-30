import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useFilter = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  const { filter, setFilter } = context;
  return { filter, setFilter };
};