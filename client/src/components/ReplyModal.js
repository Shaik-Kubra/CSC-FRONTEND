import React, { useState } from 'react';

function ReplyModal({ complaintId, onClose, onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    onSubmit(complaintId, message);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="box modal-box" style={{ background: 'white', padding: '20px', width: '400px' }}>
        <h4>Add Message</h4>
        <textarea 
          rows="4" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply here..."
          style={{ width: '100%' }}
        />
        <div className="btn-group" style={{ marginTop: '10px' }}>
          <button onClick={handleSend} className="action-btn">Send</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ReplyModal;