import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fknvxwnwekwdkodtnhsa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbnZ4d253ZWt3ZGtvZHRuaHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MDEzMjgsImV4cCI6MjA5MTE3NzMyOH0.y5vYuf6YlJ-Iz18wEmOo_Gb1x7hYDpvXs9b2kMbqjpM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
