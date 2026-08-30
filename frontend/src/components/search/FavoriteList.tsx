import { useFavorites } from '../../hooks/useFavorites.hook';
import FavoriteCard from './FavoriteCard';

const FavoritesList = () => {
  const { favorites } = useFavorites();

  console.log("Trenutni favoriti u listi:", favorites);

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-2xl font-bold text-gray-700">Your lists is empty!</h2>
        <p className="text-gray-500">Add hotels or restaurants by clicking on the heart icon.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-10'>
       <h1 className="text-3xl font-bold my-8">Your favorites</h1>
       <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
        {favorites.map((favorite) => (
          <FavoriteCard key={favorite.link} favorite={favorite} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;