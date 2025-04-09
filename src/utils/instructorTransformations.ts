
import { Json } from '@/integrations/supabase/types';

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
  name: string;
  location: string;
  experience: number;
  specialization: string;
  services: Json;
  photos: Json;
  // Add other fields if needed
}

// Processed instructor data ready for display
export interface ProcessedInstructor {
  id: string;
  name: string;
  location: string;
  experience: number;
  specialization: string;
  lessonType: string[];
  priceRange: string;
  imageUrl: string;
}

export const transformInstructors = (instructors: RawInstructor[] | null): ProcessedInstructor[] => {
  if (!instructors) return [];
  
  return instructors.map(instructor => {
    // Extract lesson types from services
    const services = Array.isArray(instructor.services) ? instructor.services : [];
    const lessonTypes = services.map(service => {
      // Ensure service is an object
      if (typeof service === 'object' && service !== null) {
        // Cast to ServiceObject to help TypeScript understand the structure
        const serviceObj = service as ServiceObject;
        // Access title property safely with type checking
        return typeof serviceObj.title === 'string' ? serviceObj.title : '';
      }
      return '';
    }).filter(Boolean);
    
    // Find lowest and highest price for price range
    let minPrice = Infinity;
    let maxPrice = 0;
    
    if (Array.isArray(instructor.services)) {
      instructor.services.forEach(service => {
        if (typeof service === 'object' && service !== null) {
          // Cast to ServiceObject
          const serviceObj = service as ServiceObject;
          
          if ('price' in serviceObj) {
            // Safely parse the price with proper type checking
            const price = typeof serviceObj.price === 'string' ? 
              parseFloat(serviceObj.price) : 
              typeof serviceObj.price === 'number' ? 
                serviceObj.price : NaN;
            
            if (!isNaN(price)) {
              minPrice = Math.min(minPrice, price);
              maxPrice = Math.max(maxPrice, price);
            }
          }
        }
      });
    }
    
    // Format price range
    const priceRange = minPrice !== Infinity && maxPrice > 0
      ? `$${minPrice}-${maxPrice}`
      : 'Price varies';
    
    // Get first photo or use placeholder
    // Ensure imageUrl is always a string by using String() if necessary
    let imageUrl = '/placeholder.svg';
    if (Array.isArray(instructor.photos) && instructor.photos.length > 0) {
      const firstPhoto = instructor.photos[0];
      imageUrl = typeof firstPhoto === 'string' ? firstPhoto : String(firstPhoto);
    }
    
    return {
      id: instructor.id,
      name: instructor.name,
      location: instructor.location,
      experience: instructor.experience,
      specialization: instructor.specialization,
      lessonType: lessonTypes,
      priceRange: priceRange,
      imageUrl: imageUrl
    };
  });
};
