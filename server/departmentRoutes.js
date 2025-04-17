const express = require("express");
const router = express.Router();
const db = require("./connection");

// Get all departments
router.get("/departments", (req, res) => {
    console.log("Received data:", req.body); // 👈 ADD THIS LINE
  db.query("SELECT * FROM department_lls", (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// Add a new department
router.post("/departments", (req, res) => {
  const { Department, email } = req.body;
  db.query(
    "INSERT INTO department_lls (Department, email) VALUES (?, ?)",
    [Department, email],
    (err, result) => {
      if (err) {
        console.error("Error inserting department:", err);
        return res.status(500).json({ error: "Error inserting department" });
      }
      res.status(201).json({ message: "Department added successfully" });
    }
  );
});

// Update department
router.put("/departments/:id", (req, res) => {
  const { id } = req.params;
  const { Department, email } = req.body;
  db.query(
    "UPDATE department_lls SET Department = ?, email = ? WHERE id = ?",
    [Department, email, id],
    (err) => {
      if (err) {
        console.error("Error updating department:", err);
        return res.status(500).json({ error: "Error updating department" });
      }
      res.json({ message: "Department updated successfully" });
    }
  );
});

// Delete department
router.delete("/departments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM department_lls WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting department:", err);
      return res.status(500).json({ error: "Error deleting department" });
    }
    res.json({ message: "Department deleted successfully" });
  });
});

module.exports = router;
