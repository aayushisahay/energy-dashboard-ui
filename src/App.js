import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SideBar from './components/SideBar';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

const AppContent = () => {
  const [collapsed, setCollapsed] = useState(true); 
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  const hideSidebarPaths = ['/login', '/forgot-password'];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  const sidebarWidth = collapsed ? 60 : 220;

  const layoutStyle = {
  display: 'flex',
  minHeight: '100vh', 
  width: '100%',
  alignItems: 'stretch', 
};


  const contentStyle = {
    marginLeft: showSidebar ? `${sidebarWidth}px` : '0',
    //padding: '2rem',
    transition: 'margin-left 0.3s ease',
    flexGrow: 1,
  };

  return (
    <div style={layoutStyle}>
      {showSidebar && (
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}
      <div style={contentStyle}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? <Settings /> : <Navigate to="/login" />
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;