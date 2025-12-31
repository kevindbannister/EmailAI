import { google } from 'googleapis';
import { googleOAuthConfig } from '../config/google.js';

const assertGoogleConfig = () => {
  if (!googleOAuthConfig.clientId || !googleOAuthConfig.clientSecret || !googleOAuthConfig.redirectUri) {
    throw new Error('Google OAuth environment variables are not configured.');
  }
};

export const createGoogleOAuthClient = () => {
  assertGoogleConfig();
  return new google.auth.OAuth2(
    googleOAuthConfig.clientId,
    googleOAuthConfig.clientSecret,
    googleOAuthConfig.redirectUri
  );
};

export const buildGoogleAuthUrl = ({ state }) => {
  const client = createGoogleOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: googleOAuthConfig.scopes,
    state,
  });
};

export const exchangeCodeForToken = async ({ code }) => {
  const client = createGoogleOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
};

export const fetchGoogleUserProfile = async ({ tokens }) => {
  const client = createGoogleOAuthClient();
  client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2', auth: client });
  const { data } = await oauth2.userinfo.get();
  return data;
};
