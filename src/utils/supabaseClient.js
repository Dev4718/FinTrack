import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nmmgfgorqixcwuiezxdf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbWdmZ29ycWl4Y3d1aWV6eGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzM4ODEsImV4cCI6MjEwNjcwOTg4MX0.Rv-78_D6Mh9ofykK1SkDLGVZv6PdzmXFJFSEGUNLs3w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
