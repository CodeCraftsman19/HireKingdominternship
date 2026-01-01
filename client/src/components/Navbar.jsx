import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Sun, Grid3x3, Settings, LogOut, User } from 'lucide-react';

const Navbar = ({ sidebarCollapsed }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar-custom d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center" style={{ flex: 1, maxWidth: '500px' }}>
        <div className="input-group search-bar">
          <span className="input-group-text bg-white border-0">
            <Search size={18} className="text-secondary" />
          </span>
          <input 
            type="text" 
            className="form-control border-0" 
            placeholder="Search ⌘K"
            style={{ fontSize: '0.857rem' }}
          />
        </div>
      </div>
      
      <div className="d-flex align-items-center gap-2">
        {/* Language/Text Icon */}
        <button className="btn btn-link text-secondary p-2" style={{ border: 'none' }}>
          <span style={{ fontSize: '1.2rem' }}>文A</span>
        </button>
        
        {/* Theme Toggle */}
        <button className="btn btn-link text-secondary p-2" style={{ border: 'none' }}>
          <Sun size={20} />
        </button>
        
        {/* Grid/Apps */}
        <button className="btn btn-link text-secondary p-2 position-relative" style={{ border: 'none' }}>
          <Grid3x3 size={20} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" 
                style={{ fontSize: '0.6rem', padding: '0.15rem 0.3rem' }}>
            0+
          </span>
        </button>
        
        {/* Notifications */}
        <button className="btn btn-link text-secondary p-2 position-relative" style={{ border: 'none' }}>
          <Bell size={20} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                style={{ fontSize: '0.6rem', padding: '0.15rem 0.3rem' }}>
            3
          </span>
        </button>
        
        {/* User Dropdown */}
        <div className="dropdown">
          <button 
            className="btn btn-link text-decoration-none d-flex align-items-center text-secondary p-0"
            type="button"
            data-bs-toggle="dropdown"
            style={{ border: 'none' }}
          >
            <div 
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
              style={{ width: '38px', height: '38px', fontSize: '14px', fontWeight: '600' }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="d-flex flex-column align-items-start">
                <span style={{ fontSize: '0.857rem', fontWeight: '500' }}>{user?.name || 'User'}</span>
                <span style={{ fontSize: '0.75rem', color: '#b4b7bd' }}>Admin</span>
              </div>
            )}
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-lg" style={{ minWidth: '200px' }}>
            <li>
              <a className="dropdown-item d-flex align-items-center" href="#">
                <User size={16} className="me-2" />
                Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item d-flex align-items-center" href="#">
                <Settings size={16} className="me-2" />
                Settings
              </a>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item d-flex align-items-center text-danger" onClick={handleLogout}>
                <LogOut size={16} className="me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



