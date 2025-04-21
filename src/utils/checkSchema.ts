import { supabase } from '@/integrations/supabase/client';

export const checkSchema = async () => {
  try {
    // Check instructors table schema
    const { data: instructorsSchema, error: schemaError } = await supabase
      .from('instructors')
      .select()
      .limit(1);

    if (schemaError) {
      console.error('Error fetching schema:', schemaError);
      return;
    }

    console.log('Current schema:', instructorsSchema);
  } catch (error) {
    console.error('Error:', error);
  }
}; 