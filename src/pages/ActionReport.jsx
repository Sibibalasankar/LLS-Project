import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ActionReport = () => {
  const [actions, setActions] = useState([]);
  const navigate = useNavigate();
  const didLoad = useRef(false); // <- New flag

  const goToActionReport = (action) => {
    navigate(`/action-form/${action.id}`);
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('actionReports')) || [];
      const validActions = saved.filter(action =>
        action && typeof action.id === 'number' && typeof action.label === 'string'
      );
      setActions(validActions);
    } catch (error) {
      console.error('Failed to parse saved actions', error);
      setActions([]);
    }
  }, []);

  useEffect(() => {
    if (didLoad.current) {
      localStorage.setItem('actionReports', JSON.stringify(actions));
    } else {
      didLoad.current = true; // skip saving on first mount
    }
  }, [actions]);

  const addAction = () => {
    const newAction = {
      id: Date.now(),
      label: `Action ${actions.length + 1}`,
      createdAt: new Date().toISOString()
    };
    setActions([...actions, newAction]);
  };

  const deleteAction = (id) => {
    const updated = actions.filter((a) => a.id !== id);
    setActions(updated);
  };

  const clearAllActions = () => {
    if (actions.length > 0 && window.confirm('Are you sure you want to delete all action reports?')) {
      setActions([]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <button
          onClick={addAction}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Action Report
        </button>
        <button
          onClick={clearAllActions}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          disabled={actions.length === 0}
        >
          Clear All
        </button>
      </div>

      <table className="w-full border border-gray-300 rounded">
        <tbody>
          {actions.map((action) => (
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
