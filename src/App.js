/* import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SideBar from './components/SideBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Logout from './pages/Logout';

function App() {
  return (
    <Router>
      <div>
        <header className="app-header">
          <h1 className="app-title">Vatika Business Park</h1>
        </header>

        <div className="d-flex mt-5">
          <SideBar />
          <div className="flex-grow-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
 */

/*import React from 'react';
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
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  // Hide sidebar on login and forgot-password pages
  const hideSidebarPaths = ['/login', '/forgot-password'];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="d-flex mt-5">
      {showSidebar && <SideBar />}
      <div className="flex-grow-1 p-4">
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
{/*       <div>
        <header className="app-header">
          <h1 className="app-title">Vatika Business Park</h1>
        </header>

        <div className="d-flex mt-5">
          <SideBar />
          <div className="flex-grow-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      </div> }
      <AppContent />
    </Router>
  );
}

export default App;*/


import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SideBar from './components/SideBar';
import Header from './components/Header'; // <-- new header
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  // Hide sidebar and header on login and forgot-password pages
  const hidePaths = ['/login', '/forgot-password'];
  const showLayout = !hidePaths.includes(location.pathname);

  return (
    <div>
      {showLayout && <Header />}
      <div className="d-flex" style={{ marginTop: showLayout ? '60px' : '0' }}>
        {showLayout && <SideBar />}
        <div className="flex-grow-1 p-4" style={{ marginLeft: showLayout ? '170px' : '0' }}>
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