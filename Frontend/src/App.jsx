import { useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Compare from './pages/Compare.jsx';
import Friends from './pages/Friends.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { useAuth } from "./components/Contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { login, isLoading } = useAuth();

  useEffect(() => {
    isLoading(true);
    axios.get("http://localhost:3000/me", {
      withCredentials: true
    })
      .then(res => {
        login(res.data.user);
        // setIsLoggedIn(true);
      })
      .catch(() => {
        console.log("Auth Failed from /me endpoint");
        // setIsLoggedIn(false);
      })
      .finally(() => {
        setTimeout(()=>{
          isLoading(false);
        },1000);
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<ProtectedRoute><Home /></ProtectedRoute>} >
            <Route index element={<Dashboard />} />
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="Friends" element={<Friends />} />
            <Route path="Compare" element={<Compare />} />
          </Route>
        </Routes>
        <Outlet />
      </BrowserRouter>
    </>
  );
}

export default App;