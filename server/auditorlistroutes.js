// auditorRouter.js
const express = require("express");
const router = express.Router();
const db = require("./connection");

// Get all auditors
router.get("/auditors", (req, res) => {
  db.query("SELECT * FROM auditorslist ", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
});

// Add new auditor
router.post("/auditors", (req, res) => {
  const { name, employeeNumber, certifiedDate, certifiedOnName, mailID, designation, department } = req.body;
  db.query(
    "INSERT INTO auditorslist  (name, employeeNumber, certifiedDate, certifiedOnName, mailID, designation, department) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, employeeNumber, certifiedDate, certifiedOnName, mailID, designation, department],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.status(201).json({ message: "Auditor added" });
    }
  );
});

// Update auditor
router.put("/auditors/:id", (req, res) => {
  const { id } = req.params;
  const { name, employeeNumber, certifiedDate, certifiedOnName, mailID, designation, department } = req.body;
  db.query(
    "UPDATE auditorslist  SET name = ?, employeeNumber = ?, certifiedDate = ?, certifiedOnName = ?, mailID = ?, designation = ?, department = ? WHERE id = ?",
    [name, employeeNumber, certifiedDate, certifiedOnName, mailID, designation, department, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Auditor updated" });
    }
  );
});

// Delete auditor
router.delete("/auditors/:id", (req, res) => {
  db.query("DELETE FROM auditorslist  WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Auditor deleted" });
  });
});

module.exports = router;
