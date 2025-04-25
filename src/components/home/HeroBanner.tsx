import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getCoordinatesFromZip, calculateDistance } from '@/utils/geoUtils';
import { supabase } from '@/integrations/supabase/client';
import SearchResults from './SearchResults';
import './HeroBanner.css';

interface Instructor {
  id: string;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  specialization: string;
  experience: number;
  photos: string[];
  distance?: number;
  country: string;
  postal_code: string;
  hourly_rate: number;
  certifications: string[];
  lesson_types: string[];
}

const HeroBanner = () => {
  const [showRadiusPopup, setShowRadiusPopup] = useState(false);
  const [radius, setRadius] = useState('25');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [isSearching, setIsSearching] = useState(false);
  const [zipError, setZipError] = useState('');
  
  // New states for search results
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchCoordinates, setSearchCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const radiusButtonRef = useRef<HTMLButtonElement>(null);
  const radiusPopupRef = useRef<HTMLDivElement>(null);

  // Add ref for search results section
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data, error } = await supabase
          .from('instructors')
          .select('*')
          .eq('status', 'approved');

        if (error) throw error;
        setInstructors(data || []);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setSearchError('Failed to load instructors. Please try again.');
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    // Close popups when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (!radiusButtonRef.current?.contains(target) && 
          !radiusPopupRef.current?.contains(target)) {
        setShowRadiusPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset error when zip code changes
  useEffect(() => {
    if (zipError) {
      setZipError('');
    }
  }, [zipCode]);

  const toggleRadiusPopup = () => {
    setShowRadiusPopup(!showRadiusPopup);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(e.target.value);
  };

  const validateZipCode = (zip: string, country: string): { isValid: boolean; error?: string } => {
    if (country.toUpperCase() === 'USA') {
      if (!/^\d{5}(-\d{4})?$/.test(zip)) {
        return { isValid: false, error: 'Please enter a valid zip code' };
      }
    } else {
      if (zip.length === 0) {
        return { isValid: false, error: 'Please enter a zip code' };
      }
    }
    return { isValid: true };
  };

  // Function to handle smooth scrolling
  const scrollToResults = () => {
    if (searchResultsRef.current) {
      const yOffset = -100; // Offset to account for fixed header if any
      const element = searchResultsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const handleSearch = async () => {
    console.log('🔍 Search initiated:', { zipCode, country, radius });
    
    // Reset states
    setZipError('');
    setSearchError(null);
    setFilteredInstructors([]);
    setSearchCoordinates(null);

    // Validate inputs
    const validation = validateZipCode(zipCode, country);
    if (!validation.isValid) {
      console.log('⚠️ Zip code validation failed:', validation.error);
      setZipError(validation.error || 'Invalid zip code');
      toast.error(validation.error || 'Please enter a valid zip code');
      return;
    }

    // Validate radius
    const radiusNum = parseInt(radius);
    if (isNaN(radiusNum) || radiusNum < 1 || radiusNum > 100) {
      toast.error('Please select a valid search radius (1-100km)');
      return;
    }

    setIsSearching(true);

    try {
      // First, try to find exact matches in the database
      console.log('📍 Searching for exact matches:', { country, postal_code: zipCode });
      const exactMatches = instructors.filter(instructor => 
        instructor.country?.toLowerCase() === country.toLowerCase() &&
        instructor.postal_code === zipCode
      );

      console.log(`📌 Found ${exactMatches.length} exact matches`);

      // Get coordinates for the search location
      console.log('🌍 Getting coordinates for zip code:', zipCode);
      const coordinates = await getCoordinatesFromZip(zipCode, country);
      
      if (!coordinates) {
        console.log('❌ No coordinates found for zip code');
        setSearchError('Location not found. Please check the zip code and country.');
        toast.error('Location not found. Please check the zip code and country.');
        return;
      }

      setSearchCoordinates(coordinates);

      // If we have exact matches, prioritize them and then look for nearby instructors
      const nearbyInstructors = instructors
        .filter(instructor => {
          // Exclude exact matches from nearby search
          return !exactMatches.some(match => match.id === instructor.id);
        })
        .map(instructor => {
          if (!instructor.latitude || !instructor.longitude) {
            console.log(`⚠️ Instructor ${instructor.id} missing coordinates`);
            return null;
          }

          const distance = calculateDistance(
            coordinates,
            { latitude: instructor.latitude, longitude: instructor.longitude }
          );

          console.log(
            `• id=${instructor.id} @(${instructor.latitude},${instructor.longitude}) → ` +
            `dist=${distance.toFixed(2)}km <= ${radiusNum}km? ${distance <= radiusNum}`
          );

          return distance <= radiusNum ? { ...instructor, distance } : null;
        })
        .filter((instructor): instructor is Instructor & { distance: number } => instructor !== null);

      // Combine exact matches (with distance=0) with nearby instructors
      const allResults = [
        ...exactMatches.map(instructor => ({ ...instructor, distance: 0 })),
        ...nearbyInstructors
      ].sort((a, b) => (a.distance || 0) - (b.distance || 0));

      console.log(`✅ Found ${allResults.length} total instructors:`, {
        exactMatches: exactMatches.length,
        nearby: nearbyInstructors.length
      });

      setFilteredInstructors(allResults);

      // Wait for the results to be rendered before scrolling
      setTimeout(() => {
        scrollToResults();
      }, 100);

    } catch (error) {
      console.error('❌ Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error performing search. Please try again.';
      toast.error(errorMessage);
      setSearchError(errorMessage);
      
      // Scroll to error message as well
      setTimeout(() => {
        scrollToResults();
      }, 100);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  return (
    <>
      <header className="hero-container mb-4" role="banner"> 
        <div className="max-w-4xl mx-auto text-left">
          <h1 className="hero-title mb-8">
            Find the Best Golf Instructors Near You
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">
            Connect with professional golf instructors in your area. Book lessons, improve your game, and take your golf skills to the next level.
          </p>
        </div>

        <section className="search-container mb-4" aria-label="Golf instructor search">
          <form 
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            role="search"
            aria-label="Search for golf instructors"
          >
            {/* Zip Code Section */}
            <div className="search-section zip-section">
              <label htmlFor="zipCode" className="sr-only">Zip Code</label>
              <MapPin className="w-5 h-5" aria-hidden="true" />
              <Input 
                id="zipCode"
                type="text" 
                placeholder="Enter Zip Code" 
                className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${zipError ? 'text-red-500' : ''}`}
                aria-label="Enter your zip code"
                aria-invalid={!!zipError}
                aria-describedby={zipError ? "zipError" : undefined}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={10}
              />
              {zipError && (
                <div id="zipError" className="absolute -bottom-6 left-0 text-sm text-red-500" role="alert">
                  {zipError}
                </div>
              )}
            </div>
            
            <div className="search-divider" role="separator" />
            
            {/* Country Section */}
            <div className="search-section">
              <label htmlFor="country" className="sr-only">Country</label>
              <Input 
                id="country"
                type="text" 
                placeholder="Country" 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-2"
                aria-label="Select country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            
            <div className="search-divider" role="separator" />
            
            {/* Radius Section */}
            <div className="search-section">
              <button 
                ref={radiusButtonRef}
                className="section-button"
                onClick={toggleRadiusPopup}
                aria-expanded={showRadiusPopup}
                aria-haspopup="true"
                aria-controls="radiusPopup"
                type="button"
              >
                <span className={radius ? 'selected-value' : ''}>
                  {radius ? `${radius}km` : 'Radius'}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 transform transition-transform ${showRadiusPopup ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {showRadiusPopup && (
                <>
                  <div 
                    className="mobile-backdrop" 
                    onClick={() => setShowRadiusPopup(false)}
                    aria-hidden="true"
                  />
                  <div 
                    id="radiusPopup"
                    ref={radiusPopupRef} 
                    className="dropdown-popup radius-popup"
                    role="dialog"
                    aria-label="Select search radius"
                  >
                    <div className="mobile-radius-header">
                      <span className="mobile-radius-title">Select Search Radius</span>
                      <button 
                        className="mobile-radius-close"
                        onClick={() => setShowRadiusPopup(false)}
                        aria-label="Close radius selector"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="radius-slider-container">
                      <div className="radius-value-display" aria-live="polite">
                        {radius} kilometers
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={radius || '25'}
                        onChange={handleSliderChange}
                        className="radius-slider"
                        style={{
                          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(parseInt(radius) - 1)}%, #e5e7eb ${(parseInt(radius) - 1)}%, #e5e7eb 100%)`
                        }}
                        aria-label="Search radius in kilometers"
                        aria-valuemin={1}
                        aria-valuemax={100}
                        aria-valuenow={parseInt(radius)}
                        aria-valuetext={`${radius} kilometers`}
                      />
                      <div className="radius-labels" aria-hidden="true">
                        <span>1km</span>
                        <span>100km</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Search Button */}
            <button 
              className="search-button" 
              onClick={handleSearch}
              disabled={isSearching}
              aria-label="Search for golf instructors"
              type="submit"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              {isSearching && <span className="ml-2">Searching...</span>}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Find professional golf instructors offering private lessons, group classes, and specialized training.</p>
          </div>
        </section>
      </header>

      {/* Search Results Section */}
      <div 
        ref={searchResultsRef}
        className="scroll-mt-24" // Add padding to account for any fixed headers
      >
        {(isSearching || searchError || filteredInstructors.length > 0 || searchCoordinates) && (
          <SearchResults
            instructors={filteredInstructors}
            isLoading={isSearching}
            error={searchError}
            searchRadius={parseInt(radius)}
          />
        )}
      </div>
    </>
  );
};

export default HeroBanner;
