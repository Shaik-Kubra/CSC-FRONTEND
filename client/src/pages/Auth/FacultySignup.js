import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';

function FacultySignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', fid: '', email: '', phone: '', department: '', password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1. Create Auth User
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      // 2. Save Faculty Profile to Flask (using the specific fields from your wireframe)
      await api.post('/register-faculty', {
        id: data.user.id,
        full_name: formData.name,
        fid: formData.fid,           // Faculty ID
        email: formData.email,
        phone: formData.phone,
        department: formData.department
      });

      alert("Faculty account created! Please log in.");
      navigate('/faculty-login');

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="box auth-form">
        <h3>Faculty Sign Up</h3>
        <form onSubmit={handleSignup}>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="fid" placeholder="Faculty ID (FID)" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input name="department" placeholder="Department" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          
          <div className="btn-group">
            <button type="submit" className="action-btn">Create Account</button>
            <button type="button" onClick={() => navigate('/')} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacultySignup;