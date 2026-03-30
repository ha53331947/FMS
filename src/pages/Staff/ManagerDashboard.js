import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './Staff.css';

// Pages Import
import EmployeeManagement from './EmployeeManagement';
import BranchInventory from './BranchInventory';
import BranchOrders from './BranchOrders';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="manager-dashboard-container">
      <aside className="manager-sidebar">
        <div className="manager-sidebar-header">
          <h2 className="manager-neon-text">BRANCH OPS</h2>
        </div>
        
        <nav className="manager-nav-links">
          <Link to="/manager/inventory" className="manager-nav-item">📦 My Inventory</Link>
          <Link to="/manager/employees" className="manager-nav-item">👥 My Employees</Link>
          <Link to="/manager/orders" className="manager-nav-item">📑 Branch Orders</Link>
        </nav>

        <button onClick={handleLogout} className="manager-logout-btn">
          SECURE LOGOUT
        </button>
      </aside>

      <main className="manager-main-content">
        <Routes>
          <Route index element={
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
              <h1 style={{ color: '#f44336', textShadow: '0 0 10px #f44336' }}>Welcome, Branch Manager</h1>
              <p style={{ color: '#ccd6f6' }}>Access restricted to Branch ID: #LHR-01</p>
            </div>
          } />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="inventory" element={<BranchInventory />} />
          <Route path="orders" element={<BranchOrders />} /> 
        </Routes>
      </main>
    </div>
  );
};

export default ManagerDashboard;