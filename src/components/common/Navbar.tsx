import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../../types';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import './Navbar.css';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Templates', href: '/templates', icon: '📄' },
    { name: 'Builder', href: '/builder', icon: '✏️' },
    { name: 'My Resumes', href: '/my-resumes', icon: '📁' },
    { name: 'Export', href: '/export', icon: '📤' },
  ];

  const hasAdminAccess = currentUser.role.permissions.includes('admin:read');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">📄</span>
            <span className="brand-text">Resume Generator</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="navbar-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            ))}
            
            {hasAdminAccess && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Admin</span>
              </Link>
            )}
          </div>

          <div className="navbar-user">
            <LanguageSwitcher />
            <div className="user-dropdown">
              <button className="user-button">
                <div className="user-avatar">
                  <span className="avatar-text">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="user-info">
                  <div className="user-name">{currentUser.name}</div>
                  <div className="user-role">{currentUser.role.name}</div>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-email">{currentUser.email}</div>
                  <div className="user-last-login">
                    Last login: {new Date(currentUser.lastLogin).toLocaleDateString()}
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={onLogout}>
                  <span className="item-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;