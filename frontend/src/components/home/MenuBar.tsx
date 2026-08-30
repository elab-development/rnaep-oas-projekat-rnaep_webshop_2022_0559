  import { useState } from 'react';
  import { FaHotel, FaHeart, FaHiking, FaUsers } from 'react-icons/fa'; 
  import { MdRestaurantMenu } from 'react-icons/md';
  import FilterItem from './FilterItem';
  import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
  import { useLoggedIn } from '../../hooks/useLoggedIn';
  import { FaChartBar } from 'react-icons/fa';  

  interface MenuBarProps {
    onSearch: (query: string) => void;
  }

  const MenuBar = ({ onSearch }: MenuBarProps) => {
    const { searchTerm, setSearchTerm } = useSearchTerm();
    const [inputSearch, setInputSearch] = useState(searchTerm);
    const { user, loggedIn } = useLoggedIn();

    const handleSearch = () => {
      if (inputSearch.trim()) {
        setSearchTerm(inputSearch);
        onSearch(inputSearch); 
      }
    };

    return (
      <>
        <h1 className='font-extrabold text-center text-5xl mt-24'>Where to?</h1>
        
        <div className='flex justify-center py-10 gap-10 flex-wrap'>
          <FilterItem 
            name='hotels' 
            icon={<FaHotel className='w-6 h-6' />} 
          />
          <FilterItem 
            name='restaurants' 
            icon={<MdRestaurantMenu className='w-6 h-6' />} 
          />
          <FilterItem 
            name='aktivnosti' 
            icon={<FaHiking className='w-6 h-6' />} 
          />
          <FilterItem 
          
            name='favorites' 
            icon={<FaHeart className='w-6 h-6' />} 
          />

          
            {user?.role === 'admin' && (
            <FilterItem 
              name='users' 
              icon={<FaUsers className='w-6 h-6' />} 
            />
  )}
        </div>

        <div className='flex justify-center items-center'>
          <input
            className='w-1/2 bg-transparent border-2 border-r-0 border-slate-800 rounded-xl rounded-r-none py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-400'
            id='search'
            type='text'
            placeholder='Enter destination (e.g. Rome, New York)...'
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className='bg-green-400 font-semibold py-1.5 px-4 rounded-xl rounded-l-none border-slate-800 border-2 hover:text-white hover:border-green-400'
            type='button'
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </>
    );
  };

  export default MenuBar;