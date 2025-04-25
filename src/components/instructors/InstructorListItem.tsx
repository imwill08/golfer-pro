import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Award, Clock, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InstructorProps } from './InstructorCard';

const InstructorListItem = ({
  id,
  name,
  location,
  experience,
  specialization,
  lesson_types,
  priceRange,
  imageUrl,
  specialty,
  certifications,
  specialties
}: InstructorProps) => {
  const navigate = useNavigate();
  
  // Get lesson type titles for display
  const lessonTitles = lesson_types?.map(lt => lt.title) || ['No lessons available'];

  // Use a fallback image if imageUrl is empty
  const imageSource = imageUrl && imageUrl.trim() !== '' 
    ? imageUrl 
    : 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';
    
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the button
    if (!(e.target as HTMLElement).closest('.view-profile-btn')) {
      navigate(`/instructors/${id}`);
    }
  };

  return (
    <div 
      className="group bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-border cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="w-full md:w-72 h-48 md:h-auto relative">
          <img
            src={imageSource}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-primary text-primary-foreground">
              {priceRange}
            </Badge>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
            <div>
              <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={14} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{experience} Years Experience</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Award size={14} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">
                {specialties?.length ? specialties.join(' • ') : 'No specialties listed'}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground col-span-1 sm:col-span-2">
              <MonitorSmartphone size={14} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">
                {lessonTitles.join(' / ')}
              </span>
            </div>
          </div>

          {certifications && certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {certifications.slice(0, 2).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {certifications.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{certifications.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorListItem;
