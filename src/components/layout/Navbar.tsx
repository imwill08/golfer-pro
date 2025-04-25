import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    return cn(
      "text-base transition-colors",
      isActivePath(path)
        ? "text-primary font-medium"
        : "text-gray-600 hover:text-gray-900"
    );
  };

  const getMobileLinkClasses = (path: string) => {
    return cn(
      "block px-3 py-2 rounded-md text-base font-medium transition-colors",
      isActivePath(path)
        ? "text-primary bg-primary/5"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="grid grid-cols-3 grid-rows-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-xl font-bold text-primary">GolfPro Connect</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={getLinkClasses('/')}
            >
              Home
            </Link>
            <Link 
              to="/instructors" 
              className={getLinkClasses('/instructors')}
            >
              Find Instructors
            </Link>
            <Link 
              to="/admin/login" 
              className={getLinkClasses('/admin')}
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              <Link 
                to="/" 
                className={getMobileLinkClasses('/')}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/instructors" 
                className={getMobileLinkClasses('/instructors')}
                onClick={() => setIsMenuOpen(false)}
              >
                Find Instructors
              </Link>
              <Link 
                to="/admin/login" 
                className={getMobileLinkClasses('/admin')}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
