import { InstructorFormValues } from '@/types/instructor';
import { getCoordinatesFromZip } from '@/utils/geoUtils';

export const transformInstructorFormData = async (data: InstructorFormValues, userId: string | null = null) => {
  // Get coordinates from postal code
  let latitude = null;
  let longitude = null;
  
  if (data.postalCode && data.country) {
    const coordinates = await getCoordinatesFromZip(data.postalCode, data.country, data.state, data.city);
    
    // If that fails, try with full address
    if (!coordinates && data.city && data.state) {
      const fullAddress = `${data.city}, ${data.state}, ${data.country}, ${data.postalCode}`;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
        );
        const result = await response.json();
        if (result && result[0]) {
          latitude = parseFloat(result[0].lat);
          longitude = parseFloat(result[0].lon);
        }
      } catch (error) {
        console.error('Error getting coordinates from address:', error);
      }
    } else if (coordinates) {
      latitude = coordinates.latitude;
      longitude = coordinates.longitude;
    }
  }

  // Format location string
  const location = `${data.city}, ${data.state}, ${data.country}`.trim();
  
  const now = new Date().toISOString();
  
  // Return flat structure matching database schema exactly
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    website: data.website || '',
    country: data.country,
    state: data.state,
    city: data.city,
    postal_code: data.postalCode,
    location: location,
    latitude: latitude,
    longitude: longitude,
    experience: parseInt(data.experience?.toString() || '0'),
    tagline: data.tagline || `Professional Golf Instructor with ${data.experience} years of experience`,
    specialization: data.specialization || '',
    bio: data.bio || '',
    additional_bio: data.additionalBio || '',
    contact_info: JSON.stringify({
      email: data.email,
      phone: data.phone,
      website: data.website || ''
    }),
    last_active: now,
    updated_at: now,
    rating: 0 // Keep rating as it's part of instructors table
  };
};
