import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); 
  const [isHovered, setIsHovered] = useState(false); 

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCollapsed(true);
  };

  const sidebarStyle = {
  width: collapsed ? '60px' : '220px',
  background: 'linear-gradient(to bottom, #0d1b2a, #1b263b)',
  color: 'white',
  transition: 'width 0.3s',
  //position: 'fixed',
  overflow: 'hidden',
  zIndex: 1000,
  boxShadow: '2px 0 6px rgba(0,0,0,0.15)',
  fontFamily: 'Segoe UI, sans-serif',
  height: 'auto',
  minHeight: '100vh',
  flexShrink: 0,
};


  const toggleStyle = {
    padding: '15px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: collapsed ? 'center' : 'space-between',
    alignItems: 'center',
    fontSize: '25px',
    cursor: 'pointer',
  };

  const menuStyle = {
    listStyle: 'none',
    padding: 0,
    marginTop: '2rem',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 20px',
    display: 'block',
    whiteSpace: 'nowrap',
    transition: 'background 0.3s',
    fontSize: '15px',
  };

  const activeLinkStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderLeft: '4px solid #3fc1c9',
  };

  return (
    <div
      style={sidebarStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={toggleStyle}>
        {!collapsed && <strong>Energy Dashboard</strong>}
        <span style={{ fontSize: '20px' }}>☰</span>
      </div>
      <ul style={menuStyle}>
        {[
          { to: '/dashboard', label: 'Dashboard', icon: '📊' },
          { to: '/profile', label: 'Profile', icon: '👤' },
          { to: '/settings', label: 'Settings', icon: '⚙' },
          { to: '/logout', label: 'Logout', icon: '🚪' },
        ].map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
              }>
                {collapsed ? icon : `${icon} ${label}`}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;