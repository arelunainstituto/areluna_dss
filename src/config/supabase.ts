import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

if (!ENV.SUPABASE.URL || !ENV.SUPABASE.SERVICE_KEY) {
    console.warn('Supabase credentials not found. Supabase client will fail to initialize.');
}

export const supabase = createClient(ENV.SUPABASE.URL, ENV.SUPABASE.SERVICE_KEY);
