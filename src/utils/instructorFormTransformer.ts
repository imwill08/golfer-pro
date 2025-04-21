import { InstructorFormValues } from '@/types/instructor';

/**
 * Transforms raw instructor data from database to form values structure
 */
export const transformToFormValues = (instructorData: any): InstructorFormValues => {
  if (!instructorData) {
    throw new Error('Instructor data is required');
  }

  // Handle name fields
  const firstName = instructorData.first_name || '';
  const lastName = instructorData.last_name || '';
  
  // Handle contact info
  const contactInfo = instructorData.contact_info || {};
  
  // Handle location fields
  const location = instructorData.location || '';
  let city = instructorData.city || '';
  let state = instructorData.state || '';
  let country = instructorData.country || '';
  let postalCode = instructorData.postal_code || '';
  
  // Try to parse location if individual fields are missing
  if (location && (!city || !state || !country)) {
    const parts = location.split(', ');
    if (parts.length >= 2) {
      city = city || parts[0];
      state = state || parts[1];
      if (parts[2]) {
        const countryPostal = parts[2].split(' - ');
        country = country || countryPostal[0];
        postalCode = postalCode || (countryPostal[1] || '');
      }
    }
  }
  
  // Handle services - parse JSON string if needed
  let parsedServices = [];
  try {
    parsedServices = typeof instructorData.services === 'string' 
      ? JSON.parse(instructorData.services) 
      : (Array.isArray(instructorData.services) ? instructorData.services : []);
  } catch (e) {
    console.error('Error parsing services:', e);
    parsedServices = [];
  }

  // Initialize transformed services with default structure
  const transformedServices: {
    [key: string]: {
      price: string;
      duration: string;
      description: string;
    };
  } = {
    privateLesson: {
      price: '',
      duration: '',
      description: ''
    },
    groupLessons: {
      price: '',
      duration: '',
      description: ''
    },
    onlineCoaching: {
      price: '',
      duration: '',
      description: ''
    },
    oncourseInstruction: {
      price: '',
      duration: '',
      description: ''
    }
  };

  // Service title mappings for the 4 main service types
  const serviceTypeMap: { [key: string]: string } = {
    'private': 'privateLesson',
    'private lesson': 'privateLesson',
    'mental game': 'privateLesson',
    'one-on-one': 'privateLesson',
    '1-on-1': 'privateLesson',
    'individual': 'privateLesson',
    
    'group': 'groupLessons',
    'group lesson': 'groupLessons',
    'group clinic': 'groupLessons',
    'group class': 'groupLessons',
    
    'online': 'onlineCoaching',
    'virtual': 'onlineCoaching',
    'remote': 'onlineCoaching',
    'video': 'onlineCoaching',
    
    'on-course': 'oncourseInstruction',
    'course strategy': 'oncourseInstruction',
    'on course': 'oncourseInstruction',
    'playing lesson': 'oncourseInstruction'
  };

  // Transform services into required format
  parsedServices.forEach((service: any) => {
    if (service && service.title) {
      const titleLower = service.title.toLowerCase();
      let serviceType = null;
      
      // Find matching service type
      for (const [key, value] of Object.entries(serviceTypeMap)) {
        if (titleLower.includes(key)) {
          serviceType = value;
          break;
        }
      }

      if (serviceType) {
        // Clean up price and duration
        const price = service.price?.toString()
          .replace('$', '')
          .replace(' per person', '')
          .replace(' per week', '')
          .trim() || '';
          
        const duration = service.duration?.toString()
          .replace(/hour[s]?|minute[s]?|per week/gi, '')
          .trim() || '';

        transformedServices[serviceType] = {
          price,
          duration,
          description: service.description || ''
        };
      }
    }
  });

  // Handle lesson types from both lesson_types array and services
  const lessonTypesFromArray = new Set(instructorData.lesson_types || []);
  
  // Check which services have data
  const lessonTypesFromServices = new Set(
    Object.entries(transformedServices)
      .filter(([_, value]) => value.price || value.duration || value.description)
      .map(([key]) => key)
  );

  const lessonTypes = {
    privateLesson: lessonTypesFromArray.has('privateLesson') || lessonTypesFromServices.has('privateLesson'),
    groupLessons: lessonTypesFromArray.has('groupLessons') || lessonTypesFromServices.has('groupLessons'),
    onlineCoaching: lessonTypesFromArray.has('onlineCoaching') || lessonTypesFromServices.has('onlineCoaching'),
    oncourseInstruction: lessonTypesFromArray.has('oncourseInstruction') || lessonTypesFromServices.has('oncourseInstruction'),
    advancedTraining: false, // These are handled separately from the main service types
    juniorCoaching: false
  };
  
  // Handle certifications
  const certifications = Array.isArray(instructorData.certifications) ? instructorData.certifications : [];
  const transformedCertifications = {
    pga: certifications.some(cert => cert.includes('PGA')),
    lpga: certifications.some(cert => cert.includes('LPGA')),
    tpi: certifications.some(cert => cert.includes('TPI')),
    other: certifications.some(cert => !['PGA', 'LPGA', 'TPI'].some(c => cert.includes(c))),
    otherText: certifications.find(cert => !['PGA', 'LPGA', 'TPI'].some(c => cert.includes(c))) || ''
  };
  
  // Handle specialties
  const specialties = Array.isArray(instructorData.specialties) ? instructorData.specialties : [];
  const transformedSpecialties = {
    shortGame: specialties.some(s => s.includes('Short Game') || s === 'shortGame'),
    putting: specialties.some(s => s.includes('Putting') || s === 'putting'),
    driving: specialties.some(s => s.includes('Driving') || s === 'driving'),
    courseStrategy: specialties.some(s => s.includes('Course Strategy') || s === 'courseStrategy'),
    mentalApproach: specialties.some(s => s.includes('Mental') || s === 'Mental Game'),
    beginnerLessons: specialties.some(s => s.includes('Beginner') || s === 'Beginner Lessons'),
    advancedTraining: specialties.some(s => s.includes('Advanced') || s === 'Elite Training'),
    juniorCoaching: specialties.some(s => s.includes('Junior') || s === 'Junior Golf')
  };
  
  // Handle photos
  const photos = Array.isArray(instructorData.photos) ? instructorData.photos : [];
  const profilePhoto = photos[0] || null;
  const additionalPhotos = photos.slice(1);
  
  // Handle FAQs - parse JSON string if needed
  let parsedFaqs = [];
  try {
    parsedFaqs = typeof instructorData.faqs === 'string' 
      ? JSON.parse(instructorData.faqs) 
      : (Array.isArray(instructorData.faqs) ? instructorData.faqs : []);
  } catch (e) {
    console.error('Error parsing FAQs:', e);
    parsedFaqs = [];
  }

  // Initialize FAQ structure
  const transformedFaqs = {
    equipment: '',
    numberOfLessons: '',
    packages: '',
    customFaqs: []
  };

  // Transform FAQs into required format
  parsedFaqs.forEach((faq: any) => {
    if (!faq?.question || !faq?.answer) return;

    const questionLower = faq.question.toLowerCase();

    // Match exact questions for the standard FAQs
    if (questionLower === 'do students need to bring their own equipment?' || 
        questionLower.includes('bring their own equipment')) {
      transformedFaqs.equipment = faq.answer;
    }
    else if (questionLower === 'how many lessons will students typically need?' || 
             questionLower.includes('how many lessons')) {
      transformedFaqs.numberOfLessons = faq.answer;
    }
    else if (questionLower === 'do you offer lesson packages or discounts?' || 
             questionLower.includes('offer lesson packages')) {
      transformedFaqs.packages = faq.answer;
    }
    else {
      // Add to custom FAQs if it doesn't match any standard questions
      transformedFaqs.customFaqs.push({
        question: faq.question,
        answer: faq.answer
      });
    }
  });

  return {
    firstName,
    lastName,
    email: contactInfo.email || instructorData.email || '',
    phone: contactInfo.phone || instructorData.phone || '',
    website: contactInfo.website || instructorData.website || '',
    experience: instructorData.experience || 0,
    postalCode,
    country,
    state,
    city,
    location,
    latitude: instructorData.latitude || undefined,
    longitude: instructorData.longitude || undefined,
    tagline: instructorData.tagline || '',
    specialization: instructorData.specialization || '',
    bio: instructorData.bio || '',
    additionalBio: instructorData.additional_bio || '',
    certifications: transformedCertifications,
    lessonTypes,
    services: transformedServices,
    specialties: transformedSpecialties,
    photos,
    profilePhoto,
    additionalPhotos,
    faqs: transformedFaqs
  };
};
