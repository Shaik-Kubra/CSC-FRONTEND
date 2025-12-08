import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // 1. Add Missing 'isEditing' State
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({ 
    name: '', 
    id: '', 
    email: '', 
    dept: '' 
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const res = await api.get(`/student/profile/${authUser.id}`);
        if (res.data) {
          setUser({
            name: res.data.full_name,
            id: res.data.reg_id || 'N/A', 
            email: res.data.email,
            dept: res.data.department
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Define handleSave INSIDE the component
  const handleSave = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Call the PUT route we created
      await api.put(`/student/profile/${authUser.id}`, {
        name: user.name,
        email: user.email,
        department: user.dept
      });
      
      setIsEditing(false); // Turn off edit mode
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error(error);
      alert("Update failed. Check console for details.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="portal-page">Loading profile...</div>;

  return (
    <div className="portal-page">
      <div className="box profile-box">
        
        {/* VIEW MODE */}
        {!isEditing ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="avatar-circle" style={{ 
                width: '80px', height: '80px', background: '#4f46e5', color: 'white', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', margin: '0 auto' 
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
            </div>

            <div className="details-list" style={{ textAlign: 'left', margin: '20px 0' }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Department:</strong> {user.dept}</p>
            </div>

            <div className="btn-group">
              <button className="secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button onClick={handleLogout} style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
                Log Out
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
            
            <label>ID (Cannot Change):</label>
            <input 
              value={user.id} 
              disabled 
              style={{ background: '#eee', cursor: 'not-allowed' }} 
            />

            <label>Email:</label>
            <input 
              value={user.email} 
              onChange={(e) => setUser({...user, email: e.target.value})} 
            />
            
            <label>Department:</label>
            <input 
              value={user.dept} 
              onChange={(e) => setUser({...user, dept: e.target.value})} 
            />

            <div className="btn-group">
              <button onClick={handleSave} className="action-btn">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;