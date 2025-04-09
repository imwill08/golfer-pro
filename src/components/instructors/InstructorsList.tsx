
import React from 'react';
import { ProcessedInstructor } from '@/utils/instructorTransformations';
import InstructorCard from '@/components/instructors/InstructorCard';
import InstructorListItem from '@/components/instructors/InstructorListItem';

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
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-golf-blue border-r-transparent"></div>
        <p className="mt-4">Loading instructors...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading instructors. Please try again.</p>
      </div>
    );
  }
  
  if (instructors.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No instructors found. Check back soon or adjust your filters.</p>
      </div>
    );
  }
  
  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <InstructorCard
              key={instructor.id}
              {...instructor}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {instructors.map((instructor) => (
            <InstructorListItem
              key={instructor.id}
              {...instructor}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default InstructorsList;
