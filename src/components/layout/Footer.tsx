
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-600 mb-4">
              Golf Pro Finder connects golf enthusiasts with qualified instructors to improve their game.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-golf-blue">Home</Link></li>
              <li><Link to="/instructors" className="text-gray-600 hover:text-golf-blue">Find Instructors</Link></li>
              <li><Link to="/join" className="text-gray-600 hover:text-golf-blue">Become an Instructor</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/instructors?category=in-person" className="text-gray-600 hover:text-golf-blue">In-Person Lessons</Link></li>
              <li><Link to="/instructors?category=online" className="text-gray-600 hover:text-golf-blue">Online Coaching</Link></li>
              <li><Link to="/instructors?category=academy" className="text-gray-600 hover:text-golf-blue">Golf Academies</Link></li>
              <li><Link to="/instructors?category=competitive" className="text-gray-600 hover:text-golf-blue">Competitive Training</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@golfprofinder.com</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Golf Pro Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
