const express = require("express");
const router = express.Router();
const connection = require("./connection");
const bcrypt = require("bcrypt");

// Admin Login Route
router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password, "________")

  const query = "SELECT * FROM lss_login WHERE Admin_name = ?";
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
    
      return res.status(401).json({ message: "Invalid username or password  in if block" });
    }

    const admin = results[0];
    console.log(results, "kkkk")
    const isMatch = await bcrypt.compare(password, admin.Password);

    if (isMatch) {
      return res.status(200).json({ message: "Login successful", role: "admin" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  });
});

// (Optional) Route to add an admin (with hashed password) — use this for testing
router.post("/add-admin", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO admins (username, password) VALUES (?, ?)";
  connection.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ message: "Error creating admin" });
    }
    return res.status(201).json({ message: "Admin created successfully" });
  });
});

module.exports = router;
