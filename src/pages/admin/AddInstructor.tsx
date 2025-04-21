import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import InstructorForm from '@/components/instructors/InstructorForm';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { uploadPhoto } from '@/utils/photoUpload';
import { transformInstructorFormData } from '@/utils/instructorDataTransformer';
import { processInstructorFaqs } from '@/utils/instructorFaqProcessor';
import { InstructorFormValues } from '@/types/instructor';
import { PostgrestError } from '@supabase/supabase-js';

const AddInstructor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: InstructorFormValues) => {
    try {
      setIsLoading(true);
      const instructorId = uuidv4();
      
      // Handle photo uploads
      let photoUrls: string[] = [];
      
      // Handle profile photo if provided
      if (data.profilePhoto instanceof File) {
        const profilePhotoUrl = await uploadPhoto(data.profilePhoto, instructorId);
        photoUrls.push(profilePhotoUrl);
      }
      
      // Handle additional photos if provided
      if (data.additionalPhotos && Array.isArray(data.additionalPhotos)) {
        const additionalPhotoUrls = await Promise.all(
          data.additionalPhotos
            .filter((photo): photo is File => photo instanceof File)
            .map(photo => uploadPhoto(photo, instructorId))
        );
        photoUrls = [...photoUrls, ...additionalPhotoUrls];
      }

      // Transform form data
      const transformedData = transformInstructorFormData(data);
      
      // Process FAQs
      const processedFaqs = processInstructorFaqs(data.faqs);

      // Prepare final instructor data
      const instructorData = {
        id: instructorId,
        ...transformedData,
        photos: photoUrls,
        faqs: processedFaqs,
        status: 'pending',
        is_approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert into database
      const { error } = await supabase
        .from('instructors')
        .insert(instructorData);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Instructor added successfully!',
      });
      navigate('/admin/instructors');
    } catch (error) {
      console.error('Error adding instructor:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add instructor. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Instructor</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <InstructorForm 
          onSubmit={handleSubmit} 
          isAdmin={true}
          buttonText="Add Instructor"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AddInstructor;
