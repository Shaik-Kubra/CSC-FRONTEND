import React from 'react';
import './FacultySidebar.css'; // Create specific styles if needed

function FacultySidebar({ activeTab, setActiveTab }) {
  return (
    <div className="faculty-sidebar" style={{ width: '250px', borderRight: '2px solid #333', padding: '20px' }}>
      <h3>Faculty Portal</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <button 
            className={activeTab === 'all' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setActiveTab('all')}
          >
            All Complaints
          </button>
        </li>
        <li>
          <button 
            className={activeTab === 'unresponded' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setActiveTab('unresponded')}
          >
            Unresponded Complaints
          </button>
        </li>
        <li>
          <button 
            className={activeTab === 'responded' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setActiveTab('responded')}
          >
            Responded Complaints
          </button>
        </li>
      </ul>
    </div>
  );
}

export default FacultySidebar;