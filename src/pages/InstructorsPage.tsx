import React, { useState, useRef } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import { BsGrid, BsList } from 'react-icons/bs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSidebar from '@/components/instructors/FilterSidebar';
import InstructorsList from '@/components/instructors/InstructorsList';
import InstructorPagination from '@/components/instructors/InstructorPagination';
import { useInstructors } from '@/hooks/useInstructors';
import { ProcessedInstructor } from '@/types/instructor';
import { ChevronDown, MapPin, Search, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'in-person', label: 'In-Person' },
  { id: 'online', label: 'Online' },
  { id: 'advance-training', label: 'Advance training' },
  { id: 'strategy-coaching', label: 'Strategy Coaching' },
  { id: 'junior-golf', label: 'Junior Golf' }
];

const InstructorsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zipCode, setZipCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [radius, setRadius] = useState<number | null>(null);
  const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
  const [showRadiusPopup, setShowRadiusPopup] = useState(false);
  const [experienceRange, setExperienceRange] = useState([0, 30]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const categoriesButtonRef = useRef<HTMLButtonElement>(null);
  const categoriesPopupRef = useRef<HTMLDivElement>(null);
  const radiusButtonRef = useRef<HTMLButtonElement>(null);
  const radiusPopupRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [filters, setFilters] = useState({
    zipCode: '',
    category: '',
    radius: null as number | null,
    lessonTypes: {
      inPerson: false,
      online: false,
      academy: false
    },
    experienceRange: [0, 30],
    priceRange: [0, 100],
    certifications: {
      beginnerFriendly: false,
      shortGameSpecialist: false,
      pgaCertified: false,
      lpgaCertified: false,
      tpiCertified: false,
      usKidsCertified: false,
      golfDigestCertified: false
    }
  });

  const toggleCategoriesPopup = () => {
    setShowCategoriesPopup(!showCategoriesPopup);
    setShowRadiusPopup(false);
  };

  const toggleRadiusPopup = () => {
    setShowRadiusPopup(!showRadiusPopup);
    setShowCategoriesPopup(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoriesPopup(false);
    setFilters(prev => ({ ...prev, category: categoryId }));
    handleFiltersChange({ ...filters, category: categoryId });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseInt(e.target.value));
  };

  // Close popups when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesPopupRef.current &&
        categoriesButtonRef.current &&
        !categoriesPopupRef.current.contains(event.target as Node) &&
        !categoriesButtonRef.current.contains(event.target as Node)
      ) {
        setShowCategoriesPopup(false);
      }

      if (
        radiusPopupRef.current &&
        radiusButtonRef.current &&
        !radiusPopupRef.current.contains(event.target as Node) &&
        !radiusButtonRef.current.contains(event.target as Node)
      ) {
        setShowRadiusPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const itemsPerPage = 6;
  
  const {
    instructors,
    filteredCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    handleFiltersChange,
    goToPage
  } = useInstructors(itemsPerPage);

  const renderInstructorCard = (instructor: ProcessedInstructor) => {
    if (viewMode === 'list') {
      return (
        <div key={instructor.id} className="p-6 flex gap-8">
          {/* Profile Image */}
          <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop"
              alt={instructor.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-grow">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{instructor.name}</h3>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                {instructor.location}
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                <span>{instructor.experience}+ Years Experience</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Swing Analysis Specialist</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                <span>PGA Certified</span>
              </div>
            </div>

            {/* Lesson Type */}
            <div className="mb-4">
              <span className="text-gray-600">Lesson Type: </span>
              <span className="text-gray-900">In-Person</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-900">Online</span>
            </div>

            {/* Price and View Profile */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-gray-600 mr-2">Price:</span>
                <span className="text-2xl font-bold text-gray-900">${instructor.rate} per hour</span>
              </div>
              <Link 
                to={`/instructors/${instructor.id}`}
                className="px-4 py-2 bg-white text-gray-900 text-sm rounded-full font-medium shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={instructor.id} className="overflow-hidden group">
        {/* Image Container */}
        <div className="relative h-[260px] rounded-2xl overflow-hidden mb-4">
          <img 
            src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop"
            alt={instructor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-semibold mb-1">{instructor.name}</h3>
            <p className="text-sm opacity-90">{instructor.location}</p>
          </div>
        </div>

        {/* Details Container */}
        <div className="space-y-3">
          {/* Experience */}
          <div className="flex items-center text-gray-600">
            <span className="w-5 h-5 flex items-center justify-center">⌚</span>
            <span className="ml-2 text-[15px]">{instructor.experience} Years Coaching</span>
          </div>

          {/* Specialty */}
          <div className="flex items-center text-gray-600">
            <span className="w-5 h-5 flex items-center justify-center">🎯</span>
            <span className="ml-2 text-[15px]">Swing Analysis Specialist</span>
          </div>

          {/* Lesson Type */}
          <div className="flex items-center text-gray-600">
            <span className="w-5 h-5 flex items-center justify-center">📍</span>
            <span className="ml-2 text-[15px]">In-Person / Online</span>
          </div>

          {/* Rate and View Profile */}
          <div className="pt-3 flex items-center justify-between">
            <div className="text-xl font-semibold">${instructor.rate}/Hr</div>
            <Link 
              to={`/instructors/${instructor.id}`}
              className="px-4 py-2 bg-white text-gray-900 text-sm rounded-full font-medium shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-0">
        {/* Search Header Section */}
        <div className="bg-white">
          <div className="container mx-1 px-6 mb-4">
            <div className="flex justify-center mt-0 relative z-4">
              <div className="w-[650px]">
                <div className="search-bar flex items-center bg-white rounded-full border shadow-sm">
                  {/* Zip Code Section */}
                  <div className="flex-1 flex items-center min-w-0 pl-4">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="Zip Code" 
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                      aria-label="Zip Code"
                    />
                  </div>
                  
                  <div className="h-10 w-px bg-gray-200" />
                  
                  {/* Categories Section */}
                  <div className="flex-1 px-4 relative">
                    <button 
                      ref={categoriesButtonRef}
                      className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-900"
                      onClick={toggleCategoriesPopup}
                    >
                      <span>
                        {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'Categories'}
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

                  <div className="h-10 w-px bg-gray-200" />
                  
                  {/* Radius Section */}
                  <div className="flex-1 px-4 relative">
                    <button 
                      ref={radiusButtonRef}
                      className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-900"
                      onClick={toggleRadiusPopup}
                    >
                      <span>
                        {radius ? `${radius}km` : 'Radius'}
                      </span>
                      <ChevronDown className={`w-5 h-5 transform transition-transform ${showRadiusPopup ? 'rotate-180' : ''}`} />
                    </button>

                    {showRadiusPopup && (
                      <div 
                        ref={radiusPopupRef} 
                        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-lg shadow-lg p-4 z-50"
                        style={{
                          minWidth: '200px'
                        }}
                      >
                        <div className="space-y-4">
                          <Slider
                            value={[radius || 5]}
                            onValueChange={([value]) => setRadius(value)}
                            max={100}
                            step={5}
                            aria-label="Radius"
                          />
                          <div className="text-sm text-gray-500 text-center">
                            {radius || 5}km radius
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Search Button */}
                  <button className="h-12 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-12">
            {/* Filters Sidebar */}
            <div className="w-72 flex-shrink-0">
              <div className="sticky top-8">
                <h2 className="text-lg font-semibold mb-6">Filters</h2>
                
                {/* Location Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
                
                {/* Lesson Type Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Lesson Type</h3>
                  <div className="space-y-2.5">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-600">In-person</span>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-600">Online</span>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-600">Academy</span>
                    </label>
                  </div>
                </div>
                
                {/* Years of Experience Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Years Of Experience</h3>
                  <div className="px-1">
                    <Slider
                      value={experienceRange}
                      onValueChange={setExperienceRange}
                      max={30}
                      step={1}
                      className="mb-2"
                      aria-label="Years of Experience"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">{experienceRange[0]} years</span>
                      <span className="text-sm text-gray-500">{experienceRange[1]} years</span>
                    </div>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Price</h3>
                    <span className="text-sm text-gray-500">${priceRange[0]}-${priceRange[1]}</span>
                  </div>
                  <div className="px-1">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100}
                      step={5}
                      className="mb-2"
                      aria-label="Price Range"
                    />
                  </div>
                </div>

                {/* More Options */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    More Options
                    <ChevronDown 
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        showMoreOptions ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {showMoreOptions && (
                    <div className="mt-4 space-y-2.5">
                      <label className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">Beginner-friendly</span>
                      </label>
                      <label className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">Short Game Specialist</span>
                      </label>
                      <label className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">PGA Certified</span>
                      </label>
                      <label className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">LPGA Certified</span>
                      </label>
                      <label className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">TPI Certified</span>
                      </label>
                      <label className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">US Kids Certified</span>
                      </label>
                      <label className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">Golf Digest Certified</span>
                      </label>
                    </div>
                  )}
                </div>
                
                {/* Apply Button */}
                <div className="mt-8">
                  <button className="w-full bg-blue-600 text-white py-2.5 px-2 rounded-full font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Apply
                  </button>
                </div>
              </div>
            </div>
            
            {/* Instructors Grid Section */}
            <div className="flex-1">
              {/* Header with Title and View Toggle */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-[40px] font-small text-gray-700">Golf Instructors Available Here</h1>
                <div className="bg-[#EEF7FF] p-1 rounded-lg flex gap-1">
                  <button 
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-[#0066FF] shadow-sm' 
                        : 'text-gray-500'
                    }`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid View"
                  >
                    <BsGrid className="w-4 h-4" />
                  </button>
                  <button 
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-[#0066FF] shadow-sm' 
                        : 'text-gray-500'
                    }`}
                    onClick={() => setViewMode('list')}
                    aria-label="List View"
                  >
                    <BsList className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instructors Grid */}
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10' 
                  : 'grid-cols-1 gap-6'
              }`}>
                {!isLoading && !error && instructors.map(renderInstructorCard)}
              </div>
              
              {/* Pagination */}
              {filteredCount > 0 && (
                <div className="mt-8">
                <InstructorPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorsPage;