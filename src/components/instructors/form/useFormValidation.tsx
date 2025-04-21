
import { UseFormReturn } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { InstructorFormValues } from '@/types/instructor';
import { validateAtLeastOneSelected } from '@/utils/formValidationUtils';

export const useFormValidation = (form: UseFormReturn<InstructorFormValues>, setActiveTab: (tab: string) => void) => {
  // Validate a tab change
  const validateTabChange = (activeTab: string, nextTab: string): boolean => {
    // Validation for Personal Info tab
    if (activeTab === "personal" && nextTab !== "personal") {
      const personalFields = ['firstName', 'lastName', 'email', 'phone'];
      const personalErrors = personalFields.filter(field => 
        !form.getValues(field as any) || (typeof form.getValues(field as any) === 'string' && form.getValues(field as any).trim() === '')
      );
      
      if (personalErrors.length > 0) {
        const fieldNames = personalErrors.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase());
        toast({
          title: 'Missing Information',
          description: `Please fill in the following fields: ${fieldNames.join(', ')}`,
          variant: 'destructive',
        });
        return false;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.getValues('email'))) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
        return false;
      }
    }
    
    // Validation for Professional Info tab
    if (activeTab === "professional" && nextTab !== "professional") {
      const professionalFields = ['experience', 'postalCode', 'country', 'state', 'city', 'specialization', 'bio'];
      const professionalErrors = professionalFields.filter(field => {
        const value = form.getValues(field as any);
        if (field === 'experience') return value === undefined || value < 0;
        return !value || (typeof value === 'string' && value.trim() === '');
      });
      
      if (professionalErrors.length > 0) {
        const fieldNames = professionalErrors.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase());
        toast({
          title: 'Missing Information',
          description: `Please fill in the following fields: ${fieldNames.join(', ')}`,
          variant: 'destructive',
        });
        return false;
      }
    }
    
    // Validation for Services tab
    if (activeTab === "services" && nextTab !== "services") {
      // Check if at least one lesson type is selected using our utility function
      if (!validateAtLeastOneSelected(form.getValues('lessonTypes'), 'lesson type')) {
        return false;
      }
      
      // Check if the selected lesson types have their details filled
      let missingServiceDetails = false;
      let missingService = '';
      
      if (form.getValues('lessonTypes.privateLesson')) {
        if (!form.getValues('services.privateLesson')?.price || !form.getValues('services.privateLesson')?.duration) {
          missingServiceDetails = true;
          missingService = 'Private Lesson';
        }
      }
      
      if (form.getValues('lessonTypes.groupLessons')) {
        if (!form.getValues('services.groupLessons')?.price || !form.getValues('services.groupLessons')?.duration) {
          missingServiceDetails = true;
          missingService = missingService || 'Group Lessons';
        }
      }
      
      if (form.getValues('lessonTypes.onlineCoaching')) {
        if (!form.getValues('services.onlineCoaching')?.price || !form.getValues('services.onlineCoaching')?.duration) {
          missingServiceDetails = true;
          missingService = missingService || 'Online Coaching';
        }
      }
      
      if (form.getValues('lessonTypes.oncourseInstruction')) {
        if (!form.getValues('services.oncourseInstruction')?.price || !form.getValues('services.oncourseInstruction')?.duration) {
          missingServiceDetails = true;
          missingService = missingService || 'On-Course Instruction';
        }
      }
      
      if (missingServiceDetails) {
        toast({
          title: 'Missing Information',
          description: `Please complete all service details for ${missingService}.`,
          variant: 'destructive',
        });
        return false;
      }
    }
    
    // Validation for Specialties tab
    if (activeTab === "specialties" && nextTab !== "specialties") {
      // Check if at least one specialty is selected using our utility function
      if (!validateAtLeastOneSelected(form.getValues('specialties'), 'specialty')) {
        return false;
      }
    }
    
    return true;
  };
  
  // Validate form submission
  const validateFormSubmission = (data: InstructorFormValues): boolean => {
    // Check if at least one lesson type is selected
    if (!validateAtLeastOneSelected(data.lessonTypes, 'lesson type')) {
      setActiveTab("services");
      return false;
    }
    
    // Check if the selected lesson types have their details filled
    let missingServiceDetails = false;
    if (data.lessonTypes.privateLesson && (!data.services.privateLesson?.price || !data.services.privateLesson?.duration)) {
      missingServiceDetails = true;
    }
    if (data.lessonTypes.groupLessons && (!data.services.groupLessons?.price || !data.services.groupLessons?.duration)) {
      missingServiceDetails = true;
    }
    if (data.lessonTypes.onlineCoaching && (!data.services.onlineCoaching?.price || !data.services.onlineCoaching?.duration)) {
      missingServiceDetails = true;
    }
    if (data.lessonTypes.oncourseInstruction && (!data.services.oncourseInstruction?.price || !data.services.oncourseInstruction?.duration)) {
      missingServiceDetails = true;
    }
    if (data.lessonTypes.advancedTraining && (!data.services.advancedTraining?.price || !data.services.advancedTraining?.duration)) {
      missingServiceDetails = true;
    }
    if (data.lessonTypes.juniorCoaching && (!data.services.juniorCoaching?.price || !data.services.juniorCoaching?.duration)) {
      missingServiceDetails = true;
    }
    
    if (missingServiceDetails) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all service details for selected lesson types.',
        variant: 'destructive',
      });
      setActiveTab("services");
      return false;
    }
    
    // Check if at least one specialty is selected
    if (!validateAtLeastOneSelected(data.specialties, 'specialty')) {
      setActiveTab("specialties");
      return false;
    }
    
    return true;
  };

  return { validateTabChange, validateFormSubmission };
};
