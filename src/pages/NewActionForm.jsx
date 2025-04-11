import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewActionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // In a real app, you would save the data here
      console.log('Form submitted:', formData);
      navigate('/actions'); // Go back to the list after submission
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>New Action Form</h1>
        <button 
          onClick={() => navigate('/actions')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.title ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          {errors.title && <p style={{ color: '#e74c3c', margin: '5px 0 0', fontSize: '12px' }}>{errors.title}</p>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.description ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              minHeight: '100px'
            }}
          />
          {errors.description && <p style={{ color: '#e74c3c', margin: '5px 0 0', fontSize: '12px' }}>{errors.description}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Due Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.date ? '#e74c3c' : '#ddd'}`,
                borderRadius: '4px'
              }}
            />
            {errors.date && <p style={{ color: '#e74c3c', margin: '5px 0 0', fontSize: '12px' }}>{errors.date}</p>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/actions')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Save Action
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewActionForm;