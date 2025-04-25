import { InstructorDTO, InstructorFormValues } from '@/types/instructor';
import { processLessonTypesData, processFAQs } from './instructorFormProcessor';

/**
 * Map for specialty display names to internal keys
 */
const SPECIALTY_MAP = {
  'Short Game': 'shortGame',
  'Putting': 'putting',
  'Driving': 'driving',
  'Course Strategy': 'courseStrategy',
  'Mental Approach': 'mentalApproach',
  'Beginner Lessons': 'beginnerLessons',
  'Advanced Training': 'advancedTraining',
  'Junior Coaching': 'juniorCoaching'
} as const;

/**
 * Map for internal keys to display names
 */
const SPECIALTY_DISPLAY_MAP = Object.fromEntries(
  Object.entries(SPECIALTY_MAP).map(([display, key]) => [key, display])
);

/**
 * Extended InstructorDTO type to include lesson_types
 */
interface ExtendedInstructorDTO extends InstructorDTO {
  lesson_types: Array<{
    title: string;
    description: string;
    duration: string;
    price: number;
  }>;
}

/**
 * Transforms raw instructor data from database to form values structure
 */
export const transformToFormValues = (instructorData: any): InstructorFormValues => {
  if (!instructorData) {
    throw new Error('Instructor data is required');
  }

  // Handle lesson types data - now directly map to array structure
  const lesson_types = Array.isArray(instructorData.lesson_types) 
    ? instructorData.lesson_types.map((lessonType: any) => ({
        title: lessonType.title || '',
        description: lessonType.description || '',
        duration: lessonType.duration || '',
        price: typeof lessonType.price === 'number' 
          ? lessonType.price 
          : Number((lessonType.price as string || '0').replace(/[^0-9.]/g, '')) || 0
      }))
    : [];

  // Handle certifications
  const certifications = Array.isArray(instructorData.certifications) ? instructorData.certifications : [];
  const transformedCertifications = {
    pga: certifications.some(cert => cert === 'PGA Certified' || cert === 'PGA'),
    lpga: certifications.some(cert => cert === 'LPGA Certified' || cert === 'LPGA'),
    tpi: certifications.some(cert => cert === 'TPI Certified' || cert === 'TPI'),
    other: certifications.some(cert => !['PGA Certified', 'LPGA Certified', 'TPI Certified', 'PGA', 'LPGA', 'TPI'].includes(cert)),
    otherText: certifications.find(cert => !['PGA Certified', 'LPGA Certified', 'TPI Certified', 'PGA', 'LPGA', 'TPI'].includes(cert)) || ''
  };

  // Handle specialties - convert from display names to internal keys
  const specialties = Array.isArray(instructorData.specialties) ? instructorData.specialties : [];
  const transformedSpecialties = {
    shortGame: false,
    putting: false,
    driving: false,
    courseStrategy: false,
    mentalApproach: false,
    beginnerLessons: false,
    advancedTraining: false,
    juniorCoaching: false
  };

  // Map display names to internal keys
  specialties.forEach(specialty => {
    const internalKey = SPECIALTY_MAP[specialty as keyof typeof SPECIALTY_MAP];
    if (internalKey) {
      transformedSpecialties[internalKey as keyof typeof transformedSpecialties] = true;
    }
  });

  // Handle FAQs with proper validation
  let transformedFaqs = [];
  if (Array.isArray(instructorData.faqs)) {
    transformedFaqs = instructorData.faqs
      .filter(faq => 
        faq && 
        typeof faq.question === 'string' && 
        typeof faq.answer === 'string' && 
        faq.question.trim() && 
        faq.answer.trim()
      )
      .map(faq => ({
        question: faq.question.trim(),
        answer: faq.answer.trim()
      }));
  }

  // Handle photos
  const photos = Array.isArray(instructorData.photos) ? instructorData.photos : [];
  const galleryPhotos = Array.isArray(instructorData.gallery_photos) ? instructorData.gallery_photos : [];
  
  return {
    firstName: instructorData.first_name || '',
    lastName: instructorData.last_name || '',
    email: instructorData.email || '',
    phone: instructorData.phone || '',
    website: instructorData.website || '',
    experience: instructorData.experience || 0,
    postalCode: instructorData.postal_code || '',
    country: instructorData.country || '',
    state: instructorData.state || '',
    city: instructorData.city || '',
    location: instructorData.location || '',
    latitude: instructorData.latitude,
    longitude: instructorData.longitude,
    tagline: instructorData.tagline || '',
    specialization: instructorData.specialization || '',
    bio: instructorData.bio || '',
    additionalBio: instructorData.additional_bio || '',
    certifications: transformedCertifications,
    lesson_types,
    specialties: transformedSpecialties,
    faqs: transformedFaqs,
    photos,
    gallery_photos: galleryPhotos,
    profilePhoto: photos[0] || null,
    additionalPhotos: null // This will be populated by the form component when new photos are selected
  };
};

/**
 * Transform specialties from form values to database format
 */
const transformSpecialties = (data: InstructorFormValues): string[] => {
  return Object.entries(data.specialties)
    .filter(([_, isSelected]) => isSelected)
    .map(([key]) => SPECIALTY_DISPLAY_MAP[key as keyof typeof SPECIALTY_DISPLAY_MAP])
    .filter(Boolean);
};

/**
 * Transform certifications from form values to database format
 */
const transformCertifications = (data: InstructorFormValues): string[] => {
  const certifications: string[] = [];
  
  if (data.certifications.pga) certifications.push('PGA');
  if (data.certifications.lpga) certifications.push('LPGA');
  if (data.certifications.tpi) certifications.push('TPI');
  if (data.certifications.other && data.certifications.otherText?.trim()) {
    certifications.push(data.certifications.otherText.trim());
  }
  
  return certifications;
};

/**
 * Transform lesson types from form values to database format
 */
const transformLessonTypes = (data: InstructorFormValues): Array<{
  title: string;
  description: string;
  duration: string;
  price: number;
}> => {
  // Since lesson_types is now an array of objects in the form values,
  // we can return it directly after ensuring the price is a number
  return (data.lesson_types || []).map(lessonType => ({
    title: lessonType.title,
    description: lessonType.description,
    duration: lessonType.duration,
    price: typeof lessonType.price === 'number'
      ? lessonType.price
      : Number((lessonType.price as string || '0').replace(/[^0-9.]/g, '')) || 0
  }));
};

/**
 * Transform FAQs from form values to database format
 */
const transformFAQs = (data: InstructorFormValues): Array<{
  question: string;
  answer: string;
}> => {
  const faqs: Array<{ question: string; answer: string }> = [];

  // Add custom FAQs from the form
  if (Array.isArray(data.faqs)) {
    data.faqs.forEach(faq => {
      if (faq && typeof faq === 'object' && 'question' in faq && 'answer' in faq) {
        faqs.push({
          question: faq.question.trim(),
          answer: faq.answer.trim()
        });
      }
    });
  }

  return faqs;
};

export const transformInstructorFormData = async (
  formData: InstructorFormValues, 
  { photos = [], gallery_photos = [] }: { photos?: string[], gallery_photos?: string[] } = {}
): Promise<Partial<ExtendedInstructorDTO>> => {
  try {
    // Transform certifications with consistent format
    const certifications = transformCertifications(formData).map(cert => 
      cert.endsWith('Certified') ? cert : `${cert} Certified`
    );

    return {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      website: formData.website?.trim(),
      country: formData.country.trim(),
      state: formData.state.trim(),
      city: formData.city.trim(),
      postal_code: formData.postalCode.trim(),
      experience: formData.experience,
      tagline: formData.tagline?.trim() || '',
      specialization: formData.specialization.trim(),
      bio: formData.bio.trim(),
      additional_bio: formData.additionalBio?.trim(),
      
      // Arrays with proper transformation
      specialties: transformSpecialties(formData),
      certifications,
      lesson_types: transformLessonTypes(formData),
      faqs: transformFAQs(formData),
      
      // Photos
      photos,
      gallery_photos,
      
      // System fields
      is_approved: false,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error transforming form data:', error);
    throw error;
  }
};
