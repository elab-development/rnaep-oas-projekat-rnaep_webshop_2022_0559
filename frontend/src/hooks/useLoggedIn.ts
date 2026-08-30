import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useLoggedIn = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  return { 
    loggedIn: context.loggedIn, 
    setLoggedIn: context.setLoggedIn, 
    user: context.user, 
    setUser: context.setUser 
  };
};