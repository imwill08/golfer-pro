import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useInstructors } from '@/hooks/useInstructors';
import InstructorsDisplay from '@/components/instructors/InstructorsDisplay';
import InstructorFilters from '@/components/instructors/InstructorFilters';
import type { FilterOptions } from '@/components/instructors/InstructorFilters';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface UIState {
  viewMode: 'grid' | 'list';
}

const InstructorsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [uiState, setUiState] = useState<UIState>({
    viewMode: window.innerWidth < 768 ? 'grid' : 'grid'
  });

  // Initialize filters with URL parameters
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const lessonType = searchParams.get('lessonType');
    return {
      experienceRange: [0, 30],
      priceRange: [0, 200],
      lessonTypes: lessonType ? [lessonType] : [],
      specializations: [],
      certificates: []
    };
  });

  // Update filters when URL parameters change
  useEffect(() => {
    const lessonType = searchParams.get('lessonType');
    if (lessonType) {
      setFilters(prev => ({
        ...prev,
        lessonTypes: [lessonType]
      }));
    }
  }, [searchParams]);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setUiState(prev => ({ ...prev, viewMode: mode }));
  };

  // Force grid view on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && uiState.viewMode === 'list') {
        setUiState(prev => ({ ...prev, viewMode: 'grid' }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [uiState.viewMode]);

  const {
    instructors,
    filteredCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    goToPage,
  } = useInstructors({
    itemsPerPage: 12,
    filters
  });

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.experienceRange[0] > 0 || filters.experienceRange[1] < 30) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) count++;
    if (filters.lessonTypes.length > 0) count += filters.lessonTypes.length;
    if (filters.specializations.length > 0) count += filters.specializations.length;
    if (filters.certificates.length > 0) count += filters.certificates.length;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar /> 
      
      <main className="pt-20 pb-12 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Golf Instructors Available Here
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find the perfect instructor for your golf journey
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <div className="flex items-center">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </div>
                  {getActiveFilterCount() > 0 && (
                    <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[340px] p-0">
                <InstructorFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Hidden on mobile, visible on desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky lg:top-24">
                <InstructorFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <InstructorsDisplay 
                instructors={instructors}
                viewMode={uiState.viewMode}
                setViewMode={handleViewModeChange}
                isLoading={isLoading}
                error={error}
                filteredCount={filteredCount}
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorsPage;
