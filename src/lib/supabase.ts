/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// These should be set in your Secrets panel or .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a file to a Supabase storage bucket
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true
  });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}

/**
 * Helper to handle errors with descriptive JSON as per environment guidelines
 */
export async function handleSupabaseError(error: any) {
  if (error) {
    console.error('Supabase Error:', error);
    throw new Error(JSON.stringify({
      message: error.message,
      code: error.code,
      details: error.details
    }));
  }
}
