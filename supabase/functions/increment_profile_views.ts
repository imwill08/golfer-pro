/// <reference path="./deno.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
} as const;

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Create a Supabase client with the service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { instructor_uuid } = await req.json();
    
    if (!instructor_uuid) {
      throw new Error('instructor_uuid is required')
    }

    // Check if stats record exists
    const { data: existingStats, error: checkError } = await supabase
      .from('instructor_stats')
      .select('*')
      .eq('instructor_id', instructor_uuid)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingStats) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('instructor_stats')
        .update({ 
          profile_views: (existingStats.profile_views || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('instructor_id', instructor_uuid)

      if (updateError) throw updateError
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('instructor_stats')
        .insert({
          instructor_id: instructor_uuid,
          profile_views: 1,
          contact_clicks: 0
        })

      if (insertError) throw insertError
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
