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
  lessonType,
  priceRange,
  imageUrl,
  specialty,
  certifications
}: InstructorProps) => {
  const navigate = useNavigate();
  // Convert lessonType to array if it's a string
  const lessonTypes = typeof lessonType === 'string' 
    ? lessonType.split(' / ') 
    : Array.isArray(lessonType) ? lessonType : [];

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
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={14} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{experience} Years Experience</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Award size={14} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{specialization || specialty || 'Swing Analysis Specialist'}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground col-span-1 md:col-span-2">
              <MonitorSmartphone size={14} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">
                {lessonTypes.length > 0 ? lessonTypes.join(' / ') : 'In-Person / Online'}
              </span>
            </div>
          </div>
          
          {certifications && certifications.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {certifications.slice(0, 3).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {certifications.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{certifications.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-end mt-auto pt-4 border-t border-border">
            <Link to={`/instructors/${id}`} className="view-profile-btn">
              <Button variant="default">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorListItem;
