import express from 'express';
import { buildGoogleAuthUrl, exchangeCodeForToken, fetchGoogleUserProfile } from '../services/googleAuth.js';
import { createOAuthState, verifyOAuthState } from '../utils/oauthState.js';
import { encrypt } from '../utils/crypto.js';
import { upsertOauthAccount } from '../db/oauthAccounts.js';
import { googleOAuthConfig } from '../config/google.js';

export const authGoogleRouter = express.Router();

const getUserIdFromRequest = (req) => {
  if (req.user?.id) return req.user.id;
  const headerUserId = req.headers['x-user-id'];
  if (headerUserId) return Array.isArray(headerUserId) ? headerUserId[0] : headerUserId;
  return req.query.user_id;
};

const getOauthErrorResponse = (error) => {
  const errorCode = error?.response?.data?.error;
  if (!errorCode) return null;
  if (['invalid_grant', 'invalid_client', 'redirect_uri_mismatch'].includes(errorCode)) {
    return { status: 400, error: errorCode, message: 'Google OAuth request could not be completed.' };
  }
  return { status: 500, error: 'oauth_error', message: 'Google OAuth request failed.' };
};

authGoogleRouter.get('/start', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const returnTo = req.query.returnTo;

  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id for Google OAuth start.' });
  }

  const state = await createOAuthState({ userId, returnTo });
  const authUrl = buildGoogleAuthUrl({ state });

  return res.redirect(authUrl);
});

authGoogleRouter.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing OAuth code or state.' });
  }

  const verifiedState = await verifyOAuthState(state);
  if (!verifiedState?.user_id) {
    return res.status(401).json({ error: 'Invalid OAuth state.' });
  }

  try {
    const tokens = await exchangeCodeForToken({ code });
    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date).toISOString()
      : new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const encryptedAccessToken = tokens.access_token ? encrypt(tokens.access_token) : null;
    const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;

    const profile = await fetchGoogleUserProfile({ tokens });
    const email = profile.email;
    const providerAccountId = profile.id;

    if (!email || !providerAccountId || !encryptedAccessToken) {
      return res.status(400).json({ error: 'Google OAuth did not return required identity data.' });
    }

    await upsertOauthAccount({
      userId: verifiedState.user_id,
      provider: 'google',
      email,
      providerAccountId,
      tenantId: null,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt,
      scope: tokens.scope,
    });

    const redirectTo = verifiedState.return_to || googleOAuthConfig.postAuthRedirect;
    return res.redirect(redirectTo);
  } catch (error) {
    const oauthError = getOauthErrorResponse(error);
    if (oauthError) {
      return res.status(oauthError.status).json({ error: oauthError.error, message: oauthError.message });
    }
    return res.status(500).json({ error: 'Failed to complete Google OAuth flow.' });
  }
});
