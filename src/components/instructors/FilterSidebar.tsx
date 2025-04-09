
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin, ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void;
}

const FilterSidebar = ({ onFiltersChange }: FilterSidebarProps) => {
  const [location, setLocation] = React.useState('');
  const [lessonType, setLessonType] = React.useState({
    inPerson: false,
    online: false,
    academy: false,
  });
  const [experienceRange, setExperienceRange] = React.useState([0]);
  const [priceRange, setPriceRange] = React.useState([0, 100]);
  const [showMoreOptions, setShowMoreOptions] = React.useState(false);

  React.useEffect(() => {
    onFiltersChange({
      location,
      lessonType,
      experienceRange: experienceRange[0],
      priceRange,
    });
  }, [location, lessonType, experienceRange, priceRange, onFiltersChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>
      
      {/* Location */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <MapPin size={18} className="text-gray-500 mr-2" />
          <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
        </div>
        <Input
          id="location"
          placeholder="City, State or Zip"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Lesson Type */}
      <div className="mb-6">
        <Label className="text-gray-700 font-medium mb-3 block">Lesson Type</Label>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="in-person"
              checked={lessonType.inPerson}
              onCheckedChange={(checked) => 
                setLessonType(prev => ({ ...prev, inPerson: checked as boolean }))
              }
              className="mr-2"
            />
            <Label htmlFor="in-person" className="text-gray-600">In-person</Label>
          </div>
          
          <div className="flex items-center">
            <Checkbox
              id="online"
              checked={lessonType.online}
              onCheckedChange={(checked) => 
                setLessonType(prev => ({ ...prev, online: checked as boolean }))
              }
              className="mr-2"
            />
            <Label htmlFor="online" className="text-gray-600">Online</Label>
          </div>
          
          <div className="flex items-center">
            <Checkbox
              id="academy"
              checked={lessonType.academy}
              onCheckedChange={(checked) => 
                setLessonType(prev => ({ ...prev, academy: checked as boolean }))
              }
              className="mr-2"
            />
            <Label htmlFor="academy" className="text-gray-600">Academy</Label>
          </div>
        </div>
      </div>
      
      {/* Years of Experience */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <Label className="text-gray-700 font-medium">Years Of Experience</Label>
          <span className="text-gray-500 text-sm">{experienceRange[0]}+</span>
        </div>
        <Slider
          value={experienceRange}
          min={0}
          max={30}
          step={1}
          onValueChange={setExperienceRange}
        />
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <Label className="text-gray-700 font-medium">Price</Label>
          <span className="text-gray-500 text-sm">${priceRange[0]}-{priceRange[1]}</span>
        </div>
        <Slider
          value={priceRange}
          min={0}
          max={300}
          step={10}
          onValueChange={setPriceRange}
        />
      </div>
      
      {/* More Options */}
      <button
        className="flex items-center justify-between w-full text-gray-700 font-medium"
        onClick={() => setShowMoreOptions(!showMoreOptions)}
      >
        <span>More Options</span>
        <ChevronDown 
          size={18} 
          className={`transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {showMoreOptions && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium block">Certifications</Label>
            <div className="flex items-center">
              <Checkbox id="pga-certified" className="mr-2" />
              <Label htmlFor="pga-certified" className="text-gray-600">PGA Certified</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium block">Availability</Label>
            <div className="flex items-center">
              <Checkbox id="weekends" className="mr-2" />
              <Label htmlFor="weekends" className="text-gray-600">Weekends</Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="evenings" className="mr-2" />
              <Label htmlFor="evenings" className="text-gray-600">Evenings</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
