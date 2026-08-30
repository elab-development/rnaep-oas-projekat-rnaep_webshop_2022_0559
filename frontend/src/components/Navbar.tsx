import { Link } from 'react-router-dom';
import logo from '../assets/logo2.svg';
import { useLoggedIn } from '../hooks/useLoggedIn';
import { useEffect, useState } from 'react';
import tripadvisorLogo from '../assets/tripadvisor.png';


const Navbar = () => {
const [user, setUser] = useState<any>(null);
  const { loggedIn, setLoggedIn } = useLoggedIn();

  useEffect(() => {
  const storage = localStorage.getItem('user');
  if (storage && storage !== "undefined") {
    try {
      setUser(JSON.parse(storage)); 
    } catch (e) {
      setUser("");
    }
  }
}, [loggedIn]);

  <div className="flex items-center gap-2">
  <img src={tripadvisorLogo} alt="Tripadvisor" className="h-8 w-auto" />
  <span className="font-bold text-xl">Tripadvisor</span>
</div>

  return (
     <div className='flex py-4 sm:pl-20 sm:justify-between items-center navbar flex-col sm:flex-row'>
      <Link to={'/'} className='flex items-center gap-3'>
        <img src={tripadvisorLogo} 
         alt="Tripadvisor"
          className="h-8 w-auto object-contain" />
        <h1 className='font-bold text-2xl'>Tripadvisor</h1>
      </Link>
      <div className='flex justify-end gap-10 sm:mr-20'>
        {user && (
          <h1 className='font-semibold mt-2'>
              Welcome, <span className='text-green-500'>
                {/* DODAJ .ime OVDE da bi pisalo samo mina */}
                {user?.ime || 'User'} 
              </span> !
          </h1>
        )}
        {loggedIn && (
          <Link
           to={'/login'}
           onClick={() => {
             localStorage.removeItem('user');
             setLoggedIn(false);
           }}
         >
            <h1 className='font-semibold mt-2'>Logout</h1>
          </Link>
        )}
      </div>
      </div>
  );
};

export default Navbar;