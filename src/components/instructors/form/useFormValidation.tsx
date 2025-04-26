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
    // Allow backward navigation without validation
    const tabOrder = ["personal", "professional", "location", "specialties", "photos", "lesson_types"];
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = tabOrder.indexOf(nextTab);
    if (nextIndex < currentIndex) {
      return true;
    }

    const data = form.getValues();

    switch (currentTab) {
      case "personal":
        if (!data.firstName || !data.lastName || !data.email || !data.phone) {
          form.trigger(['firstName', 'lastName', 'email', 'phone']);
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields in Personal Info tab.",
            variant: "destructive",
          });
          return false;
        }
        break;

      case "professional":
        if (!data.bio || !data.yearStarted) {
          form.trigger(['bio', 'yearStarted']);
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields in Professional Info tab.",
            variant: "destructive",
          });
          return false;
        }
        break;

      case "location":
        if (!data.postalCode || !data.country || !data.state || !data.city) {
          form.trigger(['postalCode', 'country', 'state', 'city']);
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields in Location Details tab.",
            variant: "destructive",
          });
          return false;
        }
        break;

      case "specialties":
        // No validation required for specialties
        break;

      case "lesson_types":
        // Check if at least one lesson type is added with all required fields
        if (!data.lesson_types?.length) {
          form.trigger('lesson_types');
          toast({
            title: "Lesson Types Required",
            description: "Please add at least one lesson type.",
            variant: "destructive",
          });
          return false;
        }
        
        // Check if all lesson types have required fields
        const hasIncompleteLessonType = data.lesson_types.some(
          lt => !lt.title || !lt.description || !lt.duration || !lt.price
        );
        if (hasIncompleteLessonType) {
          form.trigger('lesson_types');
          toast({
            title: "Incomplete Lesson Types",
            description: "Please fill in all required fields for each lesson type.",
            variant: "destructive",
          });
          return false;
        }
        break;

      case "photos":
        // No validation required for photos
        break;
    }

    return true;
  };

  const validateFormSubmission = (data: InstructorFormValues): boolean => {
    // Personal Info
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      setActiveTab("personal");
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields in Personal Info tab.",
        variant: "destructive",
      });
      return false;
    }

    // Professional Info
    if (!data.bio || !data.yearStarted) {
      setActiveTab("professional");
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields in Professional Info tab.",
        variant: "destructive",
      });
      return false;
    }

    // Location Details
    if (!data.postalCode || !data.country || !data.state || !data.city) {
      setActiveTab("location");
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields in Location Details tab.",
        variant: "destructive",
      });
      return false;
    }

    // Specialties - no validation required

    // Lesson Types
    if (!data.lesson_types?.length) {
      setActiveTab("lesson_types");
      toast({
        title: "Lesson Types Required",
        description: "Please add at least one lesson type.",
        variant: "destructive",
      });
      return false;
    }

    // Check if all lesson types have required fields
    const hasIncompleteLessonType = data.lesson_types.some(
      lt => !lt.title || !lt.description || !lt.duration || !lt.price
    );
    if (hasIncompleteLessonType) {
      setActiveTab("lesson_types");
      toast({
        title: "Incomplete Lesson Types",
        description: "Please fill in all required fields for each lesson type.",
        variant: "destructive",
      });
      return false;
    }

    // Photos - no validation required
    if (!data.profilePhoto) {
      setActiveTab("photos");
      toast({
        title: "Profile Photo Required",
        description: "Please upload a profile photo.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateTabChange, validateFormSubmission };
};
