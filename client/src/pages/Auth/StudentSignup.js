import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';

function StudentSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    id: '',       // This is the Register Number (e.g., R220308)
    email: '',
    department: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Auth User (Supabase Security)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // 2. Send Profile Data to Flask
      // We map 'formData.id' to 'student_reg_no' so the backend saves it in the 'reg_id' column
      await api.post('/register-student', {
        id: data.user.id,             // The UUID from Supabase Auth
        full_name: formData.name,
        student_reg_no: formData.id,  // <--- Mapped to reg_id in backend
        email: formData.email,
        department: formData.department
      });

      alert("Account created successfully! You can now login.");
      navigate('/student-login');

    } catch (error) {
      alert("Signup Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="box auth-form">
        <h3>Create Student Account</h3>
        <form onSubmit={handleSignup}>
          
          <label>Full Name</label>
          <input 
            name="name" 
            placeholder="e.g. John Doe" 
            onChange={handleChange} 
            required 
          />

          <label>Register ID (Student ID)</label>
          <input 
            name="id" 
            placeholder="e.g. R220308" 
            onChange={handleChange} 
            required 
          />

          <label>Department</label>
          <input 
            name="department" 
            placeholder="e.g. CSE" 
            onChange={handleChange} 
            required 
          />

          <label>Email</label>
          <input 
            name="email" 
            type="email" 
            placeholder="e.g. student@rguktrkv.ac.in" 
            onChange={handleChange} 
            required 
          />

          <label>Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="Minimum 6 characters" 
            onChange={handleChange} 
            required 
          />
          
          <div className="btn-group">
            <button type="submit" className="action-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
            <button type="button" onClick={() => navigate('/')} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentSignup;