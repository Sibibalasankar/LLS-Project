import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ActionReport = () => {
  const [actionForms, setActionForms] = useState([
    {
      id: 1,
      title: 'Sample Action 1',
      description: 'This is a sample action description',
      date: '2023-06-15',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Sample Action 2',
      description: 'Another sample action item',
      date: '2023-06-20',
      status: 'in-progress'
    }
  ]);

  const handleRemoveAction = (id) => {
    setActionForms(actionForms.filter(form => form.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        Action Report
      </h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#34495e', margin: 0 }}>Action Forms</h2>
        <Link 
          to="/actions/new"
          style={{
            padding: '10px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          + Add Action Form
        </Link>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {actionForms.length === 0 ? (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '40px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px dashed #ddd'
          }}>
            <p style={{ color: '#7f8c8d', margin: 0 }}>No action forms available. Click the button above to add one.</p>
          </div>
        ) : (
          actionForms.map((form) => (
            <div key={form.id} style={{ 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ marginTop: 0, color: '#2c3e50' }}>{form.title}</h3>
                <button 
                  onClick={() => handleRemoveAction(form.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>
              
              <p style={{ color: '#7f8c8d', margin: '10px 0' }}>{form.description}</p>
              
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                <div>
                  <span style={{ color: '#95a5a6', fontSize: '12px' }}>Due Date</span>
                  <p style={{ margin: '5px 0 0', fontSize: '14px' }}>{form.date}</p>
                </div>
                
                <div>
                  <span style={{ color: '#95a5a6', fontSize: '12px' }}>Status</span>
                  <p style={{ 
                    margin: '5px 0 0', 
                    fontSize: '14px',
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      form.status === 'completed' ? '#2ecc71' :
                      form.status === 'in-progress' ? '#3498db' : '#f39c12',
                    color: 'white'
                  }}>
                    {form.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionReport;