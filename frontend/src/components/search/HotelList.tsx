import { useLoading } from '../../hooks/useLoading';
import { useEffect, useState } from 'react';
import { useSearchedHotels } from '../../hooks/useSearchedHotels';
import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
import Loader from '../Loader';
import HotelCard from './HotelCard';

const HotelList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchedHotels } = useSearchedHotels();
  const { searchTerm } = useSearchTerm();
  const { loading } = useLoading();

  useEffect(() => {
    if (searchedHotels?.length > 0) {
      setTotalPages(Math.ceil(searchedHotels.length / 12));
    }
    setCurrentPage(1);
  }, [searchedHotels]);
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
        ? searchedHotels.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                No results found! Try something else
              </h2>
            </div>
          )
        : searchedHotels.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                Enter your destination and press Search!
              </h2>
            </div>
          )}
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-5 mb-5'>
          {searchedHotels
          ?.slice(currentPage * 12 - 12, currentPage * 12)
          .map((hotel, idx) => (
            <HotelCard key={idx} hotel={hotel} />
        ))}
      </div>
       {searchedHotels?.length > 0 && (
        <div className='flex items-center justify-center gap-5 my-5'>
          {[...Array(totalPages)].map((e, idx) => (
            <div
              className={`bg-green-400 px-3 rounded-full text-xl py-1 font-bold text-white cursor-pointer hover:bg-green-700 ${
                currentPage === idx + 1 && ' activepagination'
              }`}
              key={e + ' ' + idx}
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

export default HotelList;