import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';

function StudentSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', id: '', email: '', department: '', password: ''
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

      // 2. Save Profile to Flask Database
      await api.post('/register-student', {
        id: data.user.id,
        full_name: formData.name,
        student_reg_no: formData.id,
        email: formData.email,
        department: formData.department
      });

      alert("Account created! You can now login.");
      navigate('/student-login');

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="box auth-form">
        <h3>Create Student Account</h3>
        <form onSubmit={handleSignup}>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="id" placeholder="ID (Reg No)" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
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

export default StudentSignup;