import { InstructorFormValues, InstructorFAQs } from '@/types/instructor';
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if an email already exists in the instructors table
 * @param email The email to check
 * @param currentInstructorId Optional ID of the current instructor (for updates)
 * @returns true if email exists, false otherwise
 */
const checkEmailExists = async (email: string, currentInstructorId?: string): Promise<boolean> => {
  try {
    const query = supabase
      .from('instructors')
      .select('id')
      .eq('email', email);
    
    // If updating an existing instructor, exclude their own email from the check
    if (currentInstructorId) {
      query.neq('id', currentInstructorId);
    }

    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.error('Error checking email existence:', error);
      throw new Error('Failed to check email existence');
    }

    return !!data;
  } catch (err) {
    console.error('Error in checkEmailExists:', err);
    throw err;
  }
};

/**
 * Uploads a single file to Supabase storage
 */
export const uploadSingleFile = async (file: File, folderName = 'instructor_photos'): Promise<string> => {
  try {
    // Validate file has required properties
    if (!file.name || !file.type || !file.type.startsWith('image/')) {
      console.error('Invalid file object: must be an image file with a valid name');
      throw new Error('Invalid file: please provide a valid image file');
    }

    const nameParts = file.name.split('.');
    const fileExt = nameParts.length > 1 ? nameParts.pop() : 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folderName}/${fileName}`;

    const { error } = await supabase.storage
      .from('instructorsimages')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('instructorsimages')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};

/**
 * Uploads multiple files to Supabase storage
 */
export const uploadMultipleFiles = async (
  files: File[], 
  folderName = 'instructor_gallery'
): Promise<string[]> => {
  if (!files || files.length === 0) return [];
  
  try {
    const uploadPromises = files.map(file => uploadSingleFile(file, folderName));
    return await Promise.all(uploadPromises);
  } catch (err) {
    console.error('Error uploading files:', err);
    throw err;
  }
};

/**
 * Process instructor photos and return URLs
 */
export const processInstructorPhotos = async (
  formData: InstructorFormValues,
  currentInstructorId?: string
): Promise<{ profilePhotos: string[]; galleryPhotos: string[] }> => {
  try {
    // Check if email already exists (excluding current instructor if updating)
    const emailExists = await checkEmailExists(formData.email, currentInstructorId);
    if (emailExists) {
      throw new Error('An instructor with this email already exists');
    }

    // Handle profile photo
    let profilePhotos: string[] = [];
    
    // If it's a string, it's an existing photo URL
    if (typeof formData.profilePhoto === 'string') {
      profilePhotos = [formData.profilePhoto];
    } 
    // If it's a File object, it's a new photo to upload
    else if (formData.profilePhoto instanceof File) {
      try {
        const profileUrl = await uploadSingleFile(formData.profilePhoto, 'profile_photos');
        if (profileUrl) {
          profilePhotos = [profileUrl];
        }
      } catch (err) {
        console.error('Error uploading profile photo:', err);
        throw new Error('Failed to upload profile photo. Please try again.');
      }
    }
    // If no photo provided and it's a new instructor
    else if (!currentInstructorId) {
      throw new Error('Profile photo is required for new instructors');
    }

    // Handle gallery photos (optional)
    let galleryPhotos: string[] = [];
    
    // Handle existing and new gallery photos
    if (Array.isArray(formData.additionalPhotos)) {
      // Process each photo based on its type
      for (const photo of formData.additionalPhotos) {
        if (typeof photo === 'string') {
          // It's an existing photo URL
          galleryPhotos.push(photo);
        } else if (photo instanceof File) {
          try {
            // It's a new photo to upload
            const photoUrl = await uploadSingleFile(photo, 'gallery_photos');
            if (photoUrl) {
              galleryPhotos.push(photoUrl);
            }
          } catch (err) {
            console.error('Error uploading gallery photo:', err);
            // Continue since gallery photos are optional
          }
        }
      }
    }

    return {
      profilePhotos, // Will be stored in photos column
      galleryPhotos // Will be stored in gallery_photos column
    };
  } catch (err) {
    console.error('Error in processInstructorPhotos:', err);
    throw err;
  }
};

/**
 * Transforms lesson types data from form structure to database structure
 */
export const processLessonTypesData = (data: InstructorFormValues): Array<{
  title: string;
  description: string;
  duration: string;
  price: number;
}> => {
  // If lesson_types is already an array in the new format, process it directly
  if (Array.isArray(data.lesson_types)) {
    return data.lesson_types.map(lessonType => ({
      title: lessonType.title || '',
      description: lessonType.description || '',
      duration: lessonType.duration || '',
      price: typeof lessonType.price === 'number' 
        ? lessonType.price 
        : Number(String(lessonType.price || '0').replace(/[^0-9.]/g, '')) || 0
    }));
  }
  
  // Fallback for old format (if somehow still using it)
  const result: Array<{
    title: string;
    description: string;
    duration: string;
    price: number;
  }> = [];
  
  // Map of form keys to display titles (for backward compatibility)
  const lessonTypeMap = {
    privateLesson: 'Private Lesson',
    groupLessons: 'Group Lessons',
    onlineCoaching: 'Online Coaching',
    oncourseInstruction: 'On-Course Instruction',
    advancedTraining: 'Advanced Training',
    juniorCoaching: 'Junior Coaching'
  } as const;

  // Process only the enabled lesson types (old format)
  if (typeof data.lesson_types === 'object' && data.lesson_types !== null) {
    try {
      // Use type assertion to handle the old lesson_types structure
      const oldFormat = data.lesson_types as Record<string, {
        description?: string;
        duration?: string;
        price?: string | number;
      }>;
      
      Object.entries(oldFormat).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
          const displayTitle = key in lessonTypeMap 
            ? lessonTypeMap[key as keyof typeof lessonTypeMap] 
            : key;
            
          const description = typeof value.description === 'string' ? value.description.trim() : '';
          const duration = typeof value.duration === 'string' ? value.duration.trim() : '';
          let price = 0;
          
          if (typeof value.price === 'number') {
            price = value.price;
          } else if (typeof value.price === 'string') {
            price = Number(value.price.replace(/[^0-9.]/g, '')) || 0;
          }
          
          result.push({
            title: displayTitle,
            description,
            duration,
            price
          });
        }
      });
    } catch (error) {
      console.error('Error processing old lesson_types format:', error);
    }
  }

  return result;
};

/**
 * Process certifications data from form structure
 */
export const processCertifications = (data: InstructorFormValues): string[] => {
  const certifications: string[] = [];
  
  if (data.certifications?.pga) certifications.push('PGA');
  if (data.certifications?.lpga) certifications.push('LPGA');
  if (data.certifications?.tpi) certifications.push('TPI');
  if (data.certifications?.other && data.certifications?.otherText?.trim()) {
    certifications.push(data.certifications.otherText.trim());
  }
  
  return certifications.map(cert => cert.endsWith('Certified') ? cert : `${cert} Certified`);
};

/**
 * Process FAQ data from the form, ensuring it follows the correct format
 */
export const processFAQs = (data: InstructorFormValues): Array<{
  question: string;
  answer: string;
}> => {
  const faqs: Array<{ question: string; answer: string }> = [];

  // Process custom FAQs if they exist
  if (Array.isArray(data.faqs)) {
    data.faqs.forEach(faq => {
      if (faq.question && faq.answer) {
        faqs.push({
          question: faq.question,
          answer: faq.answer
        });
      }
    });
  }

  return faqs;
};

/**
 * Process and transform instructor form data for submission
 */
export const transformInstructorFormData = async (formData: InstructorFormValues, currentInstructorId?: string) => {
  try {
    // Process photos
    const { profilePhotos, galleryPhotos } = await processInstructorPhotos(formData, currentInstructorId);
    
    // Format location string
    const location = `${formData.city}, ${formData.state}, ${formData.country}`;
    
    // Process lesson types, certifications, and FAQs
    const lesson_types = processLessonTypesData(formData); // Store directly in lesson_types
    const certifications = processCertifications(formData);
    const faqs = processFAQs(formData);
    
    // Format contact info
    const contactInfo = {
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      website: formData.website?.trim() || ''
    };

    // Return transformed data
    return {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      website: formData.website?.trim() || '',
      location,
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      postal_code: formData.postalCode.trim(),
      experience: formData.experience,
      tagline: formData.tagline?.trim() || '',
      specialization: formData.specialization.trim(),
      bio: formData.bio.trim(),
      additional_bio: formData.additionalBio?.trim() || '',
      specialties: formData.specialties,
      certifications,
      lesson_types, // Store lesson types directly in this column
      faqs,
      photos: profilePhotos,
      gallery_photos: galleryPhotos,
      is_approved: false,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error transforming instructor form data:', error);
    throw error;
  }
}; 