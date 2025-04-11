import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ActionReport = () => {
  const [actions, setActions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const navigate = useNavigate();
  const didLoad = useRef(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('actionReports')) || [];
    const validActions = saved.filter(action =>
      action && typeof action.id === 'number' && typeof action.label === 'string'
    );
    setActions(validActions);
  }, []);

  useEffect(() => {
    if (didLoad.current) {
      localStorage.setItem('actionReports', JSON.stringify(actions));
    } else {
      didLoad.current = true;
    }
  }, [actions]);

  useEffect(() => {
    const deptList = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(deptList);
  }, []);

  const goToActionReport = (action) => {
    navigate(`/action-form/${action.id}`);
  };

  const addAction = () => {
    if (!selectedDept) {
      alert("Please select a department.");
      return;
    }

    const newAction = {
      id: Date.now(),
      label: `Action ${actions.length + 1}`,
      department: selectedDept,
      createdAt: new Date().toISOString()
    };

    setActions([...actions, newAction]);
    setShowForm(false);
    setSelectedDept("");
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
          onClick={() => setShowForm(true)}
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

      {/* Modal */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form bg-white p-4 rounded shadow-lg max-w-md mx-auto">
            <h3 className="mb-2 font-semibold">Add Action Report</h3>
            <label className="block mb-2">
              Select Department:
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addAction}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full border border-gray-300 rounded">
        <thead>
          <tr>
            <th className="p-2">Label</th>
            <th className="p-2">Department</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr key={action.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{action.label}</td>
              <td className="p-2">{action.department}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => goToActionReport(action)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Go
                </button>
                <button
                  onClick={() => deleteAction(action.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
