import { useFilter } from '../../hooks/useFilter.hook';

interface FilterItemProps {
  name: string;
  icon: any;
}

const FilterItem = ({ name, icon }: FilterItemProps) => {
  const { filter, setFilter } = useFilter();

  // Proveravamo da li je ovaj item trenutno izabran
  const isActive = filter === name;

  return (
    <div 
      onClick={() => setFilter(name)}
      className={`flex items-center p-2 px-4 rounded-lg cursor-pointer gap-2 transition-all border-2
        ${isActive 
          ? 'bg-green-400 text-white border-green-400 shadow-md' 
          : 'bg-slate-800 text-green-400 border-transparent hover:bg-slate-700'
        }`}
    >
      {icon}
      <h2 className='capitalize font-semibold text-sm'>{name}</h2>
    </div>
  );
};

export default FilterItem;