import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_ID = 'instructorsimages';

/**
 * Uploads a photo to Supabase Storage and returns the public URL
 */
export const uploadPhoto = async (file: File, instructorId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${instructorId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_ID)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_ID)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

/**
 * Uploads multiple photos to Supabase Storage and returns their public URLs
 */
export const uploadPhotos = async (files: File[], instructorId: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadPhoto(file, instructorId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading photos:', error);
    throw error;
  }
}; 