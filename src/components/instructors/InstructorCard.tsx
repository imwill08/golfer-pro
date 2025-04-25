import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Award, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface InstructorProps {
  id: string;
  name: string;
  location: string;
  experience: number;
  specialization: string;
  lesson_types: Array<{
    title: string;
    description: string;
    duration: string;
    price: number;
  }>;
  priceRange: string;
  imageUrl: string;
  specialty?: string;
  certifications?: string[];
  specialties?: string[];
}

const InstructorCard = ({
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
  const lessonTitles = Array.isArray(lesson_types) && lesson_types.length > 0
    ? lesson_types.map(lt => lt.title)
    : [];

  // Debug log
  console.log('Card lesson_types:', lesson_types);
  console.log('Card lessonTitles:', lessonTitles);
    
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
      <div className="relative">
        <img
          src={imageSource}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
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
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
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
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MonitorSmartphone size={14} className="mr-2 flex-shrink-0" />
            <span className="line-clamp-1">
              {lessonTitles.length > 0 ? lessonTitles.join(' / ') : 'No lessons available'}
            </span>
          </div>
        </div>

        {certifications && certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
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
        
        <Link to={`/instructors/${id}`} className="block view-profile-btn">
          <Button className="w-full" variant="default">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InstructorCard;
