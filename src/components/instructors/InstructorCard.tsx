
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Award, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface InstructorProps {
  id: string;
  name: string;
  location: string;
  experience: number;
  specialization: string;
  lessonType: string[];
  priceRange: string;
  imageUrl: string;
}

const InstructorCard = ({
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
    <div className="instructor-card bg-white rounded-lg overflow-hidden shadow-md">
      <div className="h-60 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-semibold">{name}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Clock size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-700">{experience} Years Coaching</span>
        </div>
        
        <div className="flex items-center mb-2">
          <Award size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-700">{specialization}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <MonitorSmartphone size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-700">{lessonType.join(' / ')}</span>
        </div>
        
        <div className="mb-4">
          <div className="text-lg font-semibold text-golf-blue">{priceRange}</div>
        </div>
        
        <Link to={`/instructors/${id}`}>
          <Button className="w-full">View Profile</Button>
        </Link>
      </div>
    </div>
  );
};

export default InstructorCard;
