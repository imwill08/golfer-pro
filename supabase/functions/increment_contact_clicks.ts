import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = "https://qozctimkytddvwlsgczn.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { instructor_uuid, click_type } = await req.json();
    
    if (!instructor_uuid) {
      return new Response(
        JSON.stringify({ error: "Instructor ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if stats record exists
    const { data: existingStats } = await supabase
      .from("instructor_stats")
      .select("id")
      .eq("instructor_id", instructor_uuid)
      .single();
    
    if (existingStats) {
      // Update existing record
      const { error } = await supabase
        .from("instructor_stats")
        .update({ 
          contact_clicks: supabase.rpc("increment", { row_id: existingStats.id, column_name: "contact_clicks" }),
          updated_at: new Date().toISOString()
        })
        .eq("id", existingStats.id);
      
      if (error) throw error;
    } else {
      // Create new record
      const { error } = await supabase
        .from("instructor_stats")
        .insert({
          instructor_id: instructor_uuid,
          profile_views: 0,
          contact_clicks: 1
        });
      
      if (error) throw error;
    }
    
    // Log the click details
    await supabase
      .from("contact_click_logs")
      .insert({
        instructor_id: instructor_uuid,
        click_type: click_type
      });
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
