import React from 'react';
import InstructorsList from '@/components/instructors/InstructorsList';
import InstructorPagination from '@/components/instructors/InstructorPagination';
import ViewModeToggle from '@/components/instructors/ViewModeToggle';

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

interface InstructorsDisplayProps {
  instructors: ProcessedInstructor[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isLoading: boolean;
  error: Error | null;
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

const InstructorsDisplay: React.FC<InstructorsDisplayProps> = ({
  instructors,
  viewMode,
  setViewMode,
  isLoading,
  error,
  filteredCount,
  currentPage,
  totalPages,
  goToPage
}) => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredCount} {filteredCount === 1 ? 'instructor' : 'instructors'} found
        </div>
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      <InstructorsList 
        instructors={instructors}
        viewMode={viewMode}
        isLoading={isLoading}
        error={error}
      />
      
      {filteredCount > 0 && (
        <div className="mt-8">
          <InstructorPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default InstructorsDisplay;
