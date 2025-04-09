import React from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-container mb-4"> 
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="hero-title mb-8">
          Find the Best Golf Instructors Near You
        </h1>
        {/* <p className="hero-subtitle">
          Search and connect with expert golf instructors for personalized coaching
        </p> */}
      </div>

      <div className="search-container">
        <div className="search-bar">
          <div className="flex items-center gap-2 flex-1 pl-4">
            <MapPin className="w-6 h-6 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Zip Code" 
              className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-xl placeholder:text-gray-400"
              aria-label="Zip Code"
            />
          </div>
          
          <div className="w-px h-8 self-center bg-gray-200"></div>
          
          <div className="relative min-w-[220px]">
            <select
              className="w-full h-full appearance-none border-0 focus:ring-0 focus:outline-none text-gray-700 px-4 text-xl"
              aria-label="Category"
              defaultValue=""
            >
              <option value="" disabled>Categories</option>
              <option value="in-person">In-Person Lessons</option>
              <option value="online">Online Lessons</option>
              <option value="academy">Golf Academy</option>
              <option value="practice">Golf Practice Facilities</option>
            </select>
            <ChevronDown className="w-6 h-6 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <Button size="lg" className="rounded-[35px] px-10 bg-blue-600 hover:bg-blue-700">
            <Search className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="category-buttons">
        <button className="category-button">
          <img 
            src="/icons/person-icon.png" 
            alt="" 
            className="w-4 h-4" 
          />
          In-Person Lessons
        </button>
        <button className="category-button">
          <img 
            src="/icons/online-icon.png" 
            alt="" 
            className="w-4 h-4" 
          />
          Online Lessons
        </button>
        <button className="category-button">
          <img 
            src="/icons/academy-icon.png" 
            alt="" 
            className="w-4 h-4" 
          />
          Gold Academy
        </button>
        <button className="category-button">
          <img 
            src="/icons/facility-icon.png" 
            alt="" 
            className="w-4 h-4" 
          />
          Golf Practice Facilities
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
