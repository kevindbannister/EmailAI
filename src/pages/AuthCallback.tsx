import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase auth callback error', error);
        throw error;
      }
      console.log('Supabase session', data.session);
    };

    void loadSession();
  }, []);

  return <div className="p-6 text-sm text-slate-200">Completing Google sign-in…</div>;
};

export default AuthCallback;
