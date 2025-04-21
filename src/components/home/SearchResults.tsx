import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Instructor {
  id: string;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  specialization: string;
  experience: number;
  photos: string[];
  distance?: number;
  country: string;
  postal_code: string;
  hourly_rate: number;
  certifications: string[];
  lesson_types: string[];
}

interface SearchResultsProps {
  instructors: Instructor[];
  isLoading: boolean;
  error: string | null;
  searchRadius: number;
}

const ITEMS_PER_PAGE = 6;

const SearchResults: React.FC<SearchResultsProps> = ({
  instructors,
  isLoading,
  error,
  searchRadius
}) => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  
  // Group instructors by exact matches and nearby
  const exactMatches = instructors.filter(i => i.distance === 0);
  const nearbyInstructors = instructors.filter(i => i.distance > 0);
  
  const displayedInstructors = instructors.slice(0, displayCount);
  const hasMore = displayCount < instructors.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, instructors.length));
  };

  const handleViewProfile = (instructorId: string) => {
    navigate(`/instructors/${instructorId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="ml-4 text-gray-600">Finding instructors near you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-600 min-h-[200px] flex items-center justify-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!instructors.length) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center min-h-[200px] flex flex-col items-center justify-center">
          <p className="text-gray-600">No instructors found within {searchRadius}km of this location.</p>
          <p className="text-sm text-gray-500 mt-2">Try increasing your search radius or searching in a different area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {instructors.length} Instructor{instructors.length !== 1 ? 's' : ''} Found
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {exactMatches.length > 0 && (
            <span className="font-medium">{exactMatches.length} exact {exactMatches.length === 1 ? 'match' : 'matches'}</span>
          )}
          {exactMatches.length > 0 && nearbyInstructors.length > 0 && ' and '}
          {nearbyInstructors.length > 0 && (
            <span>{nearbyInstructors.length} within {searchRadius}km</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedInstructors.map((instructor) => (
          <Card 
            key={instructor.id} 
            className="relative overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full cursor-pointer"
            onClick={() => handleViewProfile(instructor.id)}
          >
            {/* Main Image */}
            <div className="w-full h-36 sm:h-40 relative overflow-hidden">
              {instructor.photos?.[0] ? (
                <img 
                  src={instructor.photos[0]} 
                  alt={`${instructor.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Award className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            <CardHeader className="flex-grow py-3 px-4">
              <CardTitle className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold line-clamp-1">{instructor.name}</h3>
                  <span className="text-sm font-semibold text-blue-900">${instructor.hourly_rate}/Hr</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs mt-0.5">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{instructor.location}</span>
                </div>
                
                {/* Distance Badge */}
                {instructor.distance === 0 ? (
                  <Badge variant="secondary" className="mt-1 text-xs px-2 py-0">Exact Match</Badge>
                ) : (
                  <Badge variant="outline" className="mt-1 text-xs px-2 py-0">
                    {Math.round(instructor.distance * 10) / 10}km away
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 py-3 px-4">
              {/* Experience */}
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1">{instructor.experience} Years Experience</span>
              </div>

              {/* Specialization */}
              <div className="flex items-center text-gray-600 text-sm">
                <Award className="w-3 h-3 mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1">{instructor.specialization}</span>
              </div>

              {/* Lesson Types */}
              <div className="flex items-center text-gray-600 text-sm">
                <BookOpen className="w-3 h-3 mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1">{instructor.lesson_types?.join(' / ') || 'Private Lessons'}</span>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1 mt-2">
                {instructor.certifications?.slice(0, 2).map((cert, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                    {cert}
                  </Badge>
                ))}
                {(instructor.certifications?.length || 0) > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    +{instructor.certifications!.length - 2} more
                  </Badge>
                )}
              </div>

              <button 
                className="w-full mt-3 bg-blue-900 text-white py-2 text-sm rounded hover:bg-blue-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProfile(instructor.id);
                }}
              >
                View Profile
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="sm"
            className="px-4 py-1.5 text-sm text-blue-900 border-blue-900 hover:bg-blue-50"
          >
            Load More Instructors
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 