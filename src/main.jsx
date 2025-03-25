import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/login'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App';
import User_login from './pages/User_login';
import './assets/styles/main.css';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Login/> */}
    <User_login/>
  </StrictMode>,
)
