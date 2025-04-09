
import React from 'react';
import { MapPin, Award, Clock } from 'lucide-react';
import { InstructorDetails } from '@/types/instructor';

interface ProfileHeaderProps {
  instructor: InstructorDetails;
}

const ProfileHeader = ({ instructor }: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-6 md:mb-0 md:mr-6">
          <img
            src={instructor.photos[0]}
            alt={instructor.name}
            className="w-full h-auto rounded-lg"
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
          <p className="text-gray-600 mb-4">{instructor.tagline}</p>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={18} className="mr-2" />
            <span>{instructor.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-gray-700">
              <Clock size={18} className="text-golf-blue mr-2" />
              <span>{instructor.experience}+ Years Experience</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Award size={18} className="text-golf-blue mr-2" />
              <span>{instructor.specialization}</span>
            </div>
            
            {instructor.certifications.map((cert, index) => (
              <div key={index} className="flex items-center text-gray-700">
                <Award size={18} className="text-yellow-500 mr-2" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
