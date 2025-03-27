import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import "../assets/styles/DepartmentList.css";


const DepartmentList = () => {
  const [departments, setDepartments] = useState(() => {
    const savedDepartments = localStorage.getItem("departments");
    return savedDepartments
      ? JSON.parse(savedDepartments)
      : [
          { id: 1, name: "Quality Management System", mail: "" },
          { id: 2, name: "Marketing - Industrial Automation", mail: "" },
          { id: 3, name: "Marketing - Textile Automation", mail: "" },
          { id: 4, name: "Marketing - Trading", mail: "" },
          { id: 5, name: "Project Management", mail: "" },
          { id: 6, name: "Design - Industrial Automation", mail: "" },
          { id: 7, name: "Design - Textile Automation", mail: "" },
          { id: 8, name: "Design - Controls", mail: "" },
          { id: 9, name: "Planning and Engineering Innovation", mail: "" },
          { id: 10, name: "Supply Chain Management", mail: "" },
          { id: 11, name: "Machining Division (MD)", mail: "" },
          { id: 12, name: "Sheet Metal Division (SMD)", mail: "" },
          { id: 13, name: "Powder Coating", mail: "" },
          { id: 14, name: "Product Assembly", mail: "" },
          { id: 15, name: "Project Assembly", mail: "" },
          { id: 16, name: "Quality - Inward", mail: "" },
          { id: 17, name: "Quality - SMD", mail: "" },
          { id: 18, name: "Quality - Machining Division", mail: "" },
          { id: 19, name: "Quality - Assembly", mail: "" },
          { id: 20, name: "Stores", mail: "" },
          { id: 21, name: "Customer Service Department", mail: "" },
          { id: 22, name: "Human Resources", mail: "" },
          { id: 23, name: "Total Plant Maintenance", mail: "" }
        ];
  });

  useEffect(() => {
    localStorage.setItem("departments", JSON.stringify(departments));
  }, [departments]);

  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editedMail, setEditedMail] = useState("");

  const handleEditClick = (department) => {
    setSelectedDepartment(department);
    setEditedMail(department.mail);
    setShowModal(true);
  };

  const handleSave = () => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === selectedDepartment.id ? { ...dept, mail: editedMail } : dept
      )
    );
    setShowModal(false);
  };

  const handleRemove = (id) => {
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === id ? { ...dept, mail: "" } : dept))
    );
  };

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => {
      document.querySelectorAll(".no-print").forEach(el => (el.style.display = "none"));
    },
    onAfterPrint: () => {
      document.querySelectorAll(".no-print").forEach(el => (el.style.display = ""));
    }
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center">List of Departments</h2>
      
      <div ref={printRef}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Department</th>
              <th>Mail ID (Auditee)</th>
              <th className="no-print">Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.id}>
                <td>{index + 1}</td>
                <td>{dept.name}</td>
                <td>{dept.mail || "-"}</td>
                <td className="no-print">
                  <Button variant="warning" size="sm" onClick={() => handleEditClick(dept)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" className="ms-2" onClick={() => handleRemove(dept.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
 
      <Button className="mt-3 mb-3 print_btn_DL" variant="primary" onClick={handlePrint}>
        Print
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mail ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Mail ID</Form.Label>
              <Form.Control
                type="email"
                value={editedMail}
                onChange={(e) => setEditedMail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentList;