import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

import UserProducts from './UserProducts';
import UserOrders from './UserOrders';
import './User.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Logout function with proper async/await
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      // Redirect to login page after sign out
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="user-dashboard-wrapper">
      <aside className="user-sidebar">
        <div className="sidebar-header">
          <h2 className="neon-text">FOODIE</h2>
        </div>
        
        <nav className="user-nav-links">
          <Link 
            to="/user/menu" 
            className={`user-nav-item ${location.pathname.includes('menu') ? 'active' : ''}`}
          >
            🍔 Explore Menu
          </Link>
          <Link 
            to="/user/my-orders" 
            className={`user-nav-item ${location.pathname.includes('my-orders') ? 'active' : ''}`}
          >
            📦 My Orders
          </Link>
        </nav>

        {/* Logout Button Sidebar ke bottom mein */}
        <button onClick={handleLogout} className="user-logout-btn">
          SECURE LOGOUT
        </button>
      </aside>

      <main className="user-content">
        <Routes>
          {/* Default view shows products */}
          <Route index element={<UserProducts />} />
          <Route path="menu" element={<UserProducts />} />
          <Route path="my-orders" element={<UserOrders />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboard;