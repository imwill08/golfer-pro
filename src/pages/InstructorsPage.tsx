import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useInstructors } from '@/hooks/useInstructors';
import InstructorsDisplay from '@/components/instructors/InstructorsDisplay';
import InstructorFilters from '@/components/instructors/InstructorFilters';
import InstructorSearchBar from '@/components/instructors/InstructorSearchBar';
import type { FilterOptions } from '@/components/instructors/InstructorFilters';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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

  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState<FilterOptions>({
    experienceRange: [0, 30],
    priceRange: [0, 1000],
    lessonTypes: [],
    specializations: [],
    certificates: []
  });

  // Handle URL query parameters
  useEffect(() => {
    const specialties = searchParams.get('specialties');
    if (specialties) {
      // Decode the URL-encoded specialty name
      const decodedSpecialty = decodeURIComponent(specialties);
      console.log('Setting specialty filter:', decodedSpecialty);
      
      setFilters(prev => ({
        ...prev,
        specializations: [decodedSpecialty]
      }));
    } else {
      // Reset specializations if no specialty in URL
      setFilters(prev => ({
        ...prev,
        specializations: []
      }));
    }
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (filters.specializations.length > 0) {
      newSearchParams.set('specialties', filters.specializations[0]);
    } else {
      newSearchParams.delete('specialties');
    }
    
    // Only update if the params have actually changed
    if (newSearchParams.toString() !== searchParams.toString()) {
      window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
    }
  }, [filters.specializations]);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setUiState(prev => ({ ...prev, viewMode: mode }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
    filters,
    searchTerm
  });

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      experienceRange: [0, 30],
      priceRange: [0, 1000],
      lessonTypes: [],
      specializations: [],
      certificates: []
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.experienceRange[0] > 0 || filters.experienceRange[1] < 30) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.specializations.length > 0) count += filters.specializations.length;
    if (filters.certificates.length > 0) count += filters.certificates.length;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Find Your Perfect 
              <span className="hidden md:inline"> Golf Instructor</span>
              <span className="inline md:hidden"> Golf Pro</span>
            </h1>
            <InstructorSearchBar 
              onSearch={handleSearch}
              className="mb-6"
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[300px] sm:w-[400px] p-0 overflow-y-auto max-h-screen"
              >
                <SheetTitle className="sr-only">Filter Options</SheetTitle>
                <SheetDescription className="sr-only">
                  Adjust your search filters to find the perfect golf instructor
                </SheetDescription>
                <div className="p-6 h-full overflow-y-auto pb-20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    {getActiveFilterCount() > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <InstructorFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Hidden on mobile, visible on desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
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
