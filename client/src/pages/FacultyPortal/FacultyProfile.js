import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

function FacultyProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [user, setUser] = useState({ 
    name: '', 
    fid: '', 
    email: '', 
    phone: '', 
    department: '' 
  });

  useEffect(() => {
    fetchFacultyProfile();
  }, []);

  const fetchFacultyProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const res = await api.get(`/faculty/profile/${authUser.id}`);
        if (res.data) {
          setUser({
            name: res.data.full_name,
            fid: res.data.fid || 'N/A',
            email: res.data.email,
            phone: res.data.phone || 'N/A',
            department: res.data.department
          });
        }
      }
    } catch (error) {
      console.error("Error fetching faculty profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Defined INSIDE the component so it can access 'user' and 'isEditing'
  const handleSave = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      await api.put(`/faculty/profile/${authUser.id}`, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department
      });
      
      setIsEditing(false);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error(error);
      alert("Update failed. Check console.");
    }
  };

  if (loading) return <div className="portal-page">Loading profile...</div>;

  return (
    <div className="portal-page">
      <div className="box profile-box">
        
        {!isEditing ? (
          /* VIEW MODE */
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="avatar-circle" style={{ 
                width: '80px', height: '80px', background: '#4f46e5', color: 'white', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', margin: '0 auto' 
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
              </div>
            </div>

            <h3 style={{textAlign: 'center'}}>Faculty Details</h3>
            
            <div className="details-list" style={{ textAlign: 'left', margin: '20px 0' }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>FID:</strong> {user.fid}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Department:</strong> {user.department}</p>
            </div>

            <div className="btn-group">
              <button className="secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button onClick={handleLogout} style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
                Log out
              </button>
            </div>
          </>
        ) : (
          /* EDIT MODE */
          <div className="edit-component">
            <h3>Edit Profile</h3>
            <label>Name:</label>
            <input 
              value={user.name} 
              onChange={(e) => setUser({...user, name: e.target.value})} 
            />
            
            <label>FID (Cannot Change):</label>
            <input 
              value={user.fid} 
              disabled 
              style={{ background: '#eee', cursor: 'not-allowed' }} 
            />
            
            <label>Email:</label>
            <input 
              value={user.email} 
              onChange={(e) => setUser({...user, email: e.target.value})} 
            />
            
            <label>Phone:</label>
            <input 
              value={user.phone} 
              onChange={(e) => setUser({...user, phone: e.target.value})} 
            />
             
             <label>Department:</label>
            <input 
              value={user.department} 
              onChange={(e) => setUser({...user, department: e.target.value})} 
            />

            <div className="btn-group">
              <button onClick={handleSave} className="action-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyProfile;