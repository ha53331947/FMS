import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://localhost:5000/orders'; 

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Agar data array hai to set karein, warna empty array
      setOrders(Array.isArray(res.data) ? res.data : []); 
    } catch (err) {
      console.error("Sync Error:", err);
      setOrders([]); // Error ki surat mein app crash na ho
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order-manager" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="neon-text" style={{ color: '#64ffda' }}>Live Order History</h1>
        <button className="btn-3d" onClick={fetchOrders} style={{ padding: '8px 20px', cursor: 'pointer' }}>
          🔄 REFRESH LIST
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64ffda' }}>Syncing Database...</p>
      ) : (
        <div className="glass-card" style={{ padding: '0px', background: '#0a192f', border: '1px solid #233554' }}>
          <table className="cyber-table" style={{ width: '100%', borderCollapse: 'collapse', color: '#ccd6f6' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#112240', color: '#8892b0' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th>CUSTOMER</th>
                <th>ITEM NAME</th> {/* Yahan change kiya */}
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? [...orders].reverse().map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #233554' }}>
                  <td style={{ padding: '15px', color: '#64ffda' }}>#{o.id}</td>
                  <td>{o.customerName || "Guest"}</td>
                  
                  {/* FIX: o.items.map ko hata kar o.productName use kiya hai */}
                  <td style={{ color: '#ffffff' }}>
                    {o.productName || "N/A"} 
                  </td>

                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.7rem',
                      background: 'rgba(100, 255, 218, 0.1)',
                      color: '#64ffda',
                      border: '1px solid #64ffda'
                    }}>
                      {o.status || 'PENDING'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#8892b0' }}>
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;