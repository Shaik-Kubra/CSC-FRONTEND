import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://dhavhqjmhiqauxfjamxv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoYXZocWptaGlxYXV4ZmphbXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODY2NDgsImV4cCI6MjA4MDc2MjY0OH0.t6_lhPJKR6dq-VF2FLovOVP7VOd8yxIdqKfAS-5ZpRM';

export const supabase = createClient(supabaseUrl, supabaseKey);