import React, { useState, useEffect } from 'react';
import axios from 'axios';


const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmp, setNewEmp] = useState({ name: '', role: '', contact: '' });
  const [editId, setEditId] = useState(null); // Edit track karne ke liye
  
  const API_URL = 'http://localhost:5000/branches/1'; // Branch 1 context

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // Add ya Update karne ka logic
  const handleSubmit = async () => {
    if (!newEmp.name || !newEmp.role) return alert("Poori details bharo bhai!");

    let updatedEmployees;
    
    if (editId) {
      // EDIT LOGIC: Purane bande ko update karo
      updatedEmployees = employees.map(emp => 
        emp.id === editId ? { ...newEmp, id: editId } : emp
      );
      setEditId(null);
    } else {
      // ADD LOGIC: Naya banda dalo
      updatedEmployees = [...employees, { ...newEmp, id: Date.now() }];
    }

    try {
      await axios.patch(API_URL, { employees: updatedEmployees });
      setNewEmp({ name: '', role: '', contact: '' });
      fetchEmployees();
      alert(editId ? "Staff updated!" : "Staff added!");
    } catch (err) {
      alert("Action fail ho gaya!");
    }
  };

  // Edit button dabane par data form mein bhar do
  const startEdit = (emp) => {
    setEditId(emp.id);
    setNewEmp({ name: emp.name, role: emp.role, contact: emp.contact || '' });
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete kar doon?")) return;
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    await axios.patch(API_URL, { employees: updatedEmployees });
    fetchEmployees();
  };

  return (
    <div className="employee-section">
      <h2 className="neon-text" style={{ color: '#f44336' }}>
        {editId ? "⚡ Editing Staff" : "👥 Manage Branch Employees"}
      </h2>
      
      {/* Form Section */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" placeholder="Name" 
          value={newEmp.name} onChange={(e) => setNewEmp({...newEmp, name: e.target.value})}
          style={{ background: '#112240', color: 'white', border: '1px solid #233554', padding: '10px', borderRadius: '4px' }}
        />
        <input 
          type="text" placeholder="Role (Chef/Waiter)" 
          value={newEmp.role} onChange={(e) => setNewEmp({...newEmp, role: e.target.value})}
          style={{ background: '#112240', color: 'white', border: '1px solid #233554', padding: '10px', borderRadius: '4px' }}
        />
        <input 
          type="text" placeholder="Contact #" 
          value={newEmp.contact} onChange={(e) => setNewEmp({...newEmp, contact: e.target.value})}
          style={{ background: '#112240', color: 'white', border: '1px solid #233554', padding: '10px', borderRadius: '4px' }}
        />
        
        <button onClick={handleSubmit} className="btn-3d" style={{ background: editId ? '#ffae00' : '#f44336', minWidth: '120px' }}>
          {editId ? "UPDATE" : "ADD STAFF"}
        </button>
        
        {editId && (
          <button onClick={() => { setEditId(null); setNewEmp({name:'', role:'', contact:''}); }} 
                  style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '5px 10px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>

      {/* Table Section */}
      <table className="cyber-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #233554', color: '#8892b0' }}>
            <th style={{ padding: '15px' }}>NAME</th>
            <th>ROLE</th>
            <th>CONTACT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? employees.map(emp => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #233554' }}>
              <td style={{ padding: '15px', color: '#64ffda' }}>{emp.name}</td>
              <td>{emp.role}</td>
              <td style={{ color: '#8892b0' }}>{emp.contact || 'N/A'}</td>
              <td>
                <button onClick={() => startEdit(emp)} style={{ marginRight: '10px', color: '#ffae00', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>EDIT</button>
                <button onClick={() => deleteEmployee(emp.id)} style={{ color: '#f44336', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>DELETE</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No staff found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;