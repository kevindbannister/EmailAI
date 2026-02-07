import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/Button';

const GoogleSignInButton = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    console.log('Starting Supabase Google OAuth sign-in.');
    setErrorMessage(null);
    console.log('Calling supabase.auth.signInWithOAuth with redirect.', {
      provider: 'google',
      redirectTo: `${window.location.origin}/auth/callback`
    });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    console.log('Supabase Google OAuth response', { data, error });
    if (error) {
      console.error('Supabase Google OAuth sign-in failed.', error);
      setErrorMessage('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button type="button" className="w-full" onClick={() => void handleGoogleSignIn()}>
        Sign in with Google
      </Button>
      {errorMessage ? (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default GoogleSignInButton;
