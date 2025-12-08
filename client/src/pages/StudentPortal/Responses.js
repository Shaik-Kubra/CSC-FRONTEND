import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { supabase } from '../../api/supabaseClient';

function Responses() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const res = await api.get(`/my-complaints/${data.user.id}`);
        setList(res.data);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="portal-page" style={{ flexDirection: 'column', alignItems: 'center' }}>
      <h2>My Complaints & Responses</h2>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {list.length === 0 && <p>No history found.</p>}
        {list.map((item, idx) => (
          <div key={idx} className="box" style={{ marginBottom: '15px' }}>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <strong>Q: </strong> {item.question}
            </div>
            <div style={{ paddingTop: '10px', color: item.status === 'Pending' ? 'orange' : 'green' }}>
              <strong>A: </strong> {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Responses;