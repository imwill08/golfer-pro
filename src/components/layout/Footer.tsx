import React from 'react'; 
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-12">
        {/* Logo and Description */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="grid grid-cols-3 grid-rows-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <h1 className="text-3xl font-bold">GolfPro Connect</h1>
          </div>
          
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Connecting passionate golfers with top-rated instructors near you. Learn, train, and improve your game with expert coaching
          </p>
        </div>
        
        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-center md:text-center">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/instructors" className="text-muted-foreground hover:text-primary transition-colors">Find Instructors</Link></li>
              <li><Link to="/join-instructor" className="text-muted-foreground hover:text-primary transition-colors">Join as Instructor</Link></li>
              <li><Link to="/faqs" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-center md:text-center">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">Support</Link></li>
              <li><Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-center md:text-center">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright and Social Links */}
        <div className="border-t pt-8">
          <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} GolfPro Connect. All rights reserved.
            </p>
            <div className="flex gap-6 justify-center">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
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
