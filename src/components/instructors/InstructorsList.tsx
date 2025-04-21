import React from 'react';
import InstructorCard from '@/components/instructors/InstructorCard';
import InstructorListItem from '@/components/instructors/InstructorListItem';

interface ProcessedInstructor {
  id: string;
  name: string;
  location: string;
  image: string;
  experience: number;
  specialty: string;
  lessonType: string;
  rate: string;
  specialization: string;
  priceRange: string;
  imageUrl: string;
  certifications: string[];
  services: {
    title: string;
    description: string;
    duration: string;
    price: string;
  }[];
  latitude: number | null;
  longitude: number | null;
}

interface InstructorsListProps {
  instructors: ProcessedInstructor[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  error: Error | null;
}

const InstructorsList: React.FC<InstructorsListProps> = ({
  instructors,
  viewMode,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading instructors...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-destructive">
        <p>Error loading instructors. Please try again.</p>
      </div>
    );
  }
  
  if (instructors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <p>No instructors found. Check back soon or adjust your filters.</p>
      </div>
    );
  }
  
  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="h-full">
              <InstructorCard
                id={instructor.id}
                name={instructor.name}
                location={instructor.location}
                imageUrl={instructor.imageUrl || instructor.image || ''}
                experience={instructor.experience}
                specialization={instructor.specialization}
                specialty={instructor.specialty}
                lessonType={instructor.lessonType}
                priceRange={instructor.priceRange || `$${instructor.rate}/Hr`}
                certifications={instructor.certifications}
                services={instructor.services}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="transition-all duration-200 hover:transform hover:scale-[1.01]">
              <InstructorListItem
                id={instructor.id}
                name={instructor.name}
                location={instructor.location}
                imageUrl={instructor.imageUrl || instructor.image || ''}
                experience={instructor.experience}
                specialization={instructor.specialization}
                specialty={instructor.specialty}
                lessonType={instructor.lessonType}
                priceRange={instructor.priceRange || `$${instructor.rate}/Hr`}
                certifications={instructor.certifications}
                services={instructor.services}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorsList;
