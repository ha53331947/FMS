import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; 
import { signOut } from 'firebase/auth';

import ProductManagement from './ProductManagement';
import BranchManagement from './BranchManagement'; 
import OrderManagement from './OrderManagement'; 
import InventoryManagement from './InventoryManagement';
import OffersManagement from './OffersManagement';

import './Admin.css';

const AdminDashboard = () => {
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
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2 className="neon-text">ADMIN HQ</h2>
        </div>
        
        <nav className="admin-nav-links">
          <Link to="/admin/products" className="admin-nav-item">🍔 Products</Link>
          <Link to="/admin/branches" className="admin-nav-item">🏢 Branches</Link>
          <Link to="/admin/inventory" className="admin-nav-item">📦 Inventory</Link>
          <Link to="/admin/orders" className="admin-nav-item">📑 All Orders</Link>
          <Link to="/admin/offers" className="admin-nav-item">📢 Manage Offers</Link>
        </nav>

        <button onClick={handleLogout} className="admin-logout-btn">
          SECURE LOGOUT
        </button>
      </aside>

      <main className="admin-main-content">
        <Routes>
          <Route index element={<ProductManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="branches" element={<BranchManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="orders" element={<OrderManagement />} /> 
          <Route path="offers" element={<OffersManagement />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;