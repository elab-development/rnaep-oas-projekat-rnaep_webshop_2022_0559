import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdReviews } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';

import tripadvisorImg from '../../assets/tripadvisor.png';
import { Favorite } from '../../models/Favorites';

interface FavoriteCardProps {
  favorite: Favorite;
}

const FavoriteCard = ({ favorite }: FavoriteCardProps) => {
  const navigate = useNavigate();

  return (
        <div className='flex items-center justify-center h-full'>

      <div className='w-full max-w-sm h-[450px] flex flex-col rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer hover:shadow-2xl transition-all'>

        <img
          src={favorite?.image || tripadvisorImg}
          className='w-full h-80 object-cover '
          alt={favorite.name}
          onClick={() => navigate(favorite.link)}
        />
       
        <div className='px-6 py-4 flex-1 flex flex-col justify-between'>
          <div>
            <div className='font-bold text-xl mb-2 line-clamp-2 uppercase'>
              {favorite.name}
            </div>
          </div>
                    <div className='flex flex-wrap gap-2 pt-2'>
                              <span className='inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700'>
                                <div className='flex items-center gap-1'>
                                  <FaStar className='text-yellow-500' />
                                  <span>{favorite.rating}</span>
                                </div>
                              </span>
                              <span className='inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700'>
                                <div className='flex items-center gap-1'>
                                  <MdReviews className='text-blue-500' />
                                  <span>{favorite.reviews}</span>
                                </div>
                              </span>
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;