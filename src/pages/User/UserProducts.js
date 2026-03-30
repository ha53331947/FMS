import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '', qty: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Products fetch karte waqt conversion lazmi hai
    axios.get('https://haris-14.firebaseio.com/products.json')
      .then(res => {
        if (res.data) {
          // Object ko Array mein convert karne ka logic
          const formattedData = Object.keys(res.data).map((key) => ({
            id: key,
            ...res.data[key],
          }));
          setProducts(formattedData);
        } else {
          setProducts([]);
        }
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();

    const itemName = selectedProduct.name || selectedProduct.title || "Delicious Meal";
    const quantity = parseInt(formData.qty);

    const order = {
      customerName: formData.name,
      contact: formData.contact,
      address: formData.address,
      quantity: quantity,
      productName: itemName,
      total: selectedProduct.price * quantity,
      status: "Pending",
      timestamp: new Date().toLocaleString()
    };

    try {
      // FIX: .json lagana lazmi hai Firebase mein
      await axios.post('https://haris-14.firebaseio.com/orders.json', order);
      alert(`🚀 Order Placed: ${itemName}`);
      
      setSelectedProduct(null);
      setFormData({ name: '', contact: '', address: '', qty: 1 });
    } catch (err) { 
      console.error("Order error:", err);
      alert("Error placing order. Make sure URL is correct."); 
    }
  };

  if (loading) return <div style={{color: '#64ffda', padding: '20px'}}>Loading Menu...</div>;

  return (
    <div className="menu-page-container">
      <h1 className="neon-text">SELECT YOUR MEAL</h1>
      
      <div className="products-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* Safe mapping: products array hai ya nahi check karega */}
        {Array.isArray(products) && products.length > 0 ? (
          products.map(p => (
            <div key={p.id} className="product-card" style={{ border: '1px solid #233554', padding: '15px', borderRadius: '8px' }}>
              <div className="card-badge">HOT</div>
              <h3>{p.name || p.title || "No Name"}</h3>
              <p className="price-tag">Rs. {p.price}</p>
              <button className="order-now-btn" onClick={() => setSelectedProduct(p)}>
                ORDER NOW
              </button>
            </div>
          ))
        ) : (
          <p style={{color: '#8892b0'}}>No products found in database.</p>
        )}
      </div>

      {selectedProduct && (
        <div className="order-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2,12,27,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="order-modal" style={{ background: '#112240', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)} style={{ float: 'right', background: 'none', border: 'none', color: '#64ffda', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            <h2 className="modal-title" style={{ color: '#64ffda' }}>Confirming: {selectedProduct.name || selectedProduct.title}</h2>
            
            <form onSubmit={placeOrder} className="checkout-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                className="user-input-field"
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Your Full Name" 
                style={{ padding: '10px', background: '#0a192f', color: '#fff', border: '1px solid #233554' }}
              />
              <input 
                className="user-input-field"
                required 
                value={formData.contact} 
                onChange={e => setFormData({...formData, contact: e.target.value})} 
                placeholder="Contact Number" 
                style={{ padding: '10px', background: '#0a192f', color: '#fff', border: '1px solid #233554' }}
              />
              <textarea 
                className="user-input-field"
                required 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                placeholder="Full Delivery Address" 
                rows="3" 
                style={{ padding: '10px', background: '#0a192f', color: '#fff', border: '1px solid #233554' }}
              />
              <div className="qty-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ color: '#64ffda' }}>Qty:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={formData.qty} 
                  onChange={e => setFormData({...formData, qty: e.target.value})} 
                  style={{ width: '60px', padding: '5px', background: '#0a192f', color: '#fff', border: '1px solid #233554' }}
                />
              </div>

              <button type="submit" className="confirm-btn" style={{ background: '#64ffda', color: '#020c1b', padding: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
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