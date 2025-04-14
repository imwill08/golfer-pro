import React from 'react'; 
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="footer-logo">
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
            <div className="footer-logo-dot"></div>
          </div>
          <h1 className="text-3xl font-bold">GolfPro Admin</h1>
        </div>
        <p className="footer-description">
          Connecting passionate golfers with top-rated instructors near you. Learn, train, and improve your game with expert coaching
        </p>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/instructors" className="footer-link">Find Instructors</Link></li>
                <li><Link to="/join" className="footer-link">Join as Instructor</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/faqs" className="footer-link">FAQs</Link></li>
              </ul>
            </div>
            
            <div className="text-center">
              <h3 className="footer-heading">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms" className="footer-link">Terms of Services</Link></li>
                <li><Link to="/support" className="footer-link">Support</Link></li>
                <li><Link to="/admin" className="footer-link">Admin Panel</Link></li>
              </ul>
            </div>
            
            <div className="text-center">
              <h3 className="footer-heading">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-divider">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <p className="footer-copyright">&copy; 2025 GolfProConnect. All rights reserved.</p>
            <div className="flex gap-4 flex-1 justify-end">
              <a href="#" className="footer-social-icon">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="footer-social-icon">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="footer-social-icon">
                <FaFacebook size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
