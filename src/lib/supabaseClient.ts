type SupabaseClient = {
  auth: {
    signInWithOAuth: (options: {
      provider: 'google';
      options: { redirectTo: string };
    }) => Promise<{ data?: unknown; error?: unknown }>;
    getSession: () => Promise<{ data: { session: unknown }; error: unknown }>;
  };
};

type SupabaseGlobal = {
  createClient: (url: string, anonKey: string) => SupabaseClient;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabaseGlobal =
  typeof window !== 'undefined'
    ? (window as Window & { supabase?: SupabaseGlobal }).supabase
    : undefined;

if (!supabaseGlobal) {
  throw new Error('Supabase client library is not available on window.supabase.');
}

export const supabase = supabaseGlobal.createClient(supabaseUrl, supabaseAnonKey);
