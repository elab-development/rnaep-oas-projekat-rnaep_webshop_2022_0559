import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useFilter } from '../hooks/useFilter.hook';
import MenuBar from '../components/home/MenuBar';
import HotelList from '../components/search/HotelList';
import RestaurantList from '../components/search/RestaurantList';
import FavoritesList from '../components/search/FavoriteList'; 
import AktivnostList from '../components/search/AktivnostList'; 
import { useSearchedHotels } from '../hooks/useSearchedHotels';
import { useSearchedRestaurants } from '../hooks/useSearchedRestaurants';
import { useSearchedAktivnosti } from '../hooks/useSearchedAktivnost'; 
import { searchPlacesInDb, importFromApi } from '../utils/hotelsApi';
import { searchAktivnostiInDb, importAktivnostiFromApi } from '../utils/AktivnostApi'; 
import { SearchHotel } from '../models/Hotels';
import { SearchRestaurant } from '../models/Restaurant';
import { SearchAktivnost } from '../models/Aktivnost'; 
import { useLoggedIn } from '../hooks/useLoggedIn'; 
import UsersList from '../components/search/UserList';

const Home = () => {
  const { filter } = useFilter(); 
  const { user } = useLoggedIn(); 
  const navigate = useNavigate(); 
  
  const { searchedHotels, setSearchedHotels } = useSearchedHotels();
  const { searchedRestaurants, setSearchedRestaurants } = useSearchedRestaurants();
  const { searchedAktivnosti, setSearchedAktivnosti } = useSearchedAktivnosti(); 

  const [lastQuery, setLastQuery] = useState(""); 

  const handleSearch = async (query: string) => {
    setLastQuery(query); 
    
    try {
      let res = await searchPlacesInDb(query);
      
      if (!res || res.count === 0) {
        await importFromApi(query);
        res = await searchPlacesInDb(query);
      }

      const data = res.data || [];

      const hotels = data
        .filter((i: any) => i.tip === 'hotel')
        .map((h: any) => new SearchHotel(
          h.id, h.ime, h.prosecna_ocena, h.broj_recenzija, { min: 0, max: 0 }, h.slika || ""
        ));

      const restaurants = data
        .filter((i: any) => i.tip === 'restoran')
        .map((r: any) => new SearchRestaurant(
          r.id, r.ime, r.prosecna_ocena, r.broj_recenzija, "$$", r.slika || ""
        ));

      setSearchedHotels(hotels);
      setSearchedRestaurants(restaurants);

    } catch (e) {
      console.error("Hoteli/Restorani greška:", e);
    }

    try {
      let resAktivnosti = await searchAktivnostiInDb(query);
      
      if (!resAktivnosti || resAktivnosti.count === 0) {
        await importAktivnostiFromApi(query);
        resAktivnosti = await searchAktivnostiInDb(query);
      }

      const aktivnostiData = resAktivnosti.data || [];
      const aktivnosti = aktivnostiData.map((a: any) => 
        new SearchAktivnost(a.id, a.naziv, a.cena, a.trajanje, a.opis, a.image || a.slika || "")
      );

      setSearchedAktivnosti(aktivnosti);

    } catch (e) {
      console.error("Aktivnosti greška:", e);
    }
  };

  const idiNaStatistiku = () => {
    navigate('/statistika', {
      state: {
        brojHotela: searchedHotels.length,
        brojRestorana: searchedRestaurants.length,
        brojAktivnosti: searchedAktivnosti.length,
        grad: lastQuery 
      }
    });
  };

  return (
    <div>
      <MenuBar onSearch={handleSearch} />
      
      {lastQuery && (
        <div className="flex justify-center my-4">
          <button 
            onClick={idiNaStatistiku}
            className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition capitalize"
          >
            Pogledaj statistiku za {lastQuery}
          </button>
        </div>
      )}
      
      {filter === 'hotels' && <HotelList />}
      {filter === 'restaurants' && <RestaurantList />}
      {filter === 'aktivnosti' && <AktivnostList />}
      {filter === 'favorites' && <FavoritesList />}
      {filter === 'users' && user?.role === 'admin' && <UsersList />}
    </div>
  );
};

export default Home;