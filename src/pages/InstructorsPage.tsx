
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSidebar from '@/components/instructors/FilterSidebar';
import ViewToggle from '@/components/instructors/ViewToggle';
import InstructorsList from '@/components/instructors/InstructorsList';
import InstructorPagination from '@/components/instructors/InstructorPagination';
import { useInstructors } from '@/hooks/useInstructors';

const InstructorsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 6;
  
  const {
    instructors,
    filteredCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    handleFiltersChange,
    goToPage
  } = useInstructors(itemsPerPage);

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Golf Instructors Available Here</h1>
            
            <ViewToggle 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <FilterSidebar onFiltersChange={handleFiltersChange} />
            </div>
            
            <div className="md:w-3/4">
              <InstructorsList 
                instructors={instructors}
                viewMode={viewMode}
                isLoading={isLoading}
                error={error}
              />
              
              {filteredCount > 0 && (
                <InstructorPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default InstructorsPage;
