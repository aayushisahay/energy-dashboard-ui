import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const SideBar = () => {
  return (
    <div className="sidebar p-3">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/profile" className="nav-link">Profile</Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/settings" className="nav-link">Settings</Link>
        </li>
        <li className="nav-item">
          <Link to="/logout" className="nav-link">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;