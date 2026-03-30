import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '' });
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const BASE_URL = 'https://haris-14.firebaseio.com/products';
  const API_URL = `${BASE_URL}.json`;
  const ORDERS_URL = 'https://haris-14.firebaseio.com/orders.json';

  // Fetch function ko useCallback mein dala taake build warnings na aayein
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      if (res.data) {
        // Firebase Object ko Array mein convert karna
        const formattedData = Object.keys(res.data).map((key) => ({
          id: key,
          ...res.data[key],
        }));
        setProducts(formattedData);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOrderNow = async (product) => {
    const confirmOrder = window.confirm(`Bhai, ${product.name} ka order place kar doon?`);
    if (!confirmOrder) return;

    const orderData = {
      customerName: "Admin Test Order",
      branchId: 1,
      items: [{ id: product.id, name: product.name, price: product.price, qty: 1 }],
      total: product.price,
      status: "Pending",
      timestamp: new Date().toLocaleString()
    };

    try {
      await axios.post(ORDERS_URL, orderData);
      alert("✅ Order Placed!");
    } catch (err) {
      alert("❌ Order fail ho gaya!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...newProduct, price: Number(newProduct.price) };
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/${currentId}.json`, productData);
        alert("Product Updated!");
      } else {
        await axios.post(API_URL, productData);
        alert("Product Added!");
      }
      setNewProduct({ name: '', category: '', price: '' });
      setShowForm(false);
      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      alert("Action failed!");
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setNewProduct({ name: product.name, category: product.category, price: product.price });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, kya waqai is item ko nikalna hai?")) {
      try {
        await axios.delete(`${BASE_URL}/${id}.json`);
        fetchProducts();
      } catch (err) {
        alert("Delete fail ho gaya!");
      }
    }
  };

  return (
    <div className="product-manager" style={{ padding: '20px', color: '#fff' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="neon-text" style={{ fontSize: '2rem', color: '#64ffda' }}>Product Inventory</h1>
        <button className="btn-3d" onClick={() => {
          setShowForm(!showForm);
          setIsEditing(false);
          setNewProduct({ name: '', category: '', price: '' });
        }}>
          {showForm ? "CANCEL" : "+ ADD PRODUCT"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', border: `1px solid ${isEditing ? '#ffae00' : '#64ffda'}`, borderRadius: '8px' }}>
          <h3 style={{ color: isEditing ? '#ffae00' : '#64ffda', marginBottom: '15px' }}>
            {isEditing ? "EDIT PRODUCT MODE" : "ADD NEW PRODUCT"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              className="custom-input" placeholder="Item Name" required
              value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #233554', background: '#0a192f', color: '#fff' }}
            />
            <input 
              className="custom-input" placeholder="Category" required
              value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #233554', background: '#0a192f', color: '#fff' }}
            />
            <input 
              className="custom-input" type="number" placeholder="Price" required
              value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #233554', background: '#0a192f', color: '#fff' }}
            />
            <button type="submit" className="btn-3d" style={{ background: isEditing ? '#ffae00' : '#64ffda', color: '#020c1b', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', border: 'none' }}>
              {isEditing ? "UPDATE NOW" : "SAVE TO DB"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#64ffda' }}>Loading Inventory...</p>
      ) : (
        <table className="cyber-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #233554' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th>ITEM NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #233554' }}>
                  <td style={{ padding: '15px', fontSize: '10px', color: '#8892b0' }}>{p.id}</td>
                  <td style={{ color: '#64ffda', fontWeight: 'bold' }}>{p.name}</td>
                  <td><span style={{ background: '#112240', padding: '4px 10px', borderRadius: '4px', color: '#ccd6f6' }}>{p.category}</span></td>
                  <td>Rs. {p.price}</td>
                  <td style={{ display: 'flex', gap: '8px', padding: '15px' }}>
                    <button 
                      onClick={() => handleOrderNow(p)}
                      style={{ background: '#64ffda', color: '#020c1b', border: 'none', padding: '5px 12px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      ORDER
                    </button>
                    <button 
                      onClick={() => handleEditClick(p)}
                      style={{ background: 'transparent', border: '1px solid #ffae00', color: '#ffae00', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: '#ff4d4d', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Remove</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#8892b0' }}>No products found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductManagement;