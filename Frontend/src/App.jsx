import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; 
import CodingProfileDashboard from './pages/Home';
import LoginPage from './pages/LoginPage';

function App() {
  const ProtectedRoute = ({ children }) => { //children is special argument to represent that render anything present inside the <protectedRoute> tag
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
  <>
  <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <CodingProfileDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;