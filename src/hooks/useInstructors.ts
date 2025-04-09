
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProcessedInstructor, RawInstructor, transformInstructors } from '@/utils/instructorTransformations';

export const useInstructors = (itemsPerPage: number = 6) => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch instructors from Supabase
  const { data: instructors, isLoading, error } = useQuery({
    queryKey: ['public-instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RawInstructor[] || [];
    }
  });

  // Transform the raw data
  const transformedInstructors = transformInstructors(instructors);
  
  // Filter instructors based on search term and filters
  const filteredInstructors = transformedInstructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil((filteredInstructors?.length || 0) / itemsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // In a real application, we would apply these filters to the instructors
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    instructors: paginatedInstructors,
    filteredCount: filteredInstructors.length,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    handleFiltersChange,
    goToPage
  };
};
