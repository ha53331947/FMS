import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Firebase Auth mein user banana
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Role ko Firebase Profile mein save karna (db.json ki zaroorat nahi)
      // Agar aapka email 'admin@franchise.com' hai to usey 'admin' role do
      const role = email.toLowerCase() === 'admin@franchise.com' ? 'admin' : 'user';

      await updateProfile(userCredential.user, {
        displayName: role
      });

      alert(`Registration Successful! Assigned Role: ${role}`);
      navigate('/'); 
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("Bhai, ye Email pehle se register hai. Login kar lo!");
      } else if (error.code === 'auth/weak-password') {
        alert("Password kam az kam 6 characters ka rakho.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2>Join Network</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          placeholder="EMAIL ADDRESS" 
          className="custom-input" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="SET PASSWORD" 
          className="custom-input" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="btn-3d" disabled={loading}>
          {loading ? "CREATING ACCOUNT..." : "REGISTER NOW"}
        </button>
      </form>
      
      <div style={{ marginTop: '25px' }}>
        <p style={{ color: '#8892b0', fontSize: '14px' }}>
          Already registered? <Link to="/" style={{ color: '#64ffda', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;