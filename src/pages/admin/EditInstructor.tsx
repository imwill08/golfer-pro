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
        .select(`
          *,
          contact_info,
          services,
          specialties,
          certifications,
          photos,
          faqs
        `)
        .eq('id', instructorId)
        .single();
      
      if (error) throw error;
      console.log('Fetched instructor data:', data);
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

      // Handle photo uploads first
      let photos: string[] = instructor?.photos || [];
      
      // Upload profile photo if provided
      if (data.profilePhoto instanceof File) {
        const profilePhotoUrl = await uploadPhoto(data.profilePhoto, instructorId);
        // If there are existing photos, replace the first one (profile photo)
        // If no photos exist, add as first photo
        if (photos.length > 0) {
          photos[0] = profilePhotoUrl;
        } else {
          photos = [profilePhotoUrl];
        }
      }
      
      // Upload additional photos if provided
      if (data.additionalPhotos && Array.isArray(data.additionalPhotos)) {
        const additionalPhotoUrls = await Promise.all(
          data.additionalPhotos
            .filter((photo): photo is File => photo instanceof File)
            .map(photo => uploadPhoto(photo, instructorId))
        );
        // Append new additional photos to existing ones (after profile photo)
        if (photos.length > 0) {
          photos = [...photos.slice(0, 1), ...additionalPhotoUrls, ...photos.slice(1)];
        } else {
          photos = additionalPhotoUrls;
        }
      }

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

      // Transform services into an array format while preserving existing data
      const existingServices = instructor?.services || [];
      const updatedServices = Object.entries(data.services || {})
        .filter(([_, service]) => service && service.price && service.duration)
        .map(([serviceType, service]) => {
          // Try to find existing service
          const existingService = existingServices.find(s => s.title === serviceType);
          return {
            title: serviceType,
            description: service.description || existingService?.description || '',
            duration: service.duration || existingService?.duration || '',
            price: parseFloat(service.price) || existingService?.price || 0
          };
        });

      // Parse location data
      const locationParts = data.location.split(', ');
      const cityName = locationParts[0] || instructor?.city || '';
      const stateName = locationParts[1] || instructor?.state || '';

      // Prepare update data preserving existing fields
      const updateData = {
        first_name: data.firstName || instructor?.first_name,
        last_name: data.lastName || instructor?.last_name,
        name: `${data.firstName} ${data.lastName}`.trim() || instructor?.name,
        location: data.location || instructor?.location,
        city: cityName,
        state: stateName,
        country: 'US', // Default to US for now
        specialization: data.specialization || instructor?.specialization,
        experience: data.experience || instructor?.experience,
        bio: data.bio || instructor?.bio,
        certifications: certifications.length > 0 ? certifications : instructor?.certifications,
        specialties: specialties.length > 0 ? specialties : instructor?.specialties,
        services: updatedServices.length > 0 ? updatedServices : instructor?.services,
        contact_info: {
          email: data.email || instructor?.contact_info?.email,
          phone: data.phone || instructor?.contact_info?.phone,
          website: data.website || instructor?.contact_info?.website
        },
        photos: photos.length > 0 ? photos : instructor?.photos,
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
