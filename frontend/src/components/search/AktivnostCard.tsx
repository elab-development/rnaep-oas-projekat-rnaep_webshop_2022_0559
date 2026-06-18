import { useNavigate } from 'react-router-dom';
import { IoMdTime } from 'react-icons/io';
import { RiMoneyEuroCircleFill } from 'react-icons/ri';
import tripadvisorImg from '../../assets/tripadvisor.png';
import { SearchAktivnost } from '../../models/Aktivnost';

interface AktivnostCardProps {
  aktivnost: SearchAktivnost;
}

const AktivnostCard = ({ aktivnost }: AktivnostCardProps) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/aktivnost/${aktivnost.id}`, { 
      state: { 
        aktivnost: aktivnost,
        imageFromList: aktivnost.image 
      } 
    });
  };

  return (
    <div className='flex items-center justify-center h-full'>
      <div 
        className='w-full max-w-sm h-[450px] flex flex-col rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer hover:shadow-2xl transition-all'

        onClick={goToDetails}
      >
        <img
          src={aktivnost?.image || tripadvisorImg}
          className='w-full h-80 object-cover'
          alt={aktivnost.naziv}
        />
      
        <div className='px-6 py-5 flex-grow flex flex-col justify-between'>
          <div>
            <h3 className='font-bold text-xl mb-4 line-clamp-2 uppercase text-gray-800 leading-tight'>
              {aktivnost.naziv}
            </h3>
          </div>
        
          <div className='flex flex-wrap gap-2 mt-auto'>
            <span className='flex items-center gap-1 bg-blue-50 rounded-full px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100'>
              <IoMdTime className="text-blue-500" />
              <span>{aktivnost.trajanje}</span>
            </span>

            <span className='flex items-center gap-1 bg-green-50 rounded-full px-3 py-1 text-xs font-bold text-green-600 border border-green-100'>
              <RiMoneyEuroCircleFill className="text-green-600" />
              <span>{aktivnost.cena} EUR</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AktivnostCard;