import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    ZOHO: {
        URL: process.env.ZOHO_URL || '',
    },
    SUPABASE: {
        URL: process.env.SUPABASE_URL || '',
        SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || '',
    },
    APP: {
        PORT: parseInt(process.env.PORT || '3000', 10),
        NODE_ENV: process.env.NODE_ENV || 'development',
        TIMEZONE: process.env.TIMEZONE || 'Europe/Lisbon',
    },
};

// Simple validation
const missingKeys: string[] = [];
if (!ENV.ZOHO.URL) missingKeys.push('ZOHO_URL');
if (!ENV.SUPABASE.URL) missingKeys.push('SUPABASE_URL');
if (!ENV.SUPABASE.SERVICE_KEY) missingKeys.push('SUPABASE_SERVICE_KEY');

if (missingKeys.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`Missing critical environment variables: ${missingKeys.join(', ')}`);
}
