import { InstructorFormValues } from '@/types/instructor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getCoordinatesFromZip } from '@/utils/geoUtils';
import { validateInstructorForm } from '@/utils/formValidationUtils';
import { uploadPhoto, uploadPhotos } from './photoUpload';

export const submitInstructorForm = async (
  data: InstructorFormValues,
  instructorId: string,
  onSuccess: () => void,
  instructorData?: any
) => {
  try {
    // First, handle photo uploads
    let photos: string[] = instructorData?.photos || [];
    
    // Upload profile photo if provided
    if (data.profilePhoto) {
      const profilePhotoUrl = await uploadPhoto(data.profilePhoto, instructorId);
      photos = [profilePhotoUrl, ...photos]; // Add profile photo as first photo
    }
    
    // Upload additional photos if provided
    if (data.additionalPhotos && data.additionalPhotos.length > 0) {
      const additionalPhotoUrls = await uploadPhotos(data.additionalPhotos, instructorId);
      photos = [...photos, ...additionalPhotoUrls];
    }
    
    // Format the full name
    const fullName = `${data.firstName} ${data.lastName}`;
    
    // Format the location string
    const formattedLocation = `${data.city}, ${data.state}, ${data.country}`;
    
    // Get coordinates if not already present
    let coordinates = null;
    if (!data.latitude || !data.longitude) {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(formattedLocation)}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
        );
        const result = await response.json();
        if (result.results && result.results[0]) {
          coordinates = {
            latitude: result.results[0].geometry.lat,
            longitude: result.results[0].geometry.lng
          };
        }
      } catch (err) {
        console.error('Error getting coordinates:', err);
      }
    }
    
    // Format contact info
    const contactInfo = {
      email: data.email,
      phone: data.phone,
      website: data.website || ''
    };
    
    // Process certifications
    const certifications: string[] = [];
    if (data.certifications.pga) certifications.push('PGA');
    if (data.certifications.lpga) certifications.push('LPGA');
    if (data.certifications.tpi) certifications.push('TPI');
    if (data.certifications.other && data.certifications.otherText) {
      certifications.push(data.certifications.otherText);
    }
    
    // Process specialties
    const specialties: string[] = [];
    if (data.specialties.shortGame) specialties.push('Short Game');
    if (data.specialties.putting) specialties.push('Putting');
    if (data.specialties.driving) specialties.push('Driving');
    if (data.specialties.courseStrategy) specialties.push('Course Strategy');
    if (data.specialties.mentalApproach) specialties.push('Mental Approach');
    if (data.specialties.beginnerLessons) specialties.push('Beginner Lessons');
    if (data.specialties.advancedTraining) specialties.push('Advanced Training');
    if (data.specialties.juniorCoaching) specialties.push('Junior Coaching');
    
    // Process services
    const services = {};
    if (data.lessonTypes.privateLesson && data.services.privateLesson) {
      services['privateLesson'] = data.services.privateLesson;
    }
    if (data.lessonTypes.groupLessons && data.services.groupLessons) {
      services['groupLessons'] = data.services.groupLessons;
    }
    if (data.lessonTypes.onlineCoaching && data.services.onlineCoaching) {
      services['onlineCoaching'] = data.services.onlineCoaching;
    }
    if (data.lessonTypes.oncourseInstruction && data.services.oncourseInstruction) {
      services['oncourseInstruction'] = data.services.oncourseInstruction;
    }
    if (data.lessonTypes.advancedTraining && data.services.advancedTraining) {
      services['advancedTraining'] = data.services.advancedTraining;
    }
    if (data.lessonTypes.juniorCoaching && data.services.juniorCoaching) {
      services['juniorCoaching'] = data.services.juniorCoaching;
    }
    
    // Process FAQs
    const processedFaqs = [];
    
    // Add standard FAQs if they have answers
    if (data.faqs.equipment) {
      processedFaqs.push({
        question: 'Do students need to bring their own equipment?',
        answer: data.faqs.equipment
      });
    }
    
    if (data.faqs.numberOfLessons) {
      processedFaqs.push({
        question: 'How many lessons will students typically need?',
        answer: data.faqs.numberOfLessons
      });
    }
    
    if (data.faqs.packages) {
      processedFaqs.push({
        question: 'Do you offer lesson packages or discounts?',
        answer: data.faqs.packages
      });
    }
    
    // Add any custom FAQs
    if (Array.isArray(data.faqs.customFaqs)) {
      processedFaqs.push(...data.faqs.customFaqs);
    }
    
    const updateData: any = {
      name: fullName,
      location: formattedLocation,
      tagline: data.tagline || '',
      experience: data.experience,
      specialization: data.specialization,
      certifications,
      bio: data.bio,
      additional_bio: data.additionalBio || '',
      specialties,
      services,
      faqs: processedFaqs,
      contact_info: contactInfo,
      photos,
      highlights: instructorData?.highlights || [],
    };
    
    // Add coordinates if found
    if (coordinates) {
      updateData.latitude = coordinates.latitude;
      updateData.longitude = coordinates.longitude;
    } else if (data.latitude && data.longitude) {
      // Use existing coordinates if available
      updateData.latitude = data.latitude;
      updateData.longitude = data.longitude;
    }
    
    const { error } = await supabase
      .from('instructors')
      .update(updateData)
      .eq('id', instructorId);
    
    if (error) throw error;
    
    toast({
      title: 'Instructor Updated',
      description: 'The instructor profile has been updated successfully.',
    });
    
    onSuccess();
    return true;
  } catch (err) {
    console.error('Error updating instructor:', err);
    toast({
      title: 'Error',
      description: 'Failed to update instructor profile.',
      variant: 'destructive',
    });
    return false;
  }
};
