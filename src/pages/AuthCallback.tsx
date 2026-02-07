import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase session error:', error);
        return;
      }
      console.log('Supabase session:', data.session);
    };

    void loadSession();
  }, []);

  return (
    <div>
      <h1>Auth callback</h1>
      <p>Check the console for session details.</p>
    </div>
  );
};

export default AuthCallback;
