
import React from 'react';
import { MapPin, Clock, Award, Mail, Phone, Globe, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { InstructorDetails } from '@/types/instructor';
import BookLessonDialog from './BookLessonDialog';

interface ProfileSidebarProps {
  instructor: InstructorDetails;
}

const ProfileSidebar = ({ instructor }: ProfileSidebarProps) => {
  // Get the first service price as the default display price
  const defaultPrice = instructor.services && instructor.services.length > 0 
    ? instructor.services[0].price 
    : '$100 / Hr';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <MapPin size={18} className="mr-2" />
        Location: {instructor.location}
      </h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Clock size={18} className="text-yellow-500 mr-2" />
          <span>{instructor.experience}+ Years Experience</span>
        </div>
        
        <div className="flex items-center mb-2">
          <Award size={18} className="text-blue-500 mr-2" />
          <span>{instructor.specialization}</span>
        </div>
        
        <div className="flex items-center">
          <Award size={18} className="text-yellow-500 mr-2" />
          <span>PGA Certified</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Price:</h4>
        <div className="text-xl text-golf-blue font-medium">{defaultPrice}</div>
      </div>
      
      <BookLessonDialog instructor={instructor}>
        <Button className="w-full mb-6 bg-green-600 hover:bg-green-700">
          <Calendar className="mr-2" />
          Book a Lesson
        </Button>
      </BookLessonDialog>
      
      <Separator className="my-4" />
      
      <div>
        <h4 className="text-lg font-semibold mb-4">Contact Details</h4>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail size={18} className="text-gray-500 mr-3" />
            <a href={`mailto:${instructor.contactInfo.email}`} className="text-golf-blue hover:underline">
              {instructor.contactInfo.email}
            </a>
          </div>
          
          <div className="flex items-center">
            <Phone size={18} className="text-gray-500 mr-3" />
            <a href={`tel:${instructor.contactInfo.phone}`} className="text-golf-blue hover:underline">
              {instructor.contactInfo.phone}
            </a>
          </div>
          
          <div className="flex items-center">
            <Globe size={18} className="text-gray-500 mr-3" />
            <a href={`https://${instructor.contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-golf-blue hover:underline">
              {instructor.contactInfo.website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
