type SupabaseClient = {
  auth: {
    signInWithOAuth: (options: {
      provider: 'google';
      options: { redirectTo: string };
    }) => Promise<{ data?: unknown; error?: unknown }>;
    getSession: () => Promise<{ data: { session: unknown }; error: unknown }>;
  };
};

const supabaseClient = (globalThis as { supabase?: SupabaseClient }).supabase;

if (!supabaseClient) {
  throw new Error('Supabase client is not available on the global scope.');
}

export const supabase = supabaseClient;
