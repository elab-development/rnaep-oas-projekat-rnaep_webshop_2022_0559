import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import defaultRestaurantImg from '../assets/tripadvisor.png'; 
import { useLoading } from '../hooks/useLoading';
import Loader from '../components/Loader';
import axios from 'axios';
import {  RestaurantDetails } from '../models/Restaurant'; 

const Restaurant = () => {
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const { loading, setLoading } = useLoading();
  const { id } = useParams();
  const location = useLocation();
  const [ocena, setOcena] = useState(5);
  const [deskripcija, setDeskripcija] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const imageFromState = location.state?.imageFromList;

  const ostaviRecenziju = async () => {
    if (!deskripcija.trim()) {
      alert("Molimo unesite komentar.");
      return;
    }

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role'); 

    if (!token) {
      alert("Morate biti ulogovani da biste ostavili utisak.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:8000/api/recenzije', {
        mesto_id: parseInt(id || "0"), 
        ocena: ocena,
        deskripcija: deskripcija
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      alert("Recenzija je uspešno sačuvana!");
      setDeskripcija(""); 
      window.location.reload(); 
    } catch (error: any) {
      console.error("Greška:", error.response?.data);
      if (error.response?.status === 422) {
        alert("Već ste ostavili recenziju za ovo mesto.");
      } else {
        alert(error.response?.data?.message || "Greška pri slanju. Proverite dozvole na serveru.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchRestaurantDetails = async (idStr: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/places/${idStr}`);
        const res = response.data.data ? response.data.data : response.data;

        if (res && res.place) {
          const p = res.place;
          
          const mappedRestaurant = new RestaurantDetails(
            p.id,
            p.name || p.ime || "Nepoznato",
            Number(p.rating || p.prosecna_ocena || 0),
            Number(p.reviews || p.broj_recenzija || 0),
            p.priceRange || "€€",                    
            p.image || p.slika || "",                 
            p.link || p.tripadvisor_link || "",       
            p.address || p.adresa || "Nema adrese",   
            p.recenzije || []                        
          );
          setRestaurant(mappedRestaurant);
        }
      } catch (error) {
        console.error("Greška pri učitavanju:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRestaurantDetails(id);
  }, [id, setLoading]);

  if (loading) return <div className='flex justify-center mt-24'><Loader /></div>;

  const finalImage = imageFromState || restaurant?.image || defaultRestaurantImg;

  return (
    <div className="container mx-auto px-4 pb-20">
      {!restaurant && !loading && (
        <h1 className='font-extrabold text-center text-3xl mt-24 text-red-600'>Podaci nisu pronađeni!</h1>
      )}
      
      {restaurant && (
        <>
          
          <h1 className='font-extrabold text-center text-4xl md:text-5xl mt-12 md:mt-24 uppercase text-gray-900'>
            {restaurant.name}
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10'>
           
            <div className='flex items-center justify-center'>
              <img src={finalImage} alt={restaurant.name} className='rounded-3xl w-full h-[450px] object-cover shadow-2xl shadow-black/20'/>
            </div>

            <div className='flex flex-col justify-center space-y-6'>
               

                 <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-6">
                    <p className="text-orange-800 font-bold">📍 Adresa:</p>
                    <p className="text-gray-700">{restaurant.address}</p>
                 </div>

              

              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-yellow-50 p-4 rounded-2xl border border-yellow-100 text-center'>
                  <p className='text-sm text-yellow-600 font-bold uppercase text-xs'>Ocena</p>
                  <p className='text-3xl font-black'>⭐ {Number(restaurant.rating).toFixed(1)}</p>
                </div>
                <div className='bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center'>
                  <p className='text-sm text-gray-500 font-bold uppercase text-xs'>Recenzije</p>
                  <p className='text-3xl font-black'>💬 {restaurant.reviews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-10 border-l-8 border-orange-500 pl-4 uppercase">Iskustva posetilaca</h2>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-12">
               <h3 className="font-bold text-xl mb-4">Vaš utisak o mestu:</h3>
               <div className="flex gap-2 mb-4">
                  {[1,2,3,4,5].map((num) => (
                    <button key={num} onClick={() => setOcena(num)} className={`text-2xl transition-all ${ocena >= num ? 'scale-110' : 'grayscale opacity-30'}`}>
                      ⭐
                    </button>
                  ))}
               </div>
               <textarea 
                  value={deskripcija}
                  onChange={(e) => setDeskripcija(e.target.value)}
                  placeholder="Napišite nešto o hrani, ambijentu ili usluzi..."
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 mb-4 h-32 focus:ring-2 focus:ring-orange-500 outline-none"
               />
               <button 
                  onClick={ostaviRecenziju}
                  disabled={submitting}
                  className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-orange-600 transition-all disabled:bg-gray-400"
               >
                  {submitting ? "Slanje..." : "OBJAVI RECENZIJU"}
               </button>
            </div>

            <div className="space-y-6">
              {restaurant.recenzije && restaurant.recenzije.length > 0 ? (
                restaurant.recenzije.map((r: any) => (
                  <div key={r.id} className="bg-gray-50 p-6 rounded-2xl border-l-4 border-orange-500 flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-black text-lg text-gray-800 uppercase flex items-center gap-2">
                        {r.user?.name || r.user?.ime || "Korisnik"}
                        {r.user?.role === 'admin' && <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded">ADMIN</span>}
                      </p>
                      <span className="bg-white px-3 py-1 rounded-full text-orange-600 font-bold border border-orange-100">⭐ {r.ocena}</span>
                    </div>
                    <p className="text-gray-600 italic leading-relaxed">"{r.deskripcija}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                   <p className="text-gray-400">Nema komentara. Budite prvi koji će oceniti ovaj restoran!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Restaurant;