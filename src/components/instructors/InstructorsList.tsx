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
  specialization: string;
  imageUrl: string;
  certifications: string[];
  specialties: string[];
  lesson_types: Array<{
    title: string;
    description: string;
    duration: string;
    price: number;
  }>;
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
  // Calculate average price from lesson_types
  const calculateAveragePrice = (lesson_types: ProcessedInstructor['lesson_types']) => {
    if (!lesson_types || !Array.isArray(lesson_types) || lesson_types.length === 0) return 0;
    const total = lesson_types.reduce((sum, lesson) => {
      const price = typeof lesson.price === 'number' ? lesson.price : parseInt(lesson.price as any);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    return Math.round(total / lesson_types.length);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl overflow-hidden border border-border animate-pulse"
          >
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => {
            // Debug log
            console.log('Instructor lesson_types:', instructor.lesson_types);
            const avgPrice = calculateAveragePrice(instructor.lesson_types);
            console.log('Calculated average price:', avgPrice);

            return (
              <div key={instructor.id} className="h-full">
                <InstructorCard
                  id={instructor.id}
                  name={instructor.name}
                  location={instructor.location}
                  imageUrl={instructor.imageUrl || instructor.image || ''}
                  experience={instructor.experience}
                  specialization={instructor.specialization}
                  specialty={instructor.specialty}
                  specialties={instructor.specialties}
                  lesson_types={instructor.lesson_types || []}
                  priceRange={avgPrice > 0 ? `$${avgPrice}/Hr` : 'Contact for pricing'}
                  certifications={instructor.certifications}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {instructors.map((instructor) => {
            const avgPrice = calculateAveragePrice(instructor.lesson_types);
            return (
              <div key={instructor.id} className="transition-all duration-200 hover:transform hover:scale-[1.01]">
                <InstructorListItem
                  id={instructor.id}
                  name={instructor.name}
                  location={instructor.location}
                  imageUrl={instructor.imageUrl || instructor.image || ''}
                  experience={instructor.experience}
                  specialization={instructor.specialization}
                  specialty={instructor.specialty}
                  specialties={instructor.specialties}
                  lesson_types={instructor.lesson_types || []}
                  priceRange={avgPrice > 0 ? `$${avgPrice}/Hr` : 'Contact for pricing'}
                  certifications={instructor.certifications}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InstructorsList;
