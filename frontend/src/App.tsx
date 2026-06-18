import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotel from './pages/Hotel';
import Restaurant from './pages/Restaurant';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useLoggedIn } from './hooks/useLoggedIn';
import FavoritesList from './components/search/FavoriteList'; 
import Aktivnost from './pages/Aktivnost';
import Statistika from './pages/Statistika';


function App() {
  const { loggedIn } = useLoggedIn();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={loggedIn ? <Home /> : <Navigate to={'/login'} />} />
        <Route path='/login' element={!loggedIn ? <Login /> : <Navigate to={'/'} />} />
        <Route path='/register' element={!loggedIn ? <Register /> : <Navigate to={'/'} />} />
        <Route
          path='/favorites'
          element={loggedIn ? <FavoritesList /> : <Navigate to={'/login'} />}
        />
        <Route path='/hotels/:id' element={loggedIn ? <Hotel /> : <Navigate to={'/login'} />} />
        <Route path='/restaurants/:id' element={loggedIn ? <Restaurant /> : <Navigate to={'/login'} />} />
        <Route path='/aktivnost/:id' element={loggedIn ? <Aktivnost /> : <Navigate to={'/login'} />} />
        <Route path="/statistika" element={<Statistika/>} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;