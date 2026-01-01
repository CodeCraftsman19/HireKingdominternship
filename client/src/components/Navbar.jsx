import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Bell,
  Grid3x3,
  Menu,
  Settings,
  LogOut,
  User
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  /* 🔥 NAVBAR-ONLY HAMBURGER FIX */
  const handleHamburgerClick = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("mobile-open");
    }
  };

  return (
    <nav className="navbar-custom position-relative d-flex align-items-center justify-content-between">
      {/* LEFT */}
      <div className="d-flex align-items-center gap-2">
        {/* Hamburger (Mobile) */}
        <button
          className="btn btn-link d-md-none p-2 border-0"
          onClick={handleHamburgerClick}
          aria-label="Toggle Menu"
        >
          <Menu size={22} />
        </button>

        {/* Desktop Search */}
        <div className="d-none d-md-flex">
          <div className="input-group search-bar">
            <span className="input-group-text border-0">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search ⌘K"
            />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-2">
        {/* Mobile Search Toggle */}
        <button
          className="btn btn-link d-md-none p-2 border-0"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          <Search size={20} />
        </button>

        <ThemeToggle />

        {/* Apps */}
        <button className="btn btn-link p-2 border-0 position-relative">
          <Grid3x3 size={20} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
            0+
          </span>
        </button>

        {/* Notifications */}
        <button className="btn btn-link p-2 border-0 position-relative">
          <Bell size={20} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>

        {/* User */}
        <div className="dropdown">
          <button
            className="btn btn-link d-flex align-items-center text-decoration-none p-0 border-0"
            data-bs-toggle="dropdown"
          >
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: 36, height: 36, fontWeight: 600 }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="d-none d-md-flex flex-column align-items-start">
              <span className="fw-semibold" style={{ fontSize: "0.85rem" }}>
                {user?.name || "User"}
              </span>
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                Admin
              </span>
            </div>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow">
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
              <button
                className="dropdown-item d-flex align-items-center text-danger"
                onClick={handleLogout}
              >
                <LogOut size={16} className="me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {mobileSearchOpen && (
        <div className="position-absolute top-100 start-0 w-100 p-2 d-md-none">
          <div className="input-group search-bar">
            <span className="input-group-text border-0">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search"
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
