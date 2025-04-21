
import React, { useState, useRef } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface SearchBarProps {
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  radius: number | null;
  setRadius: (radius: number | null) => void;
  categories: { id: string; label: string }[];
  onCategorySelect: (categoryId: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  zipCode,
  setZipCode,
  selectedCategory,
  setSelectedCategory,
  radius,
  setRadius,
  categories,
  onCategorySelect,
}) => {
  const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
  const [showRadiusPopup, setShowRadiusPopup] = useState(false);
  
  const categoriesButtonRef = useRef<HTMLButtonElement>(null);
  const categoriesPopupRef = useRef<HTMLDivElement>(null);
  const radiusButtonRef = useRef<HTMLButtonElement>(null);
  const radiusPopupRef = useRef<HTMLDivElement>(null);

  const toggleCategoriesPopup = () => {
    setShowCategoriesPopup(!showCategoriesPopup);
    setShowRadiusPopup(false);
  };

  const toggleRadiusPopup = () => {
    setShowRadiusPopup(!showRadiusPopup);
    setShowCategoriesPopup(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
  };

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

  return (
    <div className="flex justify-center mt-0 relative z-4">
      <div className="w-[650px]">
        <div className="search-bar flex items-center bg-white rounded-full border shadow-sm">
          <div className="flex-1 flex items-center min-w-0 pl-4">
            <MapPin className="w-5 h-5 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Zip Code" 
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              aria-label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          
          <div className="h-10 w-px bg-gray-200" />
          
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

          <div className="h-10 w-px bg-gray-200" />
          
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
          
          <button className="h-12 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
