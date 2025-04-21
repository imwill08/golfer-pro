import { useState, useEffect, useMemo } from 'react';
import { useFetchInstructors } from './useFetchInstructors';
import type { FilterOptions } from '@/components/instructors/InstructorFilters';

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

interface UseInstructorsReturn {
  instructors: ProcessedInstructor[];
  filteredCount: number;
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

interface UseInstructorsProps {
  itemsPerPage?: number;
  filters?: FilterOptions;
}

export const useInstructors = ({
  itemsPerPage = 6,
  filters
}: UseInstructorsProps = {}): UseInstructorsReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredInstructors, setFilteredInstructors] = useState<ProcessedInstructor[]>([]);
  const [paginatedInstructors, setPaginatedInstructors] = useState<ProcessedInstructor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Use the fetch hook to get all instructors data
  const { instructors: allInstructors, isLoading, error } = useFetchInstructors();

  // Memoize the filtered instructors to prevent unnecessary recalculations
  const filteredResults = useMemo(() => {
    if (!allInstructors || !filters) {
      return allInstructors ? [...allInstructors] : [];
    }

    return allInstructors.filter(instructor => {
      // Filter by experience range
      const experience = typeof instructor.experience === 'number' ? instructor.experience : 0;
      if (experience < filters.experienceRange[0] || experience > filters.experienceRange[1]) {
        return false;
      }

      // Filter by price range
      const price = parseInt(instructor.rate.replace(/[^0-9]/g, ''), 10);
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Filter by lesson types
      if (filters.lessonTypes.length > 0) {
        const instructorLessonTypes = typeof instructor.lessonType === 'string' 
          ? instructor.lessonType.toLowerCase().split(' / ')
          : [];
        
        const hasMatchingLessonType = filters.lessonTypes.some(type =>
          instructorLessonTypes.includes(type.toLowerCase())
        );
        if (!hasMatchingLessonType) {
          return false;
        }
      }

      // Filter by specializations
      if (filters.specializations.length > 0) {
        const instructorSpecializations = [
          instructor.specialization?.toLowerCase(),
          instructor.specialty?.toLowerCase()
        ].filter(Boolean);

        const hasMatchingSpecialization = filters.specializations.some(spec =>
          instructorSpecializations.some(instructorSpec =>
            instructorSpec?.includes(spec.toLowerCase())
          )
        );
        if (!hasMatchingSpecialization) {
          return false;
        }
      }

      // Filter by certificates
      if (filters.certificates.length > 0) {
        const instructorCertifications = instructor.certifications?.map(cert => 
          cert.toLowerCase()
        ) || [];

        const hasMatchingCertificate = filters.certificates.some(cert =>
          instructorCertifications.some(instructorCert =>
            instructorCert.includes(cert.toLowerCase())
          )
        );
        if (!hasMatchingCertificate) {
          return false;
        }
      }

      return true;
    });
  }, [allInstructors, filters]);

  // Update filtered instructors when filters change
  useEffect(() => {
    setFilteredInstructors(filteredResults);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredResults]);

  // Handle pagination
  useEffect(() => {
    if (!filteredInstructors.length) {
      setPaginatedInstructors([]);
      setTotalPages(1);
      return;
    }

    const totalPagesCount = Math.max(Math.ceil(filteredInstructors.length / itemsPerPage), 1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredInstructors.slice(startIndex, startIndex + itemsPerPage);

    setPaginatedInstructors([...paginatedItems]);
    setTotalPages(totalPagesCount);
  }, [filteredInstructors, currentPage, itemsPerPage]);

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
    goToPage
  };
};
