import { toast } from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';
import { InstructorFormValues } from '@/types/instructor';
import { v4 as uuidv4 } from 'uuid';
import { uploadPhoto, uploadPhotos } from './photoUpload';
import { processInstructorPhotos } from './instructorFormProcessor';
import { transformInstructorFormData } from './instructorFormTransformer';

// Track the last API request time
let lastRequestTime = 0;

// Helper function to enforce rate limiting
const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const minimumDelay = 1000; // 1 second in milliseconds

  if (timeSinceLastRequest < minimumDelay) {
    // Wait for the remaining time to complete 1 second
    const waitTime = minimumDelay - timeSinceLastRequest;
    console.log(`Rate limiting: Waiting ${waitTime}ms before next request`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

// Helper function to get coordinates from address
const getCoordinates = async (address: { city: string; state: string; country: string; postalCode: string }) => {
  try {
    // Format the address for the API
    const formattedAddress = `${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
    console.log('Getting coordinates for address:', formattedAddress);

    // Enforce rate limiting before making the request
    await enforceRateLimit();

    // Use OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formattedAddress)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'GolfProFinder/1.0' // Identify your application
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }

    const data = await response.json();
    
    if (data && data[0]) {
      console.log('Coordinates found:', { lat: data[0].lat, lon: data[0].lon });
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    
    console.log('No coordinates found for address');
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
};

// Helper functions to process instructor data
const processSpecializations = (specialtiesObj: Record<string, boolean>): string[] => {
  const specialtyMappings = {
    shortGame: 'Short Game',
    putting: 'Putting',
    driving: 'Driving',
    courseStrategy: 'Course Strategy',
    mentalApproach: 'Mental Game',
    beginnerLessons: 'Beginner Lessons',
    advancedTraining: 'Advanced Training',
    juniorCoaching: 'Junior Coaching'
  };

  return Object.entries(specialtiesObj)
    .filter(([_, isSelected]) => isSelected)
    .map(([key]) => specialtyMappings[key as keyof typeof specialtyMappings]);
};

const processLessonTypesData = (lessonTypes: any): any[] => {
  // If it's already an array in the new format, just ensure all properties are set correctly
  if (Array.isArray(lessonTypes)) {
    return lessonTypes.map(lt => ({
      title: lt.title || '',
      price: lt.price ? (lt.price.toString().startsWith('$') ? lt.price : `$${lt.price}`) : '$0',
      duration: lt.duration?.includes('minute') ? lt.duration : `${lt.duration || ''} minutes`,
      description: lt.description || ''
    }));
  }
  
  // Handle old object-based format
  if (typeof lessonTypes === 'object' && lessonTypes !== null) {
    return Object.entries(lessonTypes)
      .filter(([_, details]) => {
        if (!details || typeof details !== 'object') return false;
        const typedDetails = details as { price?: any; duration?: any };
        return typedDetails.price && typedDetails.duration;
      })
      .map(([name, details]) => {
        // Map the service name to a more readable title
        const titles: Record<string, string> = {
          privateLesson: 'Private Lesson',
          groupLessons: 'Group Lessons',
          onlineCoaching: 'Online Coaching',
          oncourseInstruction: 'On-Course Instruction',
          advancedTraining: 'Advanced Training',
          juniorCoaching: 'Junior Coaching'
        };
        
        const detailsObj = details as { 
          price: string | number; 
          duration: string; 
          description?: string; 
        };
        
        const priceStr = typeof detailsObj.price === 'number' 
          ? detailsObj.price.toString() 
          : detailsObj.price;
        
        return {
          title: titles[name as keyof typeof titles] || name,
          price: priceStr.startsWith('$') ? priceStr : `$${priceStr}`,
          duration: detailsObj.duration.includes('minute') ? detailsObj.duration : `${detailsObj.duration} minutes`,
          description: detailsObj.description || ''
        };
      });
  }
  
  // Return empty array if neither format matches
  return [];
};

const processFAQs = (faqData: { customFaqs?: { question: string; answer: string; }[] }): any[] => {
  if (!faqData.customFaqs || faqData.customFaqs.length === 0) {
    return [];
  }

  return faqData.customFaqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));
};

export const handleInstructorFormSubmit = async (formData: InstructorFormValues, isAdmin: boolean = false, existingInstructorId?: string): Promise<void> => {
  try {
    console.log('Validating form data:', formData);
    
    // More detailed validation
    const requiredFields = {
      'First Name': formData.firstName,
      'Last Name': formData.lastName,
      'Email': formData.email,
      'Phone': formData.phone,
      'Country': formData.country,
      'State': formData.state,
      'City': formData.city,
      'Postal Code': formData.postalCode,
      'Experience': formData.experience,
      'Specialization': formData.specialization,
      'Bio': formData.bio
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => {
        if (typeof value === 'number') {
          return value <= 0;
        }
        return !value || (typeof value === 'string' && value.trim() === '');
      })
      .map(([field]) => field);

    if (missingFields.length > 0) {
      throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
    }

    // Check if email already exists, but skip if admin is editing an existing instructor
    if (!isAdmin || !existingInstructorId) {
      const { data: existingInstructor, error: emailCheckError } = await supabase
        .from('instructors')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        throw emailCheckError;
      }

      if (existingInstructor) {
        throw new Error('An instructor with this email address already exists. Please use a different email address or contact support if you need to update your profile.');
      }
    } else {
      // For admin edits, only check for duplicate email if it's different from the current instructor
      const { data: existingInstructor, error: emailCheckError } = await supabase
        .from('instructors')
        .select('id')
        .eq('email', formData.email)
        .neq('id', existingInstructorId)
        .single();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        throw emailCheckError;
      }

      if (existingInstructor) {
        throw new Error('This email address is already associated with another instructor. Please use a different email address.');
      }
    }

    // Validate lesson types
    const hasSelectedLessonType = Array.isArray(formData.lesson_types) ? 
      formData.lesson_types.length > 0 : 
      Object.values(formData.lesson_types).some(value => value);

    if (!hasSelectedLessonType) {
      throw new Error('Please select at least one lesson type');
    }

    // Validate specialties
    const hasSelectedSpecialty = Object.values(formData.specialties).some(value => value);
    if (!hasSelectedSpecialty) {
      throw new Error('Please select at least one specialty');
    }

    // Get coordinates for the address
    const coordinates = await getCoordinates({
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode
    });

    // Generate a new UUID for the instructor
    const instructor_id = uuidv4();

    // Handle photo uploads using the new processor
    const { profilePhotos, galleryPhotos } = await processInstructorPhotos(formData);

    // Format location string
    const location = `${formData.city}, ${formData.state}, ${formData.country}`;

    // Transform form data with the new transformer
    const transformedData = await transformInstructorFormData(formData, {
      photos: profilePhotos,
      gallery_photos: galleryPhotos
    });

    // Add coordinates and other fields
    const instructorData = {
      id: instructor_id,
      ...transformedData,
      location: location,
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
      contact_info: JSON.stringify({
        email: formData.email,
        phone: formData.phone,
        website: formData.website || ''
      })
    };

    console.log('Instructor data to insert:', instructorData);

    // Insert instructor data
    const { data: insertedInstructor, error: instructorError } = await supabase
      .from('instructors')
      .insert(instructorData)
      .select()
      .single();

    if (instructorError) {
      console.error('Error inserting instructor:', instructorError);
      throw instructorError;
    }

    console.log('Inserted instructor:', insertedInstructor);

    // Create initial stats record
    const { error: statsError } = await supabase
      .from('instructor_stats')
      .insert({
        instructor_id: instructor_id,
        profile_views: 0,
        contact_clicks: 0
      });

    if (statsError) {
      console.error('Error creating stats record:', statsError);
      // Don't throw here as the main instructor record was created successfully
    }

    // Show success message
    toast.success(
      'Application submitted successfully! Our admin team will review your application within 1-2 business days, and you will receive an email notification once reviewed.',
      {
        duration: 6000
      }
    );

  } catch (error: any) {
    console.error('Error submitting instructor form:', {
      error,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
};
