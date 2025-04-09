
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstructorProps } from './InstructorCard';

const InstructorListItem = ({
  id,
  name,
  location,
  experience,
  specialization,
  lessonType,
  priceRange,
  imageUrl
}: InstructorProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center">
      <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 mb-4 md:mb-0 md:mr-6">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span>{location}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <Clock size={16} className="text-golf-blue mr-2" />
            <span className="text-sm">{experience}+ Years Experience</span>
          </div>
          
          <div className="flex items-center">
            <Award size={16} className="text-golf-blue mr-2" />
            <span className="text-sm">{specialization}</span>
          </div>
          
          <div>
            <div className="text-sm">
              <span className="font-medium">Lesson Type: </span>
              {lessonType.join(' | ')}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <div className="mb-4 md:mb-0">
            <div className="text-lg font-semibold text-golf-blue">{priceRange} per hour</div>
          </div>
          
          <Link to={`/instructors/${id}`}>
            <Button>View Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorListItem;
