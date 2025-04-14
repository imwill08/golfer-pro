import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  return (
    <nav className="py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-golf-blue">LOGO</Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-golf-blue font-medium">Home</Link>
            <Link to="/instructors" className="text-gray-600 hover:text-golf-blue font-medium">Find Instructors</Link>
            <Link to="/admin" className="text-black hover:text-golf-blue font-bold">Admin Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
