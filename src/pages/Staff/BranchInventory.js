import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BranchInventory = () => {
  const [inventory, setInventory] = useState({ chicken: 0, beef: 0, bread: 0, fries: 0 });
  const [loading, setLoading] = useState(true);

  // FIX: Path check karo ke branches/1 hai ya auto-generated ID hai
  const API_URL = 'https://haris-14.firebaseio.com/branches/1.json'; 

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Agar data mil gaya aur usme inventory hai toh set karo, warna default
      if (res.data && res.data.inventory) {
        setInventory(res.data.inventory);
      } else {
        // Agar inventory key nahi hai toh blank setup kar do
        setInventory({ chicken: 0, beef: 0, bread: 0, fries: 0 });
      }
    } catch (err) {
      console.error("Inventory Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const updateStock = async (item, delta) => {
    const newValue = (inventory[item] || 0) + delta;
    if (newValue < 0) return;

    const updatedInventory = { ...inventory, [item]: newValue };
    
    try {
      // Firebase PATCH request to update only the inventory part
      await axios.patch(API_URL, { inventory: updatedInventory });
      setInventory(updatedInventory);
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed! Check console.");
    }
  };

  if (loading) return <p className="neon-text" style={{padding: '20px', color: '#64ffda'}}>Loading Inventory Data...</p>;

  return (
    <div className="inventory-container" style={{ padding: '20px', background: '#0a192f', minHeight: '100vh' }}>
      <h2 className="neon-text" style={{ color: '#f44336', marginBottom: '30px', textShadow: '0 0 10px rgba(244, 67, 54, 0.5)' }}>
        📦 LIVE BRANCH INVENTORY
      </h2>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        justifyContent: 'flex-start' 
      }}>
        {Object.keys(inventory).map((item) => (
          <div key={item} className="glass-card" style={{ 
            width: '220px',
            padding: '25px', 
            textAlign: 'center', 
            border: '1px solid #f4433633',
            background: 'rgba(17, 34, 64, 0.8)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px -15px rgba(2,12,27,0.7)'
          }}>
            <h3 style={{ textTransform: 'uppercase', color: '#8892b0', fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '10px' }}>
              {item}
            </h3>
            
            <h1 style={{ 
              fontSize: '3.5rem', 
              margin: '10px 0', 
              color: '#f44336',
              fontWeight: 'bold'
            }}>
              {inventory[item]}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button 
                onClick={() => updateStock(item, -1)} 
                style={{ background: 'transparent', border: '1px solid #f44336', color: '#f44336', padding: '10px 18px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
              >
                -1
              </button>
              <button 
                onClick={() => updateStock(item, 5)} 
                style={{ background: '#f44336', border: 'none', color: '#0a192f', padding: '10px 18px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
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