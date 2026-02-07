import { getSupabaseClient } from '../lib/supabaseClient';
import { Button } from './ui/Button';

const GoogleSignInButton = () => {
  const handleGoogleSignIn = async () => {
    console.log('Starting Supabase Google OAuth sign-in.');
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) {
      console.error('Supabase Google OAuth sign-in failed.', error);
      throw error;
    }
  };

  return (
    <Button type="button" className="w-full" onClick={() => void handleGoogleSignIn()}>
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
