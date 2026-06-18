import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useLoading = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  const { loading, setLoading } = context;
  return { loading, setLoading };
};