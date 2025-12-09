import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({ name: '', id: '', email: '', dept: '' });

  useEffect(() => {
    const fetchUser = async () => {
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
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      await api.put(`/student/profile/${authUser.id}`, {
        name: user.name,
        email: user.email,
        department: user.dept
      });
      setIsEditing(false);
      alert("Updated!");
    } catch (e) { alert("Failed to update"); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // --- STYLES ---
  const styles = {
    page: { background: 'linear-gradient(135deg, #2c7a7b 0%, #319795 100%)', minHeight: 'calc(100vh - 60px)', padding: '40px 20px', display:'flex', justifyContent:'center', alignItems:'flex-start' },
    card: { background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    banner: { height: '120px', background: 'linear-gradient(to right, #38b2ac, #319795)' },
    avatar: { width: '100px', height: '100px', background: 'white', borderRadius: '50%', border: '5px solid white', margin: '-50px auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#319795', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    content: { padding: '0 30px 40px', textAlign: 'center' },
    input: { width: '100%', padding: '12px 15px', margin: '8px 0 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f7fafc' },
    label: { display:'block', textAlign:'left', fontSize:'0.85rem', color:'#718096', fontWeight:'600' },
    btnPrimary: { background: '#38b2ac', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', margin: '0 5px' },
    btnOutline: { background: 'transparent', color: '#e53e3e', border: '1px solid #fc8181', padding: '10px 25px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', margin: '0 5px' }
  };

  if (loading) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.banner}></div>
        <div style={styles.content}>
          <div style={styles.avatar}>{user.name ? user.name.charAt(0).toUpperCase() : 'S'}</div>
          
          {!isEditing ? (
            <>
              <h2 style={{margin:'0 0 5px', color:'#2d3748'}}>{user.name}</h2>
              <span style={{background:'#e6fffa', color:'#319795', padding:'5px 12px', borderRadius:'15px', fontSize:'0.85rem', fontWeight:'bold'}}>{user.dept} Student</span>
              
              <div style={{marginTop:'30px', textAlign:'left'}}>
                <p style={{borderBottom:'1px solid #edf2f7', paddingBottom:'10px', color:'#4a5568'}}><strong>ID:</strong> {user.id}</p>
                <p style={{borderBottom:'1px solid #edf2f7', paddingBottom:'10px', color:'#4a5568'}}><strong>Email:</strong> {user.email}</p>
              </div>

              <div style={{marginTop:'30px'}}>
                <button style={styles.btnPrimary} onClick={() => setIsEditing(true)}>Edit Profile</button>
                <button style={styles.btnOutline} onClick={handleLogout}>Log Out</button>
              </div>
            </>
          ) : (
            <div style={{textAlign:'left'}}>
              <label style={styles.label}>Name</label><input style={styles.input} value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
              <label style={styles.label}>Email</label><input style={styles.input} value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
              <label style={styles.label}>Department</label><input style={styles.input} value={user.dept} onChange={(e) => setUser({...user, dept: e.target.value})} />
              <div style={{textAlign:'center', marginTop:'20px'}}>
                <button style={styles.btnPrimary} onClick={handleSave}>Save</button>
                <button style={{...styles.btnOutline, color:'#718096', borderColor:'#cbd5e0'}} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;