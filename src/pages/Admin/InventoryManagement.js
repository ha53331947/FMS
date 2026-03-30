import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
  const [branches, setBranches] = useState([]);
  const API_URL = 'https://haris-14.firebaseio.com/branches.json';

  useEffect(() => {
    axios.get(API_URL).then(res => setBranches(res.data));
  }, []);

  return (
    <div className="inventory-manager">
      <h1 className="neon-text" style={{ color: '#64ffda' }}>Global Inventory Monitor</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {branches.map(branch => (
          <div key={branch.id} className="glass-card" style={{ padding: '20px', border: '1px solid #233554' }}>
            <h3 style={{ color: '#64ffda' }}>📍 {branch.name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#8892b0' }}>Location: {branch.location}</p>
            <hr style={{ borderColor: '#233554' }} />
            <div style={{ marginTop: '10px' }}>
              <p>🍗 Chicken: <strong>{branch.inventory?.chicken || 0} kg</strong></p>
              <p>🍞 Bread: <strong>{branch.inventory?.bread || 0} units</strong></p>
              <p>🍟 Fries: <strong>{branch.inventory?.fries || 0} kg</strong></p>
            </div>
            <button className="btn-3d" style={{ marginTop: '15px', fontSize: '0.7rem' }}>UPDATE STOCK</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;