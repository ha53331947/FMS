import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', location: '', managerEmail: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const API_URL = 'https://haris-14.firebaseio.com/branches.json';

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setBranches(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentId}`, newBranch);
        alert("Branch Updated!");
      } else {
        await axios.post(API_URL, newBranch);
        alert("New Branch Added!");
      }
      setNewBranch({ name: '', location: '', managerEmail: '' });
      setShowForm(false);
      setIsEditing(false);
      fetchBranches();
    } catch (err) {
      alert("Operation failed!");
    }
  };

  const handleEditClick = (branch) => {
    setIsEditing(true);
    setCurrentId(branch.id);
    setNewBranch({ name: branch.name, location: branch.location, managerEmail: branch.managerEmail });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, kya waqai is branch ko list se nikalna hai?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBranches();
      } catch (err) {
        alert("Delete fail!");
      }
    }
  };

  return (
    <div className="product-manager">
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="neon-text" style={{ fontSize: '2rem', color: '#64ffda' }}>Branch Management</h1>
        <button className="btn-3d" onClick={() => {
          setShowForm(!showForm);
          setIsEditing(false);
          setNewBranch({ name: '', location: '', managerEmail: '' });
        }}>
          {showForm ? "CANCEL" : "+ ADD NEW BRANCH"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', border: `1px solid ${isEditing ? '#ffae00' : '#64ffda'}` }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              className="custom-input" placeholder="Branch Name (e.g. Lahore Central)" required
              value={newBranch.name} onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
            />
            <input 
              className="custom-input" placeholder="Location (City/Area)" required
              value={newBranch.location} onChange={(e) => setNewBranch({...newBranch, location: e.target.value})}
            />
            <input 
              className="custom-input" type="email" placeholder="Manager Email" required
              value={newBranch.managerEmail} onChange={(e) => setNewBranch({...newBranch, managerEmail: e.target.value})}
            />
            <button type="submit" className="btn-3d" style={{ background: isEditing ? '#ffae00' : '#64ffda', color: '#020c1b' }}>
              {isEditing ? "UPDATE BRANCH" : "REGISTER BRANCH"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#64ffda' }}>Loading Branches...</p>
      ) : (
        <table className="cyber-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #233554' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th>BRANCH NAME</th>
              <th>LOCATION</th>
              <th>MANAGER</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #233554' }}>
                <td style={{ padding: '15px' }}>#{b.id}</td>
                <td style={{ color: '#64ffda', fontWeight: 'bold' }}>{b.name}</td>
                <td>{b.location}</td>
                <td style={{ fontSize: '0.9rem', color: '#8892b0' }}>{b.managerEmail}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(b)} style={{ background: 'transparent', border: '1px solid #ffae00', color: '#ffae00', padding: '5px 10px', marginRight: '10px', cursor: 'pointer' }}>Edit</button>
                  <button className="del-btn" onClick={() => handleDelete(b.id)} style={{ background: '#ff4d4d', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BranchManagement;