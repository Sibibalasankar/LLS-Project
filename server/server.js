const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

// ✅ CORS Middleware - Allow frontend on port 5173
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Example route
app.post("/api/admin-login", (req, res) => {
    console.log(res);
    
  // handle login logic here
  res.json({ message: "Login successful" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
