import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoggedIn } from '../hooks/useLoggedIn';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { setLoggedIn, setUser } = useLoggedIn();

  const handleLogin = async () => {
    setError('');

    if (!email || !password) { 
      setError('Please provide both email and password!'); 
      return; 
    }

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
      });

      if (response.data.access_token) {
        const userData = response.data.user; 

        localStorage.setItem('token', response.data.access_token);
        
       
        localStorage.setItem('user', JSON.stringify(userData)); 
        
        setUser(userData); 
        setLoggedIn(true);
        
        navigate('/');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('Wrong email or password!');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-green-600 font-sans'>
      <div className='w-96 p-8 shadow-2xl bg-white rounded-xl'>
        <h1 className='text-3xl block text-center font-bold text-slate-800'>
          Tripadvisor
        </h1>
        <p className='text-center text-gray-500 text-sm mt-2'>Sign in to your account</p>
        <hr className='mt-4 mb-6' />
        
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold mb-1 text-slate-700'>Email Address</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border border-gray-300 w-full rounded-lg text-base px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
              placeholder='example@mail.com'
            />
          </div>
          
          <div>
            <label className='block text-sm font-semibold mb-1 text-slate-700'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border border-gray-300 rounded-lg w-full text-base px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
              placeholder='••••••••'
            />
          </div>
        </div>

        <div className='mt-4 flex justify-end'>
          <button className='text-xs text-gray-500 hover:text-green-600 transition-colors'>
            Forgot Password?
          </button>
        </div>

        <div className='mt-6'>
          <button
            type='button'
            onClick={handleLogin}
            className='bg-green-600 text-white py-2.5 w-full rounded-lg hover:bg-green-700 font-bold shadow-lg transition-all active:scale-95'
          >
            Login
          </button>
        </div>

        <div className='flex justify-center mt-6 border-t pt-4'>
          <Link to='/register' className='text-sm text-gray-600 hover:text-green-600 font-medium'>
            Don't have an account? <span className='text-green-600'>Register here</span>
          </Link>
        </div>

        {error && (
          <div className='mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-semibold animate-pulse'>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;