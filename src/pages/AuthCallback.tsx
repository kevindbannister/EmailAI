import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const waitForSession = async (timeoutMs = 4000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    if (data.session) {
      return data.session;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return null;
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [msg, setMsg] = useState('Completing Google sign-in…');

  useEffect(() => {
    (async () => {
      setMsg('Exchanging OAuth for session…');

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.slice(1));

        if (
          searchParams.get('error') ||
          searchParams.get('error_description') ||
          hashParams.get('error') ||
          hashParams.get('error_description')
        ) {
          navigate('/login?error=oauth_callback', { replace: true });
          return;
        }

        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('OAuth code exchange failed:', exchangeError);
            navigate('/login?error=oauth_exchange', { replace: true });
            return;
          }
        }

        const session = await waitForSession();
        if (session) {
          setMsg('Signed in. Redirecting…');
          await refreshSession();
          navigate('/dashboard', { replace: true });
          return;
        }

        navigate('/login?error=no_session', { replace: true });
      } catch (callbackError) {
        console.error('Unexpected OAuth callback failure:', callbackError);
        navigate('/login?error=oauth_callback', { replace: true });
      }
    })();
  }, [navigate, refreshSession]);

  return <div style={{ padding: 24 }}>{msg}</div>;
};

export default AuthCallback;
