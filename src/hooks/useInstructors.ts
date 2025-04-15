import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProcessedInstructor, RawInstructor, transformInstructors } from '@/utils/instructorTransformations';
import { Json } from '@/integrations/supabase/types';

interface UseInstructorsReturn {
  instructors: ProcessedInstructor[];
  filteredCount: number;
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleFiltersChange: (filters: any) => void;
  goToPage: (page: number) => void;
}

export const useInstructors = (itemsPerPage: number = 6): UseInstructorsReturn => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState<ProcessedInstructor[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [paginationTotalPages, setPaginationTotalPages] = useState(1);
  
  // Fetch instructors from Supabase
  const { data: rawInstructors, isLoading: supabaseLoading, error: supabaseError } = useQuery({
    queryKey: ['public-instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the database response to match RawInstructor type
      return (data || []).map(item => ({
        id: item.id,
        first_name: item.name ? item.name.split(' ')[0] : '',
        last_name: item.name ? item.name.split(' ').slice(1).join(' ') : '',
        location: item.location || '',
        profile_photo: item.photos?.[0] || '',
        years_experience: item.experience || 0,
        specialization: item.specialization || '',
        lesson_types: Array.isArray(item.services) 
          ? item.services.map((s: any) => s.title).filter(Boolean)
          : [],
        hourly_rate: item.services?.[0]?.price || 0
      }));
    }
  });

  // Transform the raw data
  const transformedInstructors = transformInstructors(rawInstructors);
  
  // Filter instructors based on search term and filters
  const filteredInstructors = transformedInstructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const calculatedTotalPages = Math.ceil((filteredInstructors?.length || 0) / itemsPerPage);
  
  // Get paginated results
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!supabaseLoading && !supabaseError) {
      setInstructors(paginatedInstructors);
      setFilteredCount(filteredInstructors.length);
      setPaginationTotalPages(calculatedTotalPages);
      setIsLoading(false);
    }
  }, [paginatedInstructors, filteredInstructors, calculatedTotalPages, supabaseLoading, supabaseError]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // In a real application, we would apply these filters to the instructors
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    instructors,
    filteredCount,
    isLoading,
    error,
    currentPage,
    totalPages: paginationTotalPages,
    searchTerm,
    setSearchTerm,
    handleFiltersChange,
    goToPage
  };
};
