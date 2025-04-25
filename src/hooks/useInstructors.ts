import { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../integrations/supabase/client';
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
  specialties: string[];
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
  itemsPerPage: number;
  filters: FilterOptions;
  searchTerm?: string;
}

export const useInstructors = ({
  itemsPerPage,
  filters,
  searchTerm = ''
}: UseInstructorsProps): UseInstructorsReturn => {
  const [allInstructors, setAllInstructors] = useState<any[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<any[]>([]);
  const [paginatedInstructors, setPaginatedInstructors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setIsLoading(true);
        
        // Test connection first
        const connectionTest = await testSupabaseConnection();
        if (!connectionTest.success) {
          throw new Error(`Connection test failed: ${connectionTest.error}`);
        }

        console.log('Fetching instructors...');
        const { data, error } = await supabase
          .from('instructors')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        if (!data) {
          console.warn('No data returned from Supabase');
          setAllInstructors([]);
          return;
        }

        // Process the raw instructor data
        const processedData = data.map(instructor => ({
          id: instructor.id,
          name: `${instructor.first_name} ${instructor.last_name}`,
          location: instructor.location,
          image: instructor.photos?.[0] || '',
          imageUrl: instructor.photos?.[0] || '',
          experience: instructor.experience || 0,
          specialty: instructor.specialization,
          specialties: instructor.specialties || [],
          lessonType: instructor.lesson_types?.map((lt: any) => lt.title).join(' / ') || 'In-Person / Online',
          rate: typeof instructor.services?.[0]?.price === 'string'
            ? parseFloat(instructor.services[0].price.replace(/[^0-9.]/g, '') || '0')
            : typeof instructor.services?.[0]?.price === 'number'
              ? instructor.services[0].price
              : 0,
          specialization: instructor.specialization,
          priceRange: instructor.services?.[0]?.price 
            ? `$${typeof instructor.services[0].price === 'string' 
                ? instructor.services[0].price 
                : `${instructor.services[0].price}`}/Hr` 
            : 'Contact for pricing',
          certifications: instructor.certifications || [],
          services: instructor.services || [],
          lesson_types: Array.isArray(instructor.lesson_types) 
            ? instructor.lesson_types.map((lt: any) => ({
                title: lt.title || '',
                description: lt.description || '',
                duration: lt.duration || '',
                price: typeof lt.price === 'number' ? lt.price : Number(lt.price || 0)
              }))
            : [],
          latitude: instructor.latitude,
          longitude: instructor.longitude
        }));

        console.log('Processed instructors:', processedData.length);
        setAllInstructors(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch instructors'));
        setAllInstructors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // Apply filters and search
  useEffect(() => {
    if (!allInstructors || !filters) {
      setFilteredInstructors([]);
      return;
    }

    const filtered = allInstructors.filter(instructor => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          instructor.name?.toLowerCase().includes(searchLower) ||
          instructor.location?.toLowerCase().includes(searchLower) ||
          instructor.specialization?.toLowerCase().includes(searchLower) ||
          instructor.specialty?.toLowerCase().includes(searchLower) ||
          (instructor.certifications && instructor.certifications.some((s: string) => 
            s.toLowerCase().includes(searchLower)
          )) ||
          (instructor.lesson_types && Array.isArray(instructor.lesson_types) && instructor.lesson_types.some((type: { title: string; description?: string }) =>
            type.title?.toLowerCase().includes(searchLower) ||
            type.description?.toLowerCase().includes(searchLower)
          ));

        if (!matchesSearch) return false;
      }

      // Filter by experience range
      if (
        instructor.experience < filters.experienceRange[0] ||
        instructor.experience > filters.experienceRange[1]
      ) {
        return false;
      }

      // Filter by price range
      const calculateAveragePrice = (lesson_types: any[]) => {
        if (!lesson_types || !Array.isArray(lesson_types) || lesson_types.length === 0) return 0;
        const total = lesson_types.reduce((sum, lesson) => {
          const price = typeof lesson.price === 'number' ? lesson.price : parseInt(lesson.price as any);
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
        return Math.round(total / lesson_types.length);
      };

      const avgPrice = calculateAveragePrice(instructor.lesson_types);
      if (
        avgPrice < filters.priceRange[0] ||
        avgPrice > filters.priceRange[1]
      ) {
        return false;
      }

      // Filter by specializations
      if (filters.specializations.length > 0) {
        const hasMatchingSpecialty = filters.specializations.some(spec => {
          // Check if the instructor has this specialty
          return instructor.specialties?.some(
            instructorSpec => instructorSpec.toLowerCase() === spec.toLowerCase()
          );
        });
        
        if (!hasMatchingSpecialty) {
          return false;
        }
      }

      // Filter by certificates
      if (filters.certificates.length > 0) {
        const hasMatchingCertificate = filters.certificates.some(cert =>
          instructor.certifications?.some(
            (instructorCert: string) => instructorCert.toLowerCase().includes(cert.toLowerCase())
          )
        );
        if (!hasMatchingCertificate) {
          return false;
        }
      }

      // Filter by lesson types
      if (filters.lessonTypes.length > 0) {
        console.log('Filtering by lesson types:', filters.lessonTypes);
        console.log('Instructor lesson_types:', instructor.lesson_types);
        
        const lessonTypeMap: Record<string, string> = {
          'privateLesson': 'Private Lesson',
          'onlineCoaching': 'Online Coaching',
          'groupLessons': 'Group Lessons',
          'oncourseInstruction': 'On-Course Instruction'
        };
        
        const hasMatchingLessonType = filters.lessonTypes.some(lessonType => {
          const displayName = lessonTypeMap[lessonType];
          if (!displayName) {
            console.log('No display name found for:', lessonType);
            return false;
          }
          
          // Check if any of the instructor's lesson types match (ignoring duration and price info)
          const matches = instructor.lesson_types?.some(
            (instructorLessonType: { title: string }) => {
              // Extract just the lesson type name without duration and price
              const baseTitle = instructorLessonType.title.split('(')[0].trim();
              const matches = baseTitle.toLowerCase() === displayName.toLowerCase();
              console.log('Comparing:', {
                filterType: displayName.toLowerCase(),
                instructorType: baseTitle.toLowerCase(),
                fullTitle: instructorLessonType.title,
                matches
              });
              return matches;
            }
          );
          
          console.log('Has matching lesson type:', matches);
          return matches;
        });
        
        if (!hasMatchingLessonType) {
          return false;
        }
      }

      return true;
    });

    setFilteredInstructors([...filtered]);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allInstructors, filters, searchTerm]);

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
    instructors: paginatedInstructors as ProcessedInstructor[],
    filteredCount: filteredInstructors.length,
    isLoading,
    error,
    currentPage,
    totalPages,
    goToPage
  };
};
