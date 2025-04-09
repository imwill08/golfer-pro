
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 bg-gray-900 bg-opacity-70 bg-blend-overlay relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/2af45f20-8168-482a-acc9-84b0f424f7be.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Share Your Golf Expertise – Become an Instructor Today!
          </h2>
          <p className="text-xl mb-8">
            Connect with students, grow your coaching business, and inspire the next generation of golfers.
          </p>
          <Link to="/join">
            <Button size="lg" className="bg-white text-golf-blue hover:bg-gray-100">
              Apply to Join
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
