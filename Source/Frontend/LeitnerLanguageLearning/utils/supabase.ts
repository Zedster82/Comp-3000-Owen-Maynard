
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createClient } from '@supabase/supabase-js';
// import { SUPABASE_API_KEY } from '@env';

const supabaseUrl = "https://onualqyvjvvikfukujao.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udWFscXl2anZ2aWtmdWt1amFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0Njk5NTcsImV4cCI6MjA1MzA0NTk1N30.bof0RLB2Cf9zJX_cA74UdkRNYumhx8ofVO0w0ut6Lac";

if (!supabaseAnonKey) {
    throw new Error('Missing SUPABASE_API_KEY environment variable');
}

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//     auth: {
//         storage: AsyncStorage,
//         autoRefreshToken: true,
//         persistSession: true,
//         detectSessionInUrl: false,
//     },
// });

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
// AppState.addEventListener('change', (state) => {
//     if (state === 'active') {
//         supabase.auth.startAutoRefresh();
//     } else {
//         supabase.auth.stopAutoRefresh();
//     }
// });