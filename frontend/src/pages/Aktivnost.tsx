import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import tripadvisorImg from '../assets/tripadvisor.png';
import { useLoading } from '../hooks/useLoading';
import Loader from '../components/Loader';
import { FaClock, FaMoneyBillWave } from 'react-icons/fa';

import { getAktivnostDetails } from '../utils/AktivnostApi'; 
import { AktivnostDetails } from '../models/Aktivnost';

const Aktivnost = () => {
  const [activity, setActivity] = useState<AktivnostDetails | null>(null);
  const { loading, setLoading } = useLoading();
  const { id } = useParams();
  
  const location = useLocation();
  const imageFromState = location.state?.imageFromList;

  useEffect(() => {
    const fetchDetails = async (idStr: string) => {
      setLoading(true);
      try {
        const res = await getAktivnostDetails(idStr);
        const data = res.data ? res.data : res;

        if (data) {
          setActivity(new AktivnostDetails(
            data.id,
            data.naziv,
            data.cena,
            data.trajanje,
            data.opis,
            data.image,
            data.destinacija_id
          ));
        }
      } catch (error) {
        console.error("Greška pri učitavanju detalja:", error);
      }
      setLoading(false);
    };

    if (id) fetchDetails(id);
  }, [id, setLoading]);

  if (loading) return <div className='flex justify-center mt-24'><Loader /></div>;

  const finalImage = imageFromState || activity?.image || tripadvisorImg;

  return (
    <div className="container mx-auto px-4 sm:px-20 mb-20">
      {activity && (
        <>
           <h1 className='font-extrabold text-center text-4xl md:text-5xl mt-12 md:mt-24 uppercase'>
            {activity.naziv}
          </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 mb-20'>
            <div className='flex items-center justify-center'>
              <img
                src={finalImage}
                alt={activity.naziv}
                className='rounded-2xl w-full max-w-2xl h-[400px] object-cover shadow-2xl'
              />
            </div>

            <div className='w-full lg:w-3/4 sticky top-60'>
              <div className='p-10 bg-white flex flex-col gap-10'>
                
                <div className='flex flex-col gap-8'>
                  <div className='flex items-center gap-6 p-4 bg-blue-100 rounded-full border border-blue-200'>
                    <FaClock className='text-blue-600 text-2xl' />
                    <div>
                      <p className='text-[10px] text-blue-500 font-bold uppercase tracking-wider'>Trajanje</p>
                      <p className='text-lg font-black text-blue-900'>{activity.trajanje}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100'>
                    <FaMoneyBillWave className='text-green-600 text-2xl' />
                    <div>
                      <p className='text-[10px] text-green-500 font-bold uppercase tracking-wider'>Cena po osobi</p>
                      <p className='text-lg font-black text-green-900'>{activity.cena} EUR</p>
                    </div>
                  </div>
                </div>

                <button className='w-full bg-[#00af87] text-white py-5 rounded-full font-black hover:bg-[#008767] transition-all shadow-lg uppercase tracking-widest text-sm'>
                 
                  Rezerviši termin
                </button>

                <p className='text-[11px] text-gray-400 text-center italic'>
                  * Besplatno otkazivanje do 24h pre početka
                </p>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Aktivnost;