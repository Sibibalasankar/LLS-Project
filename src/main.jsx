import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // ✅ Import BrowserRouter
import App from "./App"; // ✅ Ensure App.js has routing
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles/main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router> {/* ✅ Wrap everything inside Router */}
      <App />
    </Router>
  </StrictMode>
);
