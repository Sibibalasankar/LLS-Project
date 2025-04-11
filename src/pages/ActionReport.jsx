import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ActionReport = () => {
  const [actions, setActions] = useState([]);
  const navigate = useNavigate();

const goToActionReport = (action) => {
  navigate(`/action-form/${action.id}`);
};

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('actionReports')) || [];
    setActions(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('actionReports', JSON.stringify(actions));
  }, [actions]);

  const addAction = () => {
    const newAction = {
      id: Date.now(),
      label: `Action ${actions.length + 1}`
    };
    setActions([...actions, newAction]);
  };

  const deleteAction = (id) => {
    const updated = actions.filter((a) => a.id !== id);
    setActions(updated);
  };

  

  return (
    <div className="p-4">
      <button
        onClick={addAction}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add Action Report
      </button>

      <table className="w-full border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Label</th>
            <th className="p-2">Action</th>
            <th className="p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action, index) => (
            <tr key={action.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{action.label}</td>
              <td className="p-2">
                <button
                  onClick={() => goToActionReport(action)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition submit-btns"
                >
                  Go Action Report
                </button>
              </td>
              <td className="p-2 ">
                <button
                  onClick={() => deleteAction(action.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {actions.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">
                No Action Reports yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActionReport;
