import tripadvisorLogo from '../assets/tripadvisor.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-10 pb-6 w-full">
      <div className="container mx-auto px-4 sm:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img 
              src={tripadvisorLogo} 
              alt="Tripadvisor" 
              className="h-6 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" 
            />
            <span className="font-bold text-gray-600">Tripadvisor</span>
          </div>
          <div className="text-sm text-gray-500 text-center md:text-right">
            <p>&copy; {currentYear} TripAdvisor. Sva prava zadržana.</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>Uslovi korišćenja | Politika privatnosti | Kako sajt funkcioniše</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;