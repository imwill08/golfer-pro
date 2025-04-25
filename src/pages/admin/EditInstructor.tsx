import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import InstructorForm from '@/components/instructors/InstructorForm';
import LoadingErrorState from '@/components/admin/LoadingErrorState';
import { InstructorFormValues } from '@/types/instructor';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
import { transformToFormValues } from '@/utils/instructorFormTransformer';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { uploadPhoto, uploadPhotos } from '@/utils/photoUpload';
import { processInstructorPhotos } from '@/utils/instructorFormProcessor';

interface EditInstructorProps {
  instructorId: string;
  onCancel?: () => void;
}

const EditInstructor: React.FC<EditInstructorProps> = ({ 
  instructorId, 
  onCancel 
}): JSX.Element => {
  const queryClient = useQueryClient();
  
  const { data: instructor, isLoading, error } = useQuery({
    queryKey: ['instructor', instructorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', instructorId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (data: InstructorFormValues) => {
    try {
      // Test connection first
      const { success, error: connError } = await testSupabaseConnection();
      if (!success) {
        throw new Error(`Connection error: ${connError}`);
      }

      // Check for duplicate email only if email is being changed
      if (data.email !== instructor?.email) {
        const { data: existingInstructor, error: emailCheckError } = await supabase
          .from('instructors')
          .select('id')
          .eq('email', data.email)
          .neq('id', instructorId)
          .single();

        if (emailCheckError && emailCheckError.code !== 'PGRST116') {
          throw emailCheckError;
        }

        if (existingInstructor) {
          throw new Error('This email address is already associated with another instructor. Please use a different email address.');
        }
      }

      // Handle photo uploads using the processInstructorPhotos utility
      const { profilePhotos, galleryPhotos } = await processInstructorPhotos(data, instructorId);
      
      // Preserve existing photos if no new ones uploaded
      const photos = profilePhotos.length > 0 ? profilePhotos : instructor?.photos || [];
      const gallery_photos = galleryPhotos.length > 0 ? 
        [...galleryPhotos, ...(instructor?.gallery_photos || [])] : 
        instructor?.gallery_photos || [];

      // Convert form values to database format
      // First create arrays from certification checkboxes
      const certifications: string[] = [];
      if (data.certifications.pga) certifications.push('PGA');
      if (data.certifications.lpga) certifications.push('LPGA');
      if (data.certifications.tpi) certifications.push('TPI');
      if (data.certifications.other && data.certifications.otherText) 
        certifications.push(data.certifications.otherText);

      // Create array of specialties from checkboxes
      const specialties: string[] = [];
      if (data.specialties.shortGame) specialties.push('Short Game');
      if (data.specialties.putting) specialties.push('Putting');
      if (data.specialties.driving) specialties.push('Driving');
      if (data.specialties.courseStrategy) specialties.push('Course Strategy');
      if (data.specialties.mentalApproach) specialties.push('Mental Approach');
      if (data.specialties.beginnerLessons) specialties.push('Beginner Lessons');
      if (data.specialties.advancedTraining) specialties.push('Advanced Training');
      if (data.specialties.juniorCoaching) specialties.push('Junior Coaching');

      // Process lesson types data - handles the new dynamic array structure
      let lesson_types_data: Array<{
        title: string;
        description: string;
        duration: string;
        price: number | string;
      }> = [];
      
      // Handle the new array-based lesson_types structure
      if (Array.isArray(data.lesson_types)) {
        lesson_types_data = data.lesson_types.map(lt => ({
          title: lt.title,
          description: lt.description,
          duration: lt.duration,
          price: lt.price
        }));
      }

      // Parse location data
      const locationParts = data.location.split(', ');
      const cityName = locationParts[0] || instructor?.city || '';
      const stateName = locationParts[1] || instructor?.state || '';

      // Prepare update data preserving existing fields
      const updateData = {
        first_name: data.firstName || instructor?.first_name,
        last_name: data.lastName || instructor?.last_name,
        name: `${data.firstName} ${data.lastName}`.trim() || instructor?.name,
        email: data.email || instructor?.email,
        phone: data.phone || instructor?.phone,
        website: data.website || instructor?.website || '',
        location: data.location || instructor?.location,
        city: cityName,
        state: stateName,
        country: data.country || instructor?.country || 'US',
        postal_code: data.postalCode || instructor?.postal_code,
        specialization: data.specialization || instructor?.specialization,
        experience: data.experience || instructor?.experience,
        bio: data.bio || instructor?.bio,
        additional_bio: data.additionalBio || instructor?.additional_bio,
        certifications: certifications.length > 0 ? certifications : instructor?.certifications,
        specialties: specialties.length > 0 ? specialties : instructor?.specialties,
        lesson_types: lesson_types_data.length > 0 ? lesson_types_data : instructor?.lesson_types,
        contact_info: {
          email: data.email || instructor?.contact_info?.email,
          phone: data.phone || instructor?.contact_info?.phone,
          website: data.website || instructor?.contact_info?.website
        },
        photos: photos,
        gallery_photos: gallery_photos,
        faqs: data.faqs || instructor?.faqs || [],
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('instructors')
        .update(updateData)
        .eq('id', instructorId);
      
      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw updateError;
      }
      
      toast({
        title: 'Instructor Updated',
        description: 'The instructor has been updated successfully.',
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['instructor', instructorId] });
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      queryClient.invalidateQueries({ queryKey: ['public-instructors'] });
      
      if (onCancel) onCancel();
    } catch (err) {
      console.error('Error updating instructor:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update instructor. Please check your connection and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Instructor</h1>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      
      <LoadingErrorState 
        isLoading={isLoading} 
        error={error ? (error as Error).message : undefined}
      >
        {instructor && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <InstructorForm 
              onSubmit={handleSubmit} 
              isAdmin={true}
              buttonText="Update Instructor"
              initialValues={transformToFormValues(instructor)}
            />
          </div>
        )}
      </LoadingErrorState>
    </>
  );
};

export default EditInstructor;
