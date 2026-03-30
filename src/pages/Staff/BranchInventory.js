import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BranchInventory = () => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:5000/branches/1'; 

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(API_URL);
      setInventory(res.data.inventory || { chicken: 0, beef: 0, bread: 0, fries: 0 });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const updateStock = async (item, delta) => {
    const newValue = (inventory[item] || 0) + delta;
    if (newValue < 0) return;
    const updatedInventory = { ...inventory, [item]: newValue };
    try {
      await axios.patch(API_URL, { inventory: updatedInventory });
      setInventory(updatedInventory);
    } catch (err) {
      alert("Update failed!");
    }
  };

  if (loading) return <p className="neon-text">Loading...</p>;

  return (
    <div className="inventory-container" style={{ padding: '20px' }}>
      <h2 className="neon-text" style={{ color: '#f44336', marginBottom: '30px' }}>
        📦 LIVE BRANCH INVENTORY
      </h2>
      
      {/* Grid Fix: Yahan cards ke darmiyan gap aur alignment set ki hai */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        justifyContent: 'flex-start' 
      }}>
        
        {Object.keys(inventory).map((item) => (
          <div key={item} className="glass-card" style={{ 
            width: '240px', // Card ki fix width
            padding: '25px', 
            textAlign: 'center', 
            border: '1px solid #f4433633',
            background: 'rgba(10, 25, 47, 0.7)', // Dark background for contrast
            borderRadius: '12px'
          }}>
            <h3 style={{ textTransform: 'uppercase', color: '#8892b0', fontSize: '0.8rem', letterSpacing: '1px' }}>
              {item}
            </h3>
            
            <h1 style={{ 
              fontSize: '3rem', 
              margin: '15px 0', 
              color: '#f44336',
              textShadow: '0 0 10px rgba(244, 67, 54, 0.5)' 
            }}>
              {inventory[item]}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                onClick={() => updateStock(item, -1)} 
                className="btn-3d" 
                style={{ background: '#233554', border: '1px solid #f44336', color: 'white', padding: '8px 15px', cursor: 'pointer' }}
              >
                -1
              </button>
              <button 
                onClick={() => updateStock(item, 5)} 
                className="btn-3d" 
                style={{ background: '#f44336', border: 'none', color: 'white', padding: '8px 15px', cursor: 'pointer' }}
              >
                +5
              </button>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default BranchInventory;