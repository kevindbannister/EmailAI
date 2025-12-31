import { google } from 'googleapis';
import { createGoogleOAuthClient } from './googleAuth.js';
import { decrypt, encrypt } from '../utils/crypto.js';
import {
  getOauthAccountByUser,
  markOauthAccountReauthRequired,
  updateOauthAccountLastSyncAt,
  updateOauthTokens,
} from '../db/oauthAccounts.js';

const TOKEN_EXPIRY_BUFFER_MS = 2 * 60 * 1000;

const isExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() - TOKEN_EXPIRY_BUFFER_MS <= Date.now();
};

export const ensureValidGoogleAccessToken = async ({ userId }) => {
  const account = await getOauthAccountByUser({ userId, provider: 'google' });
  if (!account) return { status: 'not_connected' };

  if (account.requires_reauth) {
    return { status: 'reauth_required' };
  }

  const accessToken = decrypt(account.access_token);
  const refreshToken = decrypt(account.refresh_token);

  if (!isExpired(account.expires_at)) {
    return { status: 'connected', accessToken, account };
  }

  if (!refreshToken) {
    await markOauthAccountReauthRequired({ accountId: account.id });
    return { status: 'reauth_required' };
  }

  try {
    const client = createGoogleOAuthClient();
    client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await client.refreshAccessToken();
    if (!credentials.access_token) {
      throw new Error('Missing access token from refresh.');
    }

    const expiresAt = credentials.expiry_date
      ? new Date(credentials.expiry_date).toISOString()
      : new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const encryptedAccessToken = encrypt(credentials.access_token);
    const encryptedRefreshToken = credentials.refresh_token ? encrypt(credentials.refresh_token) : null;

    await updateOauthTokens({
      accountId: account.id,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt,
      scope: credentials.scope ?? account.scope,
    });

    const refreshedAccount = {
      ...account,
      expires_at: expiresAt,
      scope: credentials.scope ?? account.scope,
    };

    return { status: 'connected', accessToken: credentials.access_token, account: refreshedAccount };
  } catch (error) {
    await markOauthAccountReauthRequired({ accountId: account.id });
    return { status: 'reauth_required' };
  }
};

export const callGmailApi = async ({ userId, action }) => {
  const tokenResult = await ensureValidGoogleAccessToken({ userId });
  if (tokenResult.status !== 'connected') {
    const error = new Error('Google account needs reconnection.');
    error.status = tokenResult.status;
    throw error;
  }

  const client = createGoogleOAuthClient();
  client.setCredentials({ access_token: tokenResult.accessToken });
  const gmail = google.gmail({ version: 'v1', auth: client });

  const response = await action(gmail);

  if (tokenResult.account?.id) {
    await updateOauthAccountLastSyncAt({ accountId: tokenResult.account.id });
  }

  return response;
};
