import { createContext, ReactNode, useState, useEffect } from 'react';
import { SearchHotel } from '../models/Hotels';
import { SearchRestaurant } from '../models/Restaurant';
import { Favorite } from '../models/Favorites';
import { SearchAktivnost } from '../models/Aktivnost';

export interface GlobalContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  searchedHotels: SearchHotel[];
  setSearchedHotels: React.Dispatch<React.SetStateAction<SearchHotel[]>>;
  searchedAktivnosti: SearchAktivnost[];
  setSearchedAktivnosti: React.Dispatch<React.SetStateAction<SearchAktivnost[]>>;
  searchedRestaurants: SearchRestaurant[];
  setSearchedRestaurants: React.Dispatch<React.SetStateAction<SearchRestaurant[]>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
  user: any; 
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('hotels');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedHotels, setSearchedHotels] = useState<SearchHotel[]>([]);
  const [searchedAktivnosti, setSearchedAktivnosti] = useState<SearchAktivnost[]>([]);
  const [searchedRestaurants, setSearchedRestaurants] = useState<SearchRestaurant[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === "undefined") return null;
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
  });

  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const savedFavorites = localStorage.getItem('app_favorites');
    if (!savedFavorites || savedFavorites === "undefined") return [];
    try { return JSON.parse(savedFavorites); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('app_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token && !!user);
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        searchTerm, setSearchTerm, filter, setFilter, loading, setLoading,
        searchedHotels, setSearchedHotels, searchedAktivnosti, setSearchedAktivnosti,
        searchedRestaurants, setSearchedRestaurants, loggedIn, setLoggedIn,
        favorites, setFavorites, user, setUser
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;