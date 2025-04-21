
import { InstructorFormValues } from '@/types/instructor';
import { toast } from '@/hooks/use-toast';

/**
 * Validates common instructor form fields and shows toast messages for missing fields
 * @param data The form data to validate
 * @param showToast Whether to show toast messages for validation errors
 * @returns An object with validation result and any missing fields
 */
export const validateInstructorForm = (
  data: InstructorFormValues, 
  showToast: boolean = true
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];
  
  // Validate personal info
  if (!data.firstName || data.firstName.trim() === '') {
    missingFields.push('First Name');
  }
  
  if (!data.lastName || data.lastName.trim() === '') {
    missingFields.push('Last Name');
  }
  
  if (!data.email || data.email.trim() === '') {
    missingFields.push('Email');
  } else {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      if (showToast) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
      }
      return { isValid: false, missingFields: ['Valid Email Format'] };
    }
  }
  
  if (!data.phone || data.phone.trim() === '') {
    missingFields.push('Phone Number');
  }
  
  // Validate professional info
  if (!data.experience) {
    missingFields.push('Years of Experience');
  }
  
  if (!data.postalCode || data.postalCode.trim() === '') {
    missingFields.push('Postal Code');
  }
  
  if (!data.country || data.country.trim() === '') {
    missingFields.push('Country');
  }
  
  if (!data.state || data.state.trim() === '') {
    missingFields.push('State');
  }
  
  if (!data.city || data.city.trim() === '') {
    missingFields.push('City');
  }
  
  if (!data.specialization || data.specialization.trim() === '') {
    missingFields.push('Specialization');
  }
  
  if (!data.bio || data.bio.trim() === '') {
    missingFields.push('Professional Bio');
  }
  
  // Check for lesson types
  const hasLessonType = Object.values(data.lessonTypes).some(value => value === true);
  if (!hasLessonType) {
    missingFields.push('At least one Lesson Type');
  }
  
  // Check for services details if lesson types are selected
  if (hasLessonType) {
    let missingServiceDetails = [];
    
    if (data.lessonTypes.privateLesson && 
        (!data.services.privateLesson?.price || !data.services.privateLesson?.duration)) {
      missingServiceDetails.push('Private Lesson details');
    }
    
    if (data.lessonTypes.groupLessons && 
        (!data.services.groupLessons?.price || !data.services.groupLessons?.duration)) {
      missingServiceDetails.push('Group Lessons details');
    }
    
    if (data.lessonTypes.onlineCoaching && 
        (!data.services.onlineCoaching?.price || !data.services.onlineCoaching?.duration)) {
      missingServiceDetails.push('Online Coaching details');
    }
    
    if (data.lessonTypes.oncourseInstruction && 
        (!data.services.oncourseInstruction?.price || !data.services.oncourseInstruction?.duration)) {
      missingServiceDetails.push('On-Course Instruction details');
    }
    
    if (data.lessonTypes.advancedTraining && 
        (!data.services.advancedTraining?.price || !data.services.advancedTraining?.duration)) {
      missingServiceDetails.push('Advanced Training details');
    }
    
    if (data.lessonTypes.juniorCoaching && 
        (!data.services.juniorCoaching?.price || !data.services.juniorCoaching?.duration)) {
      missingServiceDetails.push('Junior Coaching details');
    }
    
    if (missingServiceDetails.length > 0) {
      missingFields.push(...missingServiceDetails);
    }
  }
  
  // Check for specialties
  const hasSpecialty = Object.values(data.specialties).some(value => value === true);
  if (!hasSpecialty) {
    missingFields.push('At least one Specialty');
  }
  
  // If there are missing fields, show a toast with the list
  if (missingFields.length > 0 && showToast) {
    toast({
      title: 'Missing Information',
      description: `Please fill in the following fields: ${missingFields.join(', ')}`,
      variant: 'destructive',
    });
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Validates that at least one field in an object is true
 * @param obj Object with boolean values
 * @param fieldName Display name for the field group
 * @param showToast Whether to show toast messages
 * @returns Whether the validation passed
 */
export const validateAtLeastOneSelected = (
  obj: Record<string, boolean>,
  fieldName: string,
  showToast: boolean = true
): boolean => {
  const isValid = Object.values(obj).some(value => value === true);
  
  if (!isValid && showToast) {
    toast({
      title: 'Missing Information',
      description: `Please select at least one ${fieldName}.`,
      variant: 'destructive',
    });
  }
  
  return isValid;
};

/**
 * Formats validation errors into a user-friendly message
 * @param missingFields Array of missing field names
 * @returns A formatted error message
 */
export const formatValidationErrors = (missingFields: string[]): string => {
  if (missingFields.length === 0) return '';
  
  if (missingFields.length === 1) {
    return `Please fill in the ${missingFields[0]} field.`;
  }
  
  const lastField = missingFields.pop();
  return `Please fill in the following fields: ${missingFields.join(', ')} and ${lastField}.`;
};
