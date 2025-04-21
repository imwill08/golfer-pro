import { toast } from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';
import { InstructorFormValues } from '@/types/instructor';
import { v4 as uuidv4 } from 'uuid';
import { uploadPhoto, uploadPhotos } from './photoUpload';

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

const processServices = (servicesObj: Record<string, { price: string; duration: string; description: string; }>): any[] => {
  return Object.entries(servicesObj)
    .filter(([_, service]) => service && service.price && service.duration)
    .map(([name, service]) => ({
      title: name,
      price: `$${service.price}`,
      duration: `${service.duration} minutes`,
      description: service.description || ''
    }));
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

export const handleInstructorFormSubmit = async (formData: InstructorFormValues): Promise<void> => {
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

    // Check if email already exists
    const { data: existingInstructor, error: emailCheckError } = await supabase
      .from('instructors')
      .select('id')
      .eq('email', formData.email)
      .single();

    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
      throw emailCheckError;
    }

    if (existingInstructor) {
      throw new Error('An instructor with this email address already exists. Please use a different email address.');
    }

    // Validate lesson types
    const hasSelectedLessonType = Object.values(formData.lessonTypes).some(value => value);
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

    // Handle photo uploads first
    let photos: string[] = [];
    
    // Upload profile photo if provided
    if (formData.profilePhoto) {
      const profilePhotoUrl = await uploadPhoto(formData.profilePhoto, instructor_id);
      photos = [profilePhotoUrl]; // Add profile photo as first photo
    }
    
    // Upload additional photos if provided
    if (formData.additionalPhotos && formData.additionalPhotos.length > 0) {
      const additionalPhotoUrls = await uploadPhotos(formData.additionalPhotos, instructor_id);
      photos = [...photos, ...additionalPhotoUrls];
    }

    // Format location string
    const location = `${formData.city}, ${formData.state}, ${formData.country}`;

    // Transform form data with correct field names
    const transformedData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || '',
      country: formData.country,
      state: formData.state,
      city: formData.city,
      postal_code: formData.postalCode,
      location: location,
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
      experience: parseInt(formData.experience?.toString() || '0'),
      tagline: formData.tagline || `Professional Golf Instructor with ${formData.experience} years of experience`,
      specialization: formData.specialization,
      bio: formData.bio,
      additional_bio: formData.additionalBio || '',
      contact_info: JSON.stringify({
        email: formData.email,
        phone: formData.phone,
        website: formData.website || ''
      })
    };

    // Process the data
    const specialties = processSpecializations(formData.specialties || {});
    const services = processServices(formData.services || {});
    const faqs = processFAQs({ customFaqs: formData.faqs.customFaqs });

    // Prepare instructor data
    const instructorData = {
      id: instructor_id,
      ...transformedData,
      specialties,
      services,
      faqs,
      photos,
      status: 'pending',
      is_approved: false
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
