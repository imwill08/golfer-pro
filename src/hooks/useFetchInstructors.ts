import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Instructor } from '@/lib/supabase-types';

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

interface UseFetchInstructorsReturn {
  instructors: ProcessedInstructor[];
  isLoading: boolean;
  error: Error | null;
}

export const useFetchInstructors = (): UseFetchInstructorsReturn => {
  const { data: rawInstructors, isLoading, error } = useQuery({
    queryKey: ['public-instructors'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('instructors')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log('Fetched instructors:', data?.length);
        return data as Instructor[];
      } catch (fetchError) {
        console.error('Error fetching instructors:', fetchError);
        throw fetchError;
      }
    }
  });

  const processedInstructors: ProcessedInstructor[] = (rawInstructors || []).map(instructor => {
    // Get the first photo or use default
    const primaryPhoto = instructor.photos?.[0] || 
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';

    // Get the first specialty or use specialization
    const primarySpecialty = instructor.specialties?.[0] || instructor.specialization;

    // Calculate price range based on experience
    const baseRate = 50; // Base rate of $50
    const experienceMultiplier = 1 + (instructor.experience / 10); // 10% increase per year of experience
    const hourlyRate = Math.round(baseRate * experienceMultiplier);
    
    return {
      id: instructor.id,
      name: instructor.name,
      location: instructor.location,
      image: primaryPhoto,
      experience: instructor.experience,
      specialty: primarySpecialty,
      lessonType: instructor.specialties?.join(' / ') || 'In-Person / Online',
      rate: `$${hourlyRate}`,
      specialization: instructor.specialization,
      priceRange: `$${hourlyRate}/Hr`,
      imageUrl: primaryPhoto,
      certifications: instructor.certifications || ['PGA Certified'],
      services: instructor.services || [],
      latitude: instructor.latitude,
      longitude: instructor.longitude
    };
  });
  
  return {
    instructors: processedInstructors,
    isLoading,
    error: error as Error | null,
  };
};
