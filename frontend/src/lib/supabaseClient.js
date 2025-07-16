import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ptchucpdnwuussupsvin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y2h1Y3Bkbnd1dXNzdXBzdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NzI5NTMsImV4cCI6MjA2NTA0ODk1M30.kFmI3NBkkG4HTRy4NvqX5ipdVO_nBPyeFAcX1gj9wBI';
//public API key (DONT USE SERVICE ROLE KEY!!!!!!!!)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // prevent overloading
    },
    logLevel: 'debug'
  },
});
//creates a supabase client

// const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// console.log("SERVICE KEY: ", serviceKey);

// export const supabaseAdmin = createClient(supabaseUrl, serviceKey);
//ADMIN CLIENT 