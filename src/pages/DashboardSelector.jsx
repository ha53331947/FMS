import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardSelector.css';

const DashboardSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="selector-container">
      <h1 className="neon-text">FRANCHISE SYSTEM</h1>
      <p className="sub-text">Please select your portal to continue</p>
      
      <div className="card-grid">
        <div className="portal-card admin" onClick={() => navigate('/admin')}>
          <div className="icon">🛡️</div>
          <h3>Admin Portal</h3>
          <p>Head Office Control</p>
        </div>

        <div className="portal-card manager" onClick={() => navigate('/manager')}>
          <div className="icon">🏢</div>
          <h3>Manager Portal</h3>
          <p>Branch Management</p>
        </div>

        <div className="portal-card user" onClick={() => navigate('/user/menu')}>
          <div className="icon">🍔</div>
          <h3>Customer Portal</h3>
          <p>Explore & Order</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSelector;