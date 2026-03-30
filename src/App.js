import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManagerDashboard from './pages/Staff/ManagerDashboard'; 
import UserDashboard from './pages/User/UserDashboard'; 
import DashboardSelector from './pages/DashboardSelector'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading-screen">SYSTEM LOADING...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. DEFAULT ROUTE (/) */}
          {/* Agar user login hai to Selector dikhao, varna Login pe bhejo */}
          <Route 
            path="/" 
            element={user ? <DashboardSelector /> : <Navigate to="/login" />} 
          />

          {/* 2. AUTH ROUTES */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

          {/* 3. PROTECTED DASHBOARDS (Sirf login users ke liye) */}
          <Route 
            path="/admin/*" 
            element={user ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/manager/*" 
            element={user ? <ManagerDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/user/*" 
            element={user ? <UserDashboard /> : <Navigate to="/login" />} 
          />

          {/* Extra paths handling */}
          <Route path="/user-home" element={<Navigate to="/user" />} />

          {/* 4. FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;