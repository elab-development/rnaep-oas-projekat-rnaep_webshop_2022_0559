import { useLoading } from '../../hooks/useLoading';
import { useEffect, useState } from 'react';
import { useSearchedAktivnosti } from '../../hooks/useSearchedAktivnost'; // Tvoj novi hook
import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
import Loader from '../Loader';
import AktivnostCard from './AktivnostCard'; // Nova kartica koju smo napravili

const AktivnostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Koristimo stanje za aktivnosti umesto hotela
  const { searchedAktivnosti } = useSearchedAktivnosti();
  const { searchTerm } = useSearchTerm();
  const { loading } = useLoading();

  useEffect(() => {
    if (searchedAktivnosti?.length > 0) {
      // Paginacija na 12 elemenata po stranici
      setTotalPages(Math.ceil(searchedAktivnosti.length / 12));
    }
    setCurrentPage(1);
  }, [searchedAktivnosti]);

  if (loading) {
    return (
      <div className='flex justify-center mt-20'>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {searchTerm
        ? searchedAktivnosti.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                No activities found! Try something else
              </h2>
            </div>
          )
        : searchedAktivnosti.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                Enter your destination to find activities!
              </h2>
            </div>
          )}

      {/* Grid za prikaz kartica aktivnosti */}
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-5 mb-5'>
        {searchedAktivnosti
          ?.slice(currentPage * 12 - 12, currentPage * 12)
          .map((aktivnost, idx) => (
            <AktivnostCard key={idx} aktivnost={aktivnost} />
          ))}
      </div>

      {/* Paginacija */}
      {searchedAktivnosti?.length > 0 && (
        <div className='flex items-center justify-center gap-5 my-5'>
          {[...Array(totalPages)].map((_, idx) => (
            <div
              className={`bg-green-400 px-3 rounded-full text-xl py-1 font-bold text-white cursor-pointer hover:bg-green-700 ${
                currentPage === idx + 1 && ' activepagination'
              }`}
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AktivnostList;