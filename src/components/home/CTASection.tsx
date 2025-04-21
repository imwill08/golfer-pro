import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-overlay"></div>
      <div className="cta-content">
        <div className="cta-text-container">
          <h2 className="cta-title">
            Share Your Golf Expertise – 
            Become an Instructor Today!
          </h2>
          <p className="cta-subtitle">
            Connect with students, grow your coaching business, and
            inspire the next generation of golfers.
          </p>
          <Link to="/join-instructor">
            <Button className="cta-button">
              Join as Instructor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
