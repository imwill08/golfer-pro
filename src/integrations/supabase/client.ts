// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jdeeemmypanndsjikxbk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZWVlbW15cGFubmRzamlreGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MTkyOTQsImV4cCI6MjA1OTQ5NTI5NH0.XE78bpQJTeoSrF_UBCaivSXGBoT-5Q3zH3PCn5AHCJA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);