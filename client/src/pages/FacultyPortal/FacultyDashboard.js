import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';
import FacultyNavbar from '../../components/FacultyNavbar'; // <--- NEW HEADER
import FacultySidebar from '../../components/FacultySidebar';
import ReplyModal from '../../components/ReplyModal';

function FacultyDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); 
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await api.get(`/faculty/complaints/${user.id}`);
          setComplaints(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Filter Logic
  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'unresponded') return c.status === 'Pending';
    if (activeTab === 'responded') return c.status !== 'Pending';
    return true; 
  });

  const handleReplySubmit = async (complaintId, message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await api.post('/faculty/reply', {
        complaint_id: complaintId,
        faculty_id: user.id,
        response_message: message
      });
      alert("Reply sent!");
      setSelectedComplaintId(null); 
      window.location.reload(); 
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  return (
    <div className="App">

      <div className="dashboard-layout">
        {/* 2. The Sidebar */}
        <div className="sidebar-container">
          <FacultySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* 3. Main Content Area */}
        <div className="main-content">
          <div className="page-header">
            <h2>Faculty Dashboard</h2>
            <p className="subtitle">Manage and respond to student queries.</p>
          </div>

          <div className="complaints-grid">
            {loading && <p>Loading complaints...</p>}
            {!loading && filteredComplaints.length === 0 && <p>No complaints found.</p>}

            {filteredComplaints.map((item) => (
              <div key={item.id} className="box complaint-card">
                <div className="card-header">
                  <span className="student-id">🆔 Student: {item.student_id}</span>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <p className="complaint-text">"{item.description}"</p>
                  <p className="date-text">📅 {new Date(item.created_at).toLocaleDateString()}</p>
                </div>

                <div className="card-actions">
                  {item.status === 'Pending' ? (
                    <button 
                      className="action-btn" 
                      onClick={() => setSelectedComplaintId(item.id)}
                    >
                      Reply to Student
                    </button>
                  ) : (
                    <button className="secondary" disabled>✅ Reply Sent</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedComplaintId && (
        <ReplyModal 
          complaintId={selectedComplaintId} 
          onClose={() => setSelectedComplaintId(null)} 
          onSubmit={handleReplySubmit} 
        />
      )}
    </div>
  );
}

export default FacultyDashboard;