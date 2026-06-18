import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdReviews } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { useFavorites } from '../../hooks/useFavorites.hook';
import { Favorite } from '../../models/Favorites';

import tripadvisorImg from '../../assets/tripadvisor.png';
import { SearchRestaurant } from '../../models/Restaurant';

interface RestaurantCardProps {
  restaurant: SearchRestaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { favorites, setFavorites } = useFavorites();

  const goToDetails = () => {
    navigate(`/restaurants/${restaurant.id}`, { state: { imageFromList: restaurant.image } });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    let currentFavorites = [...favorites];
    const isAlreadyFavorite = currentFavorites.some((fav) => fav.link === `/restaurants/${restaurant.id}`);

    if (isAlreadyFavorite) {
      const filtered = currentFavorites.filter((fav) => fav.link !== `/restaurants/${restaurant.id}`);
      setFavorites(filtered);
    } else {
      currentFavorites.push(
        new Favorite(
          restaurant.id,
          restaurant.name,
          restaurant.rating,
          restaurant.reviews,
          restaurant.priceRange,
          restaurant.image,
          `/restaurants/${restaurant.id}`
        )
      );
      setFavorites(currentFavorites);
    }
  };

  useEffect(() => {
    const isFav = favorites.some((fav) => fav.link === `/restaurants/${restaurant.id}`);
    setIsFavorite(isFav);
  }, [favorites, restaurant.id]);

  return (
    <div className='flex items-center justify-center h-full'>
      <div 
        className='w-full max-w-sm h-[450px] flex flex-col rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer hover:shadow-2xl transition-all'
        onClick={goToDetails}
      >
        <img
          src={restaurant?.image || tripadvisorImg}
          className='w-full h-80 object-cover rounded-t-lg'
          alt={restaurant.name}
        />
        <div className='px-6 py-4 flex-1 flex flex-col justify-between'>
          <div>
            <div className='font-bold text-xl mb-2 line-clamp-2 uppercase'>
              {restaurant.name}
            </div>
          </div>

          <div className='flex flex-wrap gap-2 pt-2'>
            <span className='inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700'>
              <div className='flex items-center gap-1'>
                <FaStar className='text-yellow-500' />
                <span>{restaurant.rating}</span>
              </div>
            </span>
            <span className='inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700'>
              <div className='flex items-center gap-1'>
                <MdReviews className='text-blue-500' />
                <span>{restaurant.reviews}</span>
              </div>
            </span>
           
            <span
              onClick={handleFavorite}
              className='inline-block bg-gray-100 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200'
            >
              <div className='flex items-center'>
                {isFavorite ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;