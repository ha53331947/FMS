import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    axios.get('https://haris-14.firebaseio.com/orders.json')
      .then(res => setMyOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="orders-page-container">
      <h1 className="neon-text">MY ORDER HISTORY</h1>
      <div className="orders-glass-wrapper">
        <table className="user-cyber-table">
          <thead>
            <tr>
              <th>ITEM</th>
              <th>TOTAL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.length > 0 ? (
              myOrders.map((o) => (
                <tr key={o.id}>
                  {/* Yahan 'productName' hi use karna hai jo UserProducts se aa raha hai */}
                  <td className="item-name-cell" style={{ color: '#fff', fontWeight: 'bold' }}>
                    {o.productName}
                  </td>
                  <td style={{ color: '#ccd6f6' }}>Rs. {o.total}</td>
                  <td>
                    <span className={`status-badge ${o.status?.toLowerCase()}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" style={{ textAlign: 'center', color: '#8892b0' }}>No orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrders;