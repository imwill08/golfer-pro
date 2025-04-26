import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InstructorFormValues } from '@/types/instructor';
import { formSchema } from './form/formValidation';
import { useFormValidation } from './form/useFormValidation';
import { FormTabs } from './form/FormTabs';
import { PersonalInfoTab } from './form/PersonalInfoTab';
import { ProfessionalInfoTab } from './form/ProfessionalInfoTab';
import { LessonTypesTab } from './form/LessonTypesTab';
import { SpecialtiesTab } from './form/SpecialtiesTab';
import { PhotosTab } from './form/PhotosTab';
import { Spinner } from '../ui/spinner';
import { toast } from '@/hooks/use-toast';
import { LocationDetailsTab } from './form/LocationDetailsTab';

interface InstructorFormProps {
  onSubmit: (data: InstructorFormValues) => void;
  isAdmin?: boolean;
  buttonText?: string;
  initialValues?: InstructorFormValues;
  isLoading?: boolean;
}

const InstructorForm: React.FC<InstructorFormProps> = ({ 
  onSubmit, 
  isAdmin = false, 
  buttonText = "Submit Application",
  initialValues,
  isLoading = false
}) => {
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("personal");

  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      website: '',
      yearStarted: new Date().getFullYear(),
      streetAddress: '',
      suite: '',
      postalCode: '',
      country: '',
      state: '',
      city: '',
      location: '',
      tagline: '',
      specialization: '',
      bio: '',
      additionalBio: '',
      certifications: {
        pga: false,
        lpga: false,
        tpi: false,
        other: false,
        otherText: ''
      },
      lesson_types: [],
      specialties: {
        shortGame: false,
        putting: false,
        driving: false,
        courseStrategy: false,
        mentalApproach: false,
        beginnerLessons: false,
        advancedTraining: false,
        juniorCoaching: false
      },
      faqs: [],
      profilePhoto: null,
      additionalPhotos: null
    }
  });
  
  const { validateTabChange, validateFormSubmission } = useFormValidation(form, setActiveTab);
  
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('profilePhoto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAdditionalPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      form.setValue('additionalPhotos', files);
      
      const newPreviews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setAdditionalPhotos(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalPhoto = (index: number) => {
    const newPhotos = [...additionalPhotos];
    newPhotos.splice(index, 1);
    setAdditionalPhotos(newPhotos);
    
    // Update form value if needed
    const currentFiles = form.getValues('additionalPhotos');
    if (Array.isArray(currentFiles)) {
      const newFiles = [...currentFiles];
      newFiles.splice(index, 1);
      form.setValue('additionalPhotos', newFiles.length ? newFiles : null);
    }
  };
  
  const handleFormSubmit = async (data: InstructorFormValues) => {
    try {
      // Combine location fields to create a formatted location string
      data.location = `${data.city}, ${data.state}, ${data.country} - ${data.postalCode}`;
      
      if (validateFormSubmission(data)) {
        await onSubmit(data);
        
        // Show success message
        toast({
          title: "Application Submitted Successfully!",
          description: "Thank you for applying to be an instructor. We'll review your application and get back to you soon.",
          variant: "success",
        });
      }
    } catch (error) {
      // Show error message
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleTabChange = (nextTab: string) => {
    console.log('Changing tab to:', nextTab);
    if (validateTabChange(activeTab, nextTab)) {
      setActiveTab(nextTab);
      console.log('Tab changed successfully to:', nextTab);
    } else {
      console.log('Tab change validation failed');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <FormTabs activeTab={activeTab} onTabChange={handleTabChange}>
            <PersonalInfoTab form={form} activeTab={activeTab} onTabChange={handleTabChange} />
            <ProfessionalInfoTab form={form} activeTab={activeTab} onTabChange={handleTabChange} />
            <LocationDetailsTab form={form} activeTab={activeTab} onTabChange={handleTabChange} />
            <SpecialtiesTab form={form} activeTab={activeTab} onTabChange={handleTabChange} />
            <PhotosTab 
              form={form} 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
              profilePhotoPreview={profilePhotoPreview}
              setProfilePhotoPreview={setProfilePhotoPreview}
              additionalPhotos={additionalPhotos}
              handleProfilePhotoChange={handleProfilePhotoChange}
              handleAdditionalPhotosChange={handleAdditionalPhotosChange}
              removeAdditionalPhoto={removeAdditionalPhoto}
            />
            <LessonTypesTab form={form} activeTab={activeTab} onTabChange={handleTabChange} />
          </FormTabs>
        </div>
        
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 md:static md:bg-transparent md:border-t-0 md:p-0">
          <div className="max-w-[1200px] mx-auto flex justify-end">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                buttonText
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default InstructorForm;
