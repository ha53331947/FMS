import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Firebase Login
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log("Login Successful! Redirecting to Dashboard Selector...");
      
      // 2. FIX: Role check yahan karne ki zaroorat nahi agar humne 
      // Dashboard Selector ko landing page banaya hai.
      // Seedha Home ('/') par bhejo jahan cards nazar ayenge.
      navigate('/'); 

    } catch (error) {
      console.error("Login Error:", error.code);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        alert("Email ya Password ghalat hai!");
      } else if (error.code === 'auth/user-not-found') {
        alert("Account nahi mila! Register karein.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass-card" style={{ width: '350px', padding: '40px', textAlign: 'center' }}>
        <div className="login-header">
          <h2 className="neon-text">SYSTEM ACCESS</h2>
          <p style={{ color: '#64ffda', fontSize: '10px', letterSpacing: '2px' }}>AUTHORIZED PERSONNEL ONLY</p>
        </div>

        <form onSubmit={handleLogin} style={{ marginTop: '30px' }}>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <input 
              type="email" 
              placeholder="OPERATOR EMAIL" 
              className="custom-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid #233554', color: 'white' }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '30px' }}>
            <input 
              type="password" 
              placeholder="ACCESS CODE" 
              className="custom-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid #233554', color: 'white' }}
            />
          </div>

          <button type="submit" className="btn-3d" disabled={loading} style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
            {loading ? "DECRYPTING..." : "INITIALIZE LOGIN"}
          </button>
        </form>

        <div style={{ marginTop: '25px' }}>
          <p style={{ color: '#8892b0', fontSize: '13px' }}>
            New Operator? <Link to="/signup" style={{ color: '#64ffda', textDecoration: 'none' }}>Register Unit</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;