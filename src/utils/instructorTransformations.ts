import { Json } from '@/integrations/supabase/types';
import { Instructor, Service } from '@/types/instructor';

// Helper type to make our code more readable when working with service objects
export interface ServiceObject {
  title: string;
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
  specialties?: string[];
  certifications?: string[];
  services?: ServiceObject[];
  photos?: string[]; // Add photos property to the interface
  latitude?: number;
  longitude?: number;
  bio?: string;
}

// Processed instructor data ready for display
export type ProcessedInstructor = Instructor;

// Add specialty mapping constant at the top
const SPECIALTY_MAPPING = {
  'Short Game': 'shortGame',
  'Putting': 'putting',
  'Driving & Distance': 'driving',
  'Course Strategy': 'courseStrategy',
  'Mental Game': 'mentalApproach',
  'Beginner Friendly': 'beginnerLessons',
  'Advanced Training': 'advancedTraining',
  'Junior Development': 'juniorCoaching'
};

const mapSpecialtyToId = (specialty: string): string => {
  // First try exact match
  const mapped = SPECIALTY_MAPPING[specialty];
  if (mapped) return mapped;
  
  // Then try partial matches
  const normalizedSpecialty = specialty.toLowerCase();
  if (normalizedSpecialty.includes('short game')) return 'shortGame';
  if (normalizedSpecialty.includes('putting')) return 'putting';
  if (normalizedSpecialty.includes('driving') || normalizedSpecialty.includes('distance')) return 'driving';
  if (normalizedSpecialty.includes('course') || normalizedSpecialty.includes('strategy')) return 'courseStrategy';
  if (normalizedSpecialty.includes('mental')) return 'mentalApproach';
  if (normalizedSpecialty.includes('beginner')) return 'beginnerLessons';
  if (normalizedSpecialty.includes('advanced')) return 'advancedTraining';
  if (normalizedSpecialty.includes('junior')) return 'juniorCoaching';
  
  return specialty; // fallback to original if no match
};

// Function to extract lesson types from various data formats
const extractLessonTypes = (instructor: RawInstructor): string => {
  // Check if lesson_types array exists and has items
  if (Array.isArray(instructor.lesson_types) && instructor.lesson_types.length > 0) {
    return instructor.lesson_types.join(' / ');
  }

  // Try to extract from services if available
  if (Array.isArray(instructor.services) && instructor.services.length > 0) {
    const serviceTypes = instructor.services.map(service => service.title).filter(Boolean);
    if (serviceTypes.length > 0) {
      return serviceTypes.join(' / ');
    }
  }

  // Default fallback
  return 'In-Person / Online';
};

// Function to get profile photo URL with fallback
const getProfilePhotoUrl = (instructor: RawInstructor): string => {
  // First check if profile_photo is a valid URL or path
  if (instructor.profile_photo && instructor.profile_photo.trim() !== '') {
    return instructor.profile_photo;
  }
  
  // Check if there's a photos array
  if (Array.isArray(instructor.photos) && instructor.photos.length > 0 && instructor.photos[0]) {
    return instructor.photos[0].toString();
  }
  
  // Fallback to a default image
  return 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';
};

// Function to convert raw service object to Service interface
const transformService = (serviceObj: ServiceObject): Service => {
  return {
    title: serviceObj.title || '',
    description: serviceObj.description || '',
    duration: serviceObj.duration || '',
    price: typeof serviceObj.price === 'number' 
      ? `$${serviceObj.price}` 
      : serviceObj.price?.toString() || ''
  };
};

export const transformInstructors = (rawInstructors: RawInstructor[] | null): ProcessedInstructor[] => {
  if (!rawInstructors) return [];
  
  return rawInstructors.map(instructor => {
    // Transform specialties to IDs
    const specialtyIds = instructor.specialties?.map(mapSpecialtyToId) || [];
    
    return {
      id: instructor.id,
      name: `${instructor.first_name} ${instructor.last_name}`,
      location: instructor.location,
      image: getProfilePhotoUrl(instructor),
      experience: instructor.years_experience,
      specialty: specialtyIds[0] || 'shortGame', // Default to shortGame if none specified
      specialties: specialtyIds, // Add the full array of specialty IDs
      lessonType: extractLessonTypes(instructor),
      rate: instructor.hourly_rate.toString(),
      specialization: instructor.specialization || 'Swing Analysis Specialist',
      priceRange: `$${instructor.hourly_rate}/Hr`,
      imageUrl: getProfilePhotoUrl(instructor),
      certifications: instructor.certifications || ['PGA Certified'],
      services: Array.isArray(instructor.services) 
        ? instructor.services.map(transformService) 
        : [],
      latitude: instructor.latitude,
      longitude: instructor.longitude,
      bio: instructor.bio || ''
    };
  });
};
