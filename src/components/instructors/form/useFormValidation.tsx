import { UseFormReturn } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { InstructorFormValues } from '@/types/instructor';

const validateAtLeastOneSelected = (obj: Record<string, boolean>, fieldName: string): boolean => {
  return Object.values(obj).some(value => value === true);
};

export const useFormValidation = (
  form: UseFormReturn<InstructorFormValues>,
  setActiveTab: (tab: string) => void
) => {
  const validateTabChange = (currentTab: string, nextTab: string): boolean => {
    const data = form.getValues();

    switch (currentTab) {
      case "personal":
        if (!data.firstName || !data.lastName || !data.email || !data.phone) {
          form.trigger(['firstName', 'lastName', 'email', 'phone']);
          return false;
        }
        break;

      case "professional":
        if (
          !data.postalCode ||
          !data.country ||
          !data.state ||
          !data.city ||
          !data.specialization ||
          !data.bio
        ) {
          form.trigger(['postalCode', 'country', 'state', 'city', 'specialization', 'bio']);
          return false;
        }
        break;

      case "lesson_types":
        // Check if at least one lesson type is added with all required fields
        if (!data.lesson_types?.length) {
          form.trigger('lesson_types');
          return false;
        }
        
        // Check if all lesson types have required fields
        const hasIncompleteLessonType = data.lesson_types.some(
          lt => !lt.title || !lt.description || !lt.duration || !lt.price
        );
        if (hasIncompleteLessonType) {
          form.trigger('lesson_types');
          return false;
        }
        break;

      case "specialties":
        if (!validateAtLeastOneSelected(data.specialties, 'specialty')) {
          form.trigger('specialties');
          return false;
        }
        break;

      case "photos":
        if (!data.profilePhoto) {
          form.trigger('profilePhoto');
          return false;
        }
        break;
    }

    return true;
  };

  const validateFormSubmission = (data: InstructorFormValues): boolean => {
    // Personal Info
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      setActiveTab("personal");
      return false;
    }

    // Professional Info
    if (!data.postalCode || !data.country || !data.state || !data.city || !data.specialization || !data.bio) {
      setActiveTab("professional");
      return false;
    }

    // Lesson Types
    if (!data.lesson_types?.length) {
      setActiveTab("lesson_types");
      return false;
    }

    // Check if all lesson types have required fields
    const hasIncompleteLessonType = data.lesson_types.some(
      lt => !lt.title || !lt.description || !lt.duration || !lt.price
    );
    if (hasIncompleteLessonType) {
      setActiveTab("lesson_types");
      return false;
    }

    // Specialties
    if (!validateAtLeastOneSelected(data.specialties, 'specialty')) {
      setActiveTab("specialties");
      return false;
    }

    // Photos
    if (!data.profilePhoto) {
      setActiveTab("photos");
      return false;
    }

    return true;
  };

  return { validateTabChange, validateFormSubmission };
};
