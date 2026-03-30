import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '', qty: 1 });

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();

    // Fix: Key checking taake 'Untitled' na aaye
    // Agar selectedProduct mein .name nahi hai to .title ya .productName check karega
    const itemName = selectedProduct.name || selectedProduct.title || selectedProduct.productName || "Delicious Meal";
    const quantity = parseInt(formData.qty);

    const order = {
      customerName: formData.name,
      contact: formData.contact,
      address: formData.address,
      quantity: quantity,
      productName: itemName, // Yeh key hum UserOrders mein use karenge
      total: selectedProduct.price * quantity,
      status: "Pending",
      timestamp: new Date().toLocaleString()
    };

    try {
      await axios.post('http://localhost:5000/orders', order);
      alert(`🚀 Order Placed: ${itemName}`);
      
      setSelectedProduct(null);
      setFormData({ name: '', contact: '', address: '', qty: 1 });
    } catch (err) { 
      console.error("Order error:", err);
      alert("Error placing order."); 
    }
  };

  return (
    <div className="menu-page-container">
      <h1 className="neon-text">SELECT YOUR MEAL</h1>
      
      <div className="products-list">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <div className="card-badge">HOT</div>
            {/* Fallback for title/name display */}
            <h3>{p.name || p.title || p.productName}</h3>
            <p className="price-tag">Rs. {p.price}</p>
            <button className="order-now-btn" onClick={() => setSelectedProduct(p)}>
              ORDER NOW
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="order-overlay">
          <div className="order-modal">
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>&times;</button>
            <h2 className="modal-title">Confirming: {selectedProduct.name || selectedProduct.title}</h2>
            
            <form onSubmit={placeOrder} className="checkout-form">
              <input 
                className="user-input-field"
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Your Full Name" 
              />
              <input 
                className="user-input-field"
                required 
                value={formData.contact} 
                onChange={e => setFormData({...formData, contact: e.target.value})} 
                placeholder="Contact Number" 
              />
              <textarea 
                className="user-input-field"
                required 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                placeholder="Full Delivery Address" 
                rows="3" 
              />
              <div className="qty-group" style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ color: '#64ffda' }}>Qty:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={formData.qty} 
                  onChange={e => setFormData({...formData, qty: e.target.value})} 
                  style={{ width: '60px', padding: '5px', background: '#0a192f', color: '#fff', border: '1px solid #233554' }}
                />
              </div>

              <button type="submit" className="confirm-btn">
                CONFIRM (Rs. {selectedProduct.price * formData.qty})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProducts;