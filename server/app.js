const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./adminrouter");
const departmentRoutes = require("./departmentRoutes");
const auditorRoutes = require("./auditorlistroutes"); // or './routes/auditors' depending on your folder structure



const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ ALLOW FRONTEND ORIGIN
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allows cookies and authentication to be sent
}));

app.use(express.json()); // Built-in middleware for JSON parsing
app.use("/api", adminRoutes); // Prefix all admin routes with /api
app.use("/api", departmentRoutes);
app.use("/api", auditorRoutes); // This will give you routes like: /api/auditors-list

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
