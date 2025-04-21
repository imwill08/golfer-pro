import { useState } from 'react';
import { InstructorService } from '../services/instructorService';
import { InstructorDTO } from '../types/instructor';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UseInstructorFormProps {
  initialData?: Partial<InstructorDTO>;
  onSuccess?: (data: InstructorDTO) => void;
  onError?: (error: any) => void;
}

export const useInstructorForm = ({
  initialData,
  onSuccess,
  onError
}: UseInstructorFormProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Normalize the input data
      const normalizedData = InstructorService.normalizeInput(formData);

      // Step 2: Validate and transform the data
      const validatedData = InstructorService.validateAndTransform(normalizedData);

      // Step 3: Prepare for database
      const dbPayload = InstructorService.toDbPayload(validatedData);

      // Step 4: Save to database
      const { data, error: dbError } = await supabase
        .from('instructors')
        .upsert(dbPayload)
        .select()
        .single();

      if (dbError) throw dbError;

      // Step 5: Transform the response back to DTO
      const result = InstructorService.fromDbPayload(data);

      onSuccess?.(result);
      return result;
    } catch (err) {
      console.error('Error submitting instructor form:', err);
      setError(err);
      onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('instructorsimages')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('instructorsimages')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    handleSubmit,
    handlePhotoUpload
  };
}; 