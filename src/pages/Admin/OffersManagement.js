import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({ title: '', discount: '', code: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/offers';

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newOffer);
      setNewOffer({ title: '', discount: '', code: '' });
      fetchOffers();
      alert("🎁 New Global Offer Launched!");
    } catch (err) {
      alert("Failed to add offer.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Khatam kar dein ye offer?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchOffers();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="offers-container">
      <h1 className="neon-text" style={{ color: '#ffae00', marginBottom: '20px' }}>
        📢 Global Offers & Discounts
      </h1>

      {/* Offer Form */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', border: '1px solid #ffae00' }}>
        <form onSubmit={handleAddOffer} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            className="custom-input" placeholder="Offer Title (e.g. Eid Special)" required
            value={newOffer.title} onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
          />
          <input 
            className="custom-input" type="number" placeholder="Discount %" required
            value={newOffer.discount} onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
          />
          <input 
            className="custom-input" placeholder="Promo Code" 
            value={newOffer.code} onChange={(e) => setNewOffer({...newOffer, code: e.target.value})}
          />
          <button type="submit" className="btn-3d" style={{ background: '#ffae00', color: '#000' }}>
            LAUNCH OFFER
          </button>
        </form>
      </div>

      {/* Offers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {loading ? <p>Syncing Offers...</p> : offers.map((offer) => (
          <div key={offer.id} className="glass-card" style={{ textAlign: 'center', position: 'relative', borderLeft: '4px solid #ffae00' }}>
            <h2 style={{ color: '#ffae00' }}>{offer.discount}% OFF</h2>
            <h3 style={{ color: '#fff' }}>{offer.title}</h3>
            <p style={{ color: '#8892b0' }}>Code: <span style={{ color: '#64ffda' }}>{offer.code || 'NO CODE'}</span></p>
            <button 
              onClick={() => handleDelete(offer.id)}
              style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer', marginTop: '10px', padding: '5px 10px' }}
            >
              REMOVE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersManagement;