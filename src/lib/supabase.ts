import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://shremkbvwpwkvfyuzqna.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmVta2J2d3B3a3ZmeXV6cW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MDM2NTUsImV4cCI6MjA2ODk3OTY1NX0.SaqJ-_8NQudJ5AdfbqOiQq58WrjdnU15exfLWp6db9I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
