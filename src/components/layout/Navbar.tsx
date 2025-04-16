import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            LOGO
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-gray-900 ${location.pathname === '/' ? 'font-medium' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/instructors" 
              className={`text-gray-700 hover:text-gray-900 ${location.pathname === '/instructors' ? 'font-medium' : ''}`}
            >
              Find Instructors
            </Link>
            <Link 
              to="/admin" 
              className={`text-gray-700 font-bold hover:text-gray-900 ${location.pathname === '/admin' ? 'font-medium' : ''}`}
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`mobile-menu-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link 
            to="/instructors" 
            className={`mobile-menu-item ${location.pathname === '/instructors' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Find Instructors
          </Link>
          <Link 
            to="/admin" 
            className={`mobile-menu-item ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
