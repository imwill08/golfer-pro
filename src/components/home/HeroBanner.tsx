import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './HeroBanner.css';

const categories = [
  { id: 'private-lessons', label: 'Private Lessons' },
  { id: 'online-coaching', label: 'Online Coaching' },
  { id: 'group-lessons', label: 'Group Lessons' },
  { id: 'on-course-instruction', label: 'On-Course Instruction' }
];

const HeroBanner = () => {
  const [showRadiusPopup, setShowRadiusPopup] = useState(false);
  const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
  const [radius, setRadius] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const radiusButtonRef = useRef<HTMLButtonElement>(null);
  const radiusPopupRef = useRef<HTMLDivElement>(null);
  const categoriesButtonRef = useRef<HTMLButtonElement>(null);
  const categoriesPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (!radiusButtonRef.current?.contains(target) && 
          !radiusPopupRef.current?.contains(target)) {
        setShowRadiusPopup(false);
      }

      if (!categoriesButtonRef.current?.contains(target) && 
          !categoriesPopupRef.current?.contains(target)) {
        setShowCategoriesPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoriesPopup(false);
  };

  const toggleRadiusPopup = () => {
    setShowCategoriesPopup(false);
    setShowRadiusPopup(!showRadiusPopup);
  };

  const toggleCategoriesPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRadiusPopup(false);
    setShowCategoriesPopup(!showCategoriesPopup);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setRadius(e.target.value);
  };

  return (
    <div className="hero-container mb-4 "> 
      <div className="max-w-4xl mx-auto text-left">
        <h1 className="hero-title mb-8">
          Find the Best Golf Instructors Near You
        </h1>
        {/* <p className="hero-subtitle">
          Search and connect with expert golf instructors for personalized coaching
        </p> */}
      </div>

      <div className="search-container mb-4">
        <div className="search-bar">
          {/* Zip Code Section */}
          <div className="search-section zip-section">
            <MapPin className="w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Zip Code" 
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Zip Code"
            />
          </div>
          
          <div className="search-divider" />
          
          {/* Categories Section */}
          <div className="flex-1 px-4 relative">
            <button 
              ref={categoriesButtonRef}
              className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-900"
              onClick={toggleCategoriesPopup}
            >
              <span>
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'Services'}
              </span>
              <ChevronDown className={`w-5 h-5 transform transition-transform ${showCategoriesPopup ? 'rotate-180' : ''}`} />
            </button>

            {showCategoriesPopup && (
              <div 
                ref={categoriesPopupRef} 
                className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-lg shadow-lg py-1 z-50"
                style={{
                  minWidth: '200px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      selectedCategory === category.id 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="search-divider" />
          
          {/* Radius Section */}
          <div className="search-section">
            <button 
              ref={radiusButtonRef}
              className="section-button"
              onClick={toggleRadiusPopup}
            >
              <span className={radius ? 'selected-value' : ''}>
                {radius ? `${radius}km` : 'Radius'}
              </span>
              <ChevronDown className={`w-5 h-5 transform transition-transform ${showRadiusPopup ? 'rotate-180' : ''}`} />
            </button>

            {showRadiusPopup && (
              <div 
                ref={radiusPopupRef} 
                className="dropdown-popup radius-popup"
              >
                <div className="radius-slider-container">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={radius || '5'}
                    onChange={handleSliderChange}
                    className="radius-slider"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Search Button */}
          <button className="search-button">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="category-buttons mb-4">
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