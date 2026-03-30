import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Admin/Admin.css';

const BranchOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Abhi hum Branch ID 1 (Lahore) assume kar rahe hain
  const BRANCH_ID = 1; 
  const API_URL = 'http://localhost:5000/orders';

  useEffect(() => {
    fetchBranchOrders();
  }, []);

  const fetchBranchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      // Sirf is branch ke orders filter karo
      const myOrders = res.data.filter(order => order.branchId === BRANCH_ID);
      setOrders(myOrders);
      setLoading(false);
    } catch (err) {
      console.error("Orders Error:", err);
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/${orderId}`, { status: newStatus });
      fetchBranchOrders(); // Refresh table
    } catch (err) {
      alert("Update failed!");
    }
  };

  if (loading) return <p className="neon-text">Loading Orders...</p>;

  return (
    <div className="orders-section">
      <h2 className="neon-text" style={{ color: '#f44336', marginBottom: '20px' }}>
        🚀 BRANCH ORDERS LIST
      </h2>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table className="cyber-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>CUSTOMER</th>
              <th>ITEMS</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName}</td>
                <td style={{ fontSize: '0.8rem' }}>
                   {order.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                </td>
                <td>
                  <span style={{ 
                    color: order.status === 'Pending' ? '#ffae00' : '#00ff00',
                    border: `1px solid ${order.status === 'Pending' ? '#ffae00' : '#00ff00'}`,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ background: '#0a192f', color: 'white', border: '1px solid #f44336' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No orders for your branch.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchOrders;