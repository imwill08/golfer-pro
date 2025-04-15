import { Json } from '@/integrations/supabase/types';
import { Instructor } from '@/types/instructor';

// Helper type to make our code more readable when working with service objects
export interface ServiceObject {
  title?: string;
  price?: string | number;
  duration?: string;
  description?: string;
}

// Helper type for raw instructor data from Supabase
export interface RawInstructor {
  id: string;
  first_name: string;
  last_name: string;
  location: string;
  profile_photo: string;
  years_experience: number;
  specialization: string;
  lesson_types: string[];
  hourly_rate: number;
}

// Processed instructor data ready for display
export type ProcessedInstructor = Instructor;

export const transformInstructors = (rawInstructors: RawInstructor[] | null): ProcessedInstructor[] => {
  if (!rawInstructors) return [];
  
  return rawInstructors.map(instructor => ({
    id: instructor.id,
    name: `${instructor.first_name} ${instructor.last_name}`,
    location: instructor.location,
    image: instructor.profile_photo,
    experience: instructor.years_experience,
    specialty: instructor.specialization,
    lessonType: instructor.lesson_types.join(' / '),
    rate: `${instructor.hourly_rate}$`,
  }));
};
