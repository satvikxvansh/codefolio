import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import CodingProfileDashboard from './pages/Home';
import LoginPage from './pages/LoginPage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:3000/me", {
      withCredentials: true
    }).then(res => {
      setUser(res.data.user);
      setIsLoggedIn(true);
      console.log(user);
    }).catch(() => {
      setIsLoggedIn(false);
    });
    setIsLoading(false);
  }, [isLoggedIn]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/" element={<CodingProfileDashboard userData = {user}  />} />
        </Routes>
        {isLoading &&
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xs overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div
              className="relative p-8 bg-white w-full max-w-md m-auto rounded-xl shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >Loading...</div>
          </div>

        }

        {isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />}
      </BrowserRouter>
    </>
  );
}

export default App;